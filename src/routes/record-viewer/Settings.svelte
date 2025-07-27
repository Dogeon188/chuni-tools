<script lang="ts">
	import DualSlider from '$lib/components/DualSlider.svelte'
	import Modal from '$lib/components/Modal.svelte'
	import { m } from '$lib/paraglide/messages'
	import { theme } from '$lib/preference'
	import {
		diffUpdateInterval,
		filterConstMax,
		filterConstMin,
		filterDifficulty,
		filterGenre,
		filterVersion,
		showOverPower,
		showPlayCount,
		songConstMax,
		songConstMin,
		usedConstData
	} from './preference'

	let isOpen = $state(false)

	export function open() {
		isOpen = true
	}

	export function close() {
		songConstMin
	}
</script>

<Modal bind:isOpen onclose={() => (isOpen = false)}>
	<div class="mx-8">
		<!-- Title -->
		<h2>{m['viewer.settings.title']()}</h2>

		<!-- Filters -->
		<h3>{m['viewer.settings.filters.title']()}</h3>

		<DualSlider
			label={m['viewer.settings.filters.const']()}
			min={songConstMin}
			max={songConstMax}
			step={0.1}
			minValue={$filterConstMin}
			maxValue={$filterConstMax} />

		<!-- UI -->
		<h3>{m['viewer.settings.ui.title']()}</h3>

		<div class="label">{m['viewer.settings.ui.theme']()}</div>
		<select bind:value={$theme}>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</div>
</Modal>
