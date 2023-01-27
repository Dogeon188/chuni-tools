export enum Language {
    en_US = "en_US",
    zh_TW = "zh_TW",
}

function loadLanguage() {
    const raw = localStorage.ChuniToolsLang;
    switch (raw) {
        case Language.en_US:
            return Language.en_US;
        case Language.zh_TW:
            return Language.zh_TW;
    }
    return null;
}

export function getInitialLang() {
    const langPrefrence = loadLanguage()
    if (langPrefrence) return langPrefrence

    if (navigator.language.startsWith("zh")) {
        return Language.zh_TW;
    }
    return Language.en_US;
}