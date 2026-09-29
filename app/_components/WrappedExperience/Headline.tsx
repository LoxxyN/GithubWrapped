import type { ReactNode } from 'react'

interface HeadlineProps {
	template: string
	variables: Record<string, string>
}

export const Headline = ({ template, variables }: HeadlineProps) => {
	const nodes: ReactNode[] = []

	template.split(/(\{[^}]+\})/g).forEach((part, partIndex) => {
		if (!part) return

		if (part.startsWith('{') && part.endsWith('}')) {
			const key = part.slice(1, -1)
			nodes.push(<em key={`em-${partIndex}`}>{variables[key] ?? key}</em>)
			return
		}

		part.split('\n').forEach((segment, segmentIndex) => {
			if (segmentIndex > 0) {
				nodes.push(<br key={`br-${partIndex}-${segmentIndex}`} />)
			}
			if (segment) {
				nodes.push(segment)
			}
		})
	})

	return <>{nodes}</>
}
