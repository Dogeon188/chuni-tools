<script lang="ts">
    import { getPostMessageFunc } from "@/common/web"
    import { chuniNet } from "@/common/const"
    import { Genre, genres } from "@/common/song"
    import { theme, language } from "@/common/config"
    import {
        bestRecord$,
        page$,
        playerStats$,
        playHistory$,
        recentRecord$,
        showConfig$,
        showMessageText$,
        t,
    } from "../store"
    import { filterDiff, filterConstMax, filterConstMin, filterGenre } from "../config"
    import Buttons from "./Buttons.svelte"
    import Settings from "./Settings.svelte"
    import PlayerStats from "./PlayerStats.svelte"
    import RecordTable from "./RecordTable.svelte"
    import Loading from "./Loading.svelte"
    import MessageText from "./MessageText.svelte"
    import Header from "./Header.svelte"

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
    <link rel="stylesheet" href="../common/styles/common.css" />
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
    main
        width: 100%
        display: flex
        flex-direction: column
        align-items: center
</style>
