<script lang="ts">
	import DualSlider from '$lib/components/DualSlider.svelte'
	import LanguageSelect from '$lib/components/LanguageSelect.svelte'
	import Modal from '$lib/components/Modal.svelte'
	import MultiSelectBox from '$lib/components/MultiSelectBox.svelte'
	import Switch from '$lib/components/Switch.svelte'
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
		isOpen = false
	}

	const constDataMessages = {
		[__INTL_VERSION__]: (m as any)[`common.version.${__INTL_VERSION__}`],
		[__JP_VERSION__]: (m as any)[`common.version.${__JP_VERSION__}`]
	}

	const overpowerMessages = {
		hide: m['viewer.settings.data.overpower.hide'](),
		value: m['viewer.settings.data.overpower.value'](),
		percent: m['viewer.settings.data.overpower.percent']()
	}
</script>

<Modal bind:isOpen onclose={() => (isOpen = false)}>
	<div class="mx-4 sm:mx-8">
		<!-- Title -->
		<h2>{m['viewer.settings.title']()}</h2>

		<!-- Filters -->
		<h3>{m['viewer.settings.filters.title']()}</h3>

		<DualSlider
			label={m['viewer.settings.filters.const']()}
			min={songConstMin}
			max={songConstMax}
			step={0.1}
			bind:minValue={$filterConstMin}
			bind:maxValue={$filterConstMax} />

		<MultiSelectBox
			class="mb-4"
			label={m['viewer.settings.filters.difficulty.title']()}
			description={m['viewer.settings.filters.difficulty.description']()}
			choices={['BAS', 'ADV', 'EXP', 'MAS', 'ULT']}
			store={filterDifficulty}
			colorStyles={{
				BAS: 'color: var(--color-diff-bas)',
				ADV: 'color: var(--color-diff-adv)',
				EXP: 'color: var(--color-diff-exp)',
				MAS: 'color: var(--color-diff-mas)',
				ULT: 'color: var(--color-diff-ult)'
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

		<hr class="my-4 border-borderc-dim" />

		<!-- Data -->
		<h3>{m['viewer.settings.data.title']()}</h3>

		{#if __INTL_VERSION__ !== __JP_VERSION__}
			<div class="label">{m['viewer.settings.data.const']()}</div>
			<select bind:value={$usedConstData} class="mb-4">
				{#each usedConstData.getConfig().legalValues! as choice}
					<option value={choice}>
						{constDataMessages[choice]()}
					</option>
				{/each}
			</select>
		{/if}

		<div class="label !mb-0">
			{m['viewer.settings.data.overpower.title']()}
		</div>
		<div class="mb-2 text-xs text-textc-muted">
			{@html m['viewer.settings.data.overpower.description']()}
		</div>
		<select bind:value={$showOverPower} class="mb-4">
			{#each showOverPower.getConfig().legalValues! as choice}
				<option value={choice}>
					{overpowerMessages[choice as keyof typeof overpowerMessages]}
				</option>
			{/each}
		</select>

		<Switch
			class="mb-4"
			size="lg"
			label={m['viewer.settings.data.play_count.title']()}
			description={m['viewer.settings.data.play_count.description']()}
			bind:checked={$showPlayCount} />

		{#if $showPlayCount}
			<div class="label">{m['viewer.settings.data.fetch_play_count.title']()}</div>
			<div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
				<div class="flex min-w-0 flex-1 items-center gap-2">
					<input
						type="number"
						min="1"
						class="input input-bordered min-w-[80px] flex-1"
						placeholder={m['viewer.settings.data.fetch_play_count.from']()} />
					<span class="flex-shrink-0 text-textc-dim">~</span>
					<input
						type="number"
						min="1"
						class="input input-bordered min-w-[80px] flex-1"
						placeholder={m['viewer.settings.data.fetch_play_count.to']()} />
				</div>
				<button class="btn btn-primary w-full flex-shrink-0 sm:w-auto">
					{m['viewer.settings.data.fetch_play_count.button']()}
				</button>
				<!-- TODO: Implement batch fetch play count -->
			</div>
		{/if}

		<hr class="my-4 border-borderc-dim" />

		<!-- UI -->
		<h3>{m['viewer.settings.ui.title']()}</h3>

		<div class="label">{m['viewer.settings.ui.theme']()}</div>
		<select bind:value={$theme} class="mb-4">
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>

		<div class="label">{m['viewer.settings.ui.language']()}</div>
		<LanguageSelect />

		<hr class="my-4 border-borderc-dim" />

		<!-- Reset -->
		<button
			class="btn btn-danger"
			onclick={() => {
				// Reset all preferences to default values
				filterConstMin.reset()
				filterConstMax.reset()
				filterDifficulty.reset()
				filterGenre.reset()
				filterVersion.reset()
				showOverPower.reset()
				showPlayCount.reset()
				usedConstData.reset()
				diffUpdateInterval.reset()
			}}
			>{m['viewer.settings.reset']()}
		</button>
	</div>
</Modal>
