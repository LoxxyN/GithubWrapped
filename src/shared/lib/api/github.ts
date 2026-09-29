import type { ContributionSnapshot, WrappedData } from '../types/wrapped'
import { calculateWrappedStats } from '../utils/calculations'
import { isValidUsername, normalizeUsername } from '../utils/validation'
import { WrappedDataError } from './errors'
import { fetchCommitHistogram, fetchContributions } from './github-client'
import { getMockWrappedData } from './mock-data'
import type { GraphQLUser } from './schemas'

const toSnapshot = (
	user: GraphQLUser,
	commitHours: number[] | null,
): ContributionSnapshot => {
	const { contributionsCollection } = user

	return {
		totalCommits: contributionsCollection.totalCommitContributions,
		totalRepositories: user.repositories.totalCount,
		followers: user.followers.totalCount,
		days: contributionsCollection.contributionCalendar.weeks.flatMap(week =>
			week.contributionDays.map(day => ({
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
