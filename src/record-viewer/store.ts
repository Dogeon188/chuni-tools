import { writable } from "svelte/store"

function toggleable(defaultState = false) {
    const { subscribe, set, update } = writable(defaultState)
    return {
        subscribe,
        set,
        toggle() { update(b => !b) }
    }
}

export const page = writable("best")
export const showConfig = toggleable(false)