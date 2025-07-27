<script lang="ts">
	import Settings from './Settings.svelte'

	let settingsRef = $state<Settings>()
</script>

<Settings bind:this={settingsRef} />

<h2>Record Viewer</h2>
<p>Welcome to the record viewer! This tool helps you analyze your game records.</p>

<button class="btn btn-primary" onclick={() => settingsRef!.open()}>Open Settings</button>
