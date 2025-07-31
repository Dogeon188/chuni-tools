<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte'
	import { m } from '$lib/paraglide/messages.js'
	import { getLocale } from '$lib/paraglide/runtime'
	import enContent from './en.md?raw'
	import jpContent from './jp.md?raw'
	import zhContent from './zh-tw.md?raw'

	const content =
		{
			en: enContent,
			'zh-tw': zhContent,
			jp: jpContent
		}[getLocale()] || enContent
	
	const title = content.match(/^# (.+)$/m)?.[1] ?? ''
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="card mx-auto max-w-3xl">
	<Markdown {content} />
</div>

<style>
	:global(.card img) {
		width: 66.6667%;
		margin: 0 auto;
	}
</style>