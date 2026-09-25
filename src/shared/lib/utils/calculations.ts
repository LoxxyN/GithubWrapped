import type {
	Chronotype,
	ContributionSnapshot,
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

const dayInMilliseconds = 86_400_000

const getMonthLabel = (month: number) => monthLabels[month] ?? 'месяц'

const getLanguageColor = (language: string) => languageColors[language] ?? '#a3a3a3'

const getTopLanguage = (languages: LanguageStat[]) =>
	languages[0] ?? {
		name: 'Другой',
		commits: 0,
		percentage: 0,
		color: getLanguageColor('Other'),
	}

const parseDayTimestamp = (date: string) =>
	Date.parse(`${date}T00:00:00.000Z`)

const calculateChronotype = (
	hours: number[] | null,
): { chronotype: Chronotype; nightCommitPercentage: number } | null => {
	if (!hours) {
		return null
	}

	const total = hours.reduce((sum, count) => sum + count, 0)
	if (total === 0) {
		return null
	}

	const night =
		hours.slice(20).reduce((sum, count) => sum + count, 0) +
		hours.slice(0, 6).reduce((sum, count) => sum + count, 0)
	const nightCommitPercentage = Math.round((night / total) * 100)

	return {
		chronotype: nightCommitPercentage >= 50 ? 'night-owl' : 'early-bird',
		nightCommitPercentage,
	}
}

const calculateLongestStreak = (uniqueDays: string[]) => {
	let longestStreak = 0
	let currentStreak = 0
	let currentStart: string | null = null
	let longestStart: string | null = null
	let longestEnd: string | null = null

	for (let index = 0; index < uniqueDays.length; index += 1) {
		const previous = index > 0 ? uniqueDays[index - 1] : null
		const isConsecutive =
			previous !== null &&
			parseDayTimestamp(uniqueDays[index]) - parseDayTimestamp(previous) ===
				dayInMilliseconds

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

	return {
		streak: longestStreak,
		streakStart: longestStart,
		streakEnd: longestEnd,
	}
}

export const calculateWrappedStats = (
	snapshot: ContributionSnapshot,
): WrappedStats => {
	const { totalCommits, totalRepositories, followers, days, repositories, commitHours } =
		snapshot

	const months = Array.from({ length: 12 }, (_, month) => ({
		month,
		label: getMonthLabel(month),
		commits: 0,
	}))
	const commitsByLanguage = new Map<string, number>()
	const activeDays = new Set<string>()

	for (const day of days) {
		if (day.count <= 0) {
			continue
		}

		const monthIndex = Number(day.date.slice(5, 7)) - 1
		if (monthIndex >= 0 && monthIndex < 12) {
			months[monthIndex].commits += day.count
		}
		activeDays.add(day.date)
	}

	for (const repository of repositories) {
		const language = repository.language ?? 'Other'
		commitsByLanguage.set(
			language,
			(commitsByLanguage.get(language) ?? 0) + repository.commits,
		)
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

	const { streak, streakStart, streakEnd } = calculateLongestStreak(
		Array.from(activeDays).sort(),
	)

	const topRepository =
		repositories
			.slice()
			.sort(
				(left, right) => right.commits - left.commits || right.stars - left.stars,
			)[0] ?? null

	const chronotypeData = calculateChronotype(commitHours)

	return {
		totalCommits,
		totalRepositories,
		followers,
		languages,
		topLanguage: getTopLanguage(languages),
		months,
		activeMonth,
		streak,
		streakStart,
		streakEnd,
		chronotype: chronotypeData?.chronotype ?? null,
		nightCommitPercentage: chronotypeData?.nightCommitPercentage ?? null,
		topRepository: topRepository
			? {
					name: topRepository.name,
					commits: topRepository.commits,
					stars: topRepository.stars,
					language: topRepository.language ?? 'Other',
				}
			: {
					name: 'Пока нет данных',
					commits: 0,
					stars: 0,
					language: 'Other',
				},
	}
}
