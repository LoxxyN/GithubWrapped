import { formatDate } from '@shared/lib/utils'
import { Flame } from 'lucide-react'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide.type'

export const StreakStory = ({ data, headline }: StorySlideProps) => (
	<div className='story-layout story-layout-centered story-streak'>
		<div className='story-deco' aria-hidden='true'>
			<svg
				className='story-deco-scribble'
				viewBox='0 0 480 260'
				fill='none'
				focusable='false'
			>
				<path
					d='M-30 60 C 140 -30 300 70 510 10'
					stroke='currentColor'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
			</svg>
			<span className='story-deco-dot story-deco-dot-a' />
			<span className='story-deco-dot story-deco-dot-b' />
			<span className='story-deco-dot story-deco-dot-c' />
			<span className='story-deco-dot story-deco-dot-e' />
			<svg
				className='story-deco-arcs'
				viewBox='0 0 400 260'
				fill='none'
				focusable='false'
			>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8].map(step => (
					<ellipse
						key={step}
						className={step === 4 ? 'story-arc story-arc-accent' : 'story-arc'}
						cx={190 + step * 11}
						cy={260}
						rx={190 - step * 19}
						ry={235 - step * 25}
						strokeWidth={16}
					/>
				))}
			</svg>
		</div>
		<div className='story-copy story-copy-center'>
			<div className='streak-flame'>
				<Flame aria-hidden='true' size={44} strokeWidth={1.8} />
			</div>
			<p className='story-overline story-label'>04 / Не сбивайся</p>
			<h2>
				<Headline
					template={headline}
					variables={{ streak: `${data.stats.streak} дней` }}
				/>
			</h2>
			<p className='story-description'>
				{formatDate(data.stats.streakStart)} -{' '}
				{formatDate(data.stats.streakEnd)}
			</p>
			<div className='streak-dots' aria-hidden='true'>
				{Array.from({ length: 14 }, (_, index) => (
					<span
						className={index < Math.min(data.stats.streak, 14) ? 'is-on' : ''}
						key={index}
					/>
				))}
			</div>
		</div>
	</div>
)
