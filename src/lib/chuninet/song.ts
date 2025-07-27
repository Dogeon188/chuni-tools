export enum Difficulty {
	basic = 'BAS',
	advanced = 'ADV',
	expert = 'EXP',
	master = 'MAS',
	ultima = 'ULT'
}

export const difficulties = Object.values(Difficulty)

export enum Genre {
	'POPS & ANIME' = '0',
	'niconico' = '2',
	'東方Project' = '3',
	'ORIGINAL' = '5',
	'VARIETY' = '6',
	'イロドリミドリ' = '7',
	'ゲキマイ' = '9'
}
export const genres = Object.keys(Genre) as (keyof typeof Genre)[]
export const genreId2Name = Object.fromEntries(
	Object.entries(Genre).map(([k, v]) => [Number(v), k])
) as Record<number, string>
export const genreAll = '99'

export const versionId = {
	UNKNOWN: 0,
	CHUNITHM: 1,
	'CHUNITHM+': 2,
	AIR: 3,
	'AIR+': 4,
	STAR: 5,
	'STAR+': 6,
	AMAZON: 7,
	'AMAZON+': 8,
	CRYSTAL: 9,
	'CRYSTAL+': 10,
	PARADISE: 11,
	'PARADISE LOST': 12,
	NEW: 13,
	'NEW+': 14,
	SUN: 15,
	'SUN+': 16,
	LUMINOUS: 17,
	'LUMINOUS+': 18,
	VERSE: 19,
	'X-VERSE': 20
}

export const versions = Object.keys(versionId).filter(
	(key) => key !== 'UNKNOWN'
) as (keyof typeof versionId)[]
