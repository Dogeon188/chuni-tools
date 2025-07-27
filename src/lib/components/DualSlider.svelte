<script lang="ts">
	// Props
	interface Props {
		min?: number
		max?: number
		step?: number
		minValue?: number
		maxValue?: number
		disabled?: boolean
		onchange?: (event: { min: number; max: number }) => void
		label?: string
		minLabel?: string
		maxLabel?: string
		showValues?: boolean
	}

	let {
		min = 0,
		max = 100,
		step = 1,
		minValue = $bindable(min),
		maxValue = $bindable(max),
		disabled = false,
		onchange,
		label,
		minLabel = 'Min: ',
		maxLabel = 'Max: ',
		showValues = true
	}: Props = $props()

	// Internal state
	let isDraggingMin = $state(false)
	let isDraggingMax = $state(false)
	let sliderElement: HTMLDivElement

	// Ensure values are within bounds and in correct order
	$effect(() => {
		minValue = Math.max(min, Math.min(minValue, maxValue))
		maxValue = Math.min(max, Math.max(maxValue, minValue))
	})

	// Calculate positions as percentages
	const minPercent = $derived(((minValue - min) / (max - min)) * 100)
	const maxPercent = $derived(((maxValue - min) / (max - min)) * 100)

	// Calculate decimal places based on step for proper formatting
	const decimalPlaces = $derived(() => {
		if (step >= 1) return 0
		const stepStr = step.toString()
		const decimalIndex = stepStr.indexOf('.')
		return decimalIndex === -1 ? 0 : stepStr.length - decimalIndex - 1
	})

	// Format values to avoid floating point display errors
	const formatValue = (value: number) => {
		return Number(value.toFixed(decimalPlaces()))
	}

	const formattedMinValue = $derived(formatValue(minValue))
	const formattedMaxValue = $derived(formatValue(maxValue))

	function handleMouseDown(event: MouseEvent, type: 'min' | 'max') {
		if (disabled) return

		event.preventDefault()

		if (type === 'min') {
			isDraggingMin = true
		} else {
			isDraggingMax = true
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	function handleMouseMove(event: MouseEvent) {
		if (!sliderElement || disabled) return

		const rect = sliderElement.getBoundingClientRect()
		const percent = Math.max(
			0,
			Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)
		)
		const value = min + (percent / 100) * (max - min)
		const steppedValue = Math.round(value / step) * step

		if (isDraggingMin) {
			const newMinValue = Math.max(min, Math.min(steppedValue, maxValue))
			if (newMinValue !== minValue) {
				minValue = newMinValue
				onchange?.({ min: minValue, max: maxValue })
			}
		} else if (isDraggingMax) {
			const newMaxValue = Math.min(max, Math.max(steppedValue, minValue))
			if (newMaxValue !== maxValue) {
				maxValue = newMaxValue
				onchange?.({ min: minValue, max: maxValue })
			}
		}
	}

	function handleMouseUp() {
		isDraggingMin = false
		isDraggingMax = false
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
	}

	function handleKeyDown(event: KeyboardEvent, type: 'min' | 'max') {
		if (disabled) return

		let newValue: number
		const currentValue = type === 'min' ? minValue : maxValue

		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowDown':
				event.preventDefault()
				newValue = Math.max(min, currentValue - step)
				break
			case 'ArrowRight':
			case 'ArrowUp':
				event.preventDefault()
				newValue = Math.min(max, currentValue + step)
				break
			case 'Home':
				event.preventDefault()
				newValue = min
				break
			case 'End':
				event.preventDefault()
				newValue = max
				break
			default:
				return
		}

		if (type === 'min') {
			minValue = Math.min(newValue, maxValue)
		} else {
			maxValue = Math.max(newValue, minValue)
		}

		onchange?.({ min: minValue, max: maxValue })
	}
</script>

<div
    class="my-5 w-full select-none"
	class:opacity-60={disabled}
	class:pointer-events-none={disabled}>
	<!-- Main label -->
	{#if label}
		<div class="label">
			{label}
		</div>
	{/if}

	<div class="relative mx-4 my-5 w-[calc(100%-2rem)] h-1.5" bind:this={sliderElement}>
		<!-- Background track -->
		<div class="absolute h-full w-full rounded bg-bgc-accent"></div>

		<!-- Active range -->
		<div
			class="absolute h-full rounded bg-borderc-form"
			style="left: {minPercent}%; width: {maxPercent - minPercent}%">
		</div>

		<!-- Min handle -->
        <button
            class="group absolute top-1/2 z-10 flex h-5 w-5 -translate-x-4/5 -translate-y-1/2
                   cursor-pointer items-center justify-center rounded-l-full border-2
                   border-borderc-form bg-white text-[0px] transition-shadow duration-200
                   hover:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] focus:outline-none
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borderc-form disabled:cursor-not-allowed disabled:opacity-60"
            class:shadow-[0_0_0_6px_rgba(59,130,246,0.3)]={isDraggingMin}
            class:scale-110={isDraggingMin}
            style="left: {minPercent}%"
            {disabled}
            onmousedown={(e) => handleMouseDown(e, 'min')}
            onkeydown={(e) => handleKeyDown(e, 'min')}
            aria-label="Minimum value"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={formattedMinValue}
            role="slider"
            tabindex="0">
			<span
				class="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-bgc-inverse px-2
					   py-1 text-xs whitespace-nowrap text-textc-inverse opacity-0 transition-opacity
					   duration-200 group-hover:opacity-100 group-focus:opacity-100
					   after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4
					   after:border-transparent after:border-t-gray-800 after:content-['']"
				class:opacity-100={isDraggingMin}>
				{formattedMinValue}
			</span>
		</button>

		<!-- Max handle -->
		<button
			class="group absolute top-1/2 z-[11] flex h-5 w-5 -translate-x-1/5 -translate-y-1/2
				   cursor-pointer items-center justify-center rounded-r-full border-2
				   border-borderc-form bg-white text-[0px] transition-shadow duration-200
				   hover:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] focus:outline-none
				   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borderc-form disabled:cursor-not-allowed disabled:opacity-60"
			class:shadow-[0_0_0_6px_rgba(59,130,246,0.3)]={isDraggingMax}
			class:scale-110={isDraggingMax}
			style="left: {maxPercent}%"
			{disabled}
			onmousedown={(e) => handleMouseDown(e, 'max')}
			onkeydown={(e) => handleKeyDown(e, 'max')}
			aria-label="Maximum value"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={formattedMaxValue}
			role="slider"
			tabindex="0">
			<span
				class="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded bg-bgc-inverse px-2
					   py-1 text-xs whitespace-nowrap text-textc-inverse opacity-0 transition-opacity
					   duration-200 group-hover:opacity-100 group-focus:opacity-100
					   after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4
					   after:border-transparent after:border-t-gray-800 after:content-['']"
				class:opacity-100={isDraggingMax}>
				{formattedMaxValue}
			</span>
		</button>
	</div>

	<!-- Value display -->
	{#if showValues}
		<div class="mt-2.5 flex justify-between text-sm text-gray-500">
			<span>{minLabel}{formattedMinValue}</span>
			<span>{maxLabel}{formattedMaxValue}</span>
		</div>
	{/if}
</div>
