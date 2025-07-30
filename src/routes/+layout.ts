import { browser } from '$app/environment'
import { theme } from '$lib/preference'

export const prerender = true

theme.subscribe((value) => {
	if (browser) {
		document.documentElement.setAttribute('data-theme', value)
	}
})
