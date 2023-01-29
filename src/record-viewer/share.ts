import { toBlob } from "html-to-image"
import { isMobile } from "@/common/web"

const filename = "chunithm_b40.png"

export async function saveResultAsPicture() {
    const resultNode = document.querySelector("main")

    let n = <HTMLElement>resultNode?.cloneNode(true)
    resultNode?.parentElement?.appendChild(n)

    n.style.margin = "initial"
    n.querySelectorAll("tr:nth-child(n+41)").forEach(tr => tr.remove())

    toBlob(n, {
        backgroundColor: window.getComputedStyle(document.body).backgroundColor
    }).then(async (blob) => {
        n.remove()
        if (blob == null) return alert("[chuni-intl-viewer] Something went wrong when converting your scores to PNG. Please ask the author to fix it.")
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