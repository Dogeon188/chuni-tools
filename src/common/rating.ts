const rankPoints: [number, string][] = [
    [1010000, "MAX"],
    [1009000, "SSS+"],
    [1007500, "SSS"],
    [1005000, "SS+"],
    [1000000, "SS"],
    [990000, "S+"],
    [975000, "S"],
    [950000, "AAA"],
    [925000, "AA"],
    [900000, "A"],
    [800000, "BBB"],
    [700000, "BB"],
    [600000, "B"],
    [500000, "C"],
    [0, "D"]
]

export function calcRank(score: number) {
    let r = 0
    rankPoints.some((v, i) => (r = i, score >= v[0]))
    return rankPoints[r][1]
}

const ratingPoints = [
    [1010000, 215],
    [1009000, 215],
    [1007500, 200],
    [1005000, 150],
    [1000000, 100],
    [975000, 0],
    [925000, -300],
    [900000, -500],
]

export function calcRawRating(song: ParsedRecord) {
    if (song.score <= 500000) return 0
    let c = song.const * 100
    let ret
    if (song.score <= 800000) {
        ret = (song.score - 500000) / 300000 * ((c - 500) / 2)
    } else if (song.score <= 900000) {
        ret = (song.score - 800000) / 100000 * ((c - 500) / 2) + ((c - 500) / 2)
    } else {
        let p = 1
        ratingPoints.some((v, i) => (p = i, song.score > v[0]))
        const prev = ratingPoints[p - 1], cur = ratingPoints[p]
        ret = c + cur[1] + (prev[1] - cur[1]) * (song.score - cur[0]) / (prev[0] - cur[0])
    }
    return Math.max(0, ret)
}

export function calcOp(song: ParsedRecord) {
    let e1 = { "AJ": 1, "FC": 0.5, "": 0 }[song.clear]
    if (song.score == 1010000) return (song.const + 3) * 5
    // if (song.score > 1007500) return (song.const + 2) * 5 + Math.floor(e1 + (song.score - 1007500) * 0.15) / 100
    let r
    if (song.score > 1007500) r = (song.const + 2 + 0.75 * (song.score - 1007500) / 2500) * 5 + e1
    else r = song.rawRating * 5 / 100 + e1
    return Math.floor(r * 1000) / 1000
}

export function calcOpMax(song: ParsedRecord) {
    return (song.const + 3) * 5
}

export function calcBestN(ratingList: number[], n: number) {
    return ratingList.slice(0, n).reduce((a, b) => a + b, 0) / n
}

export function calcMaxPossible(ratingList: number[]) {
    return (ratingList.slice(0, 30).reduce((a, b) => a + b, 0) + ratingList[0] * 10) / 40
}