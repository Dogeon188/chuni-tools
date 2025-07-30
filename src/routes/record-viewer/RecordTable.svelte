<script lang="ts">
	import { recordSorts } from '$lib/chuninet/record'
	import { m } from '$lib/paraglide/messages'
	import { _page } from './+page'
	import { showOverPower, showPlayCount } from './preference'
	import RecordTableItem from './RecordTableItem.svelte'

	let { records }: { records: ParsedRecord[] } = $props()

	let sortBy = $state('rating')
	let sortReverse = $state(false)

	const sortedRecords = $derived(
		records.toSorted(
			sortReverse ? (a, b) => -recordSorts[sortBy](a, b) : recordSorts[sortBy]
		)
	)

	type Column = {
		name: string
		sortBy: string
		noSortArrow?: boolean
		hidden?: boolean
	}

	const columns: Column[] = $derived([
		{ name: 'order', sortBy: 'rating', noSortArrow: true },
		{ name: 'title', sortBy: 'title' },
		{ name: 'play_order', sortBy: 'playOrder', hidden: $_page !== 'history' },
		{ name: 'const', sortBy: 'const' },
		{
			name: 'rank',
			sortBy: 'score',
			hidden: $showOverPower !== 'hide',
			noSortArrow: true
		},
		{ name: 'overpower', sortBy: 'op', hidden: $showOverPower !== 'value' },
		{
			name: 'overpower_percent',
			sortBy: 'opp',
			hidden: $showOverPower !== 'percent'
		},
		{ name: 'score', sortBy: 'score' },
		{ name: 'rating', sortBy: 'rating' },
		{ name: 'clear', sortBy: 'aj', hidden: $_page === 'recent' },
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
		rank: m['viewer.table.rank'](),
		overpower: m['viewer.table.overpower'](),
		overpower_percent: m['viewer.table.overpower_percent'](),
		score: m['viewer.table.score'](),
		rating: m['viewer.table.rating'](),
		clear: m['viewer.table.clear'](),
		play_count: m['viewer.table.play_count']()
	}
</script>

<div class="w-full overflow-x-auto">
	<table class="w-full text-center text-xs md:text-base">
		<thead>
			<tr>
				{#each columns as column}
					{#if !column.hidden}
						<th
							class="cursor-pointer whitespace-nowrap select-none hover:text-textc-normal"
							class:text-textc-normal={sortBy === column.sortBy}
							class:text-textc-dim={sortBy !== column.sortBy}
							onclick={() => {
								sortReverse =
									sortBy === column.sortBy ? !sortReverse : false
								sortBy = column.sortBy
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
			{#each sortedRecords as record (record.order)}
				<RecordTableItem {record} />
			{/each}
		</tbody>
	</table>
</div>

<!-- Dummy elements for SSR to recognize difficulty color classes -->
<div class="hidden">
	<div class="text-diff-bas">Basic</div>
	<div class="text-diff-adv">Advanced</div>
	<div class="text-diff-exp">Expert</div>
	<div class="text-diff-mas">Master</div>
	<div class="text-diff-ult">Ultima</div>

	<div class="text-rank-sss">SSS</div>
	<div class="text-rank-s">S</div>
	<div class="text-rank-a">A</div>
	<div class="text-rank-b">B</div>
</div>

<style>
	th {
		padding: 0.5rem 0.25rem;
	}
</style>
