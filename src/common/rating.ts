export function calcRank(score: number) {
    const points = [
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
    let r = 0
    points.some((v, i) => (r = i, score >= v[0]))
    return points[r][1] as string
}

export function calcRating(song: ParsedRecord) {
    let c = song.const * 100
    const points = [
        [1010000, c + 215],
        [1009000, c + 215],
        [1007500, c + 200],
        [1005000, c + 150],
        [1000000, c + 100],
        [975000, c],
        [925000, c - 300],
        [900000, c - 500],
        [800000, (c - 500) / 2],
        [500000, 0],
        [0, 0]
    ]
    let p = 1
    points.some((v, i) => (p = i, song.score > v[0]))
    const prev = points[p - 1], cur = points[p]
    const ret = cur[1] + (prev[1] - cur[1]) / (prev[0] - cur[0]) * (song.score - cur[0])
    return Math.floor(Math.max(0, ret)) / 100
}

export function calcOp(song: ParsedRecord) {
    let e1 = { "AJ": 1, "FC": 0.5, "": 0 }[song.clear]
    if (song.score == 1010000) return (song.const + 3) * 5
    if (song.score > 1007500) return (song.const + 2) * 5 + e1 + (song.score - 1007500) * 0.0015
    return song.rating * 5 + e1
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