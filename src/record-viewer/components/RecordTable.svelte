<script lang="ts">
    import {
        filterConstMin,
        filterConstMax,
        showOverPower,
        showPlayCount,
        filterGenre,
        filterDiff,
    } from "../config"
    import { page$ } from "../store"
    import RecordItem from "./RecordItem.svelte"
    import { Genre, genres } from "@/common/song"
    import { t } from "../i18n"
    import { recordSorts } from "@/record-viewer/record"
    import RankCounts from "./RankCounts.svelte"
    import OverpowerStatus from "./OverpowerStatus.svelte"
    export let playRecord: ParsedRecord[]
    export let title: string | undefined = undefined

    let sortBy = "rating"
    let sortReverse = false

    $: processedRecord = (
        $page$ === "best"
            ? playRecord.filter((v) => {
                  return (
                      $filterDiff[v.difficulty] &&
                      $filterGenre[genres.find((g) => Genre[g] == v.genre)!] &&
                      $filterConstMax >= v.const &&
                      v.const >= $filterConstMin
                  )
              })
            : playRecord
    ).sort(recordSorts[sortBy])

    $: rankCounts = (() => {
        let rs = {} as Record<string, number>
        ;["MAX", "SSS+", "SSS", "SS+", "SS", "S+", "S"].forEach((e) => (rs[e] = 0))
        ;["AAA", "AA", "A", "BBB", "BB", "B", "C", "D"].forEach((e) => (rs[e] = 0))
        for (const r of processedRecord) rs[r.rank]++
        Object.keys(rs).reduce((pre, cur) => ((rs[cur] += rs[pre]), cur))
        return rs
    })()
    $: ajCount = processedRecord.filter((v) => v.clear == "AJ").length
    $: fcCount = ajCount + processedRecord.filter((v) => v.clear == "FC").length

    function thOnClick(s: string) {
        return () => {
            if (sortBy === s) {
                processedRecord = processedRecord.reverse()
                sortReverse = !sortReverse
            } else {
                sortBy = s
                sortReverse = false
            }
        }
    }
</script>

{#if $showOverPower}
    {#if $page$ === "best"}
        <!-- <OverpowerStatus /> -->
    {/if}
{:else}
    <RankCounts {ajCount} {fcCount} {rankCounts} total={processedRecord.length} />
{/if}
<table>
    <thead>
        {#if title}
            <td colspan="7" class="title">{title}</td>
        {/if}
        <tr class:reversed={sortReverse}>
            <th on:click={thOnClick("rating")}>#</th>
            <th class:cur-sort={"title" == sortBy} on:click={thOnClick("title")}>
                {@html $t("record.head.title")}
            </th>
            <th class:cur-sort={"const" == sortBy} on:click={thOnClick("const")}>
                {@html $t("record.head.const")}
            </th>
            {#if $showOverPower}
                <th class:cur-sort={"op" == sortBy} on:click={thOnClick("op")}>
                    {@html $t("record.head.overpower")}
                </th>
                <th class:cur-sort={"opp" == sortBy} on:click={thOnClick("opp")}>
                    {@html $t("record.head.overpowerPercent")}
                </th>
            {:else}
                <th on:click={thOnClick("score")}>
                    {@html $t("record.head.rank")}
                </th>
                <th class:cur-sort={"score" == sortBy} on:click={thOnClick("score")}>
                    {@html $t("record.head.score")}
                </th>
            {/if}
            <th class:cur-sort={"rating" == sortBy} on:click={thOnClick("rating")}>
                {@html $t("record.head.rating")}</th>
            {#if $page$ === "history" || $page$ === "best"}
                <th class:cur-sort={"aj" == sortBy} on:click={thOnClick("aj")}>
                    {@html $t("record.head.ajfc")}
                </th>
            {/if}
            {#if $showPlayCount && $page$ === "best"}
                <th
                    class:cur-sort={"playcount" == sortBy}
                    on:click={thOnClick("playcount")}
                    >{@html $t("record.head.playcount")}</th>
            {/if}
        </tr>
    </thead>
    <tbody>
        {#each processedRecord as song}
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
        user-select: none
    th:not(.cur-sort):hover
        color: inherit
        filter: brightness(.9)
    th.cur-sort
        filter: brightness(1)
        color: inherit
    th.cur-sort::before
        content: "▼"
    .reversed th.cur-sort::before
        content: "▲"
    td.title
        font-weight: bold
        color: var(--theme-label)
        text-align: center
</style>
