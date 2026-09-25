import { getWrappedData, WrappedDataError } from '@/src/shared/lib/api'
import type { WrappedDataErrorCode } from '@/src/shared/lib/api'
import type { WrappedData } from '@/src/shared/lib/types'
import { WrappedError } from '@/app/_components/WrappedError'
import { WrappedExperience } from '@/app/_components/WrappedExperience'

type Outcome =
	| { data: WrappedData }
	| { code: WrappedDataErrorCode }

const decodeUsername = (value: string) => {
	try {
		return decodeURIComponent(value)
	} catch {
		return null
	}
}

export default async function WrappedPage({
	params,
}: {
	params: Promise<{ username: string }>
}) {
	const { username } = await params
	const decodedUsername = decodeUsername(username)

	if (decodedUsername === null) {
		return <WrappedError code='invalid-username' username={username} />
	}

	const outcome: Outcome = await getWrappedData(decodedUsername).then(
		(data): Outcome => ({ data }),
		(error): Outcome => {
			if (error instanceof WrappedDataError) {
				return { code: error.code }
			}
			throw error
		},
	)

	return 'data' in outcome ? (
		<WrappedExperience data={outcome.data} />
	) : (
		<WrappedError code={outcome.code} username={decodedUsername} />
	)
}
