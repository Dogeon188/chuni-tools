<script lang="ts">
	import { opScale, ranks } from '$lib/chuninet/rating'
	import { Genre, genres } from '$lib/chuninet/song'
	import NotificationPopup from '$lib/components/NotificationPopup.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
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

	// rank counts

	const rankCounts = derived(filteredBestRecord, ($filteredBestRecord) => {
		const counts: Record<string, number> = {}
		$filteredBestRecord.forEach((record) => {
			if (record.score >= 0) {
				counts[record.rank] = (counts[record.rank] || 0) + 1
			}
		})
		ranks.reduce((pre, cur) => ((counts[cur] += counts[pre] ?? 0), cur))
		return counts
	})

	const fcCount = derived(filteredBestRecord, ($filteredBestRecord) => {
		return $filteredBestRecord.filter((record) => record.clear === 'FC').length
	})
	const ajCount = derived(filteredBestRecord, ($filteredBestRecord) => {
		return $filteredBestRecord.filter((record) => record.clear === 'AJ').length
	})
	const totalCount = derived(filteredBestRecord, ($filteredBestRecord) => {
		return $filteredBestRecord.length
	})

	// over power progress

	const totalOverpower = derived(filteredBestRecord, ($filteredBestRecord) =>
		$filteredBestRecord.reduce((pre, record) => pre + record.op, 0)
	)
	const maxOverpower = derived(filteredBestRecord, ($filteredBestRecord) =>
		$filteredBestRecord.reduce((pre, record) => pre + record.opMax, 0)
	)
</script>

<svelte:window on:hashchange={routeChange} />

{#if $allFetched}
	<NotificationPopup position="bottom-right" maxVisible={5} showProgress={false} />
{/if}

<Settings bind:this={settingsRef} />

<Loading />

<header class="flex gap-16 px-4 pb-4">
	<a id="best" href="#best" class="!decoration-none !no-underline">
		<h4
			class:!text-textc-normal={$_page === 'best'}
			class:!text-textc-dim={$_page !== 'best'}>
			BEST
		</h4>
	</a>
	<a id="recent" href="#recent" class="!decoration-none !no-underline">
		<h4
			class:!text-textc-normal={$_page === 'recent'}
			class:!text-textc-dim={$_page !== 'recent'}>
			RECENT
		</h4>
	</a>
	<a id="history" href="#history" class="!decoration-none !no-underline">
		<h4
			class:!text-textc-normal={$_page === 'history'}
			class:!text-textc-dim={$_page !== 'history'}>
			HISTORY
		</h4>
	</a>
</header>

<div>
	<PlayerStats />

	<div class="card lg:max-w-2/3 lg:mx-auto">
		<!-- Rank Counts -->
		<div class="flex flex-row justify-center gap-4 md:gap-8">
			{#each ['S', 'S+', 'SS', 'SS+', 'SSS', 'SSS+'] as rank}
				<div class="flex flex-col items-center">
					<span class="text-xs text-textc-dim">{rank}</span>
					<span class="text-lg text-textc-normal">
						{$rankCounts[rank] ?? 0}
					</span>
				</div>
			{/each}
			<div class="flex flex-col items-center">
				<span class="text-xs text-clear-fc">FC</span>
				<span class="text-lg text-textc-normal">{$fcCount}</span>
			</div>
			<div class="flex flex-col items-center">
				<span class="text-xs text-clear-aj">AJ</span>
				<span class="text-lg text-textc-normal">{$ajCount}</span>
			</div>
			<div class="flex flex-col items-center justify-end">
				<span class="text-xs text-textc-dim">/{$totalCount}</span>
			</div>
		</div>

		<!-- OVER POWER Progress -->
		{#if $showOverPower !== 'hide'}
			<div class="flex flex-row items-center justify-center">
				<div class="flex flex-col items-center justify-center">
					<span class="text-xs text-textc-dim">OVER POWER</span>
					<span class="text-lg text-textc-normal">
						{($totalOverpower / opScale).toFixed(2)}
					</span>
					<span class="text-xs text-textc-dim">
						&#xff0f;{($maxOverpower / opScale).toFixed(1)}
					</span>
				</div>
				<ProgressBar
					class="mx-4 flex-1"
					current={$totalOverpower}
					max={$maxOverpower}
					showLabel={true} />
			</div>
		{/if}
	</div>

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
