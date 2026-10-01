import { Moon, Sun } from 'lucide-react'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide.type'

export const ChronotypeStory = ({ data, headline }: StorySlideProps) => {
	const { chronotype, nightCommitPercentage } = data.stats
	if (chronotype === null || nightCommitPercentage === null) return null

	const isNightOwl = chronotype === 'night-owl'
	return (
		<div
			className={`story-layout story-layout-centered story-chronotype ${isNightOwl ? 'is-night-owl' : 'is-early-bird'}`}
		>
			<div className='story-deco story-deco-dots-right' aria-hidden='true'>
				<svg
					className='story-deco-scribble'
					viewBox='0 0 480 260'
					fill='none'
					focusable='false'
				>
					<path
						d='M-20 180 C 140 -10 330 250 505 90'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
					/>
				</svg>
				<span className='story-deco-dot story-deco-dot-a' />
				<span className='story-deco-dot story-deco-dot-b' />
				<span className='story-deco-dot story-deco-dot-c' />
				<span className='story-deco-dot story-deco-dot-f' />
				<div className='story-deco-checker' />
			</div>
			<div className='story-copy story-copy-center'>
				<div className='chronotype-icon'>
					{isNightOwl ? (
						<Moon aria-hidden='true' size={40} strokeWidth={1.8} />
					) : (
						<Sun aria-hidden='true' size={40} strokeWidth={1.8} />
					)}
				</div>
				<p className='story-overline story-label'>05 / Твой темп</p>
				<h2>
					<Headline
						template={headline}
						variables={{ chronotype: isNightOwl ? 'сова' : 'жаворонок' }}
					/>
				</h2>
				<p className='story-description'>
					{nightCommitPercentage}% коммитов прошло в ночное время.
				</p>
				<div className='chronotype-meter'>
					<span style={{ width: `${nightCommitPercentage}%` }} />
				</div>
			</div>
		</div>
	)
}
