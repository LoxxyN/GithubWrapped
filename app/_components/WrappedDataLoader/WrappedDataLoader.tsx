'use client'

import { WrappedError } from '../WrappedError'
import { WrappedExperience } from '../WrappedExperience'
import { WrappedLoading } from '../WrappedLoading'
import { useWrappedData } from './useWrappedData'

export const WrappedDataLoader = ({ username }: { username: string }) => {
	const state = useWrappedData(username)

	if (state.status === 'loading') {
		return <WrappedLoading />
	}

	if (state.status === 'error') {
		return <WrappedError code={state.code} username={username} />
	}

	return <WrappedExperience data={state.data} />
}
