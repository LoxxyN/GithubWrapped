import { WrappedDataLoader } from '@/app/_components/WrappedDataLoader'

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
		return <WrappedDataLoader username={username} />
	}

	return <WrappedDataLoader key={decodedUsername} username={decodedUsername} />
}
