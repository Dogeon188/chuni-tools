<script lang="ts">
    import Header from "./Header.svelte"
    import { page, showConfig } from "../store"
    import { theme, locale } from "../config"
    import Buttons from "./Buttons.svelte"
    import Settings from "./Settings.svelte"
    import { getPostMessageFunc } from "@/common/bookmarklet"
    import { chuniNet } from "@/common/const"

    $page = window.location.hash.slice(1)

    function routeChange() {
        $page = window.location.hash.slice(1)
    }

    function sendReady() {
        const send = getPostMessageFunc(window.opener, chuniNet)
        send("saveConfig", {lang: $locale})
        send("request", {target: "recordList"})
    }

    function handleMessage(e: MessageEvent) {
        console.log(e.data)
    }
</script>

<svelte:window on:hashchange={routeChange} on:load|once={sendReady} on:message={handleMessage}/>
<svelte:head>
    <link rel="stylesheet" href="/common/styles/theme-{$theme}.css" />
</svelte:head>

<Buttons />
<Header />
<main>
    <h2>Hello World {$page}</h2>
</main>

{#if $showConfig}
    <Settings />
{/if}

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
    :global(button)
        border: none
        justify-content: center
        display: inline-flex
        align-items: center
        cursor: pointer
        user-select: none
        transition-duration: 0.1s
        filter: brightness(.7)
        &:hover
            filter: brightness(1)
    :global(body)
        background-color: var(--theme-bg-main)
        color: var(--theme-text)
        margin: 0
        font-size: 14px
        min-height: 100%
        min-width: fit-content
        font-family: "ヒラギノ角ゴ Pro W3","メイリオ",Meiryo,"ＭＳ Ｐゴシック","MS P Gothic",sans-serif
    main
        width: fit-content
        margin: auto
</style>
