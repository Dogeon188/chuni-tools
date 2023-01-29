import { parseRecord } from "./record"
import { difficulties } from "@/common/song"
import { derived, get, writable } from "svelte/store"
import { filterDiff, usedConstData } from "./config"
import { t } from "./i18n"
import { CrossPageRequestMap, requestFor } from "./request"

function toggleable(defaultState = false) {
    const { subscribe, set, update } = writable(defaultState)
    return {
        subscribe,
        set,
        update,
        toggle() { update(b => !b) }
    }
}

export const page$ = writable("best")

export const showConfig$ = toggleable(false)

export const messageText$ = writable("")
export const showMessageText$ = toggleable(false)
export const messageTextLoading$ = toggleable(false)

const songConstData: Record<string, any> = {}
for (let c of usedConstData.accepts) songConstData[c] = undefined

export const constData$ = derived(usedConstData, async ($usedConstData: string) => {
    if (!songConstData[$usedConstData]) {
        songConstData[$usedConstData] = await fetch(
            `https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/data/data/${$usedConstData}.json`
        ).then(async (d) => await d.json())
    }
    return songConstData[$usedConstData]
})

function createPlayRecord<K extends "recentRecord" | "playHistory">(type: K) {
    const { subscribe, set } = writable([] as ParsedRecord[])

    let inited = false
    let raw = [] as CrossPageRequestMap[K]

    return {
        set,
        subscribe,
        async init() {
            raw = await requestFor(type)
            set(await parseRecord(raw))
            inited = true
        },
        async updateConstData() {
            if (!inited) return
            set(await parseRecord(raw))
        }
    }
}

export const recentRecord$ = createPlayRecord("recentRecord")
export const playHistory$ = createPlayRecord("playHistory")

export const playerStats$ = (() => {
    const { subscribe, set } = writable({} as PlayerStats)
    return {
        set,
        subscribe,
        async init() {
            set(await requestFor("playerStats"))
        }
    }
})()

export const bestRecord$ = (() => {
    const { subscribe, set } = writable([] as ParsedRecord[])

    let inited = false
    let diffFetched: Record<string, boolean>
    let raw = [] as BestRecord[]

    return {
        set,
        subscribe,
        async init() {
            diffFetched = JSON.parse(JSON.stringify(get(filterDiff)))
            for (let d of difficulties) {
                if (diffFetched[d]) {
                    messageText$.set(get(t)("record.fetch.fetching", {
                        diff: d.toLowerCase(),
                        diffStr: get(t)("record.fetch.diff." + d.toLowerCase())
                    }))
                    Array.prototype.push.apply(raw, await requestFor("bestRecord", d))
                }
            }
            set(await parseRecord(raw, true))
            inited = true
        },
        async updateConstData() {
            if (!inited) return
            set(await parseRecord(raw, true))
        },
        async updateDiffFilter() {
            if (!inited) return
            messageTextLoading$.set(true)
            showMessageText$.set(true)
            let fetchedAdditional = false

            try {
                for (let d of difficulties) {
                    if (!diffFetched[d] && get(filterDiff)[d]) {
                        diffFetched[d] = true
                        messageText$.set(get(t)("record.fetch.fetching", {
                            diff: d.toLowerCase(),
                            diffStr: get(t)("record.fetch.diff." + d.toLowerCase())
                        }))
                        Array.prototype.push.apply(raw, await requestFor("bestRecord", d))
                        fetchedAdditional = true
                    }
                }
                if (fetchedAdditional) set(await parseRecord(raw, true))
                showMessageText$.set(false)
                messageTextLoading$.set(false)
            } catch {
                messageTextLoading$.set(false)
                messageText$.set(get(t)("record.fetch.error"))
                setTimeout(() => { showMessageText$.set(false) }, 6000)
            }
        }
    }
})()