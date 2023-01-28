/// <reference types="svelte" />

type PostMessageFunc = (action: string, payload: any) => void

type CrossPageRequestMessageEvent = MessageEvent<{
    action: string,
    payload: {
        uuid: string,
        target: string,
        error?: any,
        data?: unknown
        difficulty?: import("@/common/song").Difficulty,
        idx?: string
    }
}>


type PlayRecord = {
    title: string,
    score: number,
    difficulty: import("@/common/song").Difficulty,
    clear: "AJ" | "FC" | ""
}


type BestPlayRecord = PlayRecord & { idx: string }
type RecentPlayRecord = PlayRecord & { timestamp: number }

type ParsedRecord = (BestPlayRecord | RecentPlayRecord ) & {
    const: number
    rank: string
    rating: number
    order: number
    op: number
    opmax: number
    playCount?: number
    genre: number
}

type PlayerStats = {
    name: string,
    honor: { text: string, color: string },
    rating: string,
    ratingMax: string,
    playCount: string
}