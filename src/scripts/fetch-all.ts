import { getInitialLang, Language, saveLanguage } from "@/common/lang"
import { getCookie } from "@/common/web"
import { fetchPlayerStats, fetchBestRecord, fetchPlayHistory, fetchRecentRecord, fetchSongPlayCount } from "@/common/fetch"
import { getPostMessageFunc, getScriptHost } from "@/common/web"
import { chuniNet } from "@/common/const"

const buttonStyleRule = `.chuni-tool-btn {
    color: white;
    font-size: 1.5em;
    font-weight: bold;
    padding: 1.5rem;
    margin: 2rem auto;
    display: block;
    width: fit-content;
    text-decoration: none;
    border-radius: .5rem;
    border: 3px solid #567;
    background-color: #234;
    text-align: center;
    cursor: pointer;
    user-select: none;
    filter: brightness(.7);
    transition: 0.2s;
}`
const buttonHoverStyleRule = `
.chuni-tool-btn:hover {
    filter: brightness(1);
    color: white;
}`;

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
        d.styleSheets[0].insertRule(buttonStyleRule)
        d.styleSheets[0].insertRule(buttonHoverStyleRule)
        b.innerText = UIString.analyzeRating
        b.href = getScriptHost("fetch-all") + "/record-viewer/#best"
        b.target = "recordViewer"
        d.getElementById("inner")?.insertAdjacentElement("beforebegin", b)
    }

    function handleMessageRequest(e: CrossPageRequestMessageEvent, send: PostMessageFunc) {
        console.log("%cReceived request for: %c" + e.data.payload.target,
            "color: gray",
            "color: white")
        let res
        switch (e.data.payload.target) {
            case "bestRecord":
                console.log(
                    "%c    Target difficulty: %c" + e.data.payload.difficulty,
                    "color: gray",
                    "color: white")
                res = fetchBestRecord(e.data.payload.difficulty)
                break
            case "playHistory": res = fetchPlayHistory(); break
            case "recentRecord": res = fetchRecentRecord(); break
            case "playerStats": res = fetchPlayerStats(); break
            case "songPlayCount":
                console.log(
                    "%c    Target song id: %c" + e.data.payload.idx,
                    "color: gray",
                    "color: white")
                console.log(
                    "%c    Target difficulty: %c" + e.data.payload.difficulty,
                    "color: gray",
                    "color: white")
                res = fetchSongPlayCount(e.data.payload.idx!, e.data.payload.difficulty!)
                break;
        }
        send("preflight", {
            target: e.data.payload.target,
            uuid: e.data.payload.uuid,
        })
        res?.then((r) => {
            send("respond", {
                target: e.data.payload.target,
                uuid: e.data.payload.uuid,
                data: r
            })
        }).catch((er: any) => {
            console.error(er)
            send("respond", {
                target: e.data.payload.target,
                uuid: e.data.payload.uuid,
                error: er
            })
        })
    }

    function messageHandler(e: MessageEvent) {
        const send = getPostMessageFunc(<WindowProxy>e.source, e.origin)
        switch (e.data.action) {
            case "request": handleMessageRequest(e, send); break
            case "saveConfig":
                if (e.data.payload.lang) saveLanguage(e.data.payload.lang)
                console.log("%cChange language preferences to: %c" + e.data.payload.lang,
                    "color: gray",
                    "color: white")
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