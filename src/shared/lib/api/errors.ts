export type WrappedDataErrorCode =
	| 'invalid-username'
	| 'not-found'
	| 'rate-limit'
	| 'empty'
	| 'unavailable'

export class WrappedDataError extends Error {
	constructor(
		public readonly code: WrappedDataErrorCode,
		message: string,
	) {
		super(message)
		this.name = 'WrappedDataError'
	}
}
