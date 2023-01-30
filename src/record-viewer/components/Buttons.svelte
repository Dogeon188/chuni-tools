<script lang="ts">
    import { showConfig$ } from "../store"
    import { usedConstData } from "../config"
    import { saveResultAsPicture } from "../share"
</script>

<div class="wrapper">
    <button type="button" on:click={saveResultAsPicture}>
        <svg width="18" height="18">
            <path
                d="M7 2H11V8H15L9 14 3 8H7V2ZM3 14H15V16H3V14Z"
                fill="var(--theme-text)" />
        </svg>
    </button>
    {#if usedConstData.accepts.indexOf("jp") > -1}
        <button
            type="button"
            on:click={() => {
                $usedConstData =
                    usedConstData.accepts[
                        (usedConstData.accepts.indexOf($usedConstData) + 1) %
                            usedConstData.accepts.length
                    ]
            }}>
            {$usedConstData.slice(0, 2).toUpperCase()}
        </button>
    {/if}
    <button type="button" on:click={showConfig$.toggle}>
        <svg width="18" height="18">
            <path
                d="M2 4H16V6H2V4ZM2 8H16V10H2V8ZM2 12H16V14H2V12Z"
                fill="var(--theme-text)" />
        </svg>
    </button>
</div>

<style lang="sass">
    .wrapper
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: center
        gap: 1em
        position: fixed
        right: 1rem
        top: 0.6rem
    button
        width: 2rem
        height: 2rem
        background: var(--theme-border)
        opacity: 0.8
        border-radius: 40%
        font-weight: bold
    svg
        overflow: visible
</style>
