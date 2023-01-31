/// <reference types="svelte" />

declare let __APP_VERSION__: string

type CrossPageRequestMessagePayload = {
    uuid: string,
    target?: string,
    error?: Error,
    data?: any
    // for playcount & best record
    difficulty?: import("@/common/song").Difficulty,
    idx?: string
}

type PostMessageFunc = (action: string, payload: CrossPageRequestMessagePayload) => void

type CrossPageRequestMessageEvent = MessageEvent<{
    action: string,
    payload: CrossPageRequestMessagePayload
}>

type PlayRecord = {
    title: string,
    score: number,
    difficulty: import("@/common/song").Difficulty,
    clear: "AJ" | "FC" | ""
}

type BestRecord = PlayRecord & { idx: string }
type RecentRecord = PlayRecord & { timestamp: number }

type ParsedRecord = (BestRecord & RecentRecord ) & {
    const: number
    rank: string
    rating: number
    order: number
    op: number
    opmax: number
    playCount?: number
    genre: string
}

type PlayerStats = {
    name: string,
    honor: { text: string, color: string },
    rating: string,
    ratingMax: string,
    playCount: string
}

type SongConstData = {
    BAS: number,
    ADV: number,
    EXP: number,
    MAS: number,
    ULT?: number,

}