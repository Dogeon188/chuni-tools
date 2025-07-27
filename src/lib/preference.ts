import { browser } from '$app/environment'
import { StringStorable } from '$lib/storable'

const userPreferredDarkMode = browser
	? window.matchMedia('(prefers-color-scheme: dark)').matches
	: false

export const theme = StringStorable.create(
	'theme',
	userPreferredDarkMode ? 'dark' : 'light',
	['light', 'dark']
)

theme.subscribe((value) => {
	if (browser) {
		document.documentElement.classList.toggle('dark', value === 'dark')
		document.documentElement.setAttribute('data-theme', value)
	}
})

// omitted: handled by paraglide via cookies
// export const language = createStringPreference('language', ...)
