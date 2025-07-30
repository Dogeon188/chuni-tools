<script lang="ts">
	import { opScale, ranks } from '$lib/chuninet/rating'
	import { Genre, genres } from '$lib/chuninet/song'
	import NotificationPopup from '$lib/components/NotificationPopup.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import { m } from '$lib/paraglide/messages'
	import { saveResultAsPicture } from '$lib/share'
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
		showOverPower,
		usedConstData
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

	// menu buttons

	function toggleConstData() {
		if ($usedConstData === __INTL_VERSION__) {
			usedConstData.set(__JP_VERSION__)
		} else {
			usedConstData.set(__INTL_VERSION__)
		}
	}

	const constDataMessages = {
		[__INTL_VERSION__]: (m as any)[`common.version.${__INTL_VERSION__}`](),
		[__JP_VERSION__]: (m as any)[`common.version.${__JP_VERSION__}`]()
	}
</script>

<svelte:window on:hashchange={routeChange} />
<svelte:head>
	<title>{m['viewer.title']()}</title>
</svelte:head>

{#if $allFetched}
	<NotificationPopup position="bottom-right" maxVisible={5} showProgress={false} />
{/if}

<Settings bind:this={settingsRef} />

<Loading />

<!-- Menu Buttons -->
<div class="fixed top-2 right-2 sm:top-4 sm:right-4 z-[999] flex flex-row gap-2">
	<button
		onclick={saveResultAsPicture}
		class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-bgc-normal text-2xl text-textc-dim shadow-lg transition-shadow hover:bg-bgc-accent hover:shadow-2xl"
		title={m['viewer.menu.save_pic']()}
		aria-label={m['viewer.menu.save_pic']()}
	>
		<span class="material-icons">photo_camera_back</span>
	</button>
	{#if __INTL_VERSION__ !== __JP_VERSION__}
		<button
			onclick={toggleConstData}
			class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-bgc-normal text-2xl text-textc-dim shadow-lg transition-shadow hover:bg-bgc-accent hover:shadow-2xl"
			title={m['viewer.menu.change_const']({
				name: constDataMessages[$usedConstData]
			})}
			aria-label={m['viewer.menu.change_const']({
				name: constDataMessages[$usedConstData]
			})}
		>
			{#if $usedConstData === __INTL_VERSION__}
				<span class="material-icons">public</span>
			{:else}
				<span>🇯🇵</span>
			{/if}
		</button>
	{/if}
	<button
		onclick={settingsRef!.open}
		class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-bgc-normal text-2xl text-textc-dim shadow-lg transition-shadow hover:bg-bgc-accent hover:shadow-2xl"
		title={m['viewer.menu.settings']()}
		aria-label={m['viewer.menu.settings']()}
	>
		<span class="material-icons">settings</span>
	</button>
</div>

<header class="flex gap-4 sm:gap-16 p-4 sm:pt-0">
	<a id="best" href="#best" class="!decoration-none !no-underline">
		<h4
			class="!mb-0"
			class:!text-textc-normal={$_page === 'best'}
			class:!text-textc-dim={$_page !== 'best'}
		>
			BEST
		</h4>
	</a>
	<a id="recent" href="#recent" class="!decoration-none !no-underline">
		<h4
			class="!mb-0"
			class:!text-textc-normal={$_page === 'recent'}
			class:!text-textc-dim={$_page !== 'recent'}
		>
			RECENT
		</h4>
	</a>
	<a id="history" href="#history" class="!decoration-none !no-underline">
		<h4
			class="!mb-0"
			class:!text-textc-normal={$_page === 'history'}
			class:!text-textc-dim={$_page !== 'history'}
		>
			HISTORY
		</h4>
	</a>
</header>

<!-- Main Content -->
<div id="main-content">
	<div class="flex flex-col items-center gap-4 px-4 xl:flex-row">
		<PlayerStats />

		<div class="card mb-4 flex max-w-full flex-col gap-4 lg:mx-auto lg:max-w-2/3">
			<!-- Rank Counts -->
			<div class="flex flex-row max-w-full flex-wrap justify-center gap-4 md:gap-8">
				{#each ['S', 'S+', 'SS', 'SS+', 'SSS', 'SSS+'] as rank}
					<div class="flex flex-col items-center">
						<span class="text-xs text-textc-dim">{rank}</span>
						<span class="md:text-lg text-textc-normal">
							{$rankCounts[rank] ?? 0}
						</span>
					</div>
				{/each}
				<div class="flex flex-col items-center">
					<span class="text-xs text-clear-fc">FC</span>
					<span class="md:text-lg text-textc-normal">{$fcCount}</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-xs text-clear-aj">AJ</span>
					<span class="md:text-lg text-textc-normal">{$ajCount}</span>
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
						<span class="md:text-lg text-textc-normal">
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
						showLabel={true}
					/>
				</div>
			{/if}
		</div>
	</div>

	<RecordTable records={$shownRecords} />
</div>
