import { formatNumber } from '@shared/lib/utils'
import { GitBranch, Star } from 'lucide-react'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide.type'

export const RepositoryStory = ({ data, headline }: StorySlideProps) => {
	const { topLanguage, topRepository } = data.stats
	return (
		<div className='story-layout story-layout-split story-layout-reverse story-repository'>
			<div className='story-deco story-deco-dots-right' aria-hidden='true'>
				<svg
					className='story-deco-scribble'
					viewBox='0 0 480 260'
					fill='none'
					focusable='false'
				>
					<path
						d='M-30 130 C 110 270 320 0 510 160'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
					/>
				</svg>
				<span className='story-deco-dot story-deco-dot-a' />
				<span className='story-deco-dot story-deco-dot-b' />
				<span className='story-deco-dot story-deco-dot-c' />
				<span className='story-deco-dot story-deco-dot-d' />
				<div className='story-deco-stripes' />
			</div>
			<div className='story-copy'>
				<p className='story-overline story-label'>06 / Главный проект</p>
				<h2>
					<Headline
						template={headline}
						variables={{ repo: topRepository.name }}
					/>
				</h2>
				<p className='story-description'>
					Твоя главная точка притяжения в коде.
				</p>
			</div>
			<div className='story-stat-panel repository-panel'>
				<div className='repository-icon'>
					<GitBranch aria-hidden='true' size={32} strokeWidth={1.8} />
				</div>
				<p className='repository-name'>/{topRepository.name}</p>
				<div className='repository-metrics'>
					<div>
						<strong>{formatNumber(topRepository.commits)}</strong>
						<span>коммитов</span>
					</div>
					<div>
						<strong>
							<Star aria-hidden='true' size={20} strokeWidth={1.8} />{' '}
							{formatNumber(topRepository.stars)}
						</strong>
						<span>звёзд</span>
					</div>
				</div>
				<div className='repository-language'>
					<span style={{ backgroundColor: topLanguage.color }} />{' '}
					{topRepository.language}
				</div>
			</div>
		</div>
	)
}
