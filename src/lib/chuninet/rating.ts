const rankPoints: [number, string][] = [
	[1010000, 'MAX'],
	[1009000, 'SSS+'],
	[1007500, 'SSS'],
	[1005000, 'SS+'],
	[1000000, 'SS'],
	[990000, 'S+'],
	[975000, 'S'],
	[950000, 'AAA'],
	[925000, 'AA'],
	[900000, 'A'],
	[800000, 'BBB'],
	[700000, 'BB'],
	[600000, 'B'],
	[500000, 'C'],
	[0, 'D']
]

export const ranks = rankPoints.map((v) => v[1])

export const ranksMap: Record<string, number> = Object.fromEntries(
	rankPoints.map((v) => [v[1], v[0]])
)

export function calcRank(score: number) {
	let r = 0
	rankPoints.some((v, i) => ((r = i), score >= v[0]))
	return rankPoints[r][1]
}

const ratingPoints = [
	{ score: 1009000, base: 21500 /* 2.15 * opScale */, ratio: 0 },
	{ score: 1007500, base: 20000 /* 2 * opScale */, ratio: 1 },
	{ score: 1005000, base: 15000 /* 1.5 * opScale */, ratio: 2 },
	{ score: 1000000, base: 10000 /* 1 * opScale */, ratio: 1 },
	{ score: 975000, base: 0, ratio: 0.4 },
	{ score: 900000, base: -50000 /* -5 * opScale */, ratio: 2 / 3 }
]

export const ratingScale = 100
export const opScale = 10000

export function calcRawRating(song: ParsedRecord) {
	const _const = Math.floor(song.const * opScale)

	if (song.score >= 900000) {
		const point = ratingPoints.find((_point) => song.score >= _point.score)!
		return Math.max(0, _const + point.base + point.ratio * (song.score - point.score))
	}

	let rating

	if (song.score >= 800000)
		rating =
			(_const - 50000) / 2 +
			(((_const - 50000) / 2) * (song.score - 800000)) / 100000
	else if (song.score >= 500000)
		rating = (((_const - 50000) / 2) * (song.score - 500000)) / 300000
	else return 0

	return Math.max(0, rating)
}

export function calcOp(song: ParsedRecord) {
	// Multiply the OP by 10000 to circumvent the problem with decimal point arithmetic in JS --Cip
	if (song.score >= 1010000) return calcOpMax(song)

	const e1 = {
		AJ: 2000 /* 0.2 * opScale */,
		FC: 1000 /* 0.1 * opScale */,
		'': 0
	}[song.clear]
	const fixedConst = Math.floor(song.const * opScale)
	let _rating =
		song.score < 1007500
			? song.rawRating
			: fixedConst + 20000 /* 2 * opScale */ + 3 * (song.score - 1007500)

	if (song.score >= 975000) _rating = Math.floor(_rating / 10) * 10
	else _rating = Math.floor(_rating / 100) * 100

	return (_rating + e1) * 5
}

export function calcOpMax(song: ParsedRecord) {
	// Multiply the OP by 10000 to circumvent the problem with decimal point arithmetic in JS --Cip
	return (song.const + 3) * 5 * opScale
}

export function calcBestN(ratingList: number[], n: number) {
	return ratingList.slice(0, n).reduce((a, b) => a + b, 0) / n
}
