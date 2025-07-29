import { browser } from '$app/environment'
import { parseRecord } from '$lib/chuninet/record'
import { difficulties, Difficulty } from '$lib/chuninet/song'
import { requestFor } from '$lib/cwr'
import logger from '$lib/logger'
import { m } from '$lib/paraglide/messages'
import { DerivedStream, noUpdate, Stream } from '$lib/stream'
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

export const fetchError = writable<Error | null>(null)

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
		fetchError.set(error as Error)
		return { name: '', honors: [], rating: '', playCount: '', lastPlayed: 0 }
	}
})

let rawRecentRecord: PlayRecord[] = []
const rawRecentRecordInitialized = writable<boolean>(undefined)

export const recentRecord = DerivedStream(
	constData,
	async ($constData) => {
		// If constData is not available yet
		if (!$constData || Object.keys($constData).length === 0) {
			// can just fail quietly, happens only when constData is not loaded yet
			return noUpdate
		}

		if (get(rawRecentRecordInitialized) === undefined) {
			try {
				rawRecentRecordInitialized.set(false)
				rawRecentRecord = await requestFor('recentRecord')
				rawRecentRecordInitialized.set(true)
			} catch (error) {
				console.error('Error fetching recentRecord:', error)
				rawRecentRecordInitialized.set(false)
				fetchError.set(error as Error)
				return noUpdate
			}
		}
		return parseRecord(rawRecentRecord, $constData)
	},
	[]
)

let rawPlayHistory: PlayRecord[] = []
const rawPlayHistoryInitialized = writable<boolean>(undefined)

export const playHistory = DerivedStream(
	constData,
	async ($constData) => {
		// If constData is not available yet
		if (!$constData || Object.keys($constData).length === 0) {
			// can just fail quietly, happens only when constData is not loaded yet
			return noUpdate
		}

		if (get(rawPlayHistoryInitialized) === undefined) {
			try {
				rawPlayHistoryInitialized.set(false)
				rawPlayHistory = await requestFor('playHistory')
				rawPlayHistoryInitialized.set(true)
			} catch (error) {
				console.error('Error fetching playHistory:', error)
				rawPlayHistoryInitialized.set(false)
				fetchError.set(error as Error)
				return noUpdate
			}
		}
		return parseRecord(rawPlayHistory, $constData)
	},
	[]
)

const rawBestRecord: BestRecord[] = []
const fetchedDifficulties = writable(
	Object.fromEntries(difficulties.map((d) => [d, undefined])) as Record<
		Difficulty,
		boolean | undefined
	>
)
export const bestRecord = DerivedStream(
	[constData, filterDifficulty],
	async (values) => {
		const [$constData, $filterDifficulty] = values as [
			Record<string, SongConstData>,
			Record<Difficulty, boolean>
		]

		// If constData is not available yet
		if (!$constData || Object.keys($constData).length === 0) {
			// can just fail quietly, happens only when constData is not loaded yet
			return []
		}

		const updatingDifficulties = Object.entries($filterDifficulty)
			.filter(
				([key, value]) =>
					value && get(fetchedDifficulties)[key as Difficulty] === undefined
			)
			.map(([key]) => key as Difficulty)

		if (updatingDifficulties.length === 0) {
			return noUpdate
		}

		const logHandle = logger.log('')

		for (const diff of updatingDifficulties) {
			try {
				fetchedDifficulties.update((prev) => ({ ...prev, [diff]: false }))
				logHandle.updateContent(
					m['viewer.fetch.record.progress']({
						diff: `<span class="font-bold" style="color:var(--color-diff-${diff.toLowerCase()});">${diff}</span>`
					})
				)
				logHandle.refreshCountdown(5000)
				rawBestRecord.push(...(await requestFor('bestRecord', diff)))
				fetchedDifficulties.update((prev) => ({ ...prev, [diff]: true }))
			} catch (error) {
				console.error('Error fetching bestRecord:', error)
				fetchedDifficulties.update((prev) => ({ ...prev, [diff]: false }))
				fetchError.set(error as Error)
				return noUpdate
			}
		}

		logHandle.remove()

		return parseRecord(rawBestRecord, $constData, true)
	},
	[]
)

// Make sure loading screen won't show for post-init requests
const filterDifficultySnapshot = get(filterDifficulty)
export const allFetched = derived(
	[
		playerStatsInitialized,
		rawRecentRecordInitialized,
		rawPlayHistoryInitialized,
		fetchedDifficulties
	],
	([
		$playerStatsInitialized,
		$rawRecentRecordInitialized,
		$rawPlayHistoryInitialized,
		$fetchedDifficulties
	]) => {
		return (
			$playerStatsInitialized &&
			$rawRecentRecordInitialized &&
			$rawPlayHistoryInitialized &&
			Object.entries($fetchedDifficulties).every(
				([key, value]) => !filterDifficultySnapshot[key] || value
			)
		)
	}
)
