import { calcRank, calcRawRating, calcOp, calcOpMax } from "./rating"
import { difficulties, Difficulty } from "./song"

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
    const: (a, b) => b.const - a.const || a.order - b.order,
    op: (a, b) => b.op - a.op || a.order - b.order,
    opp: (a, b) => b.op / b.opMax - a.op / a.opMax || a.order - b.order,
    score: (a, b) => b.score - a.score || a.order - b.order,
    scoreDiff: (a, b) => b.scoreDiff - a.scoreDiff || a.order - b.order,
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

export function parseRecord(playRecord: PlayRecord[], constData: Record<string, SongConstData>, alertMessage?: string) {
    const recordList = playRecord as ParsedRecord[]
    const musicData = constData
    const cannotFetch = [] as ParsedRecord[]
    recordList.map((r) => {
        if (<string>r.difficulty === "WE") {
            r.title = unescapeHtmlString(r.title)
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
            if (songInfo.uncertain?.includes(r.difficulty)) r.constUncertain = true
            r.rawRating = calcRawRating(r)
            r.genre = `${songInfo.genre}`
            r.rating = Math.floor(r.rawRating / 100)
        }
        r.op = calcOp(r)
        r.opMax = calcOpMax(r)
        r.opPercent = (100 * r.op) / r.opMax
        r.rank = calcRank(r.score)
    })

    if (alertMessage && cannotFetch.length) {
        const merged = {} as { [song: string]: Difficulty[] }
        cannotFetch.forEach((r) => {
            merged[r.title] ??= []
            merged[r.title].push(r.difficulty)
        })

        alert(alertMessage.replace(
            "{{songs}}",
            Object.entries(merged).map(([title, diffs]) =>
                `    ${title} ${diffs.join(",")}`
            ).join("\n")))
    }

    recordList.sort(recordSorts.default)
    recordList.map((r, i) => { r.order = i + 1 })
    return recordList
}