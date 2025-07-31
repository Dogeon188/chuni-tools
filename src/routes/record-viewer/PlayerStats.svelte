<script lang="ts">
	import { calcBestN } from '$lib/chuninet/rating'
	import Loader from '$lib/components/Loader.svelte'
	import { floorToFixed } from '$lib/numeric'
	import { m } from '$lib/paraglide/messages'
	import { _page } from './+page'
	import { bestRecord, playHistory, playerStats } from './fetched'
	import { currentVersionId } from './preference'

	const oldVersionRecords = $derived(
		$bestRecord.filter((v) => v.version != $currentVersionId)
	)
	const newVersionRecords = $derived(
		$bestRecord.filter((v) => v.version == $currentVersionId)
	)
	const oldVersionB30 = $derived(oldVersionRecords.slice(0, 30).map((s) => s.rating))
	const newVersionB20 = $derived(newVersionRecords.slice(0, 20).map((s) => s.rating))
	const recentB30 = $derived($playHistory.slice(0, 30).map((s) => s.rating))
</script>

<div
	class="card flex w-full max-w-full items-center justify-center gap-4 flex-row md:w-auto md:gap-8 lg:mx-auto lg:max-w-2/3"
>
	{#if $playerStats}
		<div class="flex flex-col max-w-1/2">
			<!-- Name & Rating -->
			<div class="flex flex-row justify-center gap-4">
				<h3 class="whitespace-nowrap">{$playerStats.name}</h3>
				<h3>{$playerStats.rating}</h3>
			</div>

			<!-- Honors -->
			<div
				class="flex flex-col justify-center gap-2 text-center text-xs md:text-sm"
			>
				{#each $playerStats.honors as honor}
					{#if honor !== null}
						<div class="overflow-clip rounded-md bg-bgc-dim px-1 py-1">
							<span
								class="font-bold text-honor-{honor.color} inline-block text-nowrap"
								class:animate-marquee={honor.text.length > 20}
							>
								{honor.text}
							</span>
						</div>
					{:else}
						<div class="w-full rounded-md bg-bgc-dim px-1 py-1">
							<span class="text-bgc-dim">&nbsp;</span>
						</div>
					{/if}
				{/each}
			</div>
		</div>

		<div
			class="grid w-fit grid-cols-2 gap-x-4 text-sm whitespace-nowrap md:grid-cols-[2fr_1fr] md:text-base"
		>
			<!-- Generated At -->
			<span class="text-right text-textc-info">
				{m['viewer.stats.generated_at']()}
			</span>
			<span class="text-left">
				{new Date().toLocaleDateString()}
			</span>

			<!-- New Version B20 -->
			<span class="text-right text-textc-info">
				{m['viewer.stats.current20']()}
			</span>
			<span class="text-left">
				{floorToFixed(calcBestN(newVersionB20, 20) / 100, 4)}
			</span>

			<!-- Old Version B30 -->
			<span class="text-right text-textc-info">
				{m['viewer.stats.old30']()}
			</span>
			<span class="text-left">
				{floorToFixed(calcBestN(oldVersionB30, 30) / 100, 4)}
			</span>

			{#if $_page === 'best'}
				<!-- Play Count -->
				<span class="text-right text-textc-info">
					{m['viewer.stats.play_count']()}
				</span>
				<span class="text-left">{$playerStats.playCount} </span>
			{:else if $_page === 'current' || $_page === 'recent'}
				<!-- Recent B30 -->
				<span class="text-right text-textc-info">
					{m['viewer.stats.recent30']()}
				</span>
				<span class="text-left">
					{floorToFixed(calcBestN(recentB30, 30) / 100, 4)}
				</span>
			{/if}
		</div>
	{:else}
		<Loader />
	{/if}
</div>

<!-- Dummy elements for SSR to recognize honor color classes -->
<div class="hidden">
	<span class="text-honor-normal">Normal</span>
	<span class="text-honor-bronze">Bronze</span>
	<span class="text-honor-silver">Silver</span>
	<span class="text-honor-gold">Gold</span>
	<span class="text-honor-platina">Platina</span>
	<span class="text-honor-rainbow">Rainbow</span>
</div>
