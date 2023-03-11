import { getInitialLang, Language, saveLanguage } from "@/common/lang"
import { getCookie } from "@/common/web"
import { fetchPlayerStats, fetchBestRecord, fetchPlayHistory, fetchRecentRecord, fetchSongPlayCount } from "@/common/fetch"
import { getPostMessageFunc, getScriptHost } from "@/common/web"
import { chuniNet } from "@/common/const"

(async function (d: Document) {
    const UIString = {
        [Language.en_US]: {
            pleaseLogin: "Please login to CHUNITHM-NET first.",
            needReload: "Oops! Something went wrong, please reload CHUNITHM-NET.",
            analyzeRating: "Analyze Rating"
        },
        [Language.zh_TW]: {
            pleaseLogin: "請先登入 CHUNITHM-NET 再執行本程式。",
            needReload: "唉呀，看來我們這裡出了一點小意外，請重新整理 CHUNITHM-NET。",
            analyzeRating: "分析遊戲成績"
        }
    }[getInitialLang()]

    if (!getCookie("_t")) {
        alert(UIString.pleaseLogin)
        window.location.href = chuniNet
        return
    }

    function insertOpenerBtn() {
        const b = d.createElement("a")
        b.className = "chuni-tool-btn"
        const s = d.createElement("link")
        s.rel = "stylesheet"
        s.href = getScriptHost("fetch-all") + "/common/styles/inject.css"
        b.innerText = UIString.analyzeRating
        b.href = getScriptHost("fetch-all") + "/record-viewer/#best"
        b.target = "recordViewer"
        d.getElementsByTagName("head")[0].appendChild(s)
        s.addEventListener("load", () => {
            d.querySelector(".clearfix")?.insertAdjacentElement("afterend", b)
        })
    }

    function handleMessageRequest(event: CrossPageRequestMessageEvent) {
        const { payload, uuid } = event.data
        console.log("%cReceived request for: %c" + payload.target,
            "color: gray",
            "color: white")
        const send = getPostMessageFunc(<WindowProxy>event.source, event.origin)
        let res
        switch (payload.target) {
            case "bestRecord":
                console.log(
                    "%c    Target difficulty: %c" + payload.data.difficulty,
                    "color: gray",
                    "color: white")
                res = fetchBestRecord(payload.data.difficulty)
                break
            case "playHistory": res = fetchPlayHistory(); break
            case "recentRecord": res = fetchRecentRecord(); break
            case "playerStats": res = fetchPlayerStats(); break
            case "songPlayCount":
                console.log(
                    "%c    Target song id: %c" + payload.data.idx,
                    "color: gray",
                    "color: white")
                console.log(
                    "%c    Target difficulty: %c" + payload.data.difficulty,
                    "color: gray",
                    "color: white")
                res = fetchSongPlayCount(payload.data.idx!, payload.data.difficulty!)
                break;
        }
        send("ping", {
            target: payload.target,
        }, uuid)
        res?.then((r) => {
            send("respond", {
                target: payload.target,
                data: r
            }, uuid)
        }).catch((er: Error) => {
            console.error(er)
            send("respond", {
                target: payload.target,
                error: er
            }, uuid)
        })
    }

    function messageHandler(e: CrossPageRequestMessageEvent) {
        switch (e.data.action) {
            case "request": handleMessageRequest(e); break
            case "saveConfig":
                const l = e.data.payload.data?.lang
                if (l) {
                    saveLanguage(l)
                    console.log("%cChange language preferences to: %c" + l,
                        "color: gray",
                        "color: white")
                }
            default:
                break
        }
    }

    try {
        insertOpenerBtn()
        window.addEventListener("message", messageHandler, false)
    } catch (error) {
        alert(UIString.needReload)
        console.log(error)
    }
})(document)