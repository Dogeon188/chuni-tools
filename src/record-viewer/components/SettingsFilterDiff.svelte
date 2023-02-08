<script lang="ts">
    import { difficulties } from "@/common/song"
    import { filterDiff } from "../config"
    import { fetchingSomething$, t } from "../store"
</script>

<div class="wrapper">
    <span>
        {@html $t("settings.filter.diff")}
        {#if Object.values($filterDiff).every((i) => i == false)}
            <span style="color:var(--theme-text-dim)">
                {@html $t("settings.filter.diff.warn")}
            </span>
        {/if}
    </span>
    <div class="btns">
        {#each difficulties as diff}
            <button
                type="button"
                class:activated={$filterDiff[diff]}
                disabled={$fetchingSomething$}
                data-diff={diff}
                on:click={() => {
                    $filterDiff[diff] = !$filterDiff[diff]
                }}>{diff}</button>
        {/each}
    </div>
    <span style="color:var(--theme-text-dim)">
        {@html $t("settings.filter.diff.notify")}
    </span>
</div>

<style lang="sass">
    .wrapper   
        display: flex
        -ms-flex-direction: column
        flex-direction: column
        padding: .5em
        gap: 1rem
    .btns
        display: flex
        -ms-flex-direction: row
        flex-direction: row
        gap: .5em
    button
        width: 100%
        padding: .5em
        border-radius: .5em
        background-color: var(--theme-bg-sub)
        border: 3px solid var(--theme-control)
        filter: brightness(.5)
        &[disabled]
            cursor: no-drop
            border: 3px solid var(--theme-bg-sub)
        &:hover
            filter: brightness(.8)
        &.activated
            filter: brightness(1)
        @each $diff in ("ULT", "MAS", "EXP", "ADV", "BAS")
            &[data-diff="#{$diff}"]
                color: var(--theme-song-#{to-lower-case($diff)})
</style>
