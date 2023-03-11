import { derived, get, writable } from "svelte/store"
import { language } from "@/common/config"
import { getTranslator } from "@/common/i18n"
import { parseRecord } from "@/common/record"
import { difficulties } from "@/common/song"
import type { Language } from "@/common/lang"
import { diffUpdateInterval, filterDiff, scoreDiffUpdateIntervals, usedConstData } from "./config"
import { CrossPageRequestMap, requestFor } from "./request"
import { compareRecord, saveRecord } from "./history"

function toggleable(defaultState = false) {
    const { subscribe, set, update } = writable(defaultState)
    return {
        subscribe,
        set,
        update,
        toggle() { update(b => !b) }
    }
}

// separated to avoid unnecessary locale imports
const translations = new Map<Language, Map<string, string>>()
const translationNames = new Map<Language, string>()

for (let l of language.accepts) {
    const commonTranslation = Object.entries(require(`@/common/locale/${l}.json`))
    const partialTranslation = Object.entries(require(`@/record-viewer/locale/${l}.json`))
    translations.set(l, <Map<Language, string>>new Map(commonTranslation.concat(partialTranslation)))
    translationNames.set(l, translations.get(l)?.get("locale.name") || "Undefined locale name")
}

export const t = getTranslator(translations, language)
export { translationNames }

export const page$ = writable("best")

export const showSettings$ = toggleable(false)

export const messageText$ = writable("")
export const fetchingSomething$ = toggleable(false)
export const messageTextLoading$ = toggleable(false)

export const showScoreDiff$ = toggleable(false)

const songConstData: Record<string, any> = {}
for (let c of usedConstData.accepts) songConstData[c] = undefined

export const constData$ = derived(usedConstData, async ($usedConstData: string) => {
    if (!songConstData[$usedConstData]) {
        songConstData[$usedConstData] = await fetch(
            `../data/song-const/${$usedConstData}.json`
        ).then(async (d) => await d.json())
    }
    return songConstData[$usedConstData] as Record<string, SongConstData>
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
            set(parseRecord(raw, await get(constData$)))
            inited = true
        },
        async updateConstData() {
            if (!inited) return
            set(parseRecord(raw, await get(constData$)))
        }
    }
}

export const recentRecord$ = createPlayRecord("recentRecord")
export const playHistory$ = createPlayRecord("playHistory")

export const playerStats$ = (() => {
    const { subscribe, set } = writable({} as PlayerStats)

    let inited = false

    return {
        set,
        subscribe,
        async init() {
            if (inited) return
            set(await requestFor("playerStats"))
            inited = true
        }
    }
})()

export const bestRecord$ = (() => {
    const { subscribe, set } = writable([] as ParsedRecord[])

    let inited = false
    let diffFetched: Record<string, boolean> = {}
    let raw = [] as BestRecord[]

    return {
        set,
        subscribe,
        async init() {
            const curTime = Date.now()
            const prevTime = Number(localStorage.getItem("prevUpdateTime") ?? Number.NEGATIVE_INFINITY)
            const loadAllAndSave = prevTime == Number.NEGATIVE_INFINITY || curTime - prevTime > scoreDiffUpdateIntervals[get(diffUpdateInterval)]

            if (inited) return

            const diffToFetch = JSON.parse(JSON.stringify(get(filterDiff)))
            for (let d of difficulties) {
                if (loadAllAndSave || diffToFetch[d]) {
                    messageText$.set(get(t)("record.fetch.fetching", {
                        diff: d.toLowerCase(),
                        diffStr: get(t)("record.fetch.diff." + d.toLowerCase())
                    }))
                    Array.prototype.push.apply(raw, await requestFor("bestRecord", d))
                    diffFetched[d] = true
                }
            }
            const parsed = parseRecord(raw, await get(constData$), get(t)("record.fetch.unknown"))
            if (loadAllAndSave) saveRecord(parsed)
            compareRecord(parsed)
            set(parsed)

            inited = true
        },
        async updateConstData() {
            if (!inited) return
            set(parseRecord(raw, await get(constData$), get(t)("record.fetch.unknown")))
        },
        async updateDiffFilter() {
            if (!inited) return
            messageTextLoading$.set(true)
            fetchingSomething$.set(true)
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
                if (fetchedAdditional) {
                    const parsed = parseRecord(raw, await get(constData$), get(t)("record.fetch.unknown"))
                    set(parsed)
                    compareRecord(parsed)
                }
                fetchingSomething$.set(false)
                messageTextLoading$.set(false)
            } catch {
                messageTextLoading$.set(false)
                messageText$.set(get(t)("record.fetch.error"))
                setTimeout(() => { fetchingSomething$.set(false) }, 6000)
            }
        }
    }
})()