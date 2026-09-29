import type { WrappedData } from '@shared/lib/types'
import { formatNumber } from '@shared/lib/utils'
import { useState } from 'react'

export type ShareState = 'idle' | 'copied' | 'shared' | 'error'

export const useShare = (data: WrappedData) => {
	const [shareState, setShareState] = useState<ShareState>('idle')

	const share = async () => {
		const shareData = {
			title: `${data.profile.username} - GitHub Wrapped ${data.year}`,
			text: `Мой GitHub Wrapped ${data.year}: ${formatNumber(data.stats.totalCommits)} коммитов и ${data.stats.streak} дней streak.`,
			url: window.location.href,
		}

		try {
			if (navigator.share) {
				await navigator.share(shareData)
				setShareState('shared')
				return
			}

			await navigator.clipboard.writeText(window.location.href)
			setShareState('copied')
		} catch {
			setShareState('error')
		}
	}

	return { share, shareState }
}
