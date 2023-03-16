import { getInitialLang, Language } from "@/common/lang"
import { getCookie } from "@/common/web"
import { fetchBestRecord } from "@/common/fetch"
import { getScriptHost } from "@/common/web"
import { chuniNet } from "@/common/const"
import { difficulties } from "@/common/song"
import { parseRecord } from "@/common/record"

(async function (d: Document) {
    const UIString = {
        [Language.en_US]: {
            pleaseLogin: "Please login to CHUNITHM-NET first.",
            needReload: "Oops! Something went wrong, please reload CHUNITHM-NET.",
            downloadCSV: "Download Song Record as CSV",
            downloading: "Downloading {{diff}} data...",
            downloaded: "Completed!"
        },
        [Language.zh_TW]: {
            pleaseLogin: "請先登入 CHUNITHM-NET 再執行本程式。",
            needReload: "唉呀，看來我們這裡出了一點小意外，請重新整理 CHUNITHM-NET。",
            downloadCSV: "以CSV下載歌曲記錄",
            downloading: "正在下載 {{diff}} 資料...",
            downloaded: "下載完成！"
        }
    }[getInitialLang()]

    if (!getCookie("_t")) {
        alert(UIString.pleaseLogin)
        window.location.href = chuniNet
        return
    }

    function insertDownloadBtn() {
        const b = d.createElement("button")
        b.className = "chuni-tool-btn"
        const s = d.createElement("link")
        s.rel = "stylesheet"
        s.href = getScriptHost("export-csv") + "/common/styles/inject.css"
        b.innerText = UIString.downloadCSV
        d.getElementsByTagName("head")[0].appendChild(s)
        s.addEventListener("load", () => {
            d.querySelector(".clearfix")?.insertAdjacentElement("afterend", b)
        })
        return b
    }

    try {
        const b = insertDownloadBtn()
        b.addEventListener("click", async () => {
            const records = [] as BestRecord[]
            for (const diff of difficulties) {
                b.innerText = UIString.downloading.replace("{{diff}}", diff)
                const best = (await fetchBestRecord(diff)).filter((r) => r.score >= 0)
                Array.prototype.push.apply(records, best)
            }

            const parsed = parseRecord(records, await fetch(
                getScriptHost("export-csv") + "/data/song-const/intl.json"
            ).then(async (d) => await d.json()))

            const rows = parsed.map((r) => `"${r.title.replace(/"/g, "\"\"")}",${r.difficulty},${r.const},${r.score},${r.rating},${r.op}`)
            b.innerText = UIString.downloaded

            const dlLink = document.createElement('a')
            dlLink.href= 'data:text/plain;charset=utf-8,' + encodeURIComponent("title,difficulty,const,score,rating,op\n" + rows.join("\n"))
            dlLink.target = "_blank"
            dlLink.download = `chunithm_record_${new Date().toISOString()}.csv`

            dlLink.style.display = 'none'
            d.body.appendChild(dlLink)

            dlLink.click()

            d.body.removeChild(dlLink)

            setTimeout(() => {
                b.innerText = UIString.downloadCSV
            }, 3000)
        })
    } catch (error) {
        alert(UIString.needReload)
        console.log(error)
    }
})(document)

/*
F2=歌曲成績
C2=定數
S11=小數點要到幾位=0.001
M2=if(
    F2>=1010000,
    C2+2.75,
    if(
        F2>=1007500,
        C2+2+0.75*(F2-1007500)/(1010000-1007500),
        if(
            F2>=1005000,
            C2+1.5+0.5*(F2-1005000)/(1007500-1005000),
            if(
                F2>=1000000,
                C2+1+0.5*(F2-1000000)/(1005000-1000000),
                if(
                    F2>=975000,
                    C2+1*(F2-975000)/(1000000-975000),
                    0
                )
            )
        )
    )
)
N2=IF(
    $S$11>0,
    FLOOR(M2,$S$11)*5,
    M2*5
)+I2
 */