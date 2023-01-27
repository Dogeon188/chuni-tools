<script lang="ts">
    import { showConfig } from "../store"
</script>

<div class="wrapper">
    <!-- <button on:click={saveResultAsPicture}>
        <svg width="18" height="18">
            <path d="M7 2H11V8H15L9 14 3 8H7V2ZM3 14H15V16H3V14Z" fill="white" />
        </svg>
    </button> -->
    <button on:click={showConfig.toggle}>
        <svg width="18" height="18">
            <path d="M2 4H16V6H2V4ZM2 8H16V10H2V8ZM2 12H16V14H2V12Z" fill="white" />
        </svg>
    </button>
</div>

<style lang="sass">
    .wrapper
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: center
        gap: 1rem
        position: fixed
        right: 1rem
        top: 0.3rem
    button
        width: 2.5rem
        height: 2.5rem
        background: var(--theme-border)
        border-radius: 40%
</style>
