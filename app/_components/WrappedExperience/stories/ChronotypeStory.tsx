import { Moon, Sun } from 'lucide-react'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide'

export const ChronotypeStory = ({ data, headline }: StorySlideProps) => {
	const { chronotype, nightCommitPercentage } = data.stats
	if (chronotype === null || nightCommitPercentage === null) return null

	const isNightOwl = chronotype === 'night-owl'
	return (
		<div className={`story-layout story-layout-centered ${isNightOwl ? 'is-night-owl' : 'is-early-bird'}`}>
			<div className='story-copy story-copy-center'>
				<div className='chronotype-icon'>
					{isNightOwl ? <Moon aria-hidden='true' size={40} strokeWidth={1.8} /> : <Sun aria-hidden='true' size={40} strokeWidth={1.8} />}
				</div>
				<p className='story-overline'>05 / Твой темп</p>
				<h2><Headline template={headline} variables={{ chronotype: isNightOwl ? 'сова' : 'жаворонок' }} /></h2>
				<p className='story-description'>{nightCommitPercentage}% коммитов прошло в ночное время.</p>
				<div className='chronotype-meter'><span style={{ width: `${nightCommitPercentage}%` }} /></div>
			</div>
		</div>
	)
}
