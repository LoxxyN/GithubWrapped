import type { WrappedDataErrorCode } from '@/src/shared/lib/api'
import {
	ArrowLeft,
	CircleAlert,
	GitCommitHorizontal,
	Hourglass,
	UserX,
	WifiOff,
} from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import './WrappedError.css'

interface WrappedErrorProps {
	code: WrappedDataErrorCode
	username: string
}

interface ErrorContent {
	icon: ReactNode
	title: string
	description: (username: string) => string
}

const errorContentByCode: Record<WrappedDataErrorCode, ErrorContent> = {
	'not-found': {
		icon: <UserX aria-hidden='true' size={30} strokeWidth={1.8} />,
		title: 'Пользователь не найден',
		description: username =>
			`@${username} — такого аккаунта нет на GitHub. Проверь, как написано имя.`,
	},
	'rate-limit': {
		icon: <Hourglass aria-hidden='true' size={30} strokeWidth={1.8} />,
		title: 'Лимит запросов исчерпан',
		description: () =>
			'GitHub ограничил количество запросов. Попробуй обновить страницу через пару минут.',
	},
	empty: {
		icon: (
			<GitCommitHorizontal aria-hidden='true' size={30} strokeWidth={1.8} />
		),
		title: 'Год без публичных вкладов',
		description: username =>
			`У @${username} нет публичных контрибьюшенов за этот год — Wrapped пока нечего показывать.`,
	},
	'invalid-username': {
		icon: <CircleAlert aria-hidden='true' size={30} strokeWidth={1.8} />,
		title: 'Некорректный username',
		description: () =>
			'Имя может содержать только буквы, цифры и одинарный дефис — от одного до 39 символов.',
	},
	unavailable: {
		icon: <WifiOff aria-hidden='true' size={30} strokeWidth={1.8} />,
		title: 'Не удалось загрузить данные',
		description: () =>
			'GitHub сейчас недоступен. Попробуй обновить страницу чуть позже.',
	},
}

export const WrappedError = ({ code, username }: WrappedErrorProps) => {
	const content = errorContentByCode[code]

	return (
		<main className='wrapped-error'>
			<div className='wrapped-error-card'>
				<span className='wrapped-error-icon'>{content.icon}</span>
				<p className='wrapped-error-overline'>GitHub Wrapped</p>
				<h1 className='wrapped-error-title'>{content.title}</h1>
				<p className='wrapped-error-description'>
					{content.description(username)}
				</p>
				<Link className='wrapped-error-back' href='/'>
					<ArrowLeft aria-hidden='true' size={18} strokeWidth={1.8} /> На
					главную
				</Link>
			</div>
		</main>
	)
}
