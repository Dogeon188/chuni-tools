<script lang="ts">
	import { m } from '$lib/paraglide/messages.js'
	import { theme } from '$lib/preference'
	import LanguageSelect from './LanguageSelect.svelte'
	import Markdown from './Markdown.svelte'
</script>

<footer class="mt-auto border-t border-borderc-normal text-textc-dim">
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 bg-bgc-dim">
		<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
			<!-- Language Selector -->
			<div class="flex-shrink-0">
				<LanguageSelect />
			</div>

			<!-- Theme Selector -->
			<div class="flex-shrink-0">
				<select bind:value={$theme} class="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
					<option value="light">Light</option>
					<option value="dark">Dark</option>
				</select>
			</div>

			<!-- Powered by message -->
			<Markdown inline className="text-sm" content={m['common.powered_by']()} />
		</div>
	</div>
</footer>
