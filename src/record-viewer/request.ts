import { getPostMessageFunc } from "@/common/web"
import { chuniNet } from "@/common/const"
import type { Difficulty } from "@/common/song"

const requestTimeoutMs = 2000
const maxRetryTime = 5

class CrossPageRequest<T> {
    payload: any
    promise: Promise<T>
    resolve: (value: T) => void = () => { }
    reject: (reason: any) => void = () => { }
    uuid: string
    handled = false
    timeout: NodeJS.Timeout
    retryTime = 0
    constructor(uuid: string, payload: any, send: PostMessageFunc) {
        let self = this
        this.uuid = uuid
        this.payload = payload
        this.promise = new Promise((resolve, reject) => {
            self.resolve = resolve
            self.reject = reject
        })
        const timeoutFunc = () => {
            if (!this.handled) {
                if (this.retryTime < maxRetryTime) {
                    this.retryTime += 1
                    send("request", payload)
                    this.timeout = setTimeout(timeoutFunc, requestTimeoutMs)
                } else {
                    this.reject(`Request timed out: ${requestTimeoutMs} ms`)
                }
            }
        }
        this.timeout = setTimeout(timeoutFunc, requestTimeoutMs)
        send("request", payload)
    }
}

const requestList = new Map<string, CrossPageRequest<any>>()

function handleMessageEvent(event: CrossPageRequestMessageEvent) {
    if (event.data.action === "preflight") {
        if (!requestList.has(event.data.payload.uuid)) {
            console.error("Unexpected response: " + event.data.payload.uuid)
        }
        requestList.get(event.data.payload.uuid)!.handled = true
        clearTimeout(requestList.get(event.data.payload.uuid)?.timeout)
    }
    if (event.data.action !== "respond") return
    if (!requestList.has(event.data.payload.uuid)) {
        console.error("Unexpected response: " + event.data.payload.uuid)
    }
    if (event.data.payload.error) {
        console.error(
            "Error on handling request: " + event.data.payload.target + "\n",
            event.data.payload.error
        )
        requestList.get(event.data.payload.uuid)?.reject(event.data.payload.error)
    } else {
        requestList.get(event.data.payload.uuid)?.resolve(event.data.payload.data)
    }
    requestList.delete(event.data.payload.uuid)
}

window.addEventListener("message", handleMessageEvent, false)

export interface CrossPageRequestMap {
    "playerStats": PlayerStats,
    "playHistory": PlayRecord[],
    "recentRecord": RecentRecord[],
    "bestRecord": BestRecord[],
    "songPlayCount": number
}

export async function requestFor(target: "bestRecord", difficulty: Difficulty)
    : Promise<BestRecord[]>
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
    const payload: any = { target, uuid }
    if (difficulty) payload.difficulty = difficulty
    if (idx) payload.idx = idx
    const p = new CrossPageRequest<CrossPageRequestMap[K]>(uuid, payload, send)
    requestList.set(uuid, p)
    return p.promise
}