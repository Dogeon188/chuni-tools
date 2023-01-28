import { getPostMessageFunc } from "@/common/bookmarklet"
import { chuniNet } from "@/common/const"
import type { Difficulty } from "@/common/song"

class CrossPageRequest<T> {
    promise: Promise<T>
    resolve: (value: T) => void = () => { }
    reject: (reason: any) => void = () => { }
    constructor() {
        let self = this
        this.promise = new Promise((resolve, reject) => {
            self.resolve = resolve
            self.reject = reject
        })
    }
}

const requestList = new Map<string, CrossPageRequest<any>>()

function handleMessageEvent(event: CrossPageRequestMessageEvent) {
    if (event.data.action !== "respond") return
    if (event.data.payload.error) {
        console.error(
            "Error on handling request: " + event.data.payload.target + "\n",
            event.data.payload.error
        )
        return
    }
    if (requestList.has(event.data.payload.uuid)) {
        requestList.get(event.data.payload.uuid)?.resolve(event.data.payload.data)
    }
}

window.addEventListener("message", handleMessageEvent, false)

interface CrossPageRequestMap {
    "playerStats": PlayerStats,
    "playHistory": PlayRecord[],
    "recentRecord": RecentPlayRecord[],
}

export async function requestFor(target: "bestRecord", difficulty: Difficulty)
    : Promise<BestPlayRecord[]>
export async function requestFor(target: "songPlayCount", difficulty: Difficulty, idx: string)
    : Promise<number>
export async function requestFor<K extends keyof CrossPageRequestMap>(target: K): Promise<CrossPageRequestMap[K]>
export async function requestFor<K extends keyof CrossPageRequestMap>(
    target: K,
    difficulty?: Difficulty,
    idx?: string
): Promise<CrossPageRequestMap[K]> {
    const send = getPostMessageFunc(window.opener, chuniNet)
    const uuid = crypto.randomUUID()
    const payload: any = {target, uuid}
    if (difficulty) payload.difficulty = difficulty
    if (idx) payload.idx = idx
    send("request", payload)
    const p = new CrossPageRequest<CrossPageRequestMap[K]>()
    requestList.set(uuid, p)
    return p.promise
}