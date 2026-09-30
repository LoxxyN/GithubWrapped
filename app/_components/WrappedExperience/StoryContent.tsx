import type { WrappedData } from '@shared/lib/types'
import { useShare, useStoryPhrase } from './hooks'
import {
	ChronotypeStory,
	CommitsStory,
	IntroStory,
	LanguageStory,
	MonthStory,
	RepositoryStory,
	StreakStory,
	SummaryStory,
} from './stories'

export type StoryKind =
	| 'intro'
	| 'commits'
	| 'language'
	| 'month'
	| 'streak'
	| 'chronotype'
	| 'repository'
	| 'summary'

interface StoryContentProps {
	kind: StoryKind
	data: WrappedData
}

export const StoryContent = ({ kind, data }: StoryContentProps) => {
	const headline = useStoryPhrase(kind)
	const { share, shareState } = useShare()
	const storyProps = { data, headline }

	switch (kind) {
		case 'intro':
			return <IntroStory {...storyProps} />
		case 'commits':
			return <CommitsStory {...storyProps} />
		case 'language':
			return <LanguageStory {...storyProps} />
		case 'month':
			return <MonthStory {...storyProps} />
		case 'streak':
			return <StreakStory {...storyProps} />
		case 'chronotype':
			return <ChronotypeStory {...storyProps} />
		case 'repository':
			return <RepositoryStory {...storyProps} />
		case 'summary':
			return (
				<SummaryStory {...storyProps} share={share} shareState={shareState} />
			)
	}
}
