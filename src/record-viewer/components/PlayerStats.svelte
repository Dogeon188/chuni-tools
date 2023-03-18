<script lang="ts">
    import { floorToFixed } from "@/common/number"
    import { calcBestN, calcMaxPossible } from "@/common/rating"
    import {
        bestRecord$,
        page$,
        playHistory$,
        recentRecord$,
        playerStats$,
        t,
    } from "../store"
    import PlayerStatsItem from "./PlayerStatsItem.svelte"
    $: bestRating$$ = $bestRecord$.slice(0, 30).map((s) => s.rating)
    $: recentRating$$ = $recentRecord$.map((s) => s.rating)
    $: historyRating$$ = $playHistory$.map((s) => s.rating)
</script>

<div class="wrapper">
    <h2 class="stats-name">{$playerStats$.name}</h2>
    <div class="stats-rating">
        <h2>{$playerStats$.rating}</h2>
        <span>MAX {$playerStats$.ratingMax}</span>
    </div>
    <div class="stats-honor" data-honor={$playerStats$.honor.color} class:marquee={true}>
        <span>{$playerStats$.honor.text}</span>
    </div>
    <div class="stats-items">
        <PlayerStatsItem
            title={$t("player.generic.generatedAt")}
            content={new Date().toLocaleDateString()} />
        {#if $page$ === "best"}
            <PlayerStatsItem
                title={$t("player.best.best30")}
                content={floorToFixed(calcBestN(bestRating$$, 30) / 100, 4)} />
            <PlayerStatsItem
                title={$t("player.best.maxPossible")}
                content={floorToFixed(calcMaxPossible(bestRating$$) / 100, 2)} />
            <PlayerStatsItem
                title={$t("player.best.playCount")}
                content={$playerStats$.playCount} />
        {:else if $page$ === "recent" || $page$ === "history"}
            <PlayerStatsItem
                title={$t("player.recent.best10")}
                content={floorToFixed(calcBestN(recentRating$$, 10) / 100, 4)} />
            <PlayerStatsItem
                title={$t("player.recent.history10")}
                content={floorToFixed(calcBestN(historyRating$$, 10) / 100, 4)} />
            <PlayerStatsItem
                title={$t("player.recent.history30")}
                content={floorToFixed(calcBestN(historyRating$$, 30) / 100, 4)} />
        {/if}
    </div>
</div>

<style lang="sass">
    .wrapper
        border: var(--theme-border) 3px solid
        border-radius: 0.5rem
        background-color: var(--theme-bg-sub)
        box-sizing: border-box
        width: 100%
        max-width: 600px
        padding: 0.5rem
        margin: 0.5rem
        display: -ms-grid
        display: grid
        align-items: center
        justify-items: center
        overflow-x: scroll
        &::-webkit-scrollbar
            display: none
    .stats-name
        grid-column: 1
        width: auto
        white-space: nowrap
    .stats-rating
        grid-column: 2
        display: flex
        -ms-flex-direction: column
        flex-direction: column
        h2
            margin: auto
        span
            color: var(--theme-text-dim)
    .stats-honor
        grid-area: 2/1/3/3
        color: var(--theme-honor-normal)
        font-weight: bold
        background: var(--theme-bg-main)
        border-radius: 3px
        padding: 5px 2rem
        margin: 0 20px
        width: -webkit-fill-available
        text-align: center
        @each $t in ("normal", "bronze", "silver", "gold", "platina", "rainbow")
            &[data-honor=#{$t}]
                color: var(--theme-honor-#{$t})
    .stats-items
        width: -moz-fit-content
        width: fit-content
        display: -ms-grid
        display: grid
        grid-template-areas: "... ..."
        grid-area: 1/3/3/4
        gap: 5px
        padding: 5px
    @media only screen and (max-width: 544px)
        .stats-name
            margin: auto
        .stats-rating
            grid-column: 1
        .stats-items
            grid-area: 1/2/3/3
            max-width: -moz-fit-content
            max-width: fit-content
        .stats-honor
            grid-area: 3/1/4/3
</style>
