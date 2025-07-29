<script lang="ts">
	interface Props {
		size?: string | number
		color?: string
		thickness?: string | number
		duration?: string
		timingFunction?: string
	}

	let {
		size = '2rem',
		color = 'var(--color-borderc-form)',
		thickness = '3px',
		duration = '1s',
		timingFunction = 'linear',
	}: Props = $props()

	// Convert size to CSS value if it's a number
	const sizeValue = $derived(typeof size === 'number' ? `${size}px` : size)
	const thicknessValue = $derived(
		typeof thickness === 'number' ? `${thickness}px` : thickness
	)
</script>

<div
	class="spinner inline-flex items-center transition-colors duration-200"
	style="
		--size: {sizeValue};
		--color: {color};
		--duration: {duration};
        --timing-function: {timingFunction};
	"
	aria-label="Loading..."
	role="status">
	{#each Array(5) as _, i}
		<div
			class="dot"
			style="animation-delay: calc(0.1 * {i} * var(--duration));"
		></div>
	{/each}
</div>

<style>
	.spinner {
		gap: calc(var(--size) / 2);
	}
	.dot {
		width: var(--size);
		height: var(--size);
		background-color: var(--color);
		border-radius: 50%;
		animation: bounce var(--duration) var(--timing-function) infinite;
	}

	/* Use CSS custom properties for better theme integration */
	.spinner:where([data-theme='dark'] *) .dot {
		opacity: 0.9;
	}

	@keyframes bounce {
		0%, 80%, 100% {
			transform: scaleY(1) translateY(0);
			opacity: 0.5;
		}
		30% {
			transform: scaleY(1.2) translateY(-50%);
			opacity: 1;
		}
		60% {
			transform: scaleY(0.8) translateY(20%);
			opacity: 0.5;
		}
	}
</style>
