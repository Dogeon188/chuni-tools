<script lang="ts">
	interface Props {
		checked?: boolean
		disabled?: boolean
		size?: 'sm' | 'md' | 'lg'
		inline?: boolean
		label?: string
		description?: string
		onchange?: (checked: boolean) => void
		class?: string
	}

	let {
		checked = $bindable(false),
		disabled = false,
		size = 'md',
		inline = false,
		label,
		description,
		onchange,
		class: className = ''
	}: Props = $props()

	function handleChange() {
		if (disabled) return
		checked = !checked
		onchange?.(checked)
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault()
			handleChange()
		}
	}

	const sizeClasses = {
		sm: 'w-8 h-4',
		md: 'w-11 h-6',
		lg: 'w-14 h-8'
	}

	const thumbSizeClasses = {
		sm: 'w-3 h-3',
		md: 'w-5 h-5',
		lg: 'w-6 h-6'
	}

	const translateClasses = $derived({
		sm: checked ? 'translate-x-4' : 'translate-x-0',
		md: checked ? 'translate-x-5' : 'translate-x-0',
		lg: checked ? 'translate-x-6.5' : 'translate-x-0.5'
	})

	const id = `switch-${Math.random().toString(36).substr(2, 9)}`
</script>

<div class={className} class:inline-flex={inline}>
	{#if label}
		<label
			for={id}
			class="m-0 inline w-fit cursor-pointer font-medium {disabled
				? 'cursor-not-allowed opacity-50'
				: ''}">
			{label}
			{#if description}
				<div
					id="{id}-description"
					class="inline text-xs text-textc-muted
								{disabled ? 'opacity-50' : ''}">
					{description}
				</div>
			{/if}
		</label>
	{/if}
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		aria-labelledby={label ? `${id}-label` : undefined}
		aria-describedby={description ? `${id}-description` : undefined}
		{disabled}
		{id}
		class="
			relative inline-flex items-center rounded-full border-2 border-transparent
			transition-colors duration-200 ease-in-out focus:ring-2
			focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
			{sizeClasses[size]}
			{checked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}
			{disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
		"
		onclick={handleChange}
		onkeydown={handleKeydown}>
		<span class="sr-only">
			{label || 'Toggle switch'}
		</span>
		<span
			class="
				inline-block transform rounded-full bg-white shadow ring-0
				transition duration-200 ease-in-out
				{thumbSizeClasses[size]}
				{translateClasses[size]}
			"></span>
	</button>
</div>

<style>
	/* Use your project's custom color variables */
	button {
		background-color: var(--color-bgc-muted);
	}

	button[aria-checked='true'] {
		background-color: var(--color-borderc-form);
	}

	button:hover:not(:disabled) {
		filter: brightness(0.95);
	}

	button:focus {
		box-shadow: 0 0 0 2px var(--color-borderc-form);
	}

	.label {
		color: var(--color-textc-normal);
	}

	/* Dark theme hover effect handled by CSS variables automatically */
	:global([data-theme='dark']) button:hover:not(:disabled) {
		filter: brightness(1.1);
	}
</style>
