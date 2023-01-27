import { Writable, writable } from "svelte/store"
import { genres } from "@/common/song"
import { Language } from "@/common/lang"

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

const locales = Object.values(Language)
export const locale = stringConfig("locale", Language.en_US, locales)

const themes = ["dark", "purple"]
export const theme = stringConfig("theme", "dark", themes)

export const filterConstMin = numberConfig("filterConstMin", 1, 1, 15.4)
export const filterConstMax = numberConfig("filterConstMax", 15.4, 1, 15.4)

export const filterDiff = flagsConfig("filterDiff", {
    "BAS": false, "ADV": false, "EXP": true, "MAS": true, "ULT": true
})

let filterGenreConfig: Record<string, boolean> = {}
for (let g of genres) { filterGenreConfig[g] = true }
export const filterGenre = flagsConfig("filterGenre", filterGenreConfig)

const availableConstData = ["intl", "jp"]
export const usedConstData = stringConfig("usedConstData", "intl", availableConstData)

export const showOverPower = booleanConfig("showOverPower", false)

export const showPlayCount = booleanConfig("showPlaycount", false)