import type { WrappedData } from '@shared/lib/types'
import { capitalize, formatDate, formatNumber } from '@shared/lib/utils'
import {
	Check,
	Download,
	Flame,
	GitBranch,
	Moon,
	Share2,
	Sparkles,
	Star,
	Sun,
} from 'lucide-react'
import { type CSSProperties } from 'react'
import { AnimatedNumber } from './AnimatedNumber'
import { StatPill } from './StatPill'
import { StoryAvatar } from './StoryAvatar'

export type StoryKind =
	| 'intro'
	| 'commits'
	| 'language'
	| 'month'
	| 'streak'
	| 'chronotype'
	| 'repository'
	| 'summary'

export type ShareState = 'idle' | 'copied' | 'shared' | 'error'

interface StoryContentProps {
	kind: StoryKind
	data: WrappedData
	shareState: ShareState
	onDownload: () => void
	onShare: () => void
}

export const StoryContent = ({
	kind,
	data,
	shareState,
	onDownload,
	onShare,
}: StoryContentProps) => {
	const { profile, stats, year } = data

	if (kind === 'intro') {
		return (
			<div className='story-layout story-layout-intro'>
				<div className='story-copy story-copy-center'>
					<StatPill>
						<Sparkles aria-hidden='true' size={14} strokeWidth={1.8} /> GITHUB
						WRAPPED {year}
					</StatPill>
					<StoryAvatar data={data} />
					<p className='story-overline'>Это твой год в коде</p>
					<h1>
						Вот что случилось,
						<br />
						<em>{profile.username}</em>
					</h1>
					<p className='story-description'>
						Личная история твоих коммитов, репозиториев и маленьких побед.
					</p>
				</div>
			</div>
		)
	}

	if (kind === 'commits') {
		return (
			<div className='story-layout story-layout-split'>
				<div className='story-copy'>
					<p className='story-overline'>01 / Твой ритм</p>
					<h2>
						Ты сделал
						<br />
						<em>{formatNumber(stats.totalCommits)}</em>
						<br />
						коммитов
					</h2>
					<p className='story-description'>
						Каждый — маленький кусок готового продукта.
					</p>
				</div>
				<div className='story-stat-panel story-stat-panel-number'>
					<span className='story-stat-caption'>в этом году</span>
					<strong>
						<AnimatedNumber value={stats.totalCommits} />
					</strong>
					<div className='commit-bars' aria-hidden='true'>
						{[38, 56, 42, 72, 64, 86, 54, 92, 76, 100, 68, 88].map(
							(height, index) => (
								<span
									key={index}
									style={
										{
											'--bar-height': `${height}%`,
											'--bar-delay': `${index * 55}ms`,
										} as CSSProperties
									}
								/>
							),
						)}
					</div>
				</div>
			</div>
		)
	}

	if (kind === 'language') {
		return (
			<div className='story-layout story-layout-split story-layout-reverse'>
				<div className='story-copy'>
					<p className='story-overline'>02 / Язык по умолчанию</p>
					<h2>
						Ты говоришь
						<br />
						<em>{stats.topLanguage.name}</em>
					</h2>
					<p className='story-description'>Код, который ты писал чаще всего.</p>
				</div>
				<div className='story-stat-panel language-panel'>
					<div
						className='language-orb'
						style={
							{ '--language-color': stats.topLanguage.color } as CSSProperties
						}
					>
						<span>{stats.topLanguage.percentage}%</span>
					</div>
					<div className='language-list'>
						{stats.languages.slice(0, 4).map(language => (
							<div className='language-row' key={language.name}>
								<div className='language-row-label'>
									<span
										className='language-dot'
										style={{ backgroundColor: language.color }}
									/>
									<span>{language.name}</span>
									<strong>{language.percentage}%</strong>
								</div>
								<div className='language-track'>
									<span
										style={{
											width: `${language.percentage}%`,
											backgroundColor: language.color,
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	if (kind === 'month') {
		const maxCommits = Math.max(...stats.months.map(month => month.commits), 1)
		return (
			<div className='story-layout story-layout-split'>
				<div className='story-copy'>
					<p className='story-overline'>03 / Пик года</p>
					<h2>
						Ты был на
						<br />
						<em>{stats.activeMonth.label}</em>
					</h2>
					<p className='story-description'>Месяц, в который всё сложилось.</p>
				</div>
				<div className='story-stat-panel month-panel'>
					<div className='month-highlight'>
						<span>{capitalize(stats.activeMonth.label)}</span>
						<strong>{formatNumber(stats.activeMonth.commits)}</strong>
						<small>коммитов</small>
					</div>
					<div className='month-chart' aria-label='Активность по месяцам'>
						{stats.months.map(month => (
							<div className='month-chart-column' key={month.month}>
								<span
									className={
										month.month === stats.activeMonth.month ? 'is-active' : ''
									}
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

	if (kind === 'streak') {
		return (
			<div className='story-layout story-layout-centered'>
				<div className='story-copy story-copy-center'>
					<div className='streak-flame'>
						<Flame aria-hidden='true' size={44} strokeWidth={1.8} />
					</div>
					<p className='story-overline'>04 / Не сбивайся</p>
					<h2>
						<em>{stats.streak}</em> дней
						<br />
						подряд
					</h2>
					<p className='story-description'>
						{formatDate(stats.streakStart)} — {formatDate(stats.streakEnd)}
					</p>
					<div className='streak-dots' aria-hidden='true'>
						{Array.from({ length: 14 }, (_, index) => (
							<span
								className={index < Math.min(stats.streak, 14) ? 'is-on' : ''}
								key={index}
							/>
						))}
					</div>
				</div>
			</div>
		)
	}

	if (kind === 'chronotype') {
		const isNightOwl = stats.chronotype === 'night-owl'
		return (
			<div
				className={`story-layout story-layout-centered ${isNightOwl ? 'is-night-owl' : 'is-early-bird'}`}
			>
				<div className='story-copy story-copy-center'>
					<div className='chronotype-icon'>
						{isNightOwl ? (
							<Moon aria-hidden='true' size={40} strokeWidth={1.8} />
						) : (
							<Sun aria-hidden='true' size={40} strokeWidth={1.8} />
						)}
					</div>
					<p className='story-overline'>05 / Твой темп</p>
					<h2>
						Ты —<br />
						<em>{isNightOwl ? 'сова' : 'жаворонок'}</em>
					</h2>
					<p className='story-description'>
						{stats.nightCommitPercentage}% коммитов пришлось на ночное время.
					</p>
					<div className='chronotype-meter'>
						<span style={{ width: `${stats.nightCommitPercentage}%` }} />
					</div>
				</div>
			</div>
		)
	}

	if (kind === 'repository') {
		return (
			<div className='story-layout story-layout-split story-layout-reverse'>
				<div className='story-copy'>
					<p className='story-overline'>06 / Главный проект</p>
					<h2>
						Проект, который
						<br />
						<em>забрал больше всего</em>
					</h2>
					<p className='story-description'>
						Твоя главная точка притяжения в коде.
					</p>
				</div>
				<div className='story-stat-panel repository-panel'>
					<div className='repository-icon'>
						<GitBranch aria-hidden='true' size={32} strokeWidth={1.8} />
					</div>
					<p className='repository-name'>/{stats.topRepository.name}</p>
					<div className='repository-metrics'>
						<div>
							<strong>{formatNumber(stats.topRepository.commits)}</strong>
							<span>коммитов</span>
						</div>
						<div>
							<strong>
								<Star aria-hidden='true' size={20} strokeWidth={1.8} />{' '}
								{formatNumber(stats.topRepository.stars)}
							</strong>
							<span>звёзд</span>
						</div>
					</div>
					<div className='repository-language'>
						<span style={{ backgroundColor: stats.topLanguage.color }} />{' '}
						{stats.topRepository.language}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='story-layout story-layout-summary'>
			<div className='story-summary-header'>
				<p className='story-overline'>07 / Финальный кадр</p>
				<h2>
					Это был
					<br />
					<em>твой год.</em>
				</h2>
			</div>
			<div className='summary-grid'>
				<div>
					<strong>
						<AnimatedNumber value={stats.totalCommits} />
					</strong>
					<span>коммитов</span>
				</div>
				<div>
					<strong>{stats.topLanguage.name}</strong>
					<span>главный язык</span>
				</div>
				<div>
					<strong>{stats.streak}</strong>
					<span>дней streak</span>
				</div>
				<div>
					<strong>{formatNumber(stats.totalRepositories)}</strong>
					<span>репозиториев</span>
				</div>
			</div>
			<div className='summary-actions'>
				<button
					className='story-action story-action-primary'
					type='button'
					onClick={onDownload}
				>
					<Download aria-hidden='true' size={18} strokeWidth={1.8} /> Скачать
					PNG
				</button>
				<button className='story-action' type='button' onClick={onShare}>
					{shareState === 'copied' || shareState === 'shared' ? (
						<Check aria-hidden='true' size={18} strokeWidth={1.8} />
					) : (
						<Share2 aria-hidden='true' size={18} strokeWidth={1.8} />
					)}
					{shareState === 'copied'
						? 'Ссылка скопирована'
						: shareState === 'shared'
							? 'Готово'
							: 'Поделиться'}
				</button>
			</div>
		</div>
	)
}
