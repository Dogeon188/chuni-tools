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
            <label>
                <input
                    type="checkbox"
                    value={g}
                    bind:checked={$filterGenre[g]}
                    on:change={() => {
                        allGenre = genres.every((v) => $filterGenre[v])
                    }} />
                <div class="btn">{g}</div>
            </label>
        {/each}
        <label class="btn-all">
            <input
                type="checkbox"
                value="ALL"
                bind:checked={allGenre}
                on:change={(e) => {
                    for (let genre of genres) {
                        $filterGenre[genre] = e.currentTarget.checked
                    }
                }} />
            <div class="btn">{$t("settings.filter.genre.all")}</div>
        </label>
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
    label
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
        user-select: none
        transition: .2s
        color: var(--theme-text-control)
        border: 4px solid var(--theme-bg-control)
    .btn-all
        grid-column: 2 / 4
        .btn
            border-color: #b61
</style>
