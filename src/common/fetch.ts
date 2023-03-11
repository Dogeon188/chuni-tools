import { chuniNet } from "./const"
import { parseNumber } from "./number"
import { genreAll, Difficulty, difficulties } from "./song"
import { getCookie } from "./web"

async function fetchChuniPage(url: string, fd?: FormData) {
    const res = await fetch(chuniNet + url, {
        headers: { "Cache-Control": "no-cache" },
        method: fd ? "POST" : "GET",
        body: fd
    })
    if (res.status === 503 || res.status === 405) {
        throw new Error("Service temporarily unavailable")
    }
    if (res.url.indexOf("/error") != -1) {
        throw new Error("Request failed: rejected by server")
    }
    return new DOMParser().parseFromString(await res.text(), "text/html")
}

export async function fetchBestRecord(diff: Difficulty = Difficulty.master): Promise<BestRecord[]> {
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
    const dom = await fetchChuniPage("/mobile/record/musicGenre/" + api, fd)

    const recordList = Array.from(
        dom.querySelectorAll(".box01.w420")[1].querySelectorAll("form")
    ).map((f) => {
        const icons = f.querySelector(".play_musicdata_icon")
        const scoreText = f.querySelector(".text_b")?.innerHTML
        return {
            title: f.querySelector(".music_title")?.innerHTML,
            score: scoreText ? parseNumber(scoreText) : -1,
            difficulty: diff,
            clear: icons?.querySelector(`img[src*="alljustice"]`) ? "AJ" :
                icons?.querySelector(`img[src*="fullcombo"]`) ? "FC" : "",
            idx: (<HTMLInputElement>f.querySelector(`input[name="idx"]`)).value
        } as BestRecord
    }).filter((s) => s.title && s.score /* && s.score > 0 */)
    return recordList
}

export async function fetchPlayHistory(): Promise<HistoryRecord[]> {
    const dom = await fetchChuniPage("/mobile/record/playlog")

    const historyRecord = (Array.from(
        dom.querySelectorAll(".mt_10 .frame02.w400")
    )).map((d) => {
        const scoreStr = d.querySelector(".play_musicdata_score_text")?.innerHTML
        const diffSrc = (<HTMLImageElement>d.querySelector(".play_track_result img")).src
        const diffStr = /musiclevel_.*(?=\.png)/.exec(diffSrc)![0].slice(11)
        const icons = <Array<HTMLDivElement>>Array.from(d.querySelectorAll(".play_musicdata_icon"))
        return {
            title: d.querySelector(".play_musicdata_title")!.innerHTML,
            score: parseNumber(scoreStr!),
            difficulty: diffStr == "ultimate" ? "ULT" : diffStr == "worldsend" ? "WE" : Difficulty[<keyof typeof Difficulty>diffStr],
            clear: icons.some((di) => di.querySelector(`img[src*="alljustice"]`)) ? "AJ" :
                icons.some((di) => di.querySelector(`img[src*="fullcombo"]`)) ? "FC" : "",
            timestamp: Date.parse(d.querySelector(".play_datalist_date")!.innerHTML),
        }
    })
    return historyRecord as HistoryRecord[]
}

export async function fetchRecentRecord(): Promise<PlayRecord[]> {
    const dom = await fetchChuniPage("/mobile/home/playerData/ratingDetailRecent")
    return Array.from(dom.querySelectorAll("form")).map((f) => {
        const diffIdxStr = (<HTMLInputElement>f.querySelector("input[name=diff]"))?.value
        return {
            title: f.querySelector(".music_title")!.innerHTML,
            score: parseNumber(f.querySelector(".text_b")?.innerHTML!),
            difficulty: Object.values(Difficulty)[parseInt(diffIdxStr!)],
            clear: ""
        }
    })
}

export async function fetchPlayerStats(): Promise<PlayerStats> {
    const dom = await fetchChuniPage("/mobile/home/playerData")

    const honorBg = <HTMLDivElement>dom.querySelector(".player_honor_short")
    const honorColor = /honor_bg_.*(?=\.png)/.exec(honorBg.style.backgroundImage)
    const rating = (<Array<HTMLImageElement>>Array.from(
        dom.querySelectorAll(".player_rating_num_block img")
    )).map((i) => {
        if (/rating_.*_comma.png/.test(i.src)) return "."
        const imgSrc = /rating_.*_[0-9]*(?=\.png)/.exec(i.src)
        return imgSrc![0].slice(-1)
    }).join("")

    return {
        name: dom.querySelector(".player_name_in")!.innerHTML,
        honor: {
            text: dom.querySelector(".player_honor_text_view span")!.innerHTML,
            color: honorColor ? honorColor[0].slice(9) : "normal"
        },
        rating,
        ratingMax: dom.querySelector(".player_rating_max")!.innerHTML,
        playCount: dom.querySelector(".user_data_play_count .user_data_text")!.innerHTML,
        lastPlayed: Date.parse(dom.querySelector(".player_lastplaydate_text")!.innerHTML)
    }
}

export async function fetchSongPlayCount(idx: string, diff: Difficulty) {
    const fd = new FormData()
    fd.append("idx", idx)
    fd.append("genre", genreAll)
    fd.append("diff", difficulties.indexOf(diff).toString())
    fd.append("token", getCookie("_t"))
    const dom = await fetchChuniPage("/mobile/record/musicGenre/sendMusicDetail/", fd)

    const pcStr = dom.querySelectorAll(
        `.music_box.bg_${Object.entries(Difficulty).find((v) => v[1] === diff)![0]} .box14 > div`
    )[1].querySelector(".text_b")
        ?.innerHTML
        .replace("times", "")

    return parseInt(pcStr!)
}