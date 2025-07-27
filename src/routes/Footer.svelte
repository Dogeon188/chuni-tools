<script lang="ts">
	import { m } from '$lib/paraglide/messages.js'
	import LanguageSelect from '../lib/components/LanguageSelect.svelte'
	import Markdown from '../lib/components/Markdown.svelte'
</script>

<footer class="mt-auto border-t border-borderc-normal text-textc-dim">
	<div class="mx-auto max-w-7xl px-4 my-4 sm:px-6 lg:px-8 bg-bgc-dim">
		<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
			<!-- Language Selector -->
			<div class="flex-shrink-0">
				<LanguageSelect />
			</div>

			<!-- Powered by message -->
			<Markdown inline className="text-sm" content={m['common.powered_by']()} />
		</div>
	</div>
</footer>
