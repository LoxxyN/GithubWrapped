import type { CSSProperties } from 'react'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide'

export const LanguageStory = ({ data, headline }: StorySlideProps) => (
	<div className='story-layout story-layout-split story-layout-reverse'>
		<div className='story-copy'>
			<p className='story-overline'>02 / Язык по умолчанию</p>
			<h2><Headline template={headline} variables={{ language: data.stats.topLanguage.name }} /></h2>
			<p className='story-description'>Код, который ты писал чаще всего.</p>
		</div>
		<div className='story-stat-panel language-panel'>
			<div className='language-orb' style={{ '--language-color': data.stats.topLanguage.color } as CSSProperties}>
				<span>{data.stats.topLanguage.percentage}%</span>
			</div>
			<div className='language-list'>
				{data.stats.languages.slice(0, 4).map(language => (
					<div className='language-row' key={language.name}>
						<div className='language-row-label'>
							<span className='language-dot' style={{ backgroundColor: language.color }} />
							<span>{language.name}</span><strong>{language.percentage}%</strong>
						</div>
						<div className='language-track'><span style={{ width: `${language.percentage}%`, backgroundColor: language.color }} /></div>
					</div>
				))}
			</div>
		</div>
	</div>
)
