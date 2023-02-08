import { derived } from "svelte/store"
import type { StringConfig } from "@/common/config"
import { getTranslations } from "@/common/translations"
import type { Language } from "./lang"

export function getTranslator(base: string, languageConfig: StringConfig<Language>) {
    const { translations, translationNames } = getTranslations(base)

    function translate(locale: string, key: string, vars: { [key: string]: string }) {
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
            (key: string, vars: { [replaceKey: string]: string } = {}) => translate($language, key, vars)))

    return { t, translationNames }
}