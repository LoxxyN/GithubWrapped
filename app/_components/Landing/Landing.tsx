import { Logo } from '@shared/ui'
import Link from 'next/link'
import { LandingBackground } from '../LandingBackground'
import { LandingForm } from '../LandingForm'
import './Landing.css'

export const Landing = () => {
	const year = new Date().getFullYear()

	return (
		<LandingBackground>
			<div className='landing-page'>
				<header className='landing-header'>
					<Logo />
					<span className='landing-header-note'>GitHub year in review</span>
				</header>

				<main className='landing-hero'>
					<p className='landing-eyebrow'>GitHub Wrapped {year}</p>
					<h1 className='landing-title'>Узнать статистику</h1>
					<p className='landing-subtitle'>
						Введи GitHub username — получи свой год одной историей: коммиты,
						языки и streak.
					</p>
					<LandingForm />
				</main>

				<footer className='landing-footer'>
					<span>
						Автор: <Link href='https://github.com/LoxxyN'>@LoxxyN</Link>
					</span>
					<span>Стек: Next.js · TypeScript · Tailwind CSS</span>
					<span>
						Исходники:{' '}
						<Link href='https://github.com/LoxxyN/GithubWrapped'>
							GithubWrapped
						</Link>
					</span>
				</footer>
			</div>
		</LandingBackground>
	)
}
