<script lang="ts">
	import { m } from '$lib/paraglide/messages.js'
	import LanguageSelect from './LanguageSelect.svelte'
	import Markdown from './Markdown.svelte'
</script>

<footer class="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
			<!-- Language Selector -->
			<div class="flex-shrink-0">
				<LanguageSelect />
			</div>

			<!-- Powered by message -->
			<div class="text-sm text-gray-600 dark:text-gray-400">
				<Markdown content={m['common.powered_by']()} />
			</div>
		</div>
	</div>
</footer>
