import { language } from "@/common/config"
import { getTranslator } from "@/common/i18n"


// separated to avoid unnecessary locale imports
const translations = new Map<string, Map<string, string>>()
const translationNames = new Map<string, string>()

for (let l of language.accepts) {
    const commonTranslation = Object.entries(require(`@/common/locale/${l}.json`))
    const partialTranslation = Object.entries(require(`@/index-page/locale/${l}.json`))
    translations.set(l, <Map<string, string>>new Map(commonTranslation.concat(partialTranslation)))
    translationNames.set(l, translations.get(l)?.get("locale.name") || "Undefined locale name")
}

export const t = getTranslator(translations, language)
export { translationNames }
