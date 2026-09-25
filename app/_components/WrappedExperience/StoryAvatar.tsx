import type { WrappedData } from '@shared/lib/types'
import { getInitials } from '@shared/lib/utils'

interface StoryAvatarProps {
	data: WrappedData
}

export const StoryAvatar = ({ data }: StoryAvatarProps) => (
	<div
		className='story-avatar'
		style={
			data.profile.avatarUrl
				? { backgroundImage: `url(${data.profile.avatarUrl})` }
				: undefined
		}
	>
		{!data.profile.avatarUrl ? getInitials(data.profile.displayName) : null}
	</div>
)
