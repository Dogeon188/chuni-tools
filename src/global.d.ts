/// <reference types="svelte" />

declare let __APP_VERSION__: string

type CrossPageRequestMessagePayload = {
    target?: string,
    error?: Error,
    data?: any
}

type PostMessageFunc = (action: string, payload: CrossPageRequestMessagePayload, uuid?: string) => void

type CrossPageRequestMessageEvent = MessageEvent<{
    uuid: string,
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
type HistoryRecord = PlayRecord & { timestamp: number }

type ParsedRecord = (BestRecord & HistoryRecord ) & {
    const: number
    rank: string
    rating: number
    order: number
    op: number
    opmax: number
    oppercent: number
    playCount?: number | null
    genre: string
    scoreDiff: number // score difference
}

type PlayerStats = {
    name: string,
    honor: { text: string, color: string },
    rating: string,
    ratingMax: string,
    playCount: string,
    lastPlayed: number,
}

type SongConstData = {
    BAS: number,
    ADV: number,
    EXP: number,
    MAS: number,
    ULT?: number,
    genre: number
}