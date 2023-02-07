<script lang="ts">
    export let records: ParsedRecord[]

    $: totalOverpower = records.reduce((pre, record) => pre + record.op, 0)
    $: maxOverpower = records.reduce((pre, record) => pre + record.opmax, 0)
    $: progress = totalOverpower / maxOverpower * 100
</script>

<div class="wrapper" class:aj={totalOverpower.toFixed(2) === maxOverpower.toFixed(2)}>
    <div>
        <div class="op-total">{totalOverpower.toFixed(2)}</div>
        <div class="op-max">&#xFF0F;{maxOverpower.toFixed(1)}</div>
    </div>
    <div class="progress">
        <div style="width:{isNaN(progress) ? 0 : progress}%">
            {(progress).toFixed(3)}%
        </div>
    </div>
</div>

<style lang="sass">
    .wrapper
        border: var(--theme-border) 3px solid
        border-radius: 0.5rem
        background-color: var(--theme-bg-sub)
        box-sizing: border-box
        width: 100%
        max-width: 600px
        padding: 0.5rem 2rem
        margin: 0.5rem
        display: flex
        justify-content: space-evenly
        align-items: center
        text-align: center
        gap: 1rem
        overflow-x: scroll
        &::-webkit-scrollbar
            display: none
        &.aj .progress, &.aj .op-total
            color: var(--theme-clear-aj)
            text-shadow: 0 0 10px var(--theme-clear-aj)
    .op-total
        font-size: 1.5em
        font-weight: bold
    .op-max
        font-size: .8em
        color: var(--theme-text-dim)
    .progress
        width: 100%
        border-radius: 1em
        background-color: var(--theme-bg-main)
        div
            border-radius: 1em
            background-color: var(--theme-control)
            font-weight: bold
</style>
