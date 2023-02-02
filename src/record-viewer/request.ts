import { getPostMessageFunc } from "@/common/web"
import { chuniNet } from "@/common/const"
import type { Difficulty } from "@/common/song"
import { v4 } from "uuid"

const requestTimeoutMs = 2000
const maxRetryTime = 3

class CrossPageRequest<T> {
    payload: any
    promise: Promise<T>
    resolve: (value: T) => void = () => { }
    reject: (reason: any) => void = () => { }
    uuid: string
    handled = false
    timeout?: NodeJS.Timeout
    retryTime = 0
    constructor(payload: any) {
        this.uuid = v4()
        this.payload = payload
        let self = this
        this.promise = new Promise((resolve, reject) => {
            self.resolve = resolve
            self.reject = reject
        })
        try {
            const send = getPostMessageFunc(window.opener, chuniNet)
            const timeoutFunc = () => {
                if (!this.handled) {
                    if (this.retryTime < maxRetryTime) {
                        this.retryTime += 1
                        send("request", payload)
                        this.timeout = setTimeout(timeoutFunc, requestTimeoutMs)
                    } else {
                        this.reject(new Error(`Request timed out: ${requestTimeoutMs * maxRetryTime} ms`))
                    }
                }
            }
            this.timeout = setTimeout(timeoutFunc, requestTimeoutMs)
            send("request", payload, this.uuid)
        } catch (err) {
            this.reject(err)
        }
    }
}

const requestList = new Map<string, CrossPageRequest<any>>()

function handleMessageEvent(event: CrossPageRequestMessageEvent) {
    const { action, payload, uuid } = event.data
    if (action === "ping") {
        if (!requestList.has(uuid)) {
            console.error("Unexpected response: " + uuid)
        }
        requestList.get(uuid)!.handled = true
        clearTimeout(requestList.get(uuid)?.timeout)
    }
    if (action !== "respond") return
    if (!requestList.has(uuid)) {
        console.error("Unexpected response: " + uuid)
    }
    if (payload.error) {
        console.error(
            "Error on handling request: " + payload.target + "\n",
            payload.error
        )
        requestList.get(uuid)?.reject(payload.error)
    } else {
        requestList.get(uuid)?.resolve(payload.data)
    }
    requestList.delete(uuid)
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
    const payload: CrossPageRequestMessagePayload = { target, data: { difficulty, idx } }
    const p = new CrossPageRequest<CrossPageRequestMap[K]>(payload)
    requestList.set(p.uuid, p)
    return p.promise
}