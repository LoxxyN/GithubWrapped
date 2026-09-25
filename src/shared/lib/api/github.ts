import { calculateWrappedStats } from '../utils/calculations'
import {
	isValidUsername,
	normalizeUsername,
} from '../utils/validation'
import type {
	GitHubEvent,
	GitHubProfile,
	GitHubRepository,
	WrappedData,
} from '../types/wrapped'
import { getMockWrappedData } from './mock-data'

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const getString = (value: unknown) =>
	typeof value === 'string' ? value : null

const getNumber = (value: unknown) =>
	typeof value === 'number' && Number.isFinite(value) ? value : 0

const githubRequest = async <T>(
	url: string,
	token: string,
): Promise<T> => {
	const response = await fetch(url, {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${token}`,
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'github-wrapped',
		},
		next: { revalidate: 3600 },
	})

	if (response.status === 404) {
		throw new WrappedDataError('not-found', 'GitHub profile not found')
	}

	if (
		response.status === 429 ||
		(response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0')
	) {
		throw new WrappedDataError('rate-limit', 'GitHub API rate limit reached')
	}

	if (!response.ok) {
		throw new WrappedDataError('unavailable', 'GitHub API request failed')
	}

	return response.json() as Promise<T>
}

const parseProfile = (value: unknown): GitHubProfile => {
	if (!isRecord(value) || typeof value.login !== 'string') {
		throw new WrappedDataError('unavailable', 'Invalid GitHub profile response')
	}

	return {
		login: value.login,
		name: getString(value.name),
		avatarUrl: getString(value.avatar_url),
		followers: getNumber(value.followers),
		publicRepos: getNumber(value.public_repos),
	}
}

const parseEvents = (value: unknown): GitHubEvent[] => {
	if (!Array.isArray(value)) {
		return []
	}

	return value.flatMap((event, index) => {
		if (!isRecord(event)) {
			return []
		}

		const repository = isRecord(event.repo) ? event.repo : null
		const repositoryName = repository ? getString(repository.name) : null
		const createdAt = getString(event.created_at)
		const payload = isRecord(event.payload) ? event.payload : null
		const commits = event.type === 'PushEvent' && payload
			? Array.isArray(payload.commits)
				? payload.commits.length
				: 0
			: 0

		if (!repositoryName || !createdAt) {
			return []
		}

		return [
			{
				id: getString(event.id) ?? `event-${index}`,
				type: typeof event.type === 'string' ? event.type : 'Unknown',
				createdAt,
				repository: repositoryName.split('/').pop() ?? repositoryName,
				commits,
			},
		]
	})
}

const parseRepositories = (value: unknown): GitHubRepository[] => {
	if (!Array.isArray(value)) {
		return []
	}

	return value.flatMap((repository) => {
		if (!isRecord(repository) || typeof repository.name !== 'string') {
			return []
		}

		return [
			{
				name: repository.name,
				stars: getNumber(repository.stargazers_count),
				language: getString(repository.language) ?? 'Other',
				fork: repository.fork === true,
				pushedAt: getString(repository.pushed_at),
			},
		]
	})
}

export const getWrappedData = async (username: string): Promise<WrappedData> => {
	const normalizedUsername = normalizeUsername(username)

	if (!isValidUsername(normalizedUsername)) {
		throw new WrappedDataError('invalid-username', 'Invalid GitHub username')
	}

	const token = process.env.GITHUB_TOKEN?.trim()
	if (!token) {
		return getMockWrappedData(normalizedUsername)
	}

	const encodedUsername = encodeURIComponent(normalizedUsername)
	const baseUrl = 'https://api.github.com'

	try {
		const [rawProfile, rawEvents, rawRepositories] = await Promise.all([
			githubRequest<unknown>(`${baseUrl}/users/${encodedUsername}`, token),
			githubRequest<unknown>(
				`${baseUrl}/users/${encodedUsername}/events/public?per_page=100`,
				token,
			),
			githubRequest<unknown>(
				`${baseUrl}/users/${encodedUsername}/repos?per_page=100&sort=pushed`,
				token,
			),
		])
		const profile = parseProfile(rawProfile)
		const events = parseEvents(rawEvents)
		const repositories = parseRepositories(rawRepositories)
		const stats = calculateWrappedStats(profile, events, repositories)

		if (stats.totalCommits === 0) {
			throw new WrappedDataError('empty', 'No public contributions found')
		}

		return {
			year: new Date().getUTCFullYear(),
			profile: {
				username: profile.login,
				displayName: profile.name ?? profile.login,
				avatarUrl: profile.avatarUrl,
			},
			stats,
			source: 'github',
			generatedAt: new Date().toISOString(),
		}
	} catch (error) {
		if (error instanceof WrappedDataError) {
			throw error
		}

		throw new WrappedDataError('unavailable', 'Unable to load GitHub data')
	}
}
