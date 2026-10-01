import { capitalize, formatNumber } from '@shared/lib/utils'
import { Headline } from '../Headline'
import type { StorySlideProps } from './StorySlide.type'

export const MonthStory = ({ data, headline }: StorySlideProps) => {
	const { activeMonth, months } = data.stats
	const maxContributions = Math.max(
		...months.map(month => month.contributions),
		1,
	)

	return (
		<div className='story-layout story-layout-split story-month'>
			<div className='story-deco story-deco-dots-right' aria-hidden='true'>
				<svg
					className='story-deco-scribble'
					viewBox='0 0 480 260'
					fill='none'
					focusable='false'
				>
					<path
						d='M-25 220 C 150 40 310 260 505 70'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
					/>
				</svg>
				<span className='story-deco-dot story-deco-dot-a' />
				<span className='story-deco-dot story-deco-dot-b' />
				<span className='story-deco-dot story-deco-dot-c' />
				<div className='story-deco-stripes' />
			</div>
			<div className='story-copy'>
				<p className='story-overline story-label'>03 / Пик года</p>
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
					<strong>{formatNumber(activeMonth.contributions)}</strong>
					<small>вкладов</small>
				</div>
				<div className='month-chart' aria-label='Активность по месяцам'>
					{months.map(month => (
						<div className='month-chart-column' key={month.month}>
							<span
								className={month.month === activeMonth.month ? 'is-active' : ''}
								style={{
									height: `${Math.max(8, (month.contributions / maxContributions) * 100)}%`,
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
