import { browser } from '$app/environment'
import { parseRecord } from '$lib/chuninet/record'
import { difficulties, Difficulty } from '$lib/chuninet/song'
import { requestFor } from '$lib/cwr'
import { DerivedStream, Stream } from '$lib/stream'
import { getScriptBaseUrl } from '$lib/web'
import { derived, get, writable } from 'svelte/store'
import { filterDifficulty, usedConstData } from './preference'

const songConstData: Record<string, Record<string, SongConstData>> = {}

export const constData = DerivedStream(
	usedConstData,
	async ($usedConstData: string) => {
		if (!songConstData[$usedConstData]) {
			// prevent SSR calling fetch
			if (browser) {
				const data = await fetch(
					`${getScriptBaseUrl()}/data/song-const/${$usedConstData}.json`
				).then((response) => response.json())
				songConstData[$usedConstData] = data
			}
		}
		return songConstData[$usedConstData] as Record<string, SongConstData>
	},
	undefined
)

const playerStatsInitialized = writable<boolean>(undefined)

export const playerStats = Stream<PlayerStats>(async () => {
	try {
		playerStatsInitialized.set(false)
		const stats = await requestFor('playerStats')
		playerStatsInitialized.set(true)
		return stats
	} catch (error) {
		console.error('Error fetching playerStats:', error)
		playerStatsInitialized.set(false)
		return { name: '', honors: [], rating: '', playCount: '', lastPlayed: 0 }
	}
})

let rawRecentRecord: PlayRecord[] = []
const rawRecentRecordInitialized = writable<boolean>(undefined)

export const recentRecord = DerivedStream(constData, async ($constData) => {
	// If constData is not available yet
	if (!$constData || Object.keys($constData).length === 0) {
		// can just fail quietly, happens only when constData is not loaded yet
		return []
	}

	if (get(rawRecentRecordInitialized) === undefined) {
		try {
			rawRecentRecordInitialized.set(false)
			rawRecentRecord = await requestFor('recentRecord')
			rawRecentRecordInitialized.set(true)
		} catch (error) {
			console.error('Error fetching recentRecord:', error)
			rawRecentRecord = []
			rawRecentRecordInitialized.set(false)
		}
	}
	return parseRecord(rawRecentRecord, $constData)
})

let rawPlayHistory: PlayRecord[] = []
const rawPlayHistoryInitialized = writable<boolean>(undefined)

export const playHistory = DerivedStream(constData, async ($constData) => {
	// If constData is not available yet
	if (!$constData || Object.keys($constData).length === 0) {
		// can just fail quietly, happens only when constData is not loaded yet
		return []
	}

	console.log('Fetching playHistory:', $constData)

	if (get(rawPlayHistoryInitialized) === undefined) {
		try {
			rawPlayHistoryInitialized.set(false)
			rawPlayHistory = await requestFor('playHistory')
			rawPlayHistoryInitialized.set(true)
		} catch (error) {
			console.error('Error fetching playHistory:', error)
			rawPlayHistory = []
			rawPlayHistoryInitialized.set(false)
		}
	}
	return parseRecord(rawPlayHistory, $constData)
})

const rawBestRecord: BestRecord[] = []
const fetchedDifficulties = Object.fromEntries(
	difficulties.map((d) => [d, undefined])
) as Record<Difficulty, boolean | undefined>

export const bestRecord = DerivedStream([constData, filterDifficulty], async (values) => {
	const [$constData, $filterDifficulty] = values as [
		Record<string, SongConstData>,
		Record<Difficulty, boolean>
	]

	// If constData is not available yet
	if (!$constData || Object.keys($constData).length === 0) {
		// can just fail quietly, happens only when constData is not loaded yet
		return []
	}

	for (const diff of difficulties) {
		if ($filterDifficulty[diff] && !fetchedDifficulties[diff]) {
			try {
				fetchedDifficulties[diff] = true // set flag first to prevent race conditions
				rawBestRecord.push(...(await requestFor('bestRecord', diff)))
			} catch (error) {
				console.error('Error fetching bestRecord:', error)
				fetchedDifficulties[diff] = false // reset flag on error
			}
		}
	}
	return parseRecord(rawBestRecord, $constData, true)
})

// not considering bestRecord since difficulty filter can be all false
export const allFetched = derived(
	[playerStatsInitialized, rawRecentRecordInitialized, rawPlayHistoryInitialized],
	(values) => values.every(Boolean)
)
