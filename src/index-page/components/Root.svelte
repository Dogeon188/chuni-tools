<script lang="ts">
    import { theme, language } from "@/common/config"
    import { t, translationNames } from "../store"
    import Intro from "./Intro.svelte"
    import HowToUse from "./HowToUse.svelte"
    import Select from "@/common/components/Select.svelte"
</script>

<svelte:head>
    <link rel="stylesheet" href="../common/styles/common.css" />
    <link rel="stylesheet" href="../common/styles/theme-{$theme}.css" />
    <title>{$t("main.title")}</title>
</svelte:head>

<main>
    <Select bind:value={$language} label={$t("main.chooseLang")}>
        {#each language.accepts as l}
            <option value={l}>{translationNames.get(l)}</option>
        {/each}
    </Select>
    <p><Intro /></p>
    <p><HowToUse /></p>
</main>

<style lang="sass">
    :global(img)
        max-width: 100%
        max-height: 50vh
        display: block
        margin: 1em auto
        border-radius: 1em
    main
        padding: 2em
        max-width: 600px
        margin: auto
</style>
