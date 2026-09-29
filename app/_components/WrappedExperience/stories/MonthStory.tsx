import { capitalize, formatNumber } from '@shared/lib/utils'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide.type'

export const MonthStory = ({ data, headline }: StorySlideProps) => {
	const { activeMonth, months } = data.stats
	const maxCommits = Math.max(...months.map(month => month.commits), 1)

	return (
		<div className='story-layout story-layout-split'>
			<div className='story-copy'>
				<p className='story-overline'>03 / Пик года</p>
				<h2>
					<Headline
						template={headline}
						variables={{ month: activeMonth.label }}
					/>
				</h2>
				<p className='story-description'>Месяц, в который всё сложилось.</p>
			</div>
			<div className='story-stat-panel month-panel'>
				<div className='month-highlight'>
					<span>{capitalize(activeMonth.label)}</span>
					<strong>{formatNumber(activeMonth.commits)}</strong>
					<small>коммитов</small>
				</div>
				<div className='month-chart' aria-label='Активность по месяцам'>
					{months.map(month => (
						<div className='month-chart-column' key={month.month}>
							<span
								className={month.month === activeMonth.month ? 'is-active' : ''}
								style={{
									height: `${Math.max(8, (month.commits / maxCommits) * 100)}%`,
								}}
							/>
							<small>{month.label.slice(0, 3)}</small>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
