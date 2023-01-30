<script lang="ts">
    import { showOverPower, showPlayCount } from "../config"
    import { page$ } from "../store"
    import RecordItem from "./RecordItem.svelte"
    import { t } from "../i18n"
    import { recordSorts } from "@/record-viewer/record"
    import RankCounts from "./RankCounts.svelte"
    // import OverpowerStatus from "./OverpowerStatus.svelte"
    export let playRecord: ParsedRecord[]
    export let title: string | undefined = undefined

    let sortBy = "rating"
    let sortReverse = false

    $: processedRecord$$ = playRecord.sort(recordSorts[sortBy])

    $: rankCounts$$ = (() => {
        let rs = {} as Record<string, number>
        ;["MAX", "SSS+", "SSS", "SS+", "SS", "S+", "S"].forEach((e) => (rs[e] = 0))
        ;["AAA", "AA", "A", "BBB", "BB", "B", "C", "D"].forEach((e) => (rs[e] = 0))
        for (const r of processedRecord$$) rs[r.rank]++
        Object.keys(rs).reduce((pre, cur) => ((rs[cur] += rs[pre]), cur))
        return rs
    })()
    $: ajCount$$ = processedRecord$$.filter((v) => v.clear == "AJ").length
    $: fcCount$$ = ajCount$$ + processedRecord$$.filter((v) => v.clear == "FC").length

    $: ths$$ = [
        { display: "order", sort: "rating", notcur: true },
        { display: "playOrder", sort: "playOrder", condition: $page$ === "history" },
        { display: "title", sort: "title" },
        { display: "const", sort: "const" },
        { display: "overpower", sort: "op", condition: $showOverPower },
        { display: "overpowerPercent", sort: "opp", condition: $showOverPower },
        { display: "rank", sort: "score", condition: !$showOverPower, notcur: true },
        { display: "score", sort: "score", condition: !$showOverPower },
        { display: "rating", sort: "rating" },
        {
            display: "ajfc",
            sort: "aj",
            condition: $page$ === "history" || $page$ === "best",
        },
        {
            display: "playcount",
            sort: "playcount",
            condition: $showPlayCount && $page$ === "best",
        },
    ]
</script>

{#if $showOverPower}
    {#if $page$ === "best"}
        <!-- <OverpowerStatus /> -->
    {/if}
{:else}
    <RankCounts
        ajCount={ajCount$$}
        fcCount={fcCount$$}
        rankCounts={rankCounts$$}
        total={processedRecord$$.length} />
{/if}
<table>
    <thead>
        {#if title}
            <td colspan="7" class="title">{title}</td>
        {/if}
        <tr class:reversed={sortReverse}>
            {#each ths$$ as elt}
                {#if elt.condition ?? true}
                    <th
                        tabindex="0"
                        class:cur-sort={!elt.notcur && elt.sort == sortBy}
                        on:click={() => {
                            if (sortBy === elt.sort) {
                                processedRecord$$ = processedRecord$$.reverse()
                                sortReverse = !sortReverse
                            } else {
                                sortBy = elt.sort
                                sortReverse = false
                            }
                        }}
                        on:keypress={(e) => {
                            if (e.code === "Enter" || e.code === "Space") {
                                if (sortBy === elt.sort) {
                                    processedRecord$$ = processedRecord$$.reverse()
                                    sortReverse = !sortReverse
                                } else {
                                    sortBy = elt.sort
                                    sortReverse = false
                                }
                            }
                        }}>
                        {@html $t("record.head." + elt.display)}
                    </th>
                {/if}
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each processedRecord$$ as song}
            <RecordItem {song} />
        {/each}
    </tbody>
</table>

<style lang="sass">
    table
        border-spacing: 0
        width: 100%
        padding-bottom: 0.5rem
        max-width: max-content
        margin: auto
    th
        padding: 0.5rem
        color: var(--theme-text-dim)
        cursor: pointer
        -webkit-user-select: none
        user-select: none
    th:not(.cur-sort):hover
        color: inherit
        filter: brightness(.9)
    th.cur-sort
        filter: brightness(1)
        color: inherit
        white-space: nowrap
    th.cur-sort::before
        color: var(--theme-text-dim)
        content: "▼ "
    .reversed th.cur-sort::before
        content: "▲ "
    td.title
        font-weight: bold
        color: var(--theme-label)
        text-align: center
</style>
