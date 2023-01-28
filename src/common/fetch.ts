import { getCookie } from "./cookie"
import { parseNumber } from "./number"
import { genreAll, Difficulty } from "./song"
import { chuniNet } from "./const"

export async function fetchRecordList(diff: Difficulty = Difficulty.master) {
    const fd = new FormData()
    fd.append("genre", genreAll)
    fd.append("token", getCookie("_t"))
    const api = {
        [Difficulty.ultima]: "sendUltima",
        [Difficulty.master]: "sendMaster",
        [Difficulty.expert]: "sendExpert",
        [Difficulty.advanced]: "sendAdvanced",
        [Difficulty.basic]: "sendBasic"
    }[diff]

    const res = await fetch(chuniNet + "/mobile/record/musicGenre/" + api, {
        headers: { "Cache-Control": "no-cache" },
        method: "POST",
        body: fd
    })
    if (res.url.indexOf("/error") != -1) {
        throw new Error("Request failed: rejected by server")
    }
    const dom = new DOMParser().parseFromString(await res.text(), "text/html")
    const recordList = Array.from(
        dom.querySelectorAll(".box01.w420")[1].querySelectorAll("form")
    ).map((f) => {
        const icons = f.querySelector(".play_musicdata_icon")
        const scoreText = f.querySelector(".text_b")?.innerHTML
        return {
            title: f.querySelector(".music_title")?.innerHTML,
            score: parseNumber(scoreText ?? "-1"),
            difficulty: diff,
            clear: icons?.querySelector(`img[src*="alljustice"]`) ? "AJ" :
                icons?.querySelector(`img[src*="fullcombo"]`) ? "FC" : "",
            idx: (<HTMLInputElement>f.querySelector(`input[name="idx"]`)).value
        }
    }).filter((s) => s.title !== null && s.score > 0)

    return recordList
}