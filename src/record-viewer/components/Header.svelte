<script lang="ts">
    import { page } from "../store"
</script>

<header>
    <h3 class:selected={$page == "best"}>
        <a href="#best">BEST</a>
    </h3>
    <h3 class:selected={$page == "recent"}>
        <a href="#recent">RECENT</a>
    </h3>
</header>

<style lang="sass">
    header
        display: flex
        gap: .5rem
        padding: 0 1rem
    h3
        margin: 0
        padding: 1rem 5%
        cursor: pointer
        a
            color: var(--theme-text-dim)
        &.selected a
            color: var(--theme-text)
</style>
