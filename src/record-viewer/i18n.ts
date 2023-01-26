import { derived } from "svelte/store"
import { locale } from "./config"
import translations from "./translations"

function translate(locale, key: string, vars: Record<string, string>) {
    if (!key) throw new Error("No key specified")
    let text = translations[locale][key]
    if (!text) {
        console.error(`No translation found for ${locale}.${key}`)
        return key
    }
    Object.keys(vars).map((k) => {
        const regex = new RegExp(`{{${k}}}`, "g");
        text = text.replace(regex, vars[k]);
    })

    return text
}

export const t = derived(
    locale,
    ($locale) => (
        (key: string, vars = {}) => translate($locale, key, vars)))