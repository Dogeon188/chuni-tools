import { locale } from "./config"

const translations = new Map<string, Map<string, string>>()
const translationNames = new Map<string, string>()

for (let l of locale.accepts) {
    translations.set(l, new Map(Object.entries(require(`./locale/${l}.json`))))
    translationNames.set(l, translations.get(l)?.get("locale.name") || "Undefined locale name")
}

export default translations
export { translations, translationNames }