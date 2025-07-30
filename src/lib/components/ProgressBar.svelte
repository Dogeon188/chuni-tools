<script lang="ts">
	interface Props {
		current?: number
		max?: number
		showLabel?: boolean
		labelFormat?: 'percentage' | 'fraction' | 'current'
		toFixed?: number // Optional prop for fixed decimal places
		textColor?: string
		backgroundColor?: string
		foregroundColor?: string
		class?: string
	}

	let {
		current = 0,
		max = 100,
		showLabel = false,
		labelFormat = 'percentage',
		toFixed = 2, // Default to 2 decimal places
		textColor = 'var(--color-white)',
		backgroundColor = 'var(--color-bgc-dim)',
		foregroundColor = 'var(--color-borderc-form)',
		class: className = ''
	}: Props = $props()

	let percentage = $derived(
		max > 0 ? Math.min(Math.max((current / max) * 100, 0), 100) : 0
	)
	let label = $derived(
		(() => {
			switch (labelFormat) {
				case 'percentage':
					return `${percentage.toFixed(toFixed)}%`
				case 'fraction':
					return `${current}/${max}`
				case 'current':
					return `${current}`
				default:
					return `${percentage.toFixed(toFixed)}%`
			}
		})()
	)
</script>

<div
	class="relative flex h-8 w-full items-center overflow-hidden rounded-2xl {className}"
	style:background-color={backgroundColor}>
	<div
		class="relative flex h-full items-center justify-center rounded-2xl transition-all duration-300 ease-in-out"
		style:width="{percentage}%"
		style:background-color={foregroundColor}>
		{#if showLabel}
			<span
				class="overflow-hidden text-xs font-medium whitespace-nowrap drop-shadow-sm"
				style:color={textColor}>
				{label}
			</span>
		{/if}
	</div>
</div>
