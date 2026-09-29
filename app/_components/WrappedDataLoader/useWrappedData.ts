import type { WrappedDataErrorCode } from '@shared/lib/api'
import type { WrappedData } from '@shared/lib/types'
import { useEffect, useState } from 'react'

type WrappedDataState =
	| { status: 'loading' }
	| { status: 'success'; data: WrappedData }
	| { status: 'error'; code: WrappedDataErrorCode }

const isErrorCode = (value: unknown): value is WrappedDataErrorCode =>
	value === 'invalid-username' ||
	value === 'not-found' ||
	value === 'rate-limit' ||
	value === 'empty' ||
	value === 'unavailable'

const getErrorCode = (payload: unknown): WrappedDataErrorCode => {
	if (
		typeof payload === 'object' &&
		payload !== null &&
		'error' in payload &&
		typeof payload.error === 'object' &&
		payload.error !== null &&
		'code' in payload.error &&
		isErrorCode(payload.error.code)
	) {
		return payload.error.code
	}

	return 'unavailable'
}

export const useWrappedData = (username: string) => {
	const [state, setState] = useState<WrappedDataState>({ status: 'loading' })

	useEffect(() => {
		const controller = new AbortController()

		const loadData = async () => {
			try {
				const response = await fetch(
					`/api/wrapped/${encodeURIComponent(username)}`,
					{ signal: controller.signal },
				)
				const payload = await response.json()

				if (!response.ok) {
					setState({ status: 'error', code: getErrorCode(payload) })
					return
				}

				setState({ status: 'success', data: payload as WrappedData })
			} catch {
				if (!controller.signal.aborted) {
					setState({ status: 'error', code: 'unavailable' })
				}
			}
		}

		loadData()
		return () => controller.abort()
	}, [username])

	return state
}
