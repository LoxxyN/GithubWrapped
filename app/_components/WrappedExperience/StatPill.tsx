import type { ReactNode } from 'react'

interface StatPillProps {
	children: ReactNode
	tone?: 'default' | 'dark'
}

export const StatPill = ({ children, tone = 'default' }: StatPillProps) => (
	<span className={`stat-pill stat-pill-${tone}`}>{children}</span>
)
