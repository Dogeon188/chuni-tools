import type { Difficulty } from "@/common/song"

export const foo = "bar"

type PrevRecords = {[title: string]: {
    [key in Difficulty]?: number // score
}}

function compareRecord(record: ParsedRecord[]) {
    const prevRecords = JSON.parse(localStorage.getItem("prevPlayRecord") ?? "{}") as PrevRecords
    record.forEach((r) => {
        r.scoreDiff = r.score - (prevRecords[r.title][r.difficulty] ?? 0)
    })
    console.log(prevRecords)
}

function saveRecord(record: ParsedRecord[]) {
    const prevRecords = {} as PrevRecords

    record.forEach((r) => {
        if (r.score < 0) return
        prevRecords[r.title] ??= {}
        prevRecords[r.title][r.difficulty] = r.score
    })

    localStorage.setItem("prevPlayRecord", JSON.stringify(prevRecords))
}

export function processRecord(record: ParsedRecord[]) {
    compareRecord(record)
    saveRecord(record)
}