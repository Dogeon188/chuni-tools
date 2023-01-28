export function parseNumber(str: string) {
    return Number([...str].filter(e => e !== ",").join(""))
}

export function floorAndToFixed2(f: number) {
    return (Math.floor(f * 100) / 100).toFixed(2)
}