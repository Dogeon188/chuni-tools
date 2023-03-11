<script lang="ts">
    import { language, theme } from "@/common/config"
    import { saveLanguage } from "@/common/lang"
    import Footer from "@/common/components/Footer.svelte"
    import { onMount } from "svelte"
    import { t, translationNames } from "../store"

    onMount(() => {
        saveLanguage($language)
    })
</script>

<svelte:head>
    <link rel="stylesheet" href="../../common/styles/common.css" />
    <link rel="stylesheet" href="../../common/styles/theme-{$theme}.css" />
    <title>{$t("main.title")}</title>
</svelte:head>

<main>
    <h1>WIP</h1>
</main>
<Footer {t} {translationNames}/>

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
