<script lang="ts">
    import { showOverPower, showPlayCount } from "../config"
    import { page$, t } from "../store"
    import RecordItem from "./RecordItem.svelte"
    import { recordSorts } from "@/record-viewer/record"

    export let playRecord: ParsedRecord[]
    export let shown = false

    let sortBy: keyof typeof recordSorts = "rating"
    let sortReverse = false

    $: processedRecord$$ = playRecord.sort(
        sortReverse ? (a, b) => -recordSorts[sortBy](a, b) : recordSorts[sortBy]
    )

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

<div class="wrapper" hidden={!shown}>
    <table>
        <thead>
            <tr class:reversed={sortReverse}>
                {#each ths$$ as elt}
                    {#if elt.condition ?? true}
                        <th
                            tabindex="0"
                            class:cur-sort={!elt.notcur && elt.sort == sortBy}
                            on:click={() => {
                                if (sortBy === elt.sort) {
                                    sortReverse = !sortReverse
                                } else {
                                    sortBy = elt.sort
                                    sortReverse = false
                                }
                            }}
                            on:keypress={(e) => {
                                if (e.code === "Enter" || e.code === "Space") {
                                    if (sortBy === elt.sort) {
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
</div>

<style lang="sass">
    .wrapper
        width: 100%
        overflow-x: scroll
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
        -ms-user-select: none
        user-select: none
        white-space: nowrap
    th:not(.cur-sort):hover
        color: inherit
        filter: brightness(.9)
    th.cur-sort
        filter: brightness(1)
        color: inherit
    th.cur-sort::before
        color: var(--theme-text-dim)
        content: "▼ "
    .reversed th.cur-sort::before
        content: "▲ "
</style>
