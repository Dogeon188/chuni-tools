<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte'
	import Loader from '$lib/components/Loader.svelte'
	import Markdown from '$lib/components/Markdown.svelte'
	import Modal from '$lib/components/Modal.svelte'
	import logger from '$lib/logger'
	import { m } from '$lib/paraglide/messages'
	import { allFetched, fetchError } from './fetched'
	import { usedConstData } from './preference'

	const lastMessage = logger.lastMessage

	function getErrorType(error: Error) {
		if (error.message.includes('Service temporarily unavailable')) {
			return 'service_down'
		} else if (
			error.message.includes('Request failed: rejected by server') ||
			error.message.includes('Failed to fetch')
		) {
			return 'rejected'
		} else if (error.message.includes('Request timed out')) {
			return 'timeout'
		} else if (error.message.includes('Target window does not exist')) {
			return 'noopener'
		}
		return 'unknown'
	}

	const errorMessages = {
		service_down: m['viewer.fetch.error.service_down'](),
		rejected: m['viewer.fetch.error.rejected'](),
		timeout: m['viewer.fetch.error.timeout'](),
		noopener: m['viewer.fetch.error.noopener'](),
		unknown: m['viewer.fetch.error.unknown']()
	}
</script>

<Modal
	isOpen={!$allFetched}
	closeOnBackdrop={false}
	closeOnEscape={false}
	showCloseButton={false}>
	<div class="flex h-full flex-col items-center justify-center">
		<h2 class="text-center">
			{m['viewer.title']()}
			<span class="text-sm text-textc-dim">@{__APP_VERSION__}</span>
		</h2>
		{#if $fetchError === null}
			<div class="mt-16 mb-16">
				<Loader
					size="2rem"
					color="var(--color-textc-info)"
					thickness="4px"
					duration="2s"
					timingFunction="ease-in-out" />
			</div>

			<div class="min-h-[1.5em] text-textc-dim">
				{@html $lastMessage?.content ?? ''}
			</div>
			<div class="text-center">
				{#if __INTL_VERSION__ !== __JP_VERSION__}
					<p class="text-textc-dim">
						{m['viewer.fetch.record.using_const']({
							name: (m as any)['common.version.' + $usedConstData]()
						})}
					</p>
				{/if}
			</div>
		{:else}
			<div class="mt-16 mb-16 text-4xl text-textc-info">:(</div>
			<Markdown content={errorMessages[getErrorType($fetchError)]} />
			<CodeBlock
				showLanguage={false}
				language="txt"
				code={$fetchError?.name +
					': ' +
					$fetchError?.message +
					'\n' +
					$fetchError.stack} />
		{/if}
	</div>
</Modal>
