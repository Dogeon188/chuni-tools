<script lang="ts">
	import { logger, type LogMessage } from '$lib/logger'
	import { onDestroy } from 'svelte'
	import { flip } from 'svelte/animate'
	import { fade, fly } from 'svelte/transition'

	// Component props
	interface Props {
		position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
		maxVisible?: number;
		showProgress?: boolean;
	}
	
	let { 
		position = 'top-right',
		maxVisible = 5,
		showProgress = true
	}: Props = $props();
	
	// Simple reactive messages for better transition support
	const messages = logger.allMessages;
	const visibleMessages = $derived($messages.slice(-maxVisible));

	// Position classes
	const positionClasses = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
		'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
	};

	// Calculate progress percentage
	function getProgress(message: LogMessage): number {
		return (message.countdown / message.maxCountdown) * 100;
	}

	// Format countdown time
	function formatCountdown(countdown: number): string {
		return (countdown / 1000).toFixed(1) + 's';
	}

	// Handle manual close
	function closeMessage(message: LogMessage) {
		logger.remove(message.id);
	}

	onDestroy(() => {
		// Cleanup if needed
	});
</script>

<!-- Notification Container -->
{#if visibleMessages.length > 0}
	<div class="fixed z-[1001] pointer-events-none {positionClasses[position]}">
		<div class="space-y-2 max-w-sm w-full">
			{#each visibleMessages as message (message.id)}
				<div
					class="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-auto overflow-hidden"
					animate:flip={{ duration: 300 }}
					in:fly|global={{ 
						x: position.includes('right') ? 300 : position.includes('left') ? -300 : 0,
						y: position.includes('top') ? -100 : position.includes('bottom') ? 100 : 0,
						duration: 300,
						delay: 0
					}}
					out:fade|global={{ duration: 200, delay: 0 }}
				>
					<!-- Progress bar -->
					{#if showProgress}
						<div class="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-100 ease-linear"
							 style="width: {getProgress(message)}%">
						</div>
					{/if}

					<!-- Message content -->
					<div class="p-4 pr-10">
						<div class="text-sm text-gray-900 dark:text-gray-100">
							{@html message.content}
						</div>
						
						{#if showProgress}
							<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
								{formatCountdown(message.countdown)}
							</div>
						{/if}
					</div>

					<!-- Close button -->
					<button
						class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
						onclick={() => closeMessage(message)}
						aria-label="Close notification"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Additional custom styles if needed */
</style>
