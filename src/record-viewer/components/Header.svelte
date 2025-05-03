<script lang="ts">
    import { page$ } from "../store"
</script>

<header>
    <a href="#best">
        <h3 class:selected={$page$ == "best"}>BEST</h3>
    </a>
    <a href="#recent">
        <h3 class:selected={$page$ == "recent"}>CURRENT</h3>
    </a>
    <a href="#history">
        <h3 class:selected={$page$ == "history"}>HISTORY</h3>
    </a>
</header>

<style lang="sass">
    header
        display: flex
        gap: .5rem
        padding: 0 1rem
    a
        padding: 1rem 3%
        cursor: pointer
        &:hover
            text-decoration-color: var(--theme-text-dim)
        h3
            margin: 0
            color: var(--theme-text-dim)
        h3.selected
            color: var(--theme-text)
</style>
