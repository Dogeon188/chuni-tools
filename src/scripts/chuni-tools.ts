import { getInitialLang, Language } from "@/common/lang"
import { getScriptHost } from "@/common/web"
import { chuniNet, chuniNetBase } from "@/common/const"

(function (d: Document, w: Window & { chuniTools: boolean }) {
    const UIString = {
        [Language.en_US]: {
            alreadyRan: "Please refresh the page before a new fetch!",
            wrongBase: `Oops! Looks like you are on the wrong page.\nPlease open CHUNITHM-NET Intl. (${chuniNetBase}) and login, then try again.`
        },
        [Language.zh_TW]: {
            alreadyRan: "你已經抓過一次成績了！請先重新整理頁面再執行一次本程式",
            wrongBase: `哇，看來你走錯路了。請到CHUNITHM-NET Intl. (${chuniNetBase}) 登入之後再試一次。`
        }
    }[getInitialLang()]

    if (w.chuniTools) {
        alert(UIString.alreadyRan)
        return
    }
    w.chuniTools = true

    if (w.location.hostname !== chuniNetBase) {
        alert(UIString.wrongBase)
        w.location.href = chuniNet
        return
    }

    function appendScript(script: string) {
        const s = d.createElement("script")
        s.src = `${getScriptHost("chuni-tools")}/scripts/${script}.js`
        d.body.append(s)
    }

    const path = d.location.pathname
    if (path.indexOf("/mobile/home/") != -1) {
        appendScript("fetch-all")
    } else {
        appendScript("fetch-all")
    }
})(document, <any>window)