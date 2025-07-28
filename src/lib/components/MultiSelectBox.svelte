<script lang="ts">
	import { m } from '$lib/paraglide/messages'
	import type { Writable } from 'svelte/store'

	interface Props {
		choices: readonly string[]
		store: Writable<Record<string, boolean>> & {
			toggleFlag: (flag: string) => void
			update: (
				updater: (value: Record<string, boolean>) => Record<string, boolean>
			) => void
		}
		colorStyles?: Record<string, string>
		label?: string
		description?: string
		disabled?: boolean
		class?: string
	}

	let {
		choices,
		store,
		colorStyles = {},
		label,
		description,
		disabled = false,
		class: className = ''
	}: Props = $props()

	// Get the current values from the store
	const values = $derived($store)

	// Toggle a specific choice
	function toggleChoice(choice: string) {
		if (!disabled) {
			store.toggleFlag(choice)
		}
	}

	// Check if all choices are selected
	const allSelected = $derived(choices.every((choice) => values[choice]))

	// Check if no choices are selected
	const noneSelected = $derived(choices.every((choice) => !values[choice]))

	// Toggle all choices
	function toggleAll() {
		if (disabled) return

		const shouldSelectAll = !allSelected
		store.update((current: Record<string, boolean>) => {
			const updated = { ...current }
			for (const choice of choices) {
				updated[choice] = shouldSelectAll
			}
			return updated
		})
	}

	// Get the color style for a choice
	function getChoiceStyle(choice: string): string {
		return colorStyles[choice] || ''
	}

	// Generate unique ID for accessibility
	const componentId = Math.random().toString(36).substring(2, 9)
</script>

<div class="multi-select-box {className}">
	{#if label}
		<label
			for="multi-select-{componentId}"
			class="mb-2 block text-sm font-medium text-textc-normal">
			{label}
			{#if description}
				<span class="text-xs text-textc-muted">{description}</span>
			{/if}
		</label>
	{/if}

	<div
		id="multi-select-{componentId}"
		class="rounded-lg border border-borderc-normal bg-bgc-normal">
		<!-- Header with select all/none -->
		<div
			class="flex items-center justify-between rounded-t-lg border-b border-borderc-normal bg-bgc-dim p-3">
			<span class="text-sm font-medium text-textc-dim">
				{choices.filter((choice) => values[choice]).length} / {choices.length}
			</span>
			<button
				type="button"
				onclick={toggleAll}
				{disabled}
				class="rounded px-3 py-1 text-xs font-medium transition-colors
					{disabled
					? 'cursor-not-allowed text-textc-muted'
					: 'text-textc-info hover:bg-bgc-info active:bg-bgc-accent'}">
				{allSelected
					? m['common.ui.multi_select.deselect_all']()
					: m['common.ui.multi_select.select_all']()}
			</button>
		</div>

		<!-- Choice buttons arranged in rows -->
		<div class="p-3">
			<div class="flex flex-wrap gap-2">
				{#each choices as choice (choice)}
					{@const isSelected = values[choice]}
					{@const choiceStyle = getChoiceStyle(choice)}
					<button
						type="button"
						onclick={() => toggleChoice(choice)}
						{disabled}
						class="rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200
							{disabled
							? 'cursor-not-allowed opacity-50'
							: 'focus:ring-opacity-50 cursor-pointer hover:scale-105 focus:ring-2 focus:ring-textc-info focus:outline-none'}
							{isSelected
							? 'border-borderc-form bg-bgc-info shadow-md'
							: 'hover:border-borderc-accent border-borderc-dim bg-bgc-normal text-textc-normal hover:bg-bgc-accent'}"
						style={choiceStyle}>
						{choice}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	/* Button hover animation */
	.multi-select-box button:hover:not(:disabled) {
		transform: translateY(-1px);
	}
</style>
