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

<div class="language-select">
	<div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
		{m['common.choose_language']()}
	</div>
	<div class="flex flex-wrap gap-2" role="group" aria-label={m['common.choose_language']()}>
		{#each languageOptions as option}
			<button
				type="button"
				class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200"
				class:bg-blue-600={currentLocale === option.code}
				class:text-white={currentLocale === option.code}
				class:border-blue-600={currentLocale === option.code}
				class:bg-white={currentLocale !== option.code}
				class:text-gray-700={currentLocale !== option.code}
				class:border-gray-300={currentLocale !== option.code}
				class:hover:bg-gray-50={currentLocale !== option.code}
				class:dark:bg-gray-800={currentLocale !== option.code}
				class:dark:text-gray-200={currentLocale !== option.code}
				class:dark:border-gray-600={currentLocale !== option.code}
				class:dark:hover:bg-gray-700={currentLocale !== option.code}
				aria-pressed={currentLocale === option.code}
				onclick={() => handleLocaleChange(option.code)}
			>
				<span>{option.name}</span>
			</button>
		{/each}
	</div>
</div>