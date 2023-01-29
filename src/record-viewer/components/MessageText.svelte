<script lang="ts">
    import { messageText$, messageTextLoading$ } from "../store"
    import { fly } from "svelte/transition"
</script>

<div class="wrapper" transition:fly={{ y: 200, duration: 1000 }}>
    {#if $messageTextLoading$}
        <span class="spinner" />
    {/if}
    <span class="text">{@html $messageText$}</span>
</div>

<style lang="sass">
    .wrapper
        position: fixed
        bottom: .5rem
        left: .5rem
        padding: .5rem
        border-radius: .5rem
        background-color: #0006
        backdrop-filter: blur(2px)
    .spinner
        border: .2rem solid transparent
        border-top-color: var(--theme-label)
        display: inline-block
        box-sizing: border-box
        border-radius: 50%
        width: 1em
        height: 1em
        animation: spin 1s cubic-bezier(.5, .2, .5, .8) infinite
    .text
        color: var(--theme-text-dim)
        font-size: 8px
    @keyframes spin
        0%
            transform: rotate(0deg)
        100%
            transform: rotate(360deg)
</style>
