import { Silk } from '@shared/ui'
import type { ReactNode } from 'react'
import './LandingBackground.css'

export const LandingBackground = ({ children }: { children: ReactNode }) => {
	return (
		<div className='landing-background'>
			<div className='landing-background-canvas' aria-hidden='true'>
				<Silk noiseIntensity={1.3} rotation={5} />
			</div>
			<div className='landing-background-content'>{children}</div>
		</div>
	)
}
