<script lang="ts">
	import LanguageSelect from '$lib/components/LanguageSelect.svelte'
	import { m } from '$lib/paraglide/messages.js'
	import Markdown from '../lib/components/Markdown.svelte'
</script>

<footer class="mt-auto border-t border-borderc-normal text-textc-dim md:text-base">
	<div class="mx-auto my-4 max-w-7xl bg-bgc-dim px-4 sm:px-6 lg:px-8">
		<div
			class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-6"
		>
			<!-- Language Selector -->
			<div class="flex flex-row items-center gap-3 text-xs sm:text-sm">
				<label for="language-dropdown" class="!mb-0 whitespace-nowrap">
					{m['common.choose_language']()}
				</label>
				<LanguageSelect />
			</div>

			<!-- Powered by message -->
			<Markdown inline class="text-xs" content={m['common.powered_by']()} />
		</div>
	</div>
</footer>
