import type { WrappedData } from '../types/wrapped'

const getHash = (value: string) =>
	value.split('').reduce((hash, character) => hash + character.charCodeAt(0), 0)

const buildLanguages = (totalCommits: number) => {
	const shares = [
		{ name: 'TypeScript', ratio: 0.62, color: '#60a5fa' },
		{ name: 'JavaScript', ratio: 0.19, color: '#facc15' },
		{ name: 'CSS', ratio: 0.11, color: '#c084fc' },
		{ name: 'Other', ratio: 0.08, color: '#a3a3a3' },
	]

	return shares.map((language) => ({
		name: language.name,
		commits: Math.round(totalCommits * language.ratio),
		percentage: Math.round(language.ratio * 100),
		color: language.color,
	}))
}

export const getMockWrappedData = (
	username: string,
	year = new Date().getUTCFullYear(),
): WrappedData => {
	const seed = getHash(username)
	const totalCommits = 486 + (seed % 714)
	const streak = 6 + (seed % 21)
	const totalRepositories = 18 + (seed % 31)
	const followers = 84 + (seed % 930)
	const activeMonthIndex = seed % 12
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
	const months = Array.from({ length: 12 }, (_, month) => ({
		month,
		label: monthLabels[month],
		commits: month === activeMonthIndex
			? Math.round(totalCommits * 0.19)
			: 18 + ((seed + month * 29) % 74),
	}))
	const languages = buildLanguages(totalCommits)
	const topRepositoryName = username.length > 8 ? 'neon-atlas' : 'wrapped-ui'
	const topRepository = {
		name: topRepositoryName,
		commits: Math.round(totalCommits * 0.24),
		stars: 38 + (seed % 420),
		language: 'TypeScript',
	}
	const isNightOwl = seed % 3 !== 0

	return {
		year,
		profile: {
			username,
			displayName: username,
			avatarUrl: null,
		},
		stats: {
			totalCommits,
			totalRepositories,
			followers,
			languages,
			topLanguage: languages[0],
			months,
			activeMonth: months[activeMonthIndex],
			streak,
			streakStart: `${year}-08-${String((seed % 20) + 1).padStart(2, '0')}`,
			streakEnd: `${year}-08-${String((seed % 20) + 1 + streak - 1).padStart(2, '0')}`,
			chronotype: isNightOwl ? 'night-owl' : 'early-bird',
			nightCommitPercentage: isNightOwl ? 58 + (seed % 19) : 24 + (seed % 19),
			topRepository,
		},
		source: 'mock',
		generatedAt: new Date().toISOString(),
	}
}
