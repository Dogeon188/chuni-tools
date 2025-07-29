<script lang="ts">
	import Loader from '$lib/components/Loader.svelte'
	import Modal from '$lib/components/Modal.svelte'
	import logger from '$lib/logger'
	import { m } from '$lib/paraglide/messages'
	import { allFetched } from './fetched'
	import { usedConstData } from './preference'

	const lastMessage = logger.lastMessage
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

		<div class="mt-16 mb-16">
			<Loader
				size="2rem"
				color="var(--color-textc-info)"
				thickness="4px"
				duration="2s"
				timingFunction="ease-in-out" />
		</div>

		<div class="min-h-[1.5em] text-textc-dim">{@html $lastMessage?.content ?? ''}</div>
		<div class="text-center">
			{#if __INTL_VERSION__ !== __JP_VERSION__}
				<p class="text-textc-dim">
					{m['viewer.fetch.record.using_const']({
						name: (m as any)['common.version.' + $usedConstData]()
					})}
				</p>
			{/if}
		</div>
	</div>
</Modal>
