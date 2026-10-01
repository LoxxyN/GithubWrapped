import { Sparkles } from 'lucide-react'
import { Headline } from '../Headline'
import { StatPill } from '../StatPill'
import { StoryAvatar } from '../StoryAvatar'
import type { StorySlideProps } from './StorySlide.type'

export const IntroStory = ({ data, headline }: StorySlideProps) => (
	<div className='story-layout story-layout-intro story-intro'>
		<div className='story-deco' aria-hidden='true'>
			<svg
				className='story-deco-scribble'
				viewBox='0 0 480 260'
				fill='none'
				focusable='false'
			>
				<path
					d='M-30 200 C 90 30 260 250 510 60'
					stroke='currentColor'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
				<path
					d='M-20 250 C 130 80 310 260 500 130'
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
			<StatPill>
				<Sparkles aria-hidden='true' size={14} strokeWidth={1.8} /> GITHUB
				WRAPPED {data.year}
			</StatPill>
			<StoryAvatar data={data} />
			<p className='story-overline'>Это твой год в коде</p>
			<h1>
				<Headline
					template={headline}
					variables={{ username: data.profile.username }}
				/>
			</h1>
			<p className='story-description'>
				Личная история твоих вкладов, репозиториев и маленьких побед.
			</p>
		</div>
	</div>
)
