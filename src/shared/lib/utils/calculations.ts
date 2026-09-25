import type {
	GitHubEvent,
	GitHubProfile,
	GitHubRepository,
	LanguageStat,
	WrappedStats,
} from '../types/wrapped'

const monthLabels = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'октябрь',
	'ноябрь',
	'декабрь',
]

const languageColors: Record<string, string> = {
	'TypeScript': '#60a5fa',
	'JavaScript': '#facc15',
	'Python': '#38bdf8',
	'Go': '#22d3ee',
	'Rust': '#fb923c',
	'CSS': '#c084fc',
	'HTML': '#fb7185',
	'Other': '#a3a3a3',
}

const getDayKey = (date: Date) => date.toISOString().slice(0, 10)

const getMonthLabel = (month: number) => monthLabels[month] ?? 'месяц'

const getLanguageColor = (language: string) => languageColors[language] ?? '#a3a3a3'

const getTopLanguage = (languages: LanguageStat[]) =>
	languages[0] ?? {
		name: 'Другой',
		commits: 0,
		percentage: 0,
		color: getLanguageColor('Other'),
	}

export const calculateWrappedStats = (
	profile: GitHubProfile,
	events: GitHubEvent[],
	repositories: GitHubRepository[],
): WrappedStats => {
	const repositoryByName = new Map(
		repositories.map((repository) => [repository.name, repository]),
	)
	const commitsByRepository = new Map<string, number>()
	const commitsByLanguage = new Map<string, number>()
	const months = Array.from({ length: 12 }, (_, month) => ({
		month,
		label: getMonthLabel(month),
		commits: 0,
	}))
	const commitDays = new Set<string>()
	let totalCommits = 0
	let nightCommits = 0

	for (const event of events) {
		const commitCount = Math.max(0, event.commits)
		if (commitCount === 0) {
			continue
		}

		const date = new Date(event.createdAt)
		if (Number.isNaN(date.getTime())) {
			continue
		}

		totalCommits += commitCount
		months[date.getUTCMonth()].commits += commitCount
		commitsByRepository.set(
			event.repository,
			(commitsByRepository.get(event.repository) ?? 0) + commitCount,
		)

		const repositoryLanguage =
			repositoryByName.get(event.repository)?.language ?? 'Other'
		commitsByLanguage.set(
			repositoryLanguage,
			(commitsByLanguage.get(repositoryLanguage) ?? 0) + commitCount,
		)

		if (date.getUTCHours() >= 20 || date.getUTCHours() < 6) {
			nightCommits += commitCount
		}

		const dayKey = getDayKey(date)
		commitDays.add(dayKey)
	}

	const languages = Array.from(commitsByLanguage.entries())
		.map(([name, commits]) => ({
			name,
			commits,
			percentage: totalCommits === 0 ? 0 : Math.round((commits / totalCommits) * 100),
			color: getLanguageColor(name),
		}))
		.sort((left, right) => right.commits - left.commits)

	const activeMonth = months.reduce((current, month) =>
		month.commits > current.commits ? month : current,
	)

	const uniqueDays = Array.from(commitDays).sort()
	let streak = 0
	let streakStart: string | null = null
	let streakEnd: string | null = null

	for (let index = 0; index < uniqueDays.length; index += 1) {
		const current = new Date(`${uniqueDays[index]}T00:00:00.000Z`)
		const previous = index > 0
			? new Date(`${uniqueDays[index - 1]}T00:00:00.000Z`)
			: null
		const isConsecutive =
			previous !== null && current.getTime() - previous.getTime() === 86_400_000

		if (isConsecutive) {
			streak += 1
		} else {
			streak = 1
			streakStart = uniqueDays[index]
		}

		streakEnd = uniqueDays[index]
	}

	let longestStreak = 0
	let currentStreak = 0
	let currentStart: string | null = null
	let longestStart: string | null = null
	let longestEnd: string | null = null

	for (let index = 0; index < uniqueDays.length; index += 1) {
		const current = new Date(`${uniqueDays[index]}T00:00:00.000Z`)
		const previous = index > 0
			? new Date(`${uniqueDays[index - 1]}T00:00:00.000Z`)
			: null
		const isConsecutive =
			previous !== null && current.getTime() - previous.getTime() === 86_400_000

		if (isConsecutive) {
			currentStreak += 1
		} else {
			currentStreak = 1
			currentStart = uniqueDays[index]
		}

		if (currentStreak > longestStreak) {
			longestStreak = currentStreak
			longestStart = currentStart
			longestEnd = uniqueDays[index]
		}
	}

	if (longestStreak > 0) {
		streak = longestStreak
		streakStart = longestStart
		streakEnd = longestEnd
	}

	const topRepository = Array.from(commitsByRepository.entries())
		.map(([name, commits]) => {
			const repository = repositoryByName.get(name)
			return {
				name,
				commits,
				stars: repository?.stars ?? 0,
				language: repository?.language ?? 'Other',
			}
		})
		.sort((left, right) => right.commits - left.commits || right.stars - left.stars)[0] ?? {
			name: 'Пока нет данных',
			commits: 0,
			stars: 0,
			language: 'Other',
		}

	return {
		totalCommits,
		totalRepositories: repositories.filter((repository) => !repository.fork).length,
		followers: profile.followers,
		languages,
		topLanguage: getTopLanguage(languages),
		months,
		activeMonth,
		streak,
		streakStart,
		streakEnd,
		chronotype: totalCommits > 0 && nightCommits / totalCommits >= 0.5
			? 'night-owl'
			: 'early-bird',
		nightCommitPercentage: totalCommits === 0
			? 0
			: Math.round((nightCommits / totalCommits) * 100),
		topRepository,
	}
}
