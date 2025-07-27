<script lang="ts">
	import DualSlider from '$lib/components/DualSlider.svelte'
	import Modal from '$lib/components/Modal.svelte'
	import MultiSelectBox from '$lib/components/MultiSelectBox.svelte'
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

	let isOpen = $state(true)

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

		<MultiSelectBox
			class="mb-4"
			label={m['viewer.settings.filters.difficulty']()}
			choices={['BAS', 'ADV', 'EXP', 'MAS', 'ULT']}
			store={filterDifficulty}
			colorStyles={{
				BAS: 'color: #22c55e;',
				ADV: 'color: #f97316;',
				EXP: 'color: #ef4444;',
				MAS: 'color: #8b5cf6;',
				ULT: 'color: #38bdf8;'
			}} />

		<MultiSelectBox
			class="mb-4"
			label={m['viewer.settings.filters.genre']()}
			choices={filterGenre.getConfig().flags}
			store={filterGenre} />

		<MultiSelectBox
			class="mb-4"
			label={m['viewer.settings.filters.version']()}
			choices={filterVersion.getConfig().flags}
			store={filterVersion} />

		<!-- UI -->
		<h3>{m['viewer.settings.ui.title']()}</h3>

		<div class="label">{m['viewer.settings.ui.theme']()}</div>
		<select bind:value={$theme}>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</div>
</Modal>
