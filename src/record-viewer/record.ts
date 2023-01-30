import { constData$ } from "@/record-viewer/store"
import { get } from "svelte/store"
import { calcOp, calcOpMax, calcRank, calcRating } from "../common/rating"
import { difficulties, difficultyWorldsend } from "../common/song"
import { t } from "@/record-viewer/store"

export const recordSorts: Record<string, (a: ParsedRecord, b: ParsedRecord) => number> = {
    default: (a, b) => b.rating - a.rating || b.const - a.const || a.score - b.score,
    playOrder: (a, b) => b.timestamp - a.timestamp,
    title: (a, b) => {
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return difficulties.indexOf(b.difficulty) - difficulties.indexOf(a.difficulty)
    },
    const: (a, b) => b.const - a.const,
    op: (a, b) => b.op - a.op,
    opp: (a, b) => b.op / b.opmax - a.op / a.opmax,
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
        .replace(/&#039;/g, "'");
}

export async function parseRecord(playRecord: PlayRecord[], isBestRecord = false) {
    const recordList = playRecord as ParsedRecord[]
    const musicData = await get(constData$)
    const cannotFetch = [] as ParsedRecord[]
    recordList.map((r) => {
        if (<string>r.difficulty === difficultyWorldsend) {
            r.const = -1
            r.rating = 0
            return
        }
        let songInfo = musicData[r.title]
        if (songInfo === undefined) {
            r.title = unescapeHtmlString(r.title)
            songInfo = musicData[r.title]
        }
        if (songInfo === undefined) {
            cannotFetch.push(r)
            r.const = 0
            r.rating = 0
            return
        }
        r.const = songInfo[r.difficulty]
        r.rating = calcRating(r)
        r.op = calcOp(r)
        r.opmax = calcOpMax(r)
        r.rank = calcRank(r.score)
        r.genre = songInfo.genre
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