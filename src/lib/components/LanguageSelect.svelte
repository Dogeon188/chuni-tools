<script lang="ts">
	import { m } from '$lib/paraglide/messages.js'
	import { getLocale, locales, setLocale } from '$lib/paraglide/runtime'

	type Locale = typeof locales[number]

	let currentLocale = $state(getLocale() as Locale)

	// Language options with display names
	const languageOptions = locales.map(locale => {
		const name = m[`common.locale_name`]({}, {locale})
		return { code: locale, name }
	})

	function handleLocaleChange(newLocale: Locale) {
		setLocale(newLocale)
		currentLocale = newLocale
	}
</script>

<div class="language-select flex flex-row items-center gap-3">
	<label for="language-dropdown" class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
		{m['common.choose_language']()}
	</label>
	<select
		id="language-dropdown"
		class="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200 transition-colors duration-200 min-w-0 flex-shrink-0"
		bind:value={currentLocale}
		onchange={(e) => handleLocaleChange((e.target as HTMLSelectElement).value as Locale)}
		aria-label={m['common.choose_language']()}
	>
		{#each languageOptions as option}
			<option value={option.code} selected={currentLocale === option.code}>
				{option.name}
			</option>
		{/each}
	</select>
</div>