<script lang="ts">
    export let records: ParsedRecord[]

    $: totalOverpower = records.reduce((pre, record) => pre + record.op, 0)
    $: maxOverpower = records.reduce((pre, record) => pre + record.opmax, 0)
    $: progress = totalOverpower / maxOverpower
</script>

<div class="wrapper">
    <div>
        <span class="op-total">{totalOverpower.toFixed(3)}</span>
        <span class="op-max">&#xFF0F;{maxOverpower}</span>
        <span class="op-per">({(progress * 100).toFixed(3)}%)</span>
    </div>

    <progress value={isNaN(progress) ? 0 : progress} />
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
        flex-direction: column
        justify-content: space-evenly
        align-items: center
        text-align: center
        gap: .8em
        overflow-x: scroll
        &::-webkit-scrollbar
            display: none
    .op-total
        font-size: 1.5em
    .op-max, .op-per
        font-size: .8em
        color: var(--theme-text-dim)
    progress
        width: 100%
        background-color: transparent
    progress::-webkit-progress-bar
        border-radius: 1em
        background-color: var(--theme-bg-main)
    progress::-webkit-progress-value
        border-radius: 1em
        background-color: var(--theme-control-altr)
</style>
