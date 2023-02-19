import { language } from "@/common/config"
import { getTranslator } from "@/common/i18n"
import type { Language } from "@/common/lang"


// separated to avoid unnecessary locale imports
const translations = new Map<Language, Map<string, string>>()
const translationNames = new Map<Language, string>()

for (let l of language.accepts) {
    const commonTranslation = Object.entries(require(`@/common/locale/${l}.json`))
    const partialTranslation = Object.entries(require(`@/index-page/locale/${l}.json`))
    translations.set(l, <Map<Language, string>>new Map(commonTranslation.concat(partialTranslation)))
    translationNames.set(l, translations.get(l)?.get("locale.name") || "Undefined locale name")
}

export const t = getTranslator(translations, language)
export { translationNames }
