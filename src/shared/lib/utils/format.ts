export const formatNumber = (value: number) =>
	new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(value)))

export const capitalize = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1)

export const formatDate = (value: string | null) => {
	if (!value) {
		return 'период не найден'
	}

	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC',
	}).format(new Date(`${value}T00:00:00.000Z`))
}

export const getInitials = (name: string) =>
	name
		.split(/[\s_-]+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0])
		.join('')
		.toUpperCase() || 'GW'

export const pluralizeContributions = (value: number) => {
	const remainder = Math.abs(value) % 100
	const lastDigit = remainder % 10

	if (remainder >= 11 && remainder <= 13) {
		return 'вкладов'
	}
	if (lastDigit === 1) {
		return 'вклад'
	}
	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'вклада'
	}
	return 'вкладов'
}
