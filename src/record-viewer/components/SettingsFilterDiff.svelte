<script lang="ts">
    import { filterDiff } from "../config"
    import { t } from "../i18n"
    import { difficulties } from "@/common/song"
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
            <label>
                <input
                    type="checkbox"
                    value={diff.toLowerCase()}
                    bind:checked={$filterDiff[diff]} />
                <div class="btn" data-diff={diff}>{diff}</div>
            </label>
        {/each}
    </div>
    <span style="color:var(--theme-text-dim)">
        {@html $t("settings.filter.diff.notify")}
    </span>
</div>

<style lang="sass">
    .wrapper   
        display: flex
        flex-direction: column
        padding: .5rem
        gap: 1rem
    .btns
        display: flex
        flex-direction: row
        gap: .5rem
        user-select: none
    label
        flex-grow: 1
        display: flex
    input
        width: 0
        height: 0
        opacity: 0
        &:not(:checked) + .btn
            filter: brightness(.5)
            &:hover
                filter: brightness(.8)
    .btn
        width: 100%
        padding: .5rem
        border-radius: .5rem
        background-color: var(--theme-bg-sub)
        text-align: center
        font-weight: bold
        cursor: pointer
        transition: .2s
        color: var(--theme-text-control)
        border: 4px solid var(--theme-bg-control)
        @each $diff in ("ULT", "MAS", "EXP", "ADV", "BAS")
            &[data-diff="#{$diff}"]
                // border: 4px solid var(--theme-song-#{to-lower-case($diff)})
                color: var(--theme-song-#{to-lower-case($diff)})
</style>
