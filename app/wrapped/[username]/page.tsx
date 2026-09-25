import Link from 'next/link'

export default async function WrappedPage({
	params,
}: {
	params: Promise<{ username: string }>
}) {
	const { username } = await params

	return (
		<main className='flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center'>
			<p className='text-xs font-semibold uppercase tracking-[0.18em] text-white/60'>
				GitHub Wrapped
			</p>
			<h1 className='text-4xl font-bold text-white'>
				@{decodeURIComponent(username)}
			</h1>
			<p className='max-w-md text-white/70'>
				Страница со слайдами пока в работе — сначала собираем лендинг.
			</p>
			<Link className='text-white underline underline-offset-4' href='/'>
				← На главную
			</Link>
		</main>
	)
}
