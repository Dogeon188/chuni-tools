<script lang="ts">
    import Header from "./Header.svelte"
    import { theme } from "../store"

    let currentHash = window.location.hash.slice(1)

    function routeChange() {
        currentHash = window.location.hash.slice(1)
    }
</script>

<svelte:window on:hashchange={routeChange} />
<svelte:head>
    <link rel="stylesheet" href="/common/styles/theme-{$theme}.css" />
</svelte:head>

<Header page="{currentHash}" />
<main>
    <h2>Hello World {currentHash}</h2>
    <select name="theme" bind:value={$theme}>
        <option value="dark">Dark</option>
        <option value="purple">Purple</option>
    </select>
</main>

<style lang="sass">
    :global(::-webkit-scrollbar)
        width: .6rem
    :global(::-webkit-scrollbar-thumb)
        border-radius: .1rem
        width: .2rem
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
        background-color: var(--theme-border)
        border-width: 1rem .2rem
        border-style: solid
        border-color: transparent
        background-clip: content-box
    :global(em)
        font-style: normal
        font-weight: bold
        color: var(--theme-link)
    :global(a)
        color: var(--theme-link)
        text-decoration: none
        &:hover
            text-decoration: underline dotted
    :global(body)
        background-color: var(--theme-bg-main)
        color: var(--theme-text)
        margin: 0
        font-size: 14px
        min-height: 100%
        min-width: fit-content
    main
        width: fit-content
        margin: auto
</style>
