<script lang="ts">
	import '../app.css'

	let { children } = $props()
</script>

<div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
	{@render children()}
</div>
