<script lang="ts">
	import { recordSorts } from '$lib/chuninet/record'
	import { m } from '$lib/paraglide/messages'
	import { _page } from './+page'
	import { showOverPower, showPlayCount } from './preference'

	let { records }: { records: ParsedRecord[] } = $props()

	let sortBy = $state('rating')
	let sortReverse = $state(false)

	type Column = {
		name: string
		sortBy: string
		noSortArrow?: boolean
		hidden?: boolean
	}

	const sortedRecords = $derived(records.toSorted((a, b) => recordSorts[sortBy](a, b)))
	const reversedRecords = $derived(
		sortReverse ? sortedRecords.toReversed() : sortedRecords
	)

	const columns: Column[] = $derived([
		{ name: 'order', sortBy: 'rating', noSortArrow: true },
		{ name: 'play_order', sortBy: 'playOrder', hidden: $_page !== 'history' },
		{ name: 'title', sortBy: 'title' },
		{ name: 'const', sortBy: 'const' },
		{
			name: 'overpower_percent',
			sortBy: 'opp',
			hidden: $showOverPower !== 'percent'
		},
		{ name: 'overpower', sortBy: 'op', hidden: $showOverPower !== 'value' },
		{ name: 'score', sortBy: 'score' },
		{ name: 'rating', sortBy: 'rating' },
		{ name: 'clear', sortBy: 'aj' },
		{
			name: 'play_count',
			sortBy: 'playCount',
			hidden: !$showPlayCount || $_page !== 'best'
		}
	])

	const columnHeaderTexts: Record<string, string> = {
		order: m['viewer.table.order'](),
		play_order: m['viewer.table.play_order'](),
		title: m['viewer.table.title'](),
		const: m['viewer.table.const'](),
		overpower_percent: m['viewer.table.overpower_percent'](),
		overpower: m['viewer.table.overpower'](),
		score: m['viewer.table.score'](),
		rating: m['viewer.table.rating'](),
		clear: m['viewer.table.clear'](),
		play_count: m['viewer.table.play_count']()
	}
</script>

<table class="w-full text-center">
	<thead>
		<tr>
			{#each columns as column}
				{#if !column.hidden}
					<th
						class="cursor-pointer whitespace-nowrap select-none"
						onclick={() => {
							sortBy = column.sortBy
							sortReverse = !sortReverse
						}}>
						{#if column.sortBy && !column.noSortArrow}
							<span class="sort-arrow">
								{sortBy === column.sortBy
									? sortReverse
										? '▲'
										: '▼'
									: ''}
							</span>
						{/if}
						{columnHeaderTexts[column.name]}
					</th>
				{/if}
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each reversedRecords as record (record.order)}
			<tr class="gap-2 border-t border-bgc-accent">
				<td>{record.order}</td>
				<td colspan={$_page === 'history' ? 2 : 1}>
					{record.title}
					<span class="text-xs text-diff-{record.difficulty.toLowerCase()}">
						{record.difficulty}
					</span>
				</td>
				<td>{record.const}</td>
				{#if $showOverPower === 'percent'}
					<td>
						{record.opPercent.toPrecision(5)}<!--
						--><span
							class="text-xs text-textc-dim">%</span>
					</td>
				{:else if $showOverPower === 'value'}
					<td class="whitespace-nowrap">
						{record.const < 0
							? '-'
							: (record.op / 10000).toFixed(2)}<!--
						--><span
							class="text-xs text-textc-dim">
							&#xFF0F;<!-- 
							-->{record.const < 0
								? '-'
								: (record.opMax / 10000).toFixed(1)}
						</span>
					</td>
				{/if}
				<td>{record.score}</td>
				<td>
					{record.const < 0 ? '-' : (record.const?.toFixed(1) ?? '??.?')}
					{#if !record.constUncertain}
						<span class="text-xs text-textc-dim">?</span>
					{/if}
				</td>
				<td>{record.clear}</td>
				{#if $showPlayCount && $_page === 'best'}
					<td>{record.playCount}</td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>

<!-- Dummy elements for SSR to recognize difficulty color classes -->
<div class="invisible">
	<div class="text-diff-bas">Basic</div>
	<div class="text-diff-adv">Advanced</div>
	<div class="text-diff-exp">Expert</div>
	<div class="text-diff-mas">Master</div>
	<div class="text-diff-ult">Ultima</div>
</div>

<style>
	th,
	td {
		padding: 0.5rem;
	}
</style>
