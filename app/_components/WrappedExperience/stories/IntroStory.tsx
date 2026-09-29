import { Sparkles } from 'lucide-react'
import { Headline } from '../Headline'
import { StatPill } from '../StatPill'
import { StoryAvatar } from '../StoryAvatar'
import type { StorySlideProps } from './StorySlide'

export const IntroStory = ({ data, headline }: StorySlideProps) => (
	<div className='story-layout story-layout-intro'>
		<div className='story-copy story-copy-center'>
			<StatPill>
				<Sparkles aria-hidden='true' size={14} strokeWidth={1.8} /> GITHUB WRAPPED{' '}
				{data.year}
			</StatPill>
			<StoryAvatar data={data} />
			<p className='story-overline'>Это твой год в коде</p>
			<h1>
				<Headline template={headline} variables={{ username: data.profile.username }} />
			</h1>
			<p className='story-description'>
				Личная история твоих коммитов, репозиториев и маленьких побед.
			</p>
		</div>
	</div>
)
