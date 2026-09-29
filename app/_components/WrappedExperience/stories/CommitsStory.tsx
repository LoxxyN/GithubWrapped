import { formatNumber } from '@shared/lib/utils'
import type { CSSProperties } from 'react'
import { AnimatedNumber } from '../AnimatedNumber'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide.type'

const chartHeights = [38, 56, 42, 72, 64, 86, 54, 92, 76, 100, 68, 88]

export const CommitsStory = ({ data, headline }: StorySlideProps) => (
	<div className='story-layout story-layout-split'>
		<div className='story-copy'>
			<p className='story-overline'>01 / Твой ритм</p>
			<h2>
				<Headline
					template={headline}
					variables={{ commits: formatNumber(data.stats.totalCommits) }}
				/>
			</h2>
			<p className='story-description'>
				Коммиты - маленький пульс твоего прогресса.
			</p>
		</div>
		<div className='story-stat-panel story-stat-panel-number'>
			<span className='story-stat-caption'>В этом году</span>
			<strong>
				<AnimatedNumber value={data.stats.totalCommits} />
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
