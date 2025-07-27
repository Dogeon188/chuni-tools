import { fetchBestRecord } from "$lib/chuninet/fetch"
import { Difficulty } from "$lib/chuninet/song"

fetchBestRecord(Difficulty.master).then((record) => {
    const idxmap = {} as Record<string, string>
    for (const r of record) {
        idxmap[r.idx] = r.title
    }
    console.log(JSON.stringify(idxmap))
})
