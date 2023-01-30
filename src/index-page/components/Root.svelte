<script lang="ts">
    import { t } from "../store"
    import { theme, language } from "@/common/config"
    import Select from "@/common/components/Select.svelte"
    import Intro from "./Intro.svelte"

</script>

<svelte:head>
    <link rel="stylesheet" href="../common/styles/common.css" />
    <link rel="stylesheet" href="../common/styles/theme-{$theme}.css" />
    <title>{$t("main.title")}</title>
</svelte:head>

<select bind:value={$language}>
    <option value="en_US">en_US</option>
    <option value="zh_TW">zh_TW</option>
</select>
<main>
    <Intro />
</main>

<style lang="sass">
    main
        padding: 1em
</style>