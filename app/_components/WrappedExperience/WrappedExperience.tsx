'use client'

import type { WrappedData } from '@shared/lib/types'
import { formatNumber } from '@shared/lib/utils'
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Download,
	Pause,
	Play,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StoryContent, type ShareState, type StoryKind } from './StoryContent'
import { drawWrappedCard } from './drawWrappedCard'

interface StoryMeta {
	kind: StoryKind
	label: string
	theme: string
}

const storyMeta: StoryMeta[] = [
	{ kind: 'intro', label: 'Начало', theme: 'story-theme-coral' },
	{ kind: 'commits', label: 'Коммиты', theme: 'story-theme-lime' },
	{ kind: 'language', label: 'Язык', theme: 'story-theme-blue' },
	{ kind: 'month', label: 'Месяц', theme: 'story-theme-violet' },
	{ kind: 'streak', label: 'Streak', theme: 'story-theme-orange' },
	{ kind: 'chronotype', label: 'Темп', theme: 'story-theme-night' },
	{ kind: 'repository', label: 'Репозиторий', theme: 'story-theme-mint' },
	{ kind: 'summary', label: 'Итоги', theme: 'story-theme-ink' },
]

export const WrappedExperience = ({ data }: { data: WrappedData }) => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isComplete, setIsComplete] = useState(false)
	const [isAutoAdvance, setIsAutoAdvance] = useState(true)
	const [shareState, setShareState] = useState<ShareState>('idle')
	const touchStart = useRef<number | null>(null)
	const currentStory = storyMeta[currentIndex]
	const lastIndex = storyMeta.length - 1

	const goTo = useCallback((index: number) => {
		setIsComplete(false)
		setCurrentIndex(Math.max(0, Math.min(index, storyMeta.length - 1)))
	}, [])

	const handleNext = useCallback(() => {
		if (currentIndex >= lastIndex) {
			setIsComplete(true)
			return
		}
		goTo(currentIndex + 1)
	}, [currentIndex, goTo, lastIndex])

	const handlePrevious = useCallback(() => {
		goTo(currentIndex - 1)
	}, [currentIndex, goTo])

	useEffect(() => {
		if (!isAutoAdvance || isComplete || currentIndex >= lastIndex) {
			return
		}

		const timer = window.setTimeout(handleNext, 7000)
		return () => window.clearTimeout(timer)
	}, [currentIndex, handleNext, isAutoAdvance, isComplete, lastIndex])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowRight' || event.key === ' ') {
				event.preventDefault()
				handleNext()
			}
			if (event.key === 'ArrowLeft') {
				event.preventDefault()
				handlePrevious()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handleNext, handlePrevious])

	const handleShare = useCallback(async () => {
		const shareData = {
			title: `${data.profile.username} — GitHub Wrapped ${data.year}`,
			text: `Мой GitHub Wrapped ${data.year}: ${formatNumber(data.stats.totalCommits)} коммитов и ${data.stats.streak} дней streak.`,
			url: window.location.href,
		}

		try {
			if (navigator.share) {
				await navigator.share(shareData)
				setShareState('shared')
				return
			}
			await navigator.clipboard.writeText(window.location.href)
			setShareState('copied')
		} catch {
			setShareState('error')
		}
	}, [data])

	const handleDownload = useCallback(() => {
		drawWrappedCard(data)
	}, [data])

	const sourceLabel = data.source === 'github' ? 'GitHub API' : 'Демо-данные'
	const progress = useMemo(
		() => ((currentIndex + 1) / storyMeta.length) * 100,
		[currentIndex],
	)

	return (
		<main className={`wrapped-page ${currentStory.theme}`}>
			<div className='wrapped-page-glow' aria-hidden='true' />
			<div className='wrapped-topbar'>
				<Link className='wrapped-brand' href='/' aria-label='На главную'>
					<span className='wrapped-brand-mark'>W</span>
					<span>
						wrapped<span className='wrapped-brand-dot'>.</span>
					</span>
				</Link>
				<div className='wrapped-topbar-meta'>
					<span className='source-badge'>
						<span className='source-badge-dot' /> {sourceLabel}
					</span>
					<button
						className='icon-button'
						type='button'
						onClick={() => setIsAutoAdvance(value => !value)}
						aria-label={
							isAutoAdvance ? 'Поставить на паузу' : 'Запустить автопрокрутку'
						}
					>
						{isAutoAdvance ? (
							<Pause aria-hidden='true' size={17} strokeWidth={1.8} />
						) : (
							<Play aria-hidden='true' size={17} strokeWidth={1.8} />
						)}
					</button>
				</div>
			</div>

			<section
				className='story-shell'
				onTouchStart={event => {
					touchStart.current = event.touches[0]?.clientX ?? null
				}}
				onTouchEnd={event => {
					const startX = touchStart.current
					const endX = event.changedTouches[0]?.clientX
					touchStart.current = null
					if (startX === null || endX === undefined) {
						return
					}
					if (Math.abs(endX - startX) > 48) {
						if (endX < startX) {
							handleNext()
						} else {
							handlePrevious()
						}
					}
				}}
			>
				<div
					className='story-progress'
					role='tablist'
					aria-label='Слайды Wrapped'
				>
					{storyMeta.map((story, index) => (
						<button
							aria-label={`Слайд ${index + 1}: ${story.label}`}
							aria-selected={index === currentIndex}
							className={`story-progress-item ${index < currentIndex ? 'is-complete' : ''} ${index === currentIndex ? 'is-active' : ''}`}
							key={story.kind}
							onClick={() => goTo(index)}
							role='tab'
							type='button'
						>
							<span />
						</button>
					))}
				</div>

				<div className='story-progress-caption'>
					<span>{String(currentIndex + 1).padStart(2, '0')}</span>
					<span>{progress.toFixed(0)}% пройдено</span>
				</div>

				<div
					className='story-content'
					key={`${currentStory.kind}-${isComplete}`}
				>
					{isComplete ? (
						<div className='story-complete'>
							<div className='complete-icon'>
								<Check aria-hidden='true' size={30} strokeWidth={1.8} />
							</div>
							<p className='story-overline'>Готово</p>
							<h2>
								Это твой
								<br />
								<em>GitHub {data.year}.</em>
							</h2>
							<p className='story-description'>
								Спасибо, что заглянул в свой год в коде.
							</p>
							<div className='complete-actions'>
								<button
									className='story-action story-action-primary'
									type='button'
									onClick={handleDownload}
								>
									<Download aria-hidden='true' size={18} strokeWidth={1.8} />{' '}
									Скачать PNG
								</button>
								<button
									className='story-action'
									type='button'
									onClick={() => goTo(0)}
								>
									<ArrowLeft aria-hidden='true' size={18} strokeWidth={1.8} />{' '}
									Начать сначала
								</button>
							</div>
						</div>
					) : (
						<StoryContent
							data={data}
							kind={currentStory.kind}
							onDownload={handleDownload}
							onShare={handleShare}
							shareState={shareState}
						/>
					)}
				</div>

				<div className='story-controls'>
					<button
						className='story-control'
						type='button'
						onClick={handlePrevious}
						disabled={currentIndex === 0}
						aria-label='Предыдущий слайд'
					>
						<ArrowLeft aria-hidden='true' size={18} strokeWidth={1.8} />{' '}
						<span>Назад</span>
					</button>
					<div className='story-control-hint'>
						Свайп или <kbd>←</kbd> <kbd>→</kbd>
					</div>
					<button
						className='story-control story-control-next'
						type='button'
						onClick={handleNext}
					>
						<span>{currentIndex === lastIndex ? 'Завершить' : 'Дальше'}</span>{' '}
						<ArrowRight aria-hidden='true' size={18} strokeWidth={1.8} />
					</button>
				</div>
			</section>

			<footer className='wrapped-footer'>
				<span>
					{data.profile.displayName} · {data.year}
				</span>
				<span>Сделано из кода и любопытства</span>
			</footer>
		</main>
	)
}
