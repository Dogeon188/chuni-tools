<script lang="ts">
	import Prism from 'prismjs'
	import { onMount } from 'svelte'

	interface Props {
		code?: string
		language?: string
		title?: string
		showLineNumbers?: boolean
		class?: string
	}

	let {
		code = '',
		language = '',
		title = '',
		showLineNumbers = false,
		class: className = ''
	}: Props = $props()

	let copied = $state(false)
	let codeElement: HTMLElement
	let copyTimeout: ReturnType<typeof setTimeout>

	let highlightedCode = $state('')

	// Copy code to clipboard
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(code)
			copied = true

			// Reset the copied state after 2 seconds
			if (copyTimeout) clearTimeout(copyTimeout)
			copyTimeout = setTimeout(() => {
				copied = false
			}, 2000)
		} catch (err) {
			console.error('Failed to copy code:', err)
			// Fallback for older browsers
			fallbackCopyTextToClipboard()
		}
	}

	// Fallback copy method for browsers that don't support clipboard API
	function fallbackCopyTextToClipboard() {
		const textArea = document.createElement('textarea')
		textArea.value = code
		textArea.style.position = 'fixed'
		textArea.style.left = '-999999px'
		textArea.style.top = '-999999px'
		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()

		try {
			document.execCommand('copy')
			copied = true
			if (copyTimeout) clearTimeout(copyTimeout)
			copyTimeout = setTimeout(() => {
				copied = false
			}, 2000)
		} catch (err) {
			console.error('Fallback: Failed to copy code:', err)
		}

		document.body.removeChild(textArea)
	}

	// Split code into lines for line numbers
	let codeLines = $derived(code.split('\n'))

	onMount(() => {
		highlightedCode = Prism.highlight(
			code,
			Prism.languages[language] || Prism.languages.javascript,
			language
		)
		return () => {
			if (copyTimeout) clearTimeout(copyTimeout)
		}
	})
</script>

<div class="relative mb-4 overflow-hidden rounded-lg bg-gray-900 shadow-lg {className}">
	<!-- Header with title and copy button -->
	<div class="flex items-center justify-between border-b border-borderc-normal bg-bgc-normal px-4 py-2">
		<div class="flex items-center gap-3">
			{#if title}
				<span class="text-sm font-medium text-textc-normal">{title}</span>
			{/if}
			{#if language}
				<span
					class="rounded bg-bgc-accent px-2 py-1 font-mono text-xs text-textc-dim uppercase"
					>{language}</span>
			{/if}
		</div>
		<button
			type="button"
			class="flex cursor-pointer items-center gap-1 rounded border-none bg-bgc-accent/75 px-2 py-1 text-xs text-textc-dim transition-colors duration-200 hover:bg-bgc-accent hover:text-textc-normal"
			class:!text-green-400={copied}
			class:!bg-green-900={copied}
			onclick={copyToClipboard}
			title={copied ? 'Copied!' : 'Copy to clipboard'}>
			{#if copied}
				<!-- Check icon -->
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"></path>
				</svg>
				<span class="sr-only">Copied</span>
			{:else}
				<!-- Copy icon -->
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					></path>
				</svg>
				<span class="sr-only">Copy to clipboard</span>
			{/if}
		</button>
	</div>

	<!-- Code content -->
	<div class="relative flex">
		{#if showLineNumbers}
			<div
				class="flex flex-col border-r border-borderc-dim bg-bgc-dim px-3 py-4 font-mono text-xs leading-6 text-textc-dim select-none">
				{#each codeLines as _, index}
					<span class="min-w-[2rem] text-right">{index + 1}</span>
				{/each}
			</div>
		{/if}
		<pre
			bind:this={codeElement}
			class="m-0 flex-1 overflow-x-auto p-4 font-mono text-sm leading-6"
			class:pl-4={showLineNumbers}
			style="tab-size: 2;"><code class="blocklanguage-{language}"
				>{@html highlightedCode}</code></pre>
	</div>
</div>

<style>
	/* Screen reader only text */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
