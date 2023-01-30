import { language } from "@/common/config"

export function getTranslations(base: string) {
    const translations = new Map<string, Map<string, string>>()
    const translationNames = new Map<string, string>()
    for (let l of language.accepts) {
        const commonTranslation = Object.entries(require(`@/common/locale/${l}.json`))
        const partialTranslation = Object.entries(require(`@/${base}/locale/${l}.json`))
        translations.set(l, <Map<string, string>>new Map(commonTranslation.concat(partialTranslation)))
        translationNames.set(l, translations.get(l)?.get("locale.name") || "Undefined locale name")
    }
    return { translations, translationNames }
}