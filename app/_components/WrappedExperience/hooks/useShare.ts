import { useEffect, useState } from 'react'

export type ShareState = 'idle' | 'copied' | 'error'

const resetDelayMilliseconds = 3000

export const useShare = () => {
	const [shareState, setShareState] = useState<ShareState>('idle')

	useEffect(() => {
		if (shareState !== 'copied') {
			return
		}

		const timer = window.setTimeout(() => {
			setShareState('idle')
		}, resetDelayMilliseconds)
		return () => window.clearTimeout(timer)
	}, [shareState])

	const share = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href)
			setShareState('copied')
		} catch {
			setShareState('error')
		}
	}

	return { share, shareState }
}
