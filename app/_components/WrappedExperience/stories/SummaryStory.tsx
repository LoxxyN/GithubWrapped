import { ArrowLeft, Check, Share2 } from 'lucide-react'
import Link from 'next/link'
import { AnimatedNumber } from '../AnimatedNumber'
import { Headline } from '../Headline'
import type { ShareState } from '../hooks/useShare'
import type { StorySlideProps } from './StorySlide.type'

interface SummaryStoryProps extends StorySlideProps {
	share: () => Promise<void>
	shareState: ShareState
}

export const SummaryStory = ({
	data,
	headline,
	share,
	shareState,
}: SummaryStoryProps) => (
	<div className='story-layout story-layout-summary story-summary'>
		<div className='story-deco' aria-hidden='true'>
			<svg
				className='story-deco-scribble'
				viewBox='0 0 480 260'
				fill='none'
				focusable='false'
			>
				<path
					d='M510 50 C 340 220 170 20 -30 180'
					stroke='currentColor'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
				<path
					d='M500 110 C 350 260 190 70 -10 230'
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
		<div className='story-summary-header'>
			<p className='story-overline story-label'>07 / Финальный кадр</p>
			<h2>
				<Headline template={headline} variables={{}} />
			</h2>
		</div>
		<div className='summary-grid'>
			<div>
				<strong>
					<AnimatedNumber value={data.stats.totalContributions} />
				</strong>
				<span>вкладов</span>
			</div>
			<div>
				<strong>{data.stats.topLanguage.name}</strong>
				<span>главный язык</span>
			</div>
			<div>
				<strong>{data.stats.streak}</strong>
				<span>дней streak</span>
			</div>
			<div>
				<strong>{data.stats.totalRepositories}</strong>
				<span>репозиториев</span>
			</div>
		</div>
		<div className='summary-actions'>
			<button className='story-action' type='button' onClick={share}>
				{shareState === 'copied' ? (
					<Check aria-hidden='true' size={18} strokeWidth={1.8} />
				) : (
					<Share2 aria-hidden='true' size={18} strokeWidth={1.8} />
				)}
				{shareState === 'copied' ? 'Ссылка скопирована' : 'Поделиться'}
			</button>
			<Link className='story-action' href='/'>
				<ArrowLeft aria-hidden='true' size={18} strokeWidth={1.8} /> На главную
			</Link>
		</div>
	</div>
)
