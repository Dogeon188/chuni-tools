// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	let __ENV__: 'development' | 'production'
	let __INTL_VERSION__: string
	let __JP_VERSION__: string

	type CWRPayload<PayloadType> = {
		target?: string
		error?: Error
		data?: PayloadType
	}

	type PostMessageFunc = (
		action: string,
		payload: CWRPayload,
		uuid?: string
	) => void

	type CWRMessageEvent<PayloadType> = MessageEvent<{
		uuid: string
		action: string
		payload: CWRPayload<PayloadType>
	}>

	type PlayRecord = {
		title: string
		score: number
		difficulty: import('@/common/song').Difficulty
		clear: 'AJ' | 'FC' | ''
	}

	type BestRecord = PlayRecord & { idx: string }
	type HistoryRecord = PlayRecord & { timestamp: number }

	type ParsedRecord = (BestRecord & HistoryRecord) & {
		const: number
		constUncertain?: boolean
		version: number
		rank: string
		rawRating: number // multiplied by 10000
		rating: number // multiplied by 100
		order: number
		// Multiply the OP by 1000 to circumvent the problem with decimal point arithmetic in JS --Cip
		op: number
		opMax: number
		opPercent: number
		playCount?: number | null
		genre: string
		scoreDiff: number // score difference
	}

	type PlayerStats = {
		name: string
		honors: ({ text: string; color: string } | null)[]
		rating: string
		playCount: string
		lastPlayed: number
	}

	type SongConstData = {
		BAS: number
		ADV: number
		EXP: number
		MAS: number
		ULT?: number
		genre: number
		version: number
		uncertain?: import('@/common/song').Difficulty[]
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { }

