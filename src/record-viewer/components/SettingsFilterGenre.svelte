<script lang="ts">
    import { filterGenre } from "../config"
    import { t } from "../i18n"
    import { genres } from "@/common/song"
    let allGenre = genres.every((genre) => $filterGenre[genre])
</script>

<div class="wrapper">
    <span>{@html $t("settings.filter.genre")}</span>
    <div class="btns">
        {#each genres as g}
            <button
                type="button"
                class:activated={$filterGenre[g]}
                on:click={() => {
                    $filterGenre[g] = !$filterGenre[g]
                    allGenre = genres.every((v) => $filterGenre[v])
                }}>{g}</button>
        {/each}
        <button
            type="button"
            class="btn-all"
            class:activated={allGenre}
            on:click={() => {
                allGenre = !allGenre
                for (let genre of genres) {
                    $filterGenre[genre] = allGenre
                }
            }}>
            {$t("settings.filter.genre.all")}
        </button>
    </div>
</div>

<style lang="sass">
    .wrapper   
        display: flex
        flex-direction: column
        padding: .5rem
        gap: 1rem
    .btns
        display: grid
        grid-template-areas: "... ... ..."
        gap: .5rem
        flex-wrap: wrap
    button
        width: 100%
        padding: .5rem
        border-radius: .5rem
        background-color: var(--theme-bg-sub)
        border: 3px solid var(--theme-control)
        color: var(--theme-text-control)
        filter: brightness(.5)
        &:hover
            filter: brightness(.8)
        &.activated
            filter: brightness(1)
    .btn-all
        grid-column: 2 / 4
        border-color: var(--theme-control-altr)
</style>
