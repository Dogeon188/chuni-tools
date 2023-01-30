<script lang="ts">
    export let label: string
    export let min: number
    export let max: number
    export let step: number
    export let low: number
    export let high: number

    let dist = max - min
    let _low = low,
        _high = high
    $: lowPer$$ = ((_low - min) / dist) * 100
    $: highPer$$ = ((_high - min) / dist) * 100
</script>

<div class="wrapper">
    <span>{@html label}</span>
    <div class="indicators">
        <div class="low" style="left: calc((100% - 3rem) * {lowPer$$} / 100)">
            <input
                value={_low}
                type="number"
                {min}
                {max}
                {step}
                inputmode="decimal"
                on:change={(e) => {
                    _low = parseFloat(e.currentTarget.value) || _low
                    _low = Math.min(max, Math.max(min, _low))
                    if (_low > _high) _high = _low
                    e.currentTarget.value = _low.toString()
                    ;(low = _low), (high = _high)
                }} />
        </div>
        <div class="high" style="left: calc((100% - 3rem) * {highPer$$} / 100)">
            <input
                value={_high}
                type="number"
                {min}
                {max}
                {step}
                inputmode="decimal"
                on:change={(e) => {
                    _high = parseFloat(e.currentTarget.value) || _high
                    _high = Math.min(max, Math.max(min, _high))
                    if (_high < _low) _low = _high
                    e.currentTarget.value = _high.toString()
                    ;(low = _low), (high = _high)
                }} />
        </div>
    </div>
    <div class="slider">
        <div
            class="slider-bg"
            style="
            background: linear-gradient(
                to right,
                var(--theme-border) 0%,
                var(--theme-border) {lowPer$$ - 1}%,
                var(--theme-control) {lowPer$$ - 1}%,
                var(--theme-control) {highPer$$ + 1}%,
                var(--theme-border) {highPer$$ + 1}%,
                var(--theme-border) 100%
            )" />
        <input
            class="low"
            type="range"
            {min}
            {max}
            {step}
            bind:value={_low}
            on:change={() => {
                ;(low = _low), (high = _high)
            }}
            on:input={() => {
                if (_low > _high) _high = _low
            }} />
        <input
            class="high"
            type="range"
            {min}
            {max}
            {step}
            bind:value={_high}
            on:change={() => {
                ;(low = _low), (high = _high)
            }}
            on:input={() => {
                if (_high < _low) _low = _high
            }} />
    </div>
</div>

<style lang="sass">
    .wrapper
        display: flex
        flex-direction: column
        padding: .5rem
        gap: .5rem
    .indicators
        height: .8rem
        position: relative
        & div
            background-color: var(--theme-bg-sub)
            height: 1.6rem
            width: 1.6rem
            border-radius: 40%
            display: flex
            justify-content: center
            align-items: center
            position: absolute
            border: var(--theme-border) .2rem solid
            &.low
                border-bottom-right-radius: 0
                transform: translateX(-.4rem)
            &.high
                border-bottom-left-radius: 0
                transform: translateX(1.6rem)
    .slider
        display: flex
        flex-direction: column
        justify-content: center
        width: 100%
        height: 3.5rem
        position: relative
    .slider-bg
        height: .4rem
        width: calc(100% - 2.6rem)
        margin-left: 1.4rem
        background-color: var(--theme-border)
        position: absolute
        border-radius: .2rem
    input[type=number]
        background-color: transparent
        border: none
        color: inherit
        font-family: inherit
        max-width: 150%
        text-align: center
        -moz-appearance: textfield
    input::-webkit-inner-spin-button
        -webkit-appearance: none
        margin: 0
    input[type=range]
        -webkit-appearance: none 
        appearance: none
        height: 0
        width: calc(100% - 1.5rem)
        position: absolute
        border-radius: .2rem
        pointer-events: none
        &.low
            &::-webkit-slider-thumb
                border-radius: 50% 0 0 50%
            &::-moz-range-thumb
                border-radius: 50% 0 0 50%
        &.high
            margin-left: 1.6rem
        @mixin slider-thumb
            z-index: 1
            -webkit-appearance: none
            pointer-events: all
            width: 1.5rem
            height: 2rem
            background-color: var(--theme-text-dim)
            border-radius: 0 50% 50% 0
            cursor: pointer
            transition: .2s
            &:hover
                background-color: var(--theme-text)
            &:active
                box-shadow: 0 0 .5rem var(--theme-text-dim)
                -webkit-box-shadow: 0 0 .5rem var(--theme-text-dim)
        &::-webkit-slider-thumb
            @include slider-thumb
        &::-moz-range-thumb
            @include slider-thumb
        &:focus-visible
            outline: none
        &:focus-visible::-webkit-slider-thumb
            outline: var(--theme-border) auto 1px
        &:focus-visible::-moz-range-thumb
            outline: var(--theme-border) auto 1px
</style>
