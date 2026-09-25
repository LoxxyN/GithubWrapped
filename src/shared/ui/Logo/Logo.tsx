import Image from 'next/image'

export const Logo = () => {
	return (
		<div>
			<Image src='/logo.svg' alt='logo' width={147} height={28} />
		</div>
	)
}
