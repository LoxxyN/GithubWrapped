import { formatNumber } from '@shared/lib/utils'
import { useEffect, useState } from 'react'

export const AnimatedNumber = ({ value }: { value: number }) => {
	const [displayValue, setDisplayValue] = useState(0)

	useEffect(() => {
		let frame = 0
		const start = performance.now()
		const duration = 900

		const update = (time: number) => {
			const progress = Math.min(1, (time - start) / duration)
			const eased = 1 - (1 - progress) ** 3
			setDisplayValue(value * eased)
			if (progress < 1) {
				frame = requestAnimationFrame(update)
			}
		}

		frame = requestAnimationFrame(update)
		return () => cancelAnimationFrame(frame)
	}, [value])

	return <>{formatNumber(displayValue)}</>
}
