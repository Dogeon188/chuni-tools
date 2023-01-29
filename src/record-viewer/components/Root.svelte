<script lang="ts">
    import Header from "./Header.svelte"
    import {
        bestRecord$,
        page$,
        playerStats$,
        playHistory$,
        recentRecord$,
        showConfig$,
        showMessageText$,
    } from "../store"
    import { theme, language } from "../config"
    import Buttons from "./Buttons.svelte"
    import Settings from "./Settings.svelte"
    import { getPostMessageFunc } from "@/common/web"
    import { chuniNet } from "@/common/const"
    import PlayerStats from "./PlayerStats.svelte"
    import RecordTable from "./RecordTable.svelte"
    import Loading from "./Loading.svelte"
    import MessageText from "./MessageText.svelte"

    $page$ = window.location.hash.slice(1)

    function routeChange() {
        $page$ = window.location.hash.slice(1)
    }

    async function sendReady() {
        const send = getPostMessageFunc(window.opener, chuniNet)
        send("saveConfig", { lang: $language })
    }
</script>

<svelte:window on:hashchange={routeChange} on:load|once={sendReady} />
<svelte:head>
    <link rel="stylesheet" href="../common/styles/theme-{$theme}.css" />
</svelte:head>

{#await Promise.all( [playerStats$.init(), recentRecord$.init(), playHistory$.init(), bestRecord$.init()] )}
    <Loading />
{:then}
    <Buttons />
    <Header />
    <main>
        <PlayerStats />
        {#if $page$ === "best"}
            <RecordTable playRecord={$bestRecord$} />
        {:else if $page$ === "recent"}
            <RecordTable playRecord={$recentRecord$} />
        {:else if $page$ === "history"}
            <RecordTable playRecord={$playHistory$} />
        {/if}

        {#if $showMessageText$}
            <MessageText />
        {/if}
    </main>
{:catch}
    <Loading error />
{/await}

{#if $showConfig$}
    <Settings />
{/if}

<style lang="sass">
    :global(::-webkit-scrollbar)
        width: .6rem
    :global(::-webkit-scrollbar-thumb)
        border-radius: .1rem
        width: .2rem
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
        background-color: var(--theme-text-dim)
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
            text-decoration: underline dotted currentColor
    :global(button)
        border: none
        justify-content: center
        display: inline-flex
        align-items: center
        cursor: pointer
        user-select: none
        color: inherit
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
