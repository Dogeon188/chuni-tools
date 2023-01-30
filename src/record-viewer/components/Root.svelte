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
    import {
        theme,
        language,
        filterDiff,
        filterConstMax,
        filterConstMin,
        filterGenre,
    } from "../config"
    import Buttons from "./Buttons.svelte"
    import Settings from "./Settings.svelte"
    import { getPostMessageFunc } from "@/common/web"
    import { chuniNet } from "@/common/const"
    import PlayerStats from "./PlayerStats.svelte"
    import RecordTable from "./RecordTable.svelte"
    import Loading from "./Loading.svelte"
    import MessageText from "./MessageText.svelte"
    import { t } from "../i18n"
    import { Genre, genres } from "@/common/song"

    $page$ = window.location.hash.slice(1)

    function routeChange() {
        $page$ = window.location.hash.slice(1)
    }

    async function sendReady() {
        const send = getPostMessageFunc(window.opener, chuniNet)
        send("saveConfig", { lang: $language })
    }

    $: filteredBestRecord$$ = $bestRecord$.filter((v) => {
        return (
            $filterDiff[v.difficulty] &&
            $filterGenre[genres.find((g) => Genre[g] == v.genre)!] &&
            $filterConstMax >= v.const &&
            v.const >= $filterConstMin
        )
    })
</script>

<svelte:window on:hashchange={routeChange} on:load|once={sendReady} />
<svelte:head>
    <link rel="stylesheet" href="../common/styles/theme-{$theme}.css" />
    <title>{$t("main.title")}</title>
</svelte:head>

{#await Promise.all( [playerStats$.init(), recentRecord$.init(), playHistory$.init(), bestRecord$.init()] )}
    <Loading />
{:then}
    <Header />
    <Buttons />
    <main>
        <PlayerStats />
        {#if $page$ === "best"}
            <RecordTable playRecord={filteredBestRecord$$} />
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
        cursor: grab
    :global(::-webkit-scrollbar-thumb)
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
            text-decoration: underline dotted currentColor
    :global(button)
        border: none
        justify-content: center
        display: inline-flex
        align-items: center
        cursor: pointer
        -webkit-user-select: none
        user-select: none
        color: inherit
        font-size: 1rem
        font-weight: bold
        font-family: inherit
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
        font-family: "ヒラギノ角ゴ Pro W3","メイリオ",Meiryo,"ＭＳ Ｐゴシック","MS P Gothic",sans-serif
    :global(*:focus-visible)
        outline-color: var(--theme-border)
        filter: brightness(1) !important
    main
        width: -moz-fit-content
        width: fit-content
        margin: auto
</style>
