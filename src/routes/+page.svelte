<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { m } from '$lib/paraglide/messages.js'
	import { setLocale } from '$lib/paraglide/runtime'
</script>

<svelte:head>
	<title>{m['about.title']()}</title>
</svelte:head>
<div class="card mx-auto max-w-3xl">
	<div>
		# {@html m['about.title']()}
	</div>

	<div class="prose prose-lg max-w-none">
		<p>{@html m['about.intro.about']()}</p>
		<p>{@html m['about.intro.contact']()}</p>
	</div>

	<div class="mb-8">
		## Language Selection
		<div class="flex flex-wrap gap-3">
			<button onclick={() => setLocale('en')} class="btn btn-primary">
				{m['locale_name']({}, { locale: 'en' })}
				<!-- English -->
			</button>
			<button onclick={() => setLocale('zh-tw')} class="btn btn-success">
				{m['locale_name']({}, { locale: 'zh-tw' })}
				<!-- 繁體中文 -->
			</button>
			<button onclick={() => setLocale('jp')} class="btn btn-purple">
				{m['locale_name']({}, { locale: 'jp' })}
				<!-- 日本語 -->
			</button>
		</div>
	</div>
</div>
