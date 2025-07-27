<script lang="ts">
	import { fade } from 'svelte/transition'

	interface Props {
		isOpen?: boolean
		closeOnEscape?: boolean
		closeOnBackdrop?: boolean
		onclose?: () => void
		onopen?: () => void
		children?: import('svelte').Snippet
	}

	let {
		isOpen = $bindable(false),
		closeOnEscape = true,
		closeOnBackdrop = true,
		onclose,
		onopen,
		children
	}: Props = $props()

	let modalElement = $state<HTMLDivElement>()
	let contentElement = $state<HTMLDivElement>()

	// Programmatic methods to open/close modal
	export function open() {
		isOpen = true
		onopen?.()
	}

	export function close() {
		isOpen = false
		onclose?.()
	}

	// Handle escape key and focus trap
	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen) return

		if (closeOnEscape && event.key === 'Escape') {
			close()
			return
		}

		// Focus trap for accessibility
		if (event.key === 'Tab' && contentElement) {
			const focusableElements = contentElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
			const firstElement = focusableElements[0] as HTMLElement
			const lastElement = focusableElements[
				focusableElements.length - 1
			] as HTMLElement

			if (event.shiftKey) {
				if (document.activeElement === firstElement) {
					event.preventDefault()
					lastElement?.focus()
				}
			} else {
				if (document.activeElement === lastElement) {
					event.preventDefault()
					firstElement?.focus()
				}
			}
		}
	}

	// Handle backdrop click
	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdrop && event.target === modalElement) {
			close()
		}
	}

	// Handle backdrop keydown for accessibility
	function handleBackdropKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			if (closeOnBackdrop && event.target === modalElement) {
				close()
			}
		}
	}

	// Prevent body scroll when modal is open
	$effect(() => {
		if (typeof document !== 'undefined') {
			if (isOpen) {
				document.body.style.overflow = 'hidden'
			} else {
				document.body.style.overflow = ''
			}
		}
		
		// Cleanup function - runs when effect is destroyed
		return () => {
			if (typeof document !== 'undefined') {
				document.body.style.overflow = ''
			}
		}
	})
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- Modal backdrop -->
	<div
		bind:this={modalElement}
		class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
		onclick={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		transition:fade={{ duration: 100 }}>
		<!-- Modal content container -->
		<div
			bind:this={contentElement}
			class="relative flex h-full max-h-[90vh] w-full max-w-[90vw] flex-col rounded-lg bg-bgc-normal shadow-xl max-sm:max-h-full max-sm:max-w-full max-sm:rounded-none"
			role="region"
			aria-label="Modal content">
			<!-- Close button -->
			<button
				class="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-bgc-accent/50 text-textc-muted transition-all duration-200 hover:scale-110 hover:bg-bgc-accent/70 hover:text-textc-dim focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				onclick={close}
				aria-label="Close modal"
				type="button">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>

			<!-- Scrollable content area -->
			<div
				class="scrollbar-thin scrollbar-thumb-bgc-muted scrollbar-track-bgc-normal flex-1 overflow-y-auto p-6 pt-16 max-sm:p-4 max-sm:pt-16">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
