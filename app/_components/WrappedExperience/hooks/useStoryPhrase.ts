import { useEffect, useState } from 'react'
import type { StoryKind } from '../StoryContent'
import { storyPhrases } from '../storyPhrases'

export const useStoryPhrase = (kind: StoryKind) => {
	const phrases = storyPhrases[kind]
	const [phraseIndex, setPhraseIndex] = useState(0)

	useEffect(() => {
		// Initializing after hydration keeps the server and first client render aligned.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setPhraseIndex(Math.floor(Math.random() * phrases.length))
	}, [phrases])

	return phrases[phraseIndex]
}
