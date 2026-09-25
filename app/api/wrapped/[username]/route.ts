import { getWrappedData, WrappedDataError } from '@shared/lib/api'

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
		const status =
			code === 'not-found'
				? 404
				: code === 'rate-limit'
					? 429
					: code === 'invalid-username'
						? 400
						: 404

		return Response.json({ error: { code, message } }, { status })
	}
}
