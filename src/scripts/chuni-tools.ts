import { getInitialLang, Language } from "@/common/lang"
import { getScriptHost } from "@/common/web"
import { chuniNet, chuniNetBase } from "@/common/const"

(function (d: Document, w: Window & { chuniTools: boolean }) {
    const UIString = {
        [Language.en_US]: {
            alreadyRun: "Please refresh the page before running CHUNI TOOLS again!",
            wrongBase: `Oops! Looks like you are on the wrong page.\nPlease open CHUNITHM-NET Intl. (${chuniNetBase}) and login, then try again.`
        },
        [Language.zh_TW]: {
            alreadyRun: "你已經執行過CHUNITHM小工具了！若要重新執行一次，請先重新整理頁面再來",
            wrongBase: `哇，看來你走錯路了。請到CHUNITHM-NET Intl. (${chuniNetBase}) 登入之後再試一次。`
        }
    }[getInitialLang()]


    if (w.chuniTools) {
        alert(UIString.alreadyRun)
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
    if (path.indexOf("/mobile/home/userOption/updateUserName") != -1) {
        appendScript("idxmap-generate")
    } else if (path.indexOf("/mobile/record/musicGenre") != -1) {
        appendScript("export-csv")
    } else { // /mobile/home
        appendScript("fetch-all")
    }
})(document, <any>window)