<script lang="ts">
	import { m } from '$lib/paraglide/messages.js'
	import { getLocale, locales, setLocale } from '$lib/paraglide/runtime'

	type Locale = (typeof locales)[number]

	let currentLocale = $state(getLocale() as Locale)

	// Language options with display names
	const languageOptions = locales.map((locale) => {
		const name = m[`common.locale_name`]({}, { locale })
		return { code: locale, name }
	})

	function handleLocaleChange(newLocale: Locale) {
		setLocale(newLocale)
		currentLocale = newLocale
	}
</script>

<select
	id="language-dropdown"
	bind:value={currentLocale}
	onchange={(e) => handleLocaleChange((e.target as HTMLSelectElement).value as Locale)}
	aria-label={m['common.choose_language']()}>
	{#each languageOptions as option}
		<option value={option.code} selected={currentLocale === option.code}>
			{option.name}
		</option>
	{/each}
</select>
