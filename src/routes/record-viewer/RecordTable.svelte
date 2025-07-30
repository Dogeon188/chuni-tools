<script lang="ts">
	import { ranksMap } from '$lib/chuninet/rating'
	import { recordSorts } from '$lib/chuninet/record'
	import { m } from '$lib/paraglide/messages'
	import { _page } from './+page'
	import { showOverPower, showPlayCount } from './preference'

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

	function rankColor(score: number): string {
		if (score >= ranksMap['SSS']) return 'rank-sss'
		if (score >= ranksMap['S']) return 'rank-s'
		if (score >= ranksMap['A']) return 'rank-a'
		if (score >= ranksMap['B']) return 'rank-b'
		return 'textc-muted'
	}
</script>

<div class="w-full overflow-x-auto">
	<table
		class="w-full text-center text-xs md:text-base">
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
				<tr
					class="gap-2 border-t border-bgc-accent"
					class:ajc={record.score >= 1010000}>
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
					{:else if $showOverPower === 'percent'}
						<!-- Over Power Percent -->
						<td>
							{record.opPercent.toPrecision(5)}<!--
						--><span
								class="text-xs text-textc-dim">%</span>
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
						<td>{record.playCount}</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Dummy elements for SSR to recognize difficulty color classes -->
<div class="invisible">
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
	th,
	td {
		padding: 0.5rem 0.25rem;
	}

	.ajc .ajc-glow {
		text-shadow: 0 0 10px var(--color-clear-aj);
	}
</style>
