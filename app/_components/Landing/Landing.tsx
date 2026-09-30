import { Logo, SplitText } from '@shared/ui'
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

					<SplitText
						tag='h1'
						text='Узнать статистику'
						className='text-6xl font-black text-center'
						delay={200}
						duration={1}
						ease='power3.out'
						splitType='words'
						from={{ opacity: 0, y: 40 }}
						to={{ opacity: 1, y: 0 }}
						threshold={0.1}
						rootMargin='-100px'
						textAlign='center'
					/>
					<p className='landing-subtitle'>
						Введи GitHub username — получи свой год одной историей: коммиты,
						языки и streak.
					</p>
					<LandingForm />
				</main>

				<footer className='landing-footer'>
					<span>
						<Link href='https://github.com/LoxxyN'>Автор: @LoxxyN</Link>
					</span>
					<span>Стек: Next.js · TypeScript · Tailwind CSS</span>
					<span>
						<Link href='https://github.com/LoxxyN/GithubWrapped'>
							Исходники: GithubWrapped
						</Link>
					</span>
				</footer>
			</div>
		</LandingBackground>
	)
}
