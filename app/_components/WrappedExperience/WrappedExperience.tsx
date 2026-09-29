'use client'

import type { WrappedData } from '@/src/shared/lib/types'
import { Logo } from '@shared/ui'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import Stories from 'react-insta-stories'
import { StoryContent, type StoryKind } from './StoryContent'
import './WrappedExperience.css'

interface StoryMeta {
	kind: StoryKind
	theme: string
}

const storyMeta: StoryMeta[] = [
	{ kind: 'intro', theme: 'story-theme-coral' },
	{ kind: 'commits', theme: 'story-theme-lime' },
	{ kind: 'language', theme: 'story-theme-blue' },
	{ kind: 'month', theme: 'story-theme-violet' },
	{ kind: 'streak', theme: 'story-theme-orange' },
	{ kind: 'chronotype', theme: 'story-theme-night' },
	{ kind: 'repository', theme: 'story-theme-mint' },
	{ kind: 'summary', theme: 'story-theme-ink' },
]

const storyDuration = 7000

export const WrappedExperience = ({ data }: { data: WrappedData }) => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const visibleStoryMeta = useMemo(
		() =>
			data.stats.chronotype === null
				? storyMeta.filter(story => story.kind !== 'chronotype')
				: storyMeta,
		[data.stats.chronotype],
	)
	const stories = useMemo(
		() =>
			visibleStoryMeta.map(story => ({
				content: () => <StoryContent kind={story.kind} data={data} />,
			})),
		[visibleStoryMeta, data],
	)
	const currentStory = visibleStoryMeta[currentIndex] ?? visibleStoryMeta[0]
	const sourceLabel = data.source === 'github' ? 'GitHub API' : 'Демо-данные'

	return (
		<main className={`wrapped-page ${currentStory.theme}`}>
			<div className='wrapped-page-glow' aria-hidden='true' />

			<header className='wrapped-topbar'>
				<Link className='wrapped-brand' href='/' aria-label='На главную'>
					<Logo />
				</Link>
				<span className='source-badge'>
					<span className='source-badge-dot' /> {sourceLabel}
				</span>
			</header>

			<section className='story-shell'>
				<Stories
					stories={stories}
					loop={false}
					keyboardNavigation
					defaultInterval={storyDuration}
					width='100%'
					height='100%'
					storyContainerStyles={{ background: 'transparent' }}
					onStoryStart={(index: number) => setCurrentIndex(index)}
				/>
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
