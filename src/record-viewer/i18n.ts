import { derived } from "svelte/store"
import { locale } from "./config"
import translations from "./translations"

function translate(locale: string, key: string, vars: Record<string, string>) {
    if (!key) throw new Error("No key specified")
    let text = translations.get(locale)?.get(key)
    if (text === undefined) {
        console.error(`No translation found for ${locale}.${key}`)
        return key
    }
    Object.keys(vars).map((k) => {
        const regex = new RegExp(`{{${k}}}`, "g");
        text = text?.replace(regex, vars[k]);
    })

    return text
}

export const t = derived(
    locale,
    ($locale) => (
        (key: string, vars = {}) => translate($locale, key, vars)))