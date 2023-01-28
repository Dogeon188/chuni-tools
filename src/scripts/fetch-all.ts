import { getInitialLang, Language, saveLanguage } from "@/common/lang"
import { getCookie } from "@/common/cookie"
import { fetchRecordList } from "@/common/fetch"
import { getPostMessageFunc, getScriptHost } from "@/common/bookmarklet"
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
        d.styleSheets[0].insertRule(`
            .chuni-tool-btn {
                color: white;
                font-size: 1.5em;
                font-weight: bold;
                padding: 1.5rem;
                margin: 2rem auto;
                display: block;
                width: fit-content;
                text-decoration: none;
                border-radius: .5rem;
                border: 4px solid #567;
                background-color: #234;
                text-align: center;
                cursor: pointer;
                user-select: none;
                filter: brightness(.7);
                transition: 0.2s;
            }`)
        d.styleSheets[0].insertRule(`
            .chuni-tool-btn:hover {
                filter: brightness(1);
                color: white;
            }`)
        b.innerText = UIString.analyzeRating
        b.href = getScriptHost("fetch-all") + "/record-viewer/#best"
        b.target = "recordViewer"
        d.querySelector(".mt_10")?.insertAdjacentElement("afterbegin", b)
    }

    function messageHandler (e: MessageEvent) {
        const send = getPostMessageFunc(<WindowProxy>e.source, e.origin)
        switch (e.data.action) {
            case "request":
                console.log("Received request: " + e.data.payload.target)
                if (e.data.payload.target === "recordList") {
                    fetchRecordList().then((recordList) => {
                        send("recordList", recordList)
                    })
                }
                break;
            case "saveConfig":
                if (e.data.payload.lang) saveLanguage(e.data.payload.lang)
                console.log("Change language preferences to: " + e.data.payload.lang)
            default:
                break;
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