import { get, Writable, writable } from "svelte/store"
import { Genre, genres } from "@/common/song"
import { getInitialLang, Language } from "@/common/lang"
import { getPostMessageFunc } from "@/common/web"
import { chuniNet } from "@/common/const"
import { bestRecord$, playHistory$, recentRecord$ } from "./store"

interface Config<T> extends Writable<T> {
    reset(): void
}
interface BooleanConfig extends Config<boolean> {
    toggle(): void
}
interface StringConfig extends Config<string> {
    accepts: string[]
}

function stringConfig(
    key: string,
    defaultValue: string,
    accepts: string[],
    onWrite: (value: string) => void = (() => { })
): StringConfig {
    let local = localStorage[key]

    if (local === undefined || !accepts.includes(local)) {
        localStorage[key] = defaultValue
        local = localStorage[key]
    }

    const { subscribe, set, update } = writable(local)

    return {
        subscribe,
        set(value) {
            set(value)
            localStorage[key] = value
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) },
        accepts
    }
}

function numberConfig(
    key: string,
    defaultValue: number,
    acceptMin: number,
    acceptMax: number,
    onWrite: (value: number) => void = (() => { })
): Config<number> {
    let local = localStorage[key]
    let value = parseFloat(local)

    if (local === undefined || value > acceptMax || value < acceptMin) {
        localStorage[key] = defaultValue
        local = localStorage[key]
        value = parseFloat(local)
    }

    const { subscribe, set, update } = writable(value)

    return {
        subscribe,
        set(value) {
            set(value)
            localStorage[key] = value
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) }
    }
}

function booleanConfig(
    key: string,
    defaultValue: boolean,
    onWrite: (value: boolean) => void = (() => { })
): BooleanConfig {
    let local = localStorage[key]
    if (local === undefined || (local !== "true" && local !== "false")) {
        localStorage[key] = defaultValue
        local = localStorage[key]
    }
    let value = JSON.parse(local)

    const { subscribe, set, update } = writable(value)

    return {
        subscribe,
        set(value) {
            set(value)
            localStorage[key] = value
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) },
        toggle() { this.update(value => !value) }
    }
}

function flagsConfig(
    key: string,
    defaultValue: Record<string, boolean>,
    onWrite: (value: Record<string, boolean>) => void = (() => { })
): Config<Record<string, boolean>> {
    let local = localStorage[key]
    if (local == undefined) {
        localStorage[key] = JSON.stringify(defaultValue)
        local = localStorage[key]
    }
    let value = JSON.parse(local)

    let defaultKeys = Object.keys(defaultValue)
    let isValidValue = Object.keys(value).every((k) => (
        defaultKeys.includes(k) && typeof value[k] === "boolean"))
    if (!isValidValue) {
        localStorage[key] = JSON.stringify(defaultValue)
        local = localStorage[key]
    }

    value = JSON.parse(local)

    const { subscribe, set, update } = writable(value)

    return {
        subscribe,
        set(value: Record<string, boolean>) {
            set(value)
            localStorage[key] = JSON.stringify(value)
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) }
    }
}

export const language = stringConfig("language", getInitialLang(), Object.values(Language), () => {
    const send = getPostMessageFunc(window.opener, chuniNet)
    send("saveConfig", { lang: get(language) })
})

const themes = ["dark", "purple", "bright"]
export const theme = stringConfig("theme", "dark", themes)

export const filterConstMin = numberConfig("filterConstMin", 1, 1, 15.4)
export const filterConstMax = numberConfig("filterConstMax", 15.4, 1, 15.4)

export const filterDiff = flagsConfig("filterDiff", {
    "BAS": false, "ADV": false, "EXP": true, "MAS": true, "ULT": true
}, () => {
    bestRecord$.updateDiffFilter()
})

let filterGenreConfig = {} as Record<keyof typeof Genre, boolean>
for (let g of genres) { filterGenreConfig[g] = true }
export const filterGenre = flagsConfig("filterGenre", filterGenreConfig)

const availableConstData = ["intl", "jp"]
export const usedConstData = stringConfig("usedConstData", "intl", availableConstData, () => {
    recentRecord$.updateConstData()
    playHistory$.updateConstData()
    bestRecord$.updateConstData()
})

export const showOverPower = booleanConfig("showOverPower", false)

export const showPlayCount = booleanConfig("showPlaycount", false)

export const configs = [language, theme, filterConstMax, filterConstMin, filterDiff, filterGenre, usedConstData, showOverPower, showPlayCount,]