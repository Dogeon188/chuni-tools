import { derived } from "svelte/store"
import { getTranslations } from "@/common/translations"
import type { StringConfig } from "@/common/config"

export function getTranslator(base: string, languageConfig: StringConfig) {
    const { translations, translationNames } = getTranslations(base)

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

    const t = derived(
        languageConfig,
        ($language) => (
            (key: string, vars = {}) => translate($language, key, vars)))

    return { t, translationNames }
}