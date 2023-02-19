<script lang="ts">
    export let rankCounts: Record<string, number>
    export let fcCount: number
    export let ajCount: number
    export let total: number
</script>

<div class="wrapper">
    {#each ["S", "S+", "SS", "SS+", "SSS", "SSS+"] as r}
        <div
            class="item"
            class:zero={!(rankCounts[r] > 0)}
            class:full={rankCounts[r] == total}>
            <div>{r}</div>
            <div>{rankCounts[r] ?? 0}</div>
        </div>
    {/each}
    {#if rankCounts["MAX"] > 0}
        <div class="item mx">
            <div>MAX</div>
            <div>{rankCounts["MAX"] ?? 0}</div>
        </div>
    {/if}
    <div class="item fc" class:zero={fcCount == 0} class:full={fcCount == total}>
        <div>FC</div>
        <div>{fcCount}</div>
    </div>
    <div class="item aj" class:zero={ajCount == 0}  class:full={ajCount == total}>
        <div>AJ</div>
        <div>{ajCount}</div>
    </div>
    <div class="total">/{total}</div>
</div>

<style lang="sass">
    .wrapper
        border: var(--theme-border) 3px solid
        border-radius: 0.5rem
        background-color: var(--theme-bg-sub)
        box-sizing: border-box
        width: 100%
        max-width: 600px
        padding: 0.5rem
        margin: 0.5rem
        display: flex
        justify-content: space-evenly
        text-align: center
        gap: .8em
        overflow-x: scroll
        &::-webkit-scrollbar
            display: none
    .item
        display: flex
        -ms-flex-direction: column
        flex-direction: column
        div:nth-child(1)
            color: var(--theme-label)
        div:nth-child(2)
            font-size: 1.2em
            font-weight: bold
        &.fc div:nth-child(1)
            color: var(--theme-clear-fc)
        &.aj div:nth-child(1)
            color: var(--theme-clear-aj)
        &.mx:not(.zero) div:nth-child(2), &.full div:nth-child(2)
            color: var(--theme-clear-aj)
            text-shadow: 0 0 10px var(--theme-clear-aj)
        &.zero div:nth-child(2)
            color: var(--theme-text-dim)
    .total
        color: var(--theme-text-dim)
        font-size: .8rem
        display: flex
        align-items: end
</style>
