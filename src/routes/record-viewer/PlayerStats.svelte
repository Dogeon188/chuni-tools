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
	class="card flex w-full max-w-full flex-col items-center justify-center gap-4 !p-4 md:w-auto md:gap-8 md:!p-8 lg:mx-auto lg:max-w-2/3"
>
	{#if $playerStats}
		<!-- Name & Rating -->
		<div class="flex flex-row items-end justify-center gap-4">
			<div class="text-xl font-bold whitespace-nowrap md:text-3xl">
				{$playerStats.name}
			</div>
			<div class="font-bold text-textc-dim md:text-xl">{$playerStats.rating}</div>
		</div>
		<div class="flex flex-col sm:flex-row items-center gap-4 max-w-full">
			<!-- Honors -->
			<div
				class="flex max-w-full sm:max-w-1/2 flex-col justify-center gap-2 text-center text-xs md:text-sm"
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

			<div
				class="grid min-w-1/2 grid-cols-2 gap-x-4 text-xs whitespace-nowrap sm:text-sm md:grid-cols-[2fr_1fr] md:text-base"
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
