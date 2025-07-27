export function parseNumber(str: string) {
    return Number([...str].filter(e => e !== ",").join(""))
}

const fractions = [1, 10, 100, 1000, 10000]
export function floorToFixed(num: number, to: number) {
    const fraction = fractions[to]
    return (Math.floor(num * fraction) / fraction).toFixed(to)
}
