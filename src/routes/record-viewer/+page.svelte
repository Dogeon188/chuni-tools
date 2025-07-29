<script lang="ts">
	import NotificationPopup from '$lib/components/NotificationPopup.svelte'
	import { logger } from '$lib/logger'
	import {
		allFetched,
		bestRecord,
		playerStats,
		playHistory,
		recentRecord
	} from './fetched'
	import Loading from './Loading.svelte'
	import Settings from './Settings.svelte'

	let settingsRef = $state<Settings>()

	playerStats.subscribe((stats) => {
		if (stats) {
			console.log('Player stats updated:', stats)
		}
	})
	recentRecord.subscribe((record) => {
		if (record) {
			console.log('Recent record updated:', record)
		}
	})
	playHistory.subscribe((history) => {
		if (history) {
			console.log('Play history updated:', history)
		}
	})
	bestRecord.subscribe((record) => {
		if (record) {
			console.log('Best record updated:', record)
		}
	})
</script>

{#if $allFetched}
	<NotificationPopup position="top-right" maxVisible={5} showProgress={false} />
{/if}

<Settings bind:this={settingsRef} />

<Loading />

<div class="content">
	<h1>Record Viewer</h1>
	<!-- Display player stats, recent record, play history, and best record here -->
</div>

<h2>Record Viewer</h2>
<p>Welcome to the record viewer! This tool helps you analyze your game records.</p>

<button class="btn btn-primary" onclick={() => settingsRef!.open()}>Open Settings</button>
