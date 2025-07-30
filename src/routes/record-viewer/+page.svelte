<script lang="ts">
	import { Genre, genres } from '$lib/chuninet/song'
	import NotificationPopup from '$lib/components/NotificationPopup.svelte'
	import type { EventHandler } from 'svelte/elements'
	import { derived } from 'svelte/store'
	import { _page } from './+page'
	import {
		allFetched,
		bestRecord,
		playerStats,
		playHistory,
		recentRecord
	} from './fetched'
	import Loading from './Loading.svelte'
	import PlayerStats from './PlayerStats.svelte'
	import {
		filterConstMax,
		filterConstMin,
		filterDifficulty,
		filterGenre,
		showOverPower
	} from './preference'
	import RecordTable from './RecordTable.svelte'
	import Settings from './Settings.svelte'

	let settingsRef = $state<Settings>()

	const routeChange: EventHandler<HashChangeEvent, Window> = (event) => {
		$_page = (new URL(event.newURL).hash.slice(1) as typeof $_page) || 'best'
	}

	// Subscribe to the stores to ensure they are loaded
	playerStats.subscribe(() => {})
	recentRecord.subscribe(() => {})
	playHistory.subscribe(() => {})
	bestRecord.subscribe(() => {})

	const filteredBestRecord = derived(
		[
			bestRecord,
			filterDifficulty,
			filterGenre,
			filterConstMin,
			filterConstMax,
			showOverPower
		],
		([
			$bestRecord,
			$filterDifficulty,
			$filterGenre,
			$filterConstMin,
			$filterConstMax,
			$showOverPower
		]) =>
			$bestRecord.filter(
				(record) =>
					($showOverPower != 'hide' || record.score >= 0) &&
					$filterDifficulty[record.difficulty] &&
					$filterGenre[genres.find((g) => Genre[g] == record.genre)!] &&
					$filterConstMax >= record.const &&
					record.const >= $filterConstMin
			)
	)

	const shownRecords = $derived(
		$_page === 'best'
			? filteredBestRecord
			: $_page === 'recent'
				? recentRecord
				: playHistory
	)
</script>

<svelte:window on:hashchange={routeChange} />

{#if $allFetched}
	<NotificationPopup position="top-right" maxVisible={5} showProgress={false} />
{/if}

<Settings bind:this={settingsRef} />

<Loading />

<header class="flex gap-16 px-4 pb-4">
	<a
		id="best"
		href="#best"
		class="!decoration-none !no-underline"
		style="text-decoration: none;">
		<h4
			class:!text-textc-normal={$_page === 'best'}
			class:!text-textc-dim={$_page !== 'best'}>
			BEST
		</h4>
	</a>
	<a
		id="recent"
		href="#recent"
		class="!decoration-none !no-underline"
		style="text-decoration: none;">
		<h4
			class:!text-textc-normal={$_page === 'recent'}
			class:!text-textc-dim={$_page !== 'recent'}>
			RECENT
		</h4>
	</a>
	<a
		id="history"
		href="#history"
		class="!decoration-none !no-underline"
		style="text-decoration: none;">
		<h4
			class:!text-textc-normal={$_page === 'history'}
			class:!text-textc-dim={$_page !== 'history'}>
			HISTORY
		</h4>
	</a>
</header>

<div>
	<PlayerStats />

	<button class="btn btn-primary" onclick={() => settingsRef!.open()}>
		Open Settings
	</button>

	<RecordTable records={$shownRecords} />
</div>

<style>
	h4 {
		margin-bottom: 0;
	}
</style>