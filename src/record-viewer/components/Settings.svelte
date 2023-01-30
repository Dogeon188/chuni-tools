<script lang="ts">
    import { fade } from "svelte/transition"
    import { showConfig$ } from "../store"
    import {
        language,
        theme,
        filterConstMax,
        filterConstMin,
        showPlayCount,
        showOverPower,
        usedConstData,
        configs,
    } from "../config"
    import { translationNames } from "../translations"
    import { t } from "../i18n"
    import UiSelect from "./UISelect.svelte"
    import UiSwitch from "./UISwitch.svelte"
    import UiDualSlider from "./UIDualSlider.svelte"
    import SettingsFilterDiff from "./SettingsFilterDiff.svelte"
    import SettingsFilterGenre from "./SettingsFilterGenre.svelte"
    import SettingsFetchPlayCount from "./SettingsFetchPlayCount.svelte"
</script>

<div class="wrapper" transition:fade={{ duration: 100 }}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-bg" on:click={showConfig$.toggle} />
    <div class="modal">
        <button type="button" class="close-btn" on:click={showConfig$.toggle}>✕</button>
        <h3 style="margin: 0;">{@html $t("settings.main.title")}</h3>

        <h4>{@html $t("settings.filter.title")}</h4>
        <UiDualSlider
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
        <UiSelect label={$t("settings.data.constData")} bind:value={$usedConstData}>
            {#each usedConstData.accepts as d}
                <option value={d}>{$t("settings.data.constData." + d)}</option>
            {/each}
        </UiSelect>
        <UiSwitch label={$t("settings.data.overpower")} bind:checked={$showOverPower} />
        <UiSwitch label={$t("settings.data.playcount")} bind:checked={$showPlayCount} />
        {#if $showPlayCount}
            <SettingsFetchPlayCount />
        {/if}

        <hr />

        <h4>{@html $t("settings.ui.title")}</h4>
        <UiSelect label={$t("settings.ui.locale")} bind:value={$language}>
            {#each language.accepts as l}
                <option value={l}>{translationNames.get(l)}</option>
            {/each}
        </UiSelect>
        <UiSelect label={$t("settings.ui.theme")} bind:value={$theme}>
            {#each theme.accepts as t}
                <option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            {/each}
        </UiSelect>

        <hr />

        <button
            type="button"
            class="btn reset-btn"
            on:click={() => {
                localStorage.clear()
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
        color: var(--theme-text)
        border-radius: 40%
    .reset-btn
        display: block
        margin-left: auto
        background-color: var(--theme-reset)
        width: -moz-fit-content
        width: fit-content
        padding: .5rem 1.5rem
        border-radius: .8rem
        font-weight: bold
        color: var(--theme-text)
    h4
        margin: .5rem 0
        color: var(--theme-text-dim)
    hr
        border: none
        border-top: var(--theme-border) .1rem solid
        margin: 2rem auto
</style>
