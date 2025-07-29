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

/**
 * Creates a post message function for cross-origin window communication.
 * This function provides a type-safe wrapper around the native postMessage API,
 * ensuring messages conform to the CWRMessageEvent structure.
 *
 * @param w - The target window proxy (e.g., window.opener, iframe.contentWindow)
 * @param origin - The target origin URL for security validation (e.g., "https://example.com")
 * @returns A function that can send structured messages to the target window
 *
 * @throws {Error} When the target window does not exist or is null
 *
 * @example
 * ```typescript
 * // Create a message sender for the parent window
 * const sendToParent = getPostMessageFunction(window.opener, 'https://chunithm-net-eng.com')
 *
 * // Send a request message
 * sendToParent('request', { target: 'playerStats' }, 'unique-id-123')
 *
 * // Send a response message
 * sendToParent('respond', { data: playerData }, 'unique-id-123')
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
 */

export function getPostMessageFunction(w: WindowProxy, origin: string): PostMessageFunc {
	if (!w) throw new Error('Target window does not exist')
	return (action, payload, uuid?: string) => {
		const obj = <CWRMessageEvent<unknown>['data']>{ action, payload }
		if (uuid) obj.uuid = uuid
		w.postMessage(obj, origin)
	}
}

