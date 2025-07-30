<script lang="ts">
	import { ranksMap } from '$lib/chuninet/rating'
	import { requestFor } from '$lib/cwr'
	import logger from '$lib/logger'
	import { _page } from './+page'
	import { showOverPower, showPlayCount } from './preference'

	let { record }: { record: ParsedRecord } = $props()

	function rankColor(score: number): string {
		if (score >= ranksMap['SSS']) return 'rank-sss'
		if (score >= ranksMap['S']) return 'rank-s'
		if (score >= ranksMap['A']) return 'rank-a'
		if (score >= ranksMap['B']) return 'rank-b'
		return 'textc-muted'
	}

	let playCount: number | null | undefined = $state(record.playCount)
</script>

<tr class="gap-2 border-t border-bgc-accent" class:ajc={record.score >= 1010000}>
	<!-- Order by Rating -->
	<td
		class:text-rank-sss={record.order <= 30}
		class:text-textc-muted={record.order > 40}>
		{record.order}
	</td>

	<!-- Song Title -->
	<td
		class="max-w-48 overflow-hidden text-left
	 text-nowrap overflow-ellipsis md:max-w-60 lg:max-w-72 xl:max-w-96"
		colspan={$_page === 'history' ? 2 : 1}>
		<span class="text-xs text-diff-{record.difficulty.toLowerCase()}">
			{record.difficulty}
		</span>
		{record.title}
	</td>

	<!-- Chart Constant -->
	<td class="whitespace-nowrap">
		{record.const.toFixed(1)}
		{#if record.constUncertain}
			<span class="text-xs text-textc-dim">?</span>
		{/if}
	</td>

	{#if $showOverPower === 'hide'}
		<!-- Rank -->
		<td class="ajc-glow text-{rankColor(record.score)}">
			{record.score < 0 ? '-' : record.rank}
		</td>
	{:else if $showOverPower === 'value'}
		<!-- Over Power Value -->
		<td class="whitespace-nowrap">
			{record.const < 0 ? '-' : (record.op / 10000).toFixed(2)}<!--
			--><span
				class="text-xs text-textc-dim">
				&#xFF0F;<!-- 
				-->{record.const < 0
					? '-'
					: (record.opMax / 10000).toFixed(1)}
			</span>
		</td>
	{:else if $showOverPower === 'percent'}
		<!-- Over Power Percent -->
		<td>
			{record.opPercent.toPrecision(5)}<!--
		--><span class="text-xs text-textc-dim"
				>%</span>
		</td>
	{/if}

	<!-- Score -->
	<td class="ajc-glow">{record.score < 0 ? '-' : record.score}</td>

	<!-- Rating -->
	<td>
		{record.const < 0 || record.score == -1
			? '-'
			: record.rating == null
				? '??.??'
				: (record.rating / 100).toFixed(2)}
	</td>

	<!-- Clear -->
	{#if $_page !== 'recent'}
		<td
			class="ajc-glow font-bold"
			class:text-clear-fc={record.clear == 'FC'}
			class:text-clear-aj={record.clear == 'AJ'}>
			{record.clear}
		</td>
	{/if}

	<!-- Play Count -->
	{#if $showPlayCount && $_page === 'best'}
		{#key playCount}
			{#if record.playCount === undefined}
				<td
					class="cursor-pointer"
					onclick={() => {
						if (playCount !== undefined) return
						playCount = null
						requestFor('songPlayCount', record.difficulty, record.idx)
							.then((pc) => {
								record.playCount = playCount = pc
							})
							.catch(() => {
								record.playCount = null
								logger.log(
									`Failed to fetch play count for ${record.title} (${record.difficulty})`
								)
							})
					}}>
					<span class="rounded bg-bgc-normal">&emsp;</span>
				</td>
			{:else}
				<td>{record.playCount ?? '?'}</td>
			{/if}
		{/key}
	{/if}
</tr>

<style>
	td {
		padding: 0.5rem 0.25rem;
	}

	.ajc .ajc-glow {
		text-shadow: 0 0 10px var(--color-clear-aj);
	}
</style>
