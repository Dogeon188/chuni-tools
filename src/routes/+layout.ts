import { browser } from '$app/environment'
import { theme } from '$lib/preference'

export const prerender = true

theme.subscribe((value) => {
	if (browser) {
		document.documentElement.classList.toggle('dark', value === 'dark')
		document.documentElement.setAttribute('data-theme', value)
	}
})
