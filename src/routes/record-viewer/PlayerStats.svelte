<script lang="ts">
	import { calcBestN } from '$lib/chuninet/rating'
	import Loader from '$lib/components/Loader.svelte'
	import { floorToFixed } from '$lib/numeric'
	import { _page } from './+page'
	import { bestRecord, playHistory, playerStats } from './fetched'
	import { currentVersionId } from './preference'

	const oldVersionRecords = $derived(
		$bestRecord.filter((v) => v.version != $currentVersionId)
	)
	const currentVersionRecords = $derived(
		$bestRecord.filter((v) => v.version == $currentVersionId)
	)
	const bestRating = $derived(oldVersionRecords.slice(0, 30).map((s) => s.rating))
	const currentRating = $derived(
		currentVersionRecords.slice(0, 20).map((s) => s.rating)
	)
	const historyRating = $derived($playHistory.map((s) => s.rating))
</script>

<div class="card flex flex-row items-center justify-center gap-16">
	{#if $playerStats}
		<div class="flex max-w-1/2 flex-col">
			<div class="flex flex-row justify-center gap-4">
				<h3 class="whitespace-nowrap">{$playerStats.name}</h3>
				<h3>{$playerStats.rating}</h3>
			</div>
			<div
				class="flex flex-col justify-center gap-2 text-center text-xs md:text-sm">
				{#each $playerStats.honors as honor}
					{#if honor !== null}
						<div class="w-full rounded-md bg-bgc-dim px-1 py-1">
							<span class="text-honor-{honor.color}">
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
		<div class="flex w-fit flex-col text-sm md:text-base whitespace-nowrap">
			<div class="flex flex-row justify-between gap-8">
				<span class="text-textc-info">Generated At</span>
				<span class="stats-item-content">
					{new Date().toLocaleDateString()}
				</span>
			</div>
			<div class="flex flex-row justify-between gap-4">
				<span class="text-textc-info">Best 30</span>
				<span class="stats-item-content">
					{floorToFixed(calcBestN(bestRating, 30) / 100, 4)}
				</span>
			</div>
			<div class="flex flex-row justify-between gap-4">
				<span class="text-textc-info">Current 20</span>
				<span class="stats-item-content">
					{floorToFixed(calcBestN(currentRating, 20) / 100, 4)}
				</span>
			</div>
			{#if $_page === 'best'}
				<div class="flex flex-row justify-between gap-4">
					<span class="text-textc-info no-underline">Best 30</span>
					<span class="stats-item-content">
						{floorToFixed(calcBestN(bestRating, 30) / 100, 4)}
					</span>
				</div>
			{:else if $_page === 'recent' || $_page === 'history'}
				<div class="flex flex-row justify-between gap-4">
					<span class="text-textc-info no-underline">History 30</span>
					<span class="stats-item-content">
						{floorToFixed(calcBestN(historyRating, 30) / 100, 4)}
					</span>
				</div>
			{/if}
		</div>
	{:else}
		<Loader />
	{/if}
</div>

<!-- Dummy elements for SSR to recognize honor color classes -->
<div class="invisible">
	<span class="text-honor-normal">Normal</span>
	<span class="text-honor-bronze">Bronze</span>
	<span class="text-honor-silver">Silver</span>
	<span class="text-honor-gold">Gold</span>
	<span class="text-honor-platina">Platina</span>
	<span class="text-honor-rainbow">Rainbow</span>
</div>
