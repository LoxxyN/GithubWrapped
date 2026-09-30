import type { Metadata } from 'next'
import { Geist, Geist_Mono, Unbounded } from 'next/font/google'
import './globals.css'
import './normalize.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin', 'cyrillic'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin', 'cyrillic'],
})

const unbounded = Unbounded({
	variable: '--font-unbounded',
	subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
	title: 'GitHub Wrapped — статистика твоего года',
	description:
		'Персональный годовой отчёт по GitHub: коммиты, языки, streak и лучший проект одной историей.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang='ru'
			className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} h-full antialiased`}
		>
			<body className='min-h-full'>{children}</body>
		</html>
	)
}
