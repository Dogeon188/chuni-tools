import { get } from "svelte/store"
import { calcOp, calcOpMax, calcRank, calcRating } from "@/common/rating"
import { difficulties } from "@/common/song"
import { constData$, t } from "./store"

export const recordSorts: Record<string, (a: ParsedRecord, b: ParsedRecord) => number> = {
    default: (a, b) => {
        if (a.score < 0) return 1
        if (b.score < 0) return -1
        return b.rating - a.rating || b.const - a.const || a.score - b.score
    },
    playOrder: (a, b) => b.timestamp - a.timestamp,
    title: (a, b) => {
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return difficulties.indexOf(b.difficulty) - difficulties.indexOf(a.difficulty)
    },
    const: (a, b) => b.const - a.const,
    op: (a, b) => b.op - a.op,
    opp: (a, b) => b.op / b.opMax - a.op / a.opMax,
    score: (a, b) => b.score - a.score,
    rating: (a, b) => a.order - b.order,
    aj: (a, b) => {
        if (a.clear == b.clear) return a.order - b.order
        const clears = ["", "FC", "AJ"]
        return clears.indexOf(b.clear) - clears.indexOf(a.clear)
    },
    playcount: (a, b) => {
        if (a.playCount == undefined) return 100
        if (b.playCount == undefined) return -100
        if (a.playCount == b.playCount) return a.order - b.order
        return b.playCount - a.playCount
    },
}

function unescapeHtmlString(str: string) {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
}

export async function parseRecord(playRecord: PlayRecord[], isBestRecord = false) {
    const recordList = playRecord as ParsedRecord[]
    const musicData = await get(constData$) as {[songName: string]: SongConstData}
    const cannotFetch = [] as ParsedRecord[]
    recordList.map((r) => {
        if (<string>r.difficulty === "WE") {
            r.const = -1
            r.rating = 0
            r.op = -1
            r.opMax = -1
            r.opPercent = -1
            r.rank = calcRank(r.score)
            return
        }
        if (musicData[r.title] === undefined) {
            r.title = unescapeHtmlString(r.title)
        }
        let songInfo = musicData[r.title]
        if (songInfo === undefined) {
            cannotFetch.push(r)
            r.const = -1
            r.rating = 0
        } else {
            r.const = songInfo[r.difficulty]!
            r.rating = calcRating(r)
            r.genre = `${songInfo.genre}`
        }
        r.op = calcOp(r)
        r.opMax = calcOpMax(r)
        r.opPercent = (100 * r.op) / r.opMax
        r.rank = calcRank(r.score)
    })

    if (isBestRecord && cannotFetch.length) {
        alert(get(t)("record.fetch.unknown", {
            songs: cannotFetch.map(r => `    ${r.title} ${r.difficulty}`).join("\n")
        }))
    }

    recordList.sort(recordSorts.default)
    recordList.map((r, i) => { r.order = i + 1 })
    return recordList
}