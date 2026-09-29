import { formatNumber } from '@shared/lib/utils'
import { GitBranch, Star } from 'lucide-react'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide.type'

export const RepositoryStory = ({ data, headline }: StorySlideProps) => {
	const { topLanguage, topRepository } = data.stats
	return (
		<div className='story-layout story-layout-split story-layout-reverse'>
			<div className='story-copy'>
				<p className='story-overline'>06 / Главный проект</p>
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
