<script lang="ts">
	import NotificationPopup from '$lib/components/NotificationPopup.svelte'
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
	import Settings from './Settings.svelte'

	let settingsRef = $state<Settings>()

	function routeChange() {
		// Reset the settings when the route changes
		$_page = (window.location.hash.slice(1) as typeof $_page) || 'best'
	}

	playerStats.subscribe(() => {})
	recentRecord.subscribe(() => {})
	playHistory.subscribe(() => {})
	bestRecord.subscribe(() => {})
</script>

<svelte:window on:hashchange={routeChange} />

{#if $allFetched}
	<NotificationPopup position="top-right" maxVisible={5} showProgress={false} />
{/if}

<Settings bind:this={settingsRef} />

<Loading />

<header class="flex gap-4 p-4">
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
			CURRENT
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

<main>
	<!-- Player Stats -->
	<PlayerStats />
	<!-- Display player stats, recent record, play history, and best record here -->
</main>

<button class="btn btn-primary" onclick={() => settingsRef!.open()}>Open Settings</button>
