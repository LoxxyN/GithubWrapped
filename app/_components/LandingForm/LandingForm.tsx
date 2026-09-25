'use client'

import { isValidUsername, normalizeUsername } from '@shared/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import './LandingForm.css'

const suggestions = ['octocat', 'sindresorhus', 'gaearon']

export const LandingForm = () => {
	const router = useRouter()
	const [username, setUsername] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const normalizedUsername = normalizeUsername(username)

		if (!isValidUsername(normalizedUsername)) {
			setError('Введите корректный GitHub username')
			return
		}

		setError('')
		router.push(`/wrapped/${encodeURIComponent(normalizedUsername)}`)
	}

	return (
		<div className='landing-form-shell'>
			<form className='landing-form' onSubmit={handleSubmit} noValidate>
				<label className='sr-only' htmlFor='github-username'>
					GitHub username
				</label>
				<div className='landing-input-wrap'>
					<span className='landing-input-prefix' aria-hidden='true'>
						@
					</span>
					<input
						id='github-username'
						name='username'
						type='text'
						value={username}
						onChange={event => {
							setUsername(event.target.value)
							if (error) {
								setError('')
							}
						}}
						placeholder='твой GitHub username'
						autoComplete='off'
						autoCapitalize='none'
						spellCheck={false}
						aria-invalid={Boolean(error)}
						aria-describedby={error ? 'github-username-error' : undefined}
					/>
				</div>
				{error ? (
					<p className='landing-error' id='github-username-error' role='alert'>
						{error}
					</p>
				) : null}
				<div className='landing-submit'>
					<button className='landing-submit__button' type='submit'>
						<span>Показать мой Wrapped</span>
						<ArrowUpRight aria-hidden='true' size={18} strokeWidth={1.8} />
					</button>
				</div>
			</form>

			<div className='landing-suggestions'>
				<span>Попробуй:</span>
				{suggestions.map(suggestion => (
					<button
						key={suggestion}
						onClick={() => {
							setUsername(suggestion)
							setError('')
						}}
					>
						@{suggestion}
					</button>
				))}
			</div>
		</div>
	)
}
