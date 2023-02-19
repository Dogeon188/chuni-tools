import type { Difficulty } from "@/common/song"

type PrevRecords = Record<string, {
    [key in Difficulty]?: number // score
}>

export function compareRecord(record: ParsedRecord[]) {
    const prevRecords = JSON.parse(localStorage.getItem("prevPlayRecord") ?? "{}") as PrevRecords

    record.forEach((r) => {
        if (r.scoreDiff !== undefined) return
        if (prevRecords[r.idx]?.[r.difficulty] !== undefined) {
            r.scoreDiff = r.score - prevRecords[r.idx][r.difficulty]!
        } else {
            r.scoreDiff = r.score
        }
    })

    return record
}

export function saveRecord(record: ParsedRecord[]) {
    const prevRecords = {} as PrevRecords

    record.forEach((r) => {
        if (r.score < 0) return
        prevRecords[r.idx] ??= {}
        prevRecords[r.idx][r.difficulty] = r.score
    })

    localStorage.setItem("prevPlayRecord", JSON.stringify(prevRecords))
    localStorage.setItem("prevUpdateTime", Date.now().toString())

    console.log("Saved record history at " + localStorage.getItem("prevUpdateTime"))
}