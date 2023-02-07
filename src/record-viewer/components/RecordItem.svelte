<script lang="ts">
    import { page$, showMessageText$ } from "../store"
    import { showOverPower, showPlayCount } from "../config"
    import { requestFor } from "../request"
    export let song: ParsedRecord
</script>

<tr
    class:best30={song.order <= ($page$ === "recent" || $page$ === "history" ? 10 : 30)}
    class:best40={song.order <=
        ($page$ === "recent" ? 10 : $page$ === "history" ? 30 : 40)}
    class:ajc={song.score == 1010000}>
    <td class="song-order">{song.order}</td>
    <td data-diff={song.difficulty} colspan={$page$ === "history" ? 2 : 1}
        >{song.title}</td>
    <td>{song.const == -1 ? "-" : song.const?.toFixed(1) ?? "??.?"}</td>
    {#if $showOverPower}
        <td class="song-op">
            {song.op.toFixed(2)}<span class="opmx">&#xFF0F;{song.opmax.toFixed(1)}</span>
        </td>
        <td>
            {song.oppercent.toPrecision(5)}<span class="opmx">%</span>
        </td>
    {:else}
        <td data-rank={song.rank}>{song.rank}</td>
        <td class="song-score">{song.score}</td>
    {/if}
    <td>
        {song.const == -1 ? "-" : song.rating == null ? "??.??" : song.rating.toFixed(2)}
    </td>
    {#if $page$ === "history" || $page$ === "best"}
        <td data-clear={song.clear}>{song.clear}</td>
    {/if}
    {#if $showPlayCount && $page$ === "best"}
        {#if song.playCount === undefined}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <td
                class="pc-hidden"
                on:click={() => {
                    if ($showMessageText$) return
                    requestFor("songPlayCount", song.difficulty, song.idx).then((pc) => {
                        song.playCount = pc
                    }).catch(() => {
                        song.playCount = null
                    })
                }}>
                <span>&emsp;</span>
            </td>
        {:else}
            <td>{song.playCount ?? "?"}</td>
        {/if}
    {/if}
</tr>

<style lang="sass">
    tr.best30 td.song-order
        color: var(--theme-rank-b30)
    tr.best40 td.song-order
        font-weight: bold
    tr:not(.best40) td.song-order
        color: var(--theme-text-dim)
    tr.ajc
        td[data-rank], td.song-score, td[data-clear]
            color: var(--theme-clear_aj)
            text-shadow: 0 0 10px var(--theme-clear-aj)
    td
        padding: .5rem
        border-top: var(--theme-border) 1.5px solid
        text-align: center
    td[data-diff]
        font-weight: bold
        text-align: left
        max-width: 300px
        @each $diff in ("WE", "ULT", "MAS", "EXP", "ADV", "BAS")
            &[data-diff="#{$diff}"]
                color: var(--theme-song-#{to-lower-case($diff)})
    td[data-rank]
        white-space: nowrap
        &[data-rank="MAX"]
            color: var(--theme-clear_aj)
            text-shadow: 0 0 10px var(--theme-clear_aj)
        @each $rank, $p in (("SSS+", 0), ("SSS", 2), ("SS+", 4), ("SS", 6), ("S+", 2), ("S", 4))
            &[data-rank="#{$rank}"]
                color: adjust-color(#fc1, $whiteness: ($p * 10%))
        @each $rank, $p in (("AAA", 0), ("AA", 1), ("A", 2), ("BBB", 3), ("BB", 4), ("B", 5))
            &[data-rank="#{$rank}"]
                color: adjust-color(#cef, $whiteness: ($p * -15%))
        @each $rank, $p in ("MAX", "SSS+", "SSS", "SS+", "SS")
            &[data-rank="#{$rank}"]
                font-weight: bold
        &[data-rank="C"]
            color: #888
        &[data-rank="D"]
            color: #666
    td[data-clear]
        font-weight: bold
        &[data-clear="FC"]
            color: var(--theme-clear-fc)
        &[data-clear="AJ"]
            color: var(--theme-clear-aj)
    td.song-op
        white-space: nowrap
    .opmx
        color: var(--theme-text-dim)
        font-size: .8em
    .pc-hidden
        cursor: pointer
        span
            border-radius: .2em
            background-color: var(--theme-bg-sub)
            color: var(--theme-bg-sub)
</style>
