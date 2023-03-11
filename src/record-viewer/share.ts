import { toBlob } from "html-to-image"
import { get } from "svelte/store"
import { isMobile } from "@/common/web"
import { t } from "./store"

const filename = "chunithm_b40.png"

export async function saveResultAsPicture() {
    const resultNode = document.querySelector("main")

    if (resultNode == null) return alert(get(t)("share.error", { error: "resultNode is null" }))
    let n = <HTMLElement>resultNode?.cloneNode(true)

    n.id = "copied-main"
    n.querySelectorAll("tbody tr:nth-child(n+41)").forEach((tr) => { tr.remove() })

    resultNode?.parentElement?.appendChild(n)
    toBlob(n, {
        backgroundColor: window.getComputedStyle(document.body).backgroundColor,
    }).then(async (blob) => {
        n.remove()
        if (blob == null) {
            alert(get(t)("share.error", { error: "result blob is null" }))
            return
        }
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
    }).catch((err) => {
        alert(get(t)("share.error", { error: err }))
    })
}