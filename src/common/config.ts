import { type Writable, writable } from "svelte/store"
import { getInitialLang, Language } from "./lang"

export interface Config<T> extends Writable<T> {
    reset(): void
}
export interface BooleanConfig extends Config<boolean> {
    toggle(): void
}
export interface StringConfig<A extends readonly string[]> extends Config<A[number]> {
    accepts: A
}

export function stringConfig<A extends readonly string[], K extends A[number]>(
    key: string,
    defaultValue: K,
    accepts: A,
    onWrite: (value: K) => void = (() => { })
): StringConfig<A> {
    let local = <K | null>localStorage.getItem(key)

    if (local === null || !accepts.includes(local)) {
        local = defaultValue
        localStorage.setItem(key, local)
    }

    const { subscribe, set, update } = writable(local)

    return {
        subscribe,
        set(value: K) {
            set(value)
            localStorage.setItem(key, value)
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) },
        accepts
    }
}

export function numberConfig(
    key: string,
    defaultValue: number,
    acceptMin: number,
    acceptMax: number,
    onWrite: (value: number) => void = (() => { })
): Config<number> {
    let local = localStorage.getItem(key)
    let value = parseFloat(local ?? "NaN")

    if (local === null || value > acceptMax || value < acceptMin) {
        value = defaultValue
        localStorage.setItem(key, value.toString())
    }

    const { subscribe, set, update } = writable(value)

    return {
        subscribe,
        set(value) {
            set(value)
            localStorage.setItem(key, value.toString())
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) }
    }
}

export function booleanConfig(
    key: string,
    defaultValue: boolean,
    onWrite: (value: boolean) => void = (() => { })
): BooleanConfig {
    let local = localStorage.getItem(key)
    if (local === null || (local !== "true" && local !== "false")) {
        local = JSON.stringify(defaultValue)
        localStorage.setItem(key, local)
    }
    let value = JSON.parse(local)

    const { subscribe, set, update } = writable(value)

    return {
        subscribe,
        set(value) {
            set(value)
            localStorage.setItem(key, JSON.stringify(value))
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) },
        toggle() { this.update(value => !value) }
    }
}

export function flagsConfig<K extends string>(
    key: string,
    defaultValue: Record<K, boolean>,
    onWrite: (value: Record<K, boolean>) => void = (() => { })
): Config<Record<K, boolean>> {
    let local = localStorage.getItem(key)
    if (local === null) {
        local = JSON.stringify(defaultValue)
        localStorage.setItem(key, local)
    }
    let value = JSON.parse(local)

    let defaultKeys = Object.keys(defaultValue)
    let isValidValue = Object.keys(value).every((k) => (
        defaultKeys.includes(k) && typeof value[k] === "boolean"))
    if (!isValidValue) {
        local = JSON.stringify(defaultValue)
        localStorage.setItem(key, local)
        value = JSON.parse(local)
    }

    const { subscribe, set, update } = writable(value)

    return {
        subscribe,
        set(value: Record<K, boolean>) {
            set(value)
            localStorage.setItem(key, JSON.stringify(value))
            onWrite(value)
        },
        update,
        reset() { this.set(defaultValue) }
    }
}

const themes = ["dark", "purple"] as const
export const theme = stringConfig("theme", "dark", themes)
export const language = stringConfig("language", getInitialLang(), Object.values(Language))