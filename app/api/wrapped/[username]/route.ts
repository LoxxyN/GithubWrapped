import { getWrappedData, WrappedDataError } from '@shared/lib/api'
import type { WrappedDataErrorCode } from '@shared/lib/api'

const statusByErrorCode: Record<WrappedDataErrorCode, number> = {
	'invalid-username': 400,
	'not-found': 404,
	'rate-limit': 429,
	empty: 422,
	unavailable: 503,
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ username: string }> },
) {
	const { username } = await params

	try {
		const data = await getWrappedData(username)
		return Response.json(data, {
			headers: {
				'Cache-Control': 'private, max-age=0, must-revalidate',
			},
		})
	} catch (error) {
		const code = error instanceof WrappedDataError ? error.code : 'unavailable'
		const message =
			error instanceof WrappedDataError
				? error.message
				: 'Unable to load GitHub data'

		return Response.json(
			{ error: { code, message } },
			{ status: statusByErrorCode[code] },
		)
	}
}
