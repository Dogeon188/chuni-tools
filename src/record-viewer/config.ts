import { booleanConfig, flagsConfig, language, numberConfig, stringConfig, theme } from "@/common/config"
import { chuniNet } from "@/common/const"
import { Genre, genres } from "@/common/song"
import { getPostMessageFunc } from "@/common/web"
import { subscribe } from "svelte/internal"
import { get } from "svelte/store"
import { bestRecord$, playHistory$, recentRecord$ } from "./store"

subscribe(language, () => {
    try {
        const send = getPostMessageFunc(window.opener, chuniNet)
        send("saveConfig", { data: { lang: get(language) } })
    } catch (err) { console.error(err) }
})

export const filterConstMin = numberConfig("filterConstMin", 1, 1, 15.7)
export const filterConstMax = numberConfig("filterConstMax", 15.7, 1, 15.7)

export const filterDiff = flagsConfig("filterDiff", {
    "BAS": true, "ADV": true, "EXP": true, "MAS": true, "ULT": true
}, () => {
    bestRecord$.updateDiffFilter()
})

let filterGenreConfig = {} as Record<keyof typeof Genre, boolean>
for (let g of genres) { filterGenreConfig[g] = true }
export const filterGenre = flagsConfig("filterGenre", filterGenreConfig)

const availableConstData = [__INTL_VERSION__, __JP_VERSION__] as const
export const usedConstData = stringConfig("usedConstData", __INTL_VERSION__, availableConstData, () => {
    recentRecord$.updateConstData()
    playHistory$.updateConstData()
    bestRecord$.updateConstData()
})

const showOverPowerChoice = ["hide", "value", "percentage"] as const
export const showOverPower = stringConfig("showOverPower", "hide", showOverPowerChoice)

export const showPlayCount = booleanConfig("showPlaycount", false)

export const scoreDiffUpdateIntervals: Record<string, number> = {
    "1d": 86400000,
    "3d": 259200000,
    "7d": 604800000,
    "14d": 1209600000,
    "30d": 2592000000,
    "manual": Number.POSITIVE_INFINITY
}
export const diffUpdateInterval = stringConfig("diffUpdateInterval", "manual", Object.keys(scoreDiffUpdateIntervals))

// FIXME filterConstMin and filterConstMax (of numberConfig) cannot be reset
export const configs = [theme, language, filterConstMax, filterConstMin, filterDiff, filterGenre, usedConstData, showOverPower, showPlayCount, diffUpdateInterval]