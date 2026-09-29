import { Share2, Check } from 'lucide-react'
import { AnimatedNumber } from '../AnimatedNumber'
import { Headline } from '../Headline'
import type { ShareState } from '../useShare'
import type { StorySlideProps } from './StorySlide'

interface SummaryStoryProps extends StorySlideProps {
	share: () => Promise<void>
	shareState: ShareState
}

export const SummaryStory = ({ data, headline, share, shareState }: SummaryStoryProps) => (
	<div className='story-layout story-layout-summary'>
		<div className='story-summary-header'>
			<p className='story-overline'>07 / Финальный кадр</p>
			<h2><Headline template={headline} variables={{}} /></h2>
		</div>
		<div className='summary-grid'>
			<div><strong><AnimatedNumber value={data.stats.totalCommits} /></strong><span>коммитов</span></div>
			<div><strong>{data.stats.topLanguage.name}</strong><span>главный язык</span></div>
			<div><strong>{data.stats.streak}</strong><span>дней streak</span></div>
			<div><strong>{data.stats.totalRepositories}</strong><span>репозиториев</span></div>
		</div>
		<div className='summary-actions'>
			<button className='story-action' type='button' onClick={share}>
				{shareState === 'copied' || shareState === 'shared' ? <Check aria-hidden='true' size={18} strokeWidth={1.8} /> : <Share2 aria-hidden='true' size={18} strokeWidth={1.8} />}
				{shareState === 'copied' ? 'Ссылка скопирована' : shareState === 'shared' ? 'Готово' : 'Поделиться'}
			</button>
		</div>
	</div>
)
