export function parseNumber(str: string) {
    return Number([...str].filter(e => e !== ",").join(""))
}