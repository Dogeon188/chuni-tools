<script context="module" lang="ts">
    import { writable } from "svelte/store"
    let scoreDiffDirty = writable(false)
</script>

<script lang="ts">
    import Select from "@/common/components/Select.svelte"
    import { diffUpdateInterval } from "../config"
    import { t } from "../store"
</script>

<Select
    label={$t("settings.data.diffUpdate", {
        date: new Date(
            Number(localStorage.getItem("prevUpdateTime"))
        ).toLocaleDateString(),
    })}
    bind:value={$diffUpdateInterval}>
    {#each diffUpdateInterval.accepts as d}
        <option value={d}>{$t("settings.data.diffUpdate." + d)}</option>
    {/each}
</Select>
{#if $diffUpdateInterval === "manual"}
    <button
        type="button"
        class="update-scorediff-btn"
        disabled={$scoreDiffDirty}
        on:click={() => {
            localStorage.removeItem("prevPlayRecord")
            localStorage.removeItem("prevUpdateTime")
            $scoreDiffDirty = true
        }}>
        {$t("settings.data.diffUpdate." + ($scoreDiffDirty ? "reload" : "update"))}
    </button>
{/if}
<div style="color: var(--theme-text-dim); margin: .5em auto">
    {@html $t("settings.data.diffUpdate.notify")}
</div>

<style lang="sass">
    .update-scorediff-btn
        background-color: var(--theme-control)
        padding: .5rem 1.5rem
        margin: .5rem .5rem
        border-radius: .8rem
        float: right
        &:disabled
            background-color: var(--theme-bg-sub)
            cursor: no-drop
</style>
