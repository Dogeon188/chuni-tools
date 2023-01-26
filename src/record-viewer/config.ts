import { get, writable } from "svelte/store"

function stringConfig(
    key: string,
    defaultValue: string,
    accept: string[],
    onWrite: (value: string) => void = (() => { })) {
    let local = localStorage[key]

    if (local == undefined || !accept.includes(local)) {
        localStorage[key] = defaultValue
        local = localStorage[key]
    }

    const { subscribe, set, update } = writable(local)

    return {
        subscribe,
        set(value: string) {
            set(value)
            localStorage[key] = value
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) }
    }
}

function numberConfig(
    key: string,
    defaultValue: number,
    acceptMin: number,
    acceptMax: number,
    onWrite: (value: number) => void = (() => { })) {
    let local = localStorage[key]
    let value = parseFloat(local)

    if (local == undefined || value > acceptMax || value < acceptMin) {
        localStorage[key] = defaultValue
        local = localStorage[key]
        value = parseFloat(local)
    }

    const { subscribe, set, update } = writable(value)

    return {
        subscribe,
        set(value: number) {
            set(value)
            localStorage[key] = value
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) }
    }
}

export const locales = ["en", "zh"]
export const locale = stringConfig("locale", "en", locales)
