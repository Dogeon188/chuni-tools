import type { Difficulty } from "@/common/song"
import { get } from "svelte/store"
import { playerStats$ } from "./store"

type PrevRecords = {
    [idx: string]: {
        [key in Difficulty]?: number // score
    }
}

function compareRecord(record: ParsedRecord[]) {
    const prevRecords = JSON.parse(localStorage.getItem("prevPlayRecord") ?? "{}") as PrevRecords

    record.forEach((r) => {
        if (prevRecords[r.idx]?.[r.difficulty] !== undefined) {
            r.scoreDiff = r.score - prevRecords[r.idx][r.difficulty]!
        } else {
            r.scoreDiff = r.score
        }
    })
}

function saveRecord(record: ParsedRecord[]) {
    const prevRecords = {} as PrevRecords

    record.forEach((r) => {
        if (r.score < 0) return
        prevRecords[r.idx] ??= {}
        prevRecords[r.idx][r.difficulty] = r.score
    })

    localStorage.setItem("prevPlayRecord", JSON.stringify(prevRecords))
    localStorage.setItem("prevLastPlayed", get(playerStats$).lastPlayed.toString())
}

export function processRecord(record: ParsedRecord[], update: boolean) {
    compareRecord(record)
    if (update) {
        saveRecord(record)
        console.log("Saved record history at " + localStorage.getItem("prevLastPlayed"))
    }
}