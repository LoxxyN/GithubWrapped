export type WrappedSource = 'mock' | 'github'

export type Chronotype = 'night-owl' | 'early-bird'

export interface WrappedProfile {
	username: string
	displayName: string
	avatarUrl: string | null
}

export interface LanguageStat {
	name: string
	commits: number
	percentage: number
	color: string
}

export interface MonthStat {
	month: number
	label: string
	commits: number
}

export interface RepositoryStat {
	name: string
	commits: number
	stars: number
	language: string
}

export interface WrappedStats {
	totalCommits: number
	totalRepositories: number
	followers: number
	languages: LanguageStat[]
	topLanguage: LanguageStat
	months: MonthStat[]
	activeMonth: MonthStat
	streak: number
	streakStart: string | null
	streakEnd: string | null
	chronotype: Chronotype
	nightCommitPercentage: number
	topRepository: RepositoryStat
}

export interface WrappedData {
	year: number
	profile: WrappedProfile
	stats: WrappedStats
	source: WrappedSource
	generatedAt: string
}

export interface GitHubProfile {
	login: string
	name: string | null
	avatarUrl: string | null
	followers: number
	publicRepos: number
}

export interface GitHubEvent {
	id: string
	type: string
	createdAt: string
	repository: string
	commits: number
}

export interface GitHubRepository {
	name: string
	stars: number
	language: string
	fork: boolean
	pushedAt: string | null
}
