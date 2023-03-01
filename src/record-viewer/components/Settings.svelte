<script lang="ts">
    import { fade } from "svelte/transition"
    import { theme, language } from "@/common/config"
    import Select from "@/common/components/Select.svelte"
    import Switch from "@/common/components/Switch.svelte"
    import DualSlider from "@/common/components/DualSlider.svelte"
    import {
        filterConstMax,
        filterConstMin,
        showPlayCount,
        showOverPower,
        usedConstData,
        configs,
    } from "../config"
    import { t, translationNames, showSettings$, showScoreDiff$ } from "../store"
    import SettingsFilterDiff from "./SettingsFilterDiff.svelte"
    import SettingsFilterGenre from "./SettingsFilterGenre.svelte"
    import SettingsFetchPlayCount from "./SettingsFetchPlayCount.svelte"
    import SettingsScoreDiffUpdate from "./SettingsScoreDiffUpdate.svelte"
</script>

<div class="wrapper" transition:fade={{ duration: 100 }}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-bg" on:click={showSettings$.toggle} />
    <div class="modal">
        <button type="button" class="close-btn" on:click={showSettings$.toggle}>✕</button>
        <h3 style="margin: 0;">{@html $t("settings.main.title")}</h3>

        <h4>{@html $t("settings.filter.title")}</h4>
        <DualSlider
            label={$t("settings.filter.const")}
            max={15.4}
            min={1}
            step={0.1}
            bind:high={$filterConstMax}
            bind:low={$filterConstMin} />

        <SettingsFilterDiff />

        <SettingsFilterGenre />

        <hr />

        <h4>{@html $t("settings.data.title")}</h4>

        {#if usedConstData.accepts.length >= 2}
            <Select label={$t("settings.data.constData")} bind:value={$usedConstData}>
                {#each usedConstData.accepts as d}
                    <option value={d}>{$t("settings.data.constData." + d)}</option>
                {/each}
            </Select>
        {/if}

        <Select label={$t("settings.data.overpower")} bind:value={$showOverPower}>
            {#each showOverPower.accepts as d}
                <option value={d}>{$t("settings.data.overpower." + d)}</option>
            {/each}
        </Select>
        <div style="color: var(--theme-text-dim); margin: .5em auto">
            {@html $t("settings.data.overpower.notify")}
        </div>

        <Switch label={$t("settings.data.playcount")} bind:checked={$showPlayCount} />
        {#if $showPlayCount}
            <SettingsFetchPlayCount />
            <div style="color: var(--theme-text-dim); margin: .5em auto">
                {@html $t("settings.data.playcount.notify")}
            </div>
        {/if}

        <Switch
            label={$t("settings.data.showScoreDiff")}
            bind:checked={$showScoreDiff$} />

        <SettingsScoreDiffUpdate />

        <hr />

        <h4>{@html $t("settings.ui.title")}</h4>

        <Select label={$t("settings.ui.locale")} bind:value={$language}>
            {#each language.accepts as l}
                <option value={l}>{translationNames.get(l)}</option>
            {/each}
        </Select>

        <Select label={$t("settings.ui.theme")} bind:value={$theme}>
            {#each theme.accepts as t}
                <option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            {/each}
        </Select>

        <hr />

        <button
            type="button"
            class="reset-btn"
            on:click={() => {
                for (const config of configs) config.reset()
            }}>
            {@html $t("settings.main.reset")}
        </button>
    </div>
</div>

<style lang="sass">
    .wrapper
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        display: flex
        align-items: center
    .modal-bg
        position: fixed
        background: #0006
        top: 0
        left: 0
        width: 100%
        height: 100%
    .modal
        background: var(--theme-bg-main)
        width: 70%
        max-width: 32rem
        max-height: 80%
        overflow-y: auto
        margin: auto
        padding: 2em
        position: relative
        box-shadow: 2rem 2rem 10px #0008
        border-radius: 1rem
        text-align: left
    .close-btn
        position: absolute
        top: .5rem
        right: .5rem
        width: 2rem
        height: 2rem
        background-color: var(--theme-border)
        border-radius: 40%
    .reset-btn
        display: block
        margin-left: auto
        background-color: var(--theme-reset)
        width: -moz-fit-content
        width: fit-content
        padding: .5rem 1.5rem
        border-radius: .8rem
    h4
        margin: .5rem 0
        color: var(--theme-text-dim)
    hr
        border: none
        border-top: var(--theme-border) .1rem solid
        margin: 2rem auto
</style>
