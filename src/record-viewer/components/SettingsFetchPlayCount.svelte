<script lang="ts">
    import { requestFor } from "../request"
    import { showConfig$, showMessageText$, bestRecord$, messageText$, messageTextLoading$ } from "../store"
    import { t } from "../i18n"
    let from = 1
    let to = 40

    function invalidPlayCount(from: number, to: number) {
        return isNaN(from) || isNaN(to) || from == null || to == null || to < from
    }

    async function fetchMultiPlayCount(from: number, to: number) {
        if ($showMessageText$ || invalidPlayCount(from, to)) return
        $messageTextLoading$ = true
        $showMessageText$ = true
        $showConfig$ = false

        try {
            const l = $bestRecord$.slice(from - 1, to).length
            for (const [i, song] of $bestRecord$.slice(from - 1, to).entries()) {
                messageText$.set($t("playcount.fetch.progress", { progress: i, all: l }))
                if (song.playCount != undefined) continue
                song.playCount = await requestFor(
                    "songPlayCount",
                    song.difficulty,
                    song.idx
                )
                $bestRecord$ = $bestRecord$
            }
            $showMessageText$ = false
            $messageTextLoading$ = false
        } catch {
            $messageTextLoading$ = false
            $messageText$ = $t("playcount.fetch.error")
            setTimeout(() => {
                $showMessageText$ = false
            }, 6000)
        }
    }
</script>

<div class="wrapper">
    <button
        class="btn"
        class:disabled={$showMessageText$ || invalidPlayCount(from, to)}
        on:click={() => fetchMultiPlayCount(from, to)}>
        Fetch
    </button>
    <input
        type="number"
        min="1"
        placeholder="from"
        bind:value={from}
        inputmode="numeric" />
    &#xFF5E;
    <input type="number" min="1" placeholder="to" bind:value={to} inputmode="numeric" />
</div>

<style lang="sass">
    .wrapper
        padding: .5rem
        display: flex
        gap: .5rem
        align-items: center
    input[type=number]
        background-color: var(--theme-bg-sub)
        color: var(--theme-text)
        border: none
        border-radius: .2rem
        width: 4rem
        padding: .5rem
        -moz-appearance: textfield
        flex-grow: 1
        &::-webkit-inner-spin-button
            -webkit-appearance: none
            margin: 0
    .btn
        width: fit-content
        padding: .5rem 1.5rem
        border-radius: .8rem
        font-weight: bold
        cursor: pointer
        user-select: none
        opacity: .9
        transition: .2s
        background-color: var(--theme-bg-control)
        &:hover
            opacity: 1
        &.disabled
            background-color: var(--theme-border)
            cursor: no-drop
</style>
