const githubUsernamePattern = /^[a-zA-Z0-9-]{1,39}$/

export const normalizeUsername = (value: string) =>
	value.trim().replace(/^@+/, '')

export const isValidUsername = (value: string) => {
	const username = normalizeUsername(value)
	return (
		githubUsernamePattern.test(username) &&
		!username.startsWith('-') &&
		!username.endsWith('-') &&
		!username.includes('--')
	)
}
