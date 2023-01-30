<script context="module">
    import { floorAndToFixed2 } from "@/common/number"
    import { calcBestN, calcMaxPossible } from "@/common/rating"
    import { bestRecord$, page$, playHistory$, recentRecord$ } from "../store"
    import PlayerStatsItem from "./PlayerStatsItem.svelte"
    import { t } from "../i18n"
    import { playerStats$ } from "../store"
</script>

<script lang="ts">
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
    <div class="stats-honor" data-honor={$playerStats$.honor.color}>
        {$playerStats$.honor.text}
    </div>
    <div class="stats-items">
        <PlayerStatsItem
            title={$t("player.generic.generatedAt")}
            content={new Date().toLocaleDateString()} />
        {#if $page$ === "best"}
            <PlayerStatsItem
                title={$t("player.best.best30")}
                content={calcBestN(bestRating$$, 30).toFixed(4)} />
            <PlayerStatsItem
                title={$t("player.best.maxPossible")}
                content={floorAndToFixed2(calcMaxPossible(bestRating$$))} />
            <PlayerStatsItem
                title={$t("player.best.playCount")}
                content={$playerStats$.playCount} />
        {:else if $page$ === "recent" || $page$ === "history"}
            <PlayerStatsItem
                title={$t("player.recent.best10")}
                content={calcBestN(recentRating$$, 10).toFixed(4)} />
            <PlayerStatsItem
                title={$t("player.recent.history10")}
                content={calcBestN(historyRating$$, 10).toFixed(4)} />
            <PlayerStatsItem
                title={$t("player.recent.history30")}
                content={calcBestN(historyRating$$, 30).toFixed(4)} />
        {/if}
    </div>
</div>

<style lang="sass">
    .wrapper
        border: var(--theme-border) 3px solid
        border-radius: 0.5rem
        background-color: var(--theme-bg-sub)
        width: fit-content
        max-width: 600px
        padding: 0.5rem
        margin: 0.5rem
        display: grid
        align-items: center
        justify-items: center
        width: calc(100% - 2rem - 6px)
    .stats-name
        grid-column: 1
        width: auto
        white-space: nowrap
    .stats-rating
        grid-column: 2
        display: flex
        flex-direction: column
        gap: .5rem
        h2
            margin: 0
            text-align: center
            width: fit-content
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
        white-space: nowrap
        @each $t in ("normal", "bronze", "silver", "gold", "platina", "rainbow")
            &[data-honor=#{$t}]
                color: var(--theme-honor-#{$t})
    .stats-items
        width: fit-content
        display: grid
        grid-template-areas: "... ..."
        grid-area: 1/3/3/4
        gap: 5px
        padding: 5px
    @media only screen and (max-width: 544px) 
        .stats-name
            width: 50%
            margin: auto
        .stats-rating
            grid-column: 1
        .stats-items
            grid-area: 1/2/3/3
            max-width: fit-content
        .stats-honor
            grid-area: 3/1/4/3
        //     grid-template-areas: "... ... ... ..."
        //     justify-self: center
        //     width: 100%
        //     justify-content: space-evenly
</style>
