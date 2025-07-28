<script lang="ts">
	import LanguageSelect from '$lib/components/LanguageSelect.svelte'
	import { m } from '$lib/paraglide/messages.js'
	import Markdown from '../lib/components/Markdown.svelte'
</script>

<footer class="mt-auto border-t border-borderc-normal text-textc-dim">
	<div class="mx-auto my-4 max-w-7xl bg-bgc-dim px-4 sm:px-6 lg:px-8">
		<div
			class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
			<!-- Language Selector -->

			<div class="language-select flex flex-row items-center gap-3">
				<label
					for="language-dropdown"
					class="text-sm font-medium whitespace-nowrap">
					{m['common.choose_language']()}
				</label>
				<LanguageSelect />
			</div>

			<!-- Powered by message -->
			<Markdown inline class="text-sm" content={m['common.powered_by']()} />
		</div>
	</div>
</footer>
