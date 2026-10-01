import { formatNumber, pluralizeContributions } from '@shared/lib/utils'
import type { CSSProperties } from 'react'
import { AnimatedNumber } from '../AnimatedNumber'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide.type'

const chartHeights = [38, 56, 42, 72, 64, 86, 54, 92, 76, 100, 68, 88]

export const CommitsStory = ({ data, headline }: StorySlideProps) => {
	const { totalContributions } = data.stats

	return (
		<div className='story-layout story-layout-split story-commits'>
			<div className='story-deco' aria-hidden='true'>
				<svg
					className='story-deco-scribble'
					viewBox='0 0 480 260'
					fill='none'
					focusable='false'
				>
					<path
						d='M510 40 C 360 200 200 20 -30 190'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
					/>
					<path
						d='M500 90 C 350 240 180 70 -10 240'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
					/>
				</svg>
				<span className='story-deco-dot story-deco-dot-a' />
				<span className='story-deco-dot story-deco-dot-b' />
				<span className='story-deco-dot story-deco-dot-c' />
				<span className='story-deco-dot story-deco-dot-d' />
				<span className='story-deco-dot story-deco-dot-e' />
				<span className='story-deco-dot story-deco-dot-f' />
				<div className='story-deco-stripes' />
				<div className='story-deco-checker' />
			</div>
			<div className='story-copy'>
				<p className='story-overline story-label'>01 / Твой ритм</p>
				<h2>
					<Headline
						template={headline}
						variables={{
							contributions: `${formatNumber(totalContributions)} ${pluralizeContributions(totalContributions)}`,
						}}
					/>
				</h2>
				<p className='story-description'>
					Вклады — маленький пульс твоего прогресса.
				</p>
			</div>
			<div className='story-stat-panel story-stat-panel-number'>
				<span className='story-stat-caption'>В этом году</span>
				<strong>
					<AnimatedNumber value={totalContributions} />
				</strong>
				<div className='commit-bars' aria-hidden='true'>
					{chartHeights.map((height, index) => (
						<span
							key={index}
							style={
								{
									'--bar-height': `${height}%`,
									'--bar-delay': `${index * 55}ms`,
								} as CSSProperties
							}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
