<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import '../app.css'

	let { children } = $props()
</script>

<div class="flex min-h-screen flex-col">
	<main class="flex-1 px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>
	<Footer />
</div>
