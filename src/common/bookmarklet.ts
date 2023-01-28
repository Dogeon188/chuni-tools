export function getScriptHost(scriptName: string) {
    const scripts = Array.from(document.querySelectorAll("script"))
    while (scripts.length) {
        const script = scripts.pop()
        if (script?.src.includes(scriptName)) {
            const url = new URL(script.src)
            const path = url.pathname
            return url.origin + path.substring(0, path.lastIndexOf("/scripts"))
        }
    }
    return "http://127.0.0.1:5500/"
}

export function getPostMessageFunc(w: WindowProxy, origin: string): PostMessageFunc {
    return (action, payload) => {
        const obj = { action, payload }
        w.postMessage(obj, origin)
    }
}
