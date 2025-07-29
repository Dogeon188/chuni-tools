<script lang="ts">
	import { bestRecord, playerStats, playHistory, recentRecord } from './fetched'
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

<Settings bind:this={settingsRef} />

<h2>Record Viewer</h2>
<p>Welcome to the record viewer! This tool helps you analyze your game records.</p>

<button class="btn btn-primary" onclick={() => settingsRef!.open()}>Open Settings</button>
