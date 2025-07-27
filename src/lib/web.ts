export function getScriptBaseUrl() {
    if (__ENV__ === "development") {
        return "https://localhost:5173"
    }
    return "https://dogeon188.github.io/chuni-tools"
}

export function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export function getCookie(key: string) {
    const cookieEntry = document.cookie
        .split(";")
        .map(e => decodeURIComponent(e.trim()))
        .map(e => e.split("="))
        .find(e => e[0] === key)
    if (cookieEntry) return cookieEntry[1] // value
    return ""
}

export function getPostMessageFunction(w: WindowProxy, origin: string): PostMessageFunc {
    if (!w) throw new Error("Target window does not exist")
    return (action, payload, uuid?: string) => {
        const obj = <CrossPageRequestMessageEvent<unknown>["data"]>{ action, payload }
        if (uuid) obj.uuid = uuid
        w.postMessage(obj, origin)
    }
}
