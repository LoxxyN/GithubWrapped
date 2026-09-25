import type { WrappedData } from '@shared/lib/types'
import { formatNumber } from '@shared/lib/utils'

export const drawWrappedCard = (data: WrappedData) => {
	const canvas = document.createElement('canvas')
	canvas.width = 1080
	canvas.height = 1350
	const context = canvas.getContext('2d')
	if (!context) {
		return
	}

	const background = context.createLinearGradient(0, 0, 1080, 1350)
	background.addColorStop(0, '#12151c')
	background.addColorStop(0.55, '#25213b')
	background.addColorStop(1, '#e35b5b')
	context.fillStyle = background
	context.fillRect(0, 0, canvas.width, canvas.height)

	context.fillStyle = 'rgba(255,255,255,0.12)'
	context.beginPath()
	context.arc(850, 180, 280, 0, Math.PI * 2)
	context.fill()
	context.fillStyle = 'rgba(255,255,255,0.08)'
	context.beginPath()
	context.arc(120, 1140, 360, 0, Math.PI * 2)
	context.fill()

	context.fillStyle = '#ffffff'
	context.font = '700 34px Arial, sans-serif'
	context.fillText(`GITHUB WRAPPED ${data.year}`, 82, 130)
	context.font = '700 92px Arial, sans-serif'
	context.fillText(data.profile.username, 82, 290)
	context.font = '400 38px Arial, sans-serif'
	context.fillText('ваш год в коде', 86, 360)

	context.fillStyle = '#f9c74f'
	context.font = '700 210px Arial, sans-serif'
	context.fillText(formatNumber(data.stats.totalCommits), 78, 710)
	context.font = '400 42px Arial, sans-serif'
	context.fillText('коммитов за год', 86, 790)

	context.fillStyle = 'rgba(255,255,255,0.84)'
	context.font = '400 34px Arial, sans-serif'
	context.fillText(`Главный язык  ·  ${data.stats.topLanguage.name}`, 86, 950)
	context.fillText(`Streak  ·  ${data.stats.streak} дней`, 86, 1015)
	context.fillText(`Репозиторий  ·  ${data.stats.topRepository.name}`, 86, 1080)

	context.fillStyle = 'rgba(255,255,255,0.62)'
	context.font = '400 24px Arial, sans-serif'
	context.fillText('github-wrapped', 86, 1240)

	canvas.toBlob(blob => {
		if (!blob) {
			return
		}
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `github-wrapped-${data.profile.username}.png`
		link.click()
		URL.revokeObjectURL(url)
	}, 'image/png')
}
