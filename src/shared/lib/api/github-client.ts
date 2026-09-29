import { WrappedDataError } from './errors'
import {
	contributionsQuery,
	graphQLResponseSchema,
	searchCommitsResponseSchema,
	type GraphQLUser,
} from './schemas'

const isRateLimited = (response: Response) =>
	response.status === 429 ||
	(response.status === 403 &&
		response.headers.get('x-ratelimit-remaining') === '0')

const requestHeaders = (token: string) => ({
	Accept: 'application/json',
	Authorization: `Bearer ${token}`,
	'User-Agent': 'github-wrapped',
})

export const fetchContributions = async (
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
const commitsPerPage = 100
const maximumHistogramCommits = histogramPages * commitsPerPage

export const fetchCommitHistogram = async (
	login: string,
	token: string,
	year: number,
): Promise<number[] | null> => {
	const hours = Array.from({ length: 24 }, () => 0)
	let sampled = 0
	let totalCount = Number.POSITIVE_INFINITY

	try {
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
			if (totalCount > maximumHistogramCommits) {
				return null
			}
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

	return sampled === totalCount && hours.some(count => count > 0) ? hours : null
}
