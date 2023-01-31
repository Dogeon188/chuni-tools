import { get } from "svelte/store"
import { Genre, genres } from "@/common/song"
import { getPostMessageFunc } from "@/common/web"
import { chuniNet } from "@/common/const"
import { stringConfig, numberConfig, flagsConfig, booleanConfig } from "@/common/config"
import { language, theme } from "@/common/config"
import { bestRecord$, playHistory$, recentRecord$ } from "./store"
import { subscribe } from "svelte/internal"

subscribe(language, () => {
    const send = getPostMessageFunc(window.opener, chuniNet)
    send("saveConfig", { data: { lang: get(language) }, uuid: "changeLang" })
})

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

export const configs = [theme, language, filterConstMax, filterConstMin, filterDiff, filterGenre, usedConstData, showOverPower, showPlayCount,]