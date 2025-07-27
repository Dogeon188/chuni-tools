import { genres, versionId, versions } from '$lib/chuninet/song'
import {
	BooleanStorable,
	FlagStorable,
	NumberStorable,
	StringStorable,
	type Storable
} from '$lib/storable'
import { derived } from 'svelte/store'

// used constatn data version

export const usedConstData = StringStorable.create('usedConstData', __INTL_VERSION__, [
	__INTL_VERSION__,
	__JP_VERSION__
] as const)

export const currentVersionId = derived(usedConstData, ($usedConstData) => {
	return versionId[$usedConstData.toUpperCase() as keyof typeof versionId]
})

// record filter

export const filterConstMin = NumberStorable.create('filterConstMin', 1, 1, 15.7)

export const filterConstMax = NumberStorable.create('filterConstMax', 15.7, 1, 15.7)

export const filterDifficulty = FlagStorable.create(
	'filterDifficulty',
	['BAS', 'ADV', 'EXP', 'MAS', 'ULT'] as const,
	{
		BAS: true,
		ADV: true,
		EXP: true,
		MAS: true,
		ULT: false
	}
)

export const filterGenre = FlagStorable.create(
	'filterGenre',
	genres,
	genres.reduce((acc, genre) => ({ ...acc, [genre]: true }), {})
)

export const filterVersion = FlagStorable.create(
	'filterVersion',
	versions,
	versions.reduce((acc, version) => ({ ...acc, [version]: true }), {})
)

// show information

export const showOverPower = StringStorable.create('showOverPower', 'hide', [
	'hide',
	'value',
	'percentage'
] as const)

export const showPlayCount = BooleanStorable.create('showPlaycount', false)

// update compared previous data

export const scoreDiffUpdateIntervals: Record<string, number> = {
	'1d': 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
	'3d': 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
	'7d': 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
	'14d': 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
	'30d': 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
	manual: Number.POSITIVE_INFINITY
}

export const diffUpdateInterval = StringStorable.create(
	'diffUpdateInterval',
	'manual',
	Object.keys(scoreDiffUpdateIntervals)
)

export const allPreferenceStores: Array<Storable> = [
	usedConstData,
	filterConstMin,
	filterConstMax,
	filterDifficulty,
	filterGenre,
	filterVersion,
	showOverPower,
	showPlayCount,
	diffUpdateInterval
]
