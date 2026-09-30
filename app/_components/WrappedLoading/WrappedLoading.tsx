'use client'

import { Logo } from '@shared/ui'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import './WrappedLoading.css'

const stages = ['Считаем вклады…', 'Смотрим языки…', 'Ищем streak…']

export const WrappedLoading = () => {
	const [stage, setStage] = useState(0)

	useEffect(() => {
		const timer = window.setInterval(() => {
			setStage(value => Math.min(value + 1, stages.length - 1))
		}, 1500)
		return () => window.clearInterval(timer)
	}, [])

	return (
		<main className='wrapped-loading'>
			<Logo />
			<p className='wrapped-loading-caption'>Готовим твой год</p>
			<ul className='wrapped-loading-stages'>
				{stages.map((label, index) => (
					<li
						className={[
							'wrapped-loading-stage',
							index < stage ? 'is-done' : '',
							index === stage ? 'is-active' : '',
						]
							.filter(Boolean)
							.join(' ')}
						key={label}
					>
						<span className='wrapped-loading-stage-mark'>
							{index < stage ? (
								<Check aria-hidden='true' size={13} strokeWidth={2.2} />
							) : null}
						</span>
						{label}
					</li>
				))}
			</ul>
			<div className='wrapped-loading-bar' aria-hidden='true'>
				<span />
			</div>
		</main>
	)
}
