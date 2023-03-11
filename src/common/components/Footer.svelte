<script lang="ts">
    import { language } from "../config"
    import type { getTranslator } from "../i18n"
    import type { Language } from "../lang"
    export let t: ReturnType<typeof getTranslator>
    export let translationNames: Map<Language, string>
</script>

<footer>
    <div>
        <label>
            {$t("footer.chooseLang")}
            <select bind:value={$language}>
                {#each language.accepts as l}
                    <option value={l}>{translationNames.get(l)}</option>
                {/each}
            </select>
        </label>
    </div>
    <div>{@html $t("footer.source")}</div>
</footer>

<style lang="sass">
    footer
        max-width: 600px
        margin: auto
        padding: 2em
        gap: .5em
        display: flex
        flex-direction: column
    select
        background: var(--theme-bg)
        color: inherit
</style>
