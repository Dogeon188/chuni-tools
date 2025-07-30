<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte'
	import Markdown from '$lib/components/Markdown.svelte'
	import { m } from '$lib/paraglide/messages.js'
	import { getScriptBaseUrl } from '$lib/web'

	const bookmarkletScript = `javascript:(function(d,s){s=d.createElement('script');s.type='module';s.src='${getScriptBaseUrl()}/scripts/chuni-tools.js?t='+Math.floor(Date.now()/60000);d.body.append(s);})(document);`
</script>

<svelte:head>
	<title>{m['about.title']()}</title>
</svelte:head>

<div class="card mx-auto max-w-3xl">
	<h1>{m['about.title']()}</h1>

	<Markdown content={m['about.intro']()} />
	<Markdown content={m['about.usage']()} />

	<div class="max-w-none">
		<h2>{m['about.bookmarklet.title']()}</h2>
		<CodeBlock class="mb-4" code={bookmarkletScript} language="js" />
		<Markdown content={m['about.bookmarklet.steps']()} />
		<img
			src="img/chuni-net-viewer-button.png"
			alt="Chuni Net Viewer Button"
			class="mx-auto mb-4 block w-lg"
		/>
		<Markdown content={m['about.bookmarklet.afterward']()} />
	</div>
</div>
