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
	contributions: number
}

export interface RepositoryStat {
	name: string
	commits: number
	stars: number
	language: string
}

export interface WrappedStats {
	totalContributions: number
	totalRepositories: number
	followers: number
	languages: LanguageStat[]
	topLanguage: LanguageStat
	months: MonthStat[]
	activeMonth: MonthStat
	streak: number
	streakStart: string | null
	streakEnd: string | null
	chronotype: Chronotype | null
	nightCommitPercentage: number | null
	topRepository: RepositoryStat
}

export interface ContributionDay {
	date: string
	count: number
}

export interface RepositoryContribution {
	name: string
	commits: number
	stars: number
	language: string | null
}

export interface ContributionSnapshot {
	totalContributions: number
	totalRepositories: number
	followers: number
	days: ContributionDay[]
	repositories: RepositoryContribution[]
	commitHours: number[] | null
}

export interface WrappedData {
	year: number
	profile: WrappedProfile
	stats: WrappedStats
	source: WrappedSource
	generatedAt: string
}
