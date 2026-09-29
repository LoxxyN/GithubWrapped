import { formatDate } from '@shared/lib/utils'
import { Flame } from 'lucide-react'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide.type'

export const StreakStory = ({ data, headline }: StorySlideProps) => (
	<div className='story-layout story-layout-centered'>
		<div className='story-copy story-copy-center'>
			<div className='streak-flame'>
				<Flame aria-hidden='true' size={44} strokeWidth={1.8} />
			</div>
			<p className='story-overline'>04 / Не сбивайся</p>
			<h2>
				<Headline
					template={headline}
					variables={{ streak: String(data.stats.streak) }}
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
