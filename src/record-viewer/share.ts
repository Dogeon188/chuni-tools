import { toBlob } from "html-to-image"
import { get } from "svelte/store"
import { isMobile } from "@/common/web"
import { t } from "./store"

const filename = "chunithm_b40.png"

export async function saveResultAsPicture() {
    const resultNode = document.querySelector("main")

    let n = <HTMLElement>resultNode?.cloneNode(true)

    n.style.width = "max-content"
    n.style.margin = "initial"
    n.querySelectorAll("tbody tr:not(.best40)").forEach((tr) => { tr.remove() })
    n.querySelectorAll(".pc-hidden span").forEach((div) => { div.remove() })
    n.querySelectorAll(".wrapper").forEach(
        (wr) => (<HTMLDivElement>wr).style.overflow = "hidden")

    resultNode?.parentElement?.appendChild(n)
    toBlob(n, {
        backgroundColor: window.getComputedStyle(document.body).backgroundColor,
    }).then(async (blob) => {
        n.remove()
        if (blob == null) return alert(get(t)("share.error"))
        if (isMobile()) {
            const f = new File([blob], filename, { type: blob.type })
            if (navigator?.canShare({ files: [f] })) {
                navigator.share({ files: [f] }).catch(console.log)
            }
        } else {
            const a = document.createElement("a")
            a.href = window.URL.createObjectURL(blob)
            a.download = filename
            a.click()
        }
    })
}