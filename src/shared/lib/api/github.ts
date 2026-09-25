import type { ContributionSnapshot, WrappedData } from '../types/wrapped'
import { calculateWrappedStats } from '../utils/calculations'
import { isValidUsername, normalizeUsername } from '../utils/validation'
import { getMockWrappedData } from './mock-data'
import {
	contributionsQuery,
	graphQLResponseSchema,
	searchCommitsResponseSchema,
	type GraphQLUser,
} from './schemas'

export type WrappedDataErrorCode =
	| 'invalid-username'
	| 'not-found'
	| 'rate-limit'
	| 'empty'
	| 'unavailable'

export class WrappedDataError extends Error {
	constructor(
		public readonly code: WrappedDataErrorCode,
		message: string,
	) {
		super(message)
		this.name = 'WrappedDataError'
	}
}

const isRateLimited = (response: Response) =>
	response.status === 429 ||
	(response.status === 403 &&
		response.headers.get('x-ratelimit-remaining') === '0')

const requestHeaders = (token: string) => ({
	Accept: 'application/json',
	Authorization: `Bearer ${token}`,
	'User-Agent': 'github-wrapped',
})

const fetchContributions = async (
	login: string,
	token: string,
	year: number,
): Promise<GraphQLUser> => {
	let response: Response
	try {
		response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: { ...requestHeaders(token), 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: contributionsQuery,
				variables: {
					login,
					from: `${year}-01-01T00:00:00Z`,
					to: `${year}-12-31T23:59:59Z`,
				},
			}),
		})
	} catch {
		throw new WrappedDataError('unavailable', 'GitHub GraphQL request failed')
	}

	if (isRateLimited(response)) {
		throw new WrappedDataError('rate-limit', 'GitHub API rate limit reached')
	}
	if (!response.ok) {
		throw new WrappedDataError('unavailable', 'GitHub GraphQL request failed')
	}

	let payload: unknown
	try {
		payload = await response.json()
	} catch {
		throw new WrappedDataError('unavailable', 'Invalid GitHub GraphQL response')
	}

	const parsed = graphQLResponseSchema.safeParse(payload)
	if (!parsed.success) {
		throw new WrappedDataError(
			'unavailable',
			'Unexpected GitHub GraphQL response',
		)
	}

	const { data, errors } = parsed.data
	if (data?.user) {
		return data.user
	}

	const errorTypes = (errors ?? []).map(error => error.type)
	if (errorTypes.includes('NOT_FOUND') || data?.user === null) {
		throw new WrappedDataError('not-found', 'GitHub profile not found')
	}
	if (errorTypes.includes('RATE_LIMITED')) {
		throw new WrappedDataError('rate-limit', 'GitHub API rate limit reached')
	}
	throw new WrappedDataError('unavailable', 'Unable to load GitHub data')
}

const getLocalHour = (isoDate: string): number | null => {
	const timestamp = Date.parse(isoDate)
	if (Number.isNaN(timestamp)) {
		return null
	}

	const offsetMatch = isoDate.match(/(?:Z|([+-])(\d{2}):(\d{2}))$/)
	const offsetMinutes = offsetMatch
		? offsetMatch[1]
			? (offsetMatch[1] === '-' ? -1 : 1) *
				(Number(offsetMatch[2]) * 60 + Number(offsetMatch[3]))
			: 0
		: 0

	return new Date(timestamp + offsetMinutes * 60_000).getUTCHours()
}

const histogramPages = 3

const fetchCommitHistogram = async (
	login: string,
	token: string,
	year: number,
): Promise<number[] | null> => {
	const hours = Array.from({ length: 24 }, () => 0)

	try {
		let sampled = 0
		let totalCount = Number.POSITIVE_INFINITY

		for (
			let page = 1;
			page <= histogramPages && sampled < totalCount;
			page += 1
		) {
			const query = encodeURIComponent(
				`author:${login} author-date:${year}-01-01..${year}-12-31`,
			)
			const response = await fetch(
				`https://api.github.com/search/commits?q=${query}&sort=committer-date&order=desc&per_page=100&page=${page}`,
				{
					headers: requestHeaders(token),
					next: { revalidate: 3600 },
				},
			)
			if (!response.ok) {
				return null
			}

			const parsed = searchCommitsResponseSchema.safeParse(
				await response.json(),
			)
			if (!parsed.success) {
				return null
			}

			totalCount = parsed.data.total_count
			if (parsed.data.items.length === 0) {
				break
			}

			for (const item of parsed.data.items) {
				const hour = item.commit.author
					? getLocalHour(item.commit.author.date)
					: null
				if (hour !== null) {
					hours[hour] += 1
					sampled += 1
				}
			}
		}
	} catch {
		return null
	}

	return hours.some(count => count > 0) ? hours : null
}

const toSnapshot = (
	user: GraphQLUser,
	commitHours: number[] | null,
): ContributionSnapshot => {
	const { contributionsCollection } = user

	return {
		totalCommits: contributionsCollection.totalCommitContributions,
		totalRepositories: user.repositories.totalCount,
		followers: user.followers.totalCount,
		days: contributionsCollection.contributionCalendar.weeks.flatMap((week) =>
			week.contributionDays.map((day) => ({
				date: day.date,
				count: day.contributionCount,
			})),
		),
		repositories: contributionsCollection.commitContributionsByRepository.map(
			entry => ({
				name: entry.repository.name,
				commits: entry.contributions.totalCount,
				stars: entry.repository.stargazerCount,
				language: entry.repository.primaryLanguage?.name ?? null,
			}),
		),
		commitHours,
	}
}

const cacheTtlMilliseconds = 60 * 60 * 1000
const responseCache = new Map<string, { expires: number; data: WrappedData }>()

export const getWrappedData = async (
	username: string,
): Promise<WrappedData> => {
	const normalizedUsername = normalizeUsername(username)

	if (!isValidUsername(normalizedUsername)) {
		throw new WrappedDataError('invalid-username', 'Invalid GitHub username')
	}

	const token = process.env.GITHUB_TOKEN?.trim()
	if (!token) {
		return getMockWrappedData(normalizedUsername)
	}

	const year = new Date().getUTCFullYear()
	const cacheKey = `${normalizedUsername.toLowerCase()}:${year}`
	const cached = responseCache.get(cacheKey)
	if (cached && cached.expires > Date.now()) {
		return cached.data
	}

	const [user, commitHours] = await Promise.all([
		fetchContributions(normalizedUsername, token, year),
		fetchCommitHistogram(normalizedUsername, token, year),
	])

	const stats = calculateWrappedStats(toSnapshot(user, commitHours))

	if (stats.totalCommits === 0) {
		throw new WrappedDataError('empty', 'No public contributions found')
	}

	const data: WrappedData = {
		year,
		profile: {
			username: user.login,
			displayName: user.name ?? user.login,
			avatarUrl: user.avatarUrl,
		},
		stats,
		source: 'github',
		generatedAt: new Date().toISOString(),
	}

	responseCache.set(cacheKey, {
		expires: Date.now() + cacheTtlMilliseconds,
		data,
	})

	return data
}
