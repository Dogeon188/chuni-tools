export enum Language {
    en_US = "en_US",
    zh_TW = "zh_TW",
}

export function saveLanguage(l: Language) {
    localStorage.chuniToolsLang = l
}

function loadLanguage() {
    const raw = localStorage.chuniToolsLang;
    switch (raw) {
        case Language.en_US:
            return Language.en_US;
        case Language.zh_TW:
            return Language.zh_TW;
    }
    return null;
}

export function getInitialLang() {
    const queryParams = new URLSearchParams(location.search)
    // URL query parameter
    if (queryParams.get("lang")) {
        return queryParams.get("lang")!.startsWith("zh") ? Language.zh_TW : Language.en_US
    }

    const langPrefrence = loadLanguage()
    if (langPrefrence) return langPrefrence

    if (navigator.language.startsWith("zh")) {
        return Language.zh_TW;
    }
    return Language.en_US;
}