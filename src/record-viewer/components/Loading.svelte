<script lang="ts">
    import { usedConstData } from "../config"
    import { messageText$, t } from "../store"

    export let error: Error | undefined = undefined
</script>

<div class="modal-wrapper">
    <div class="modal-bg" />
    <div class="modal">
        <h3>
            {@html $t("main.title")}
            <!-- svelte-ignore missing-declaration -->
            <span class="app-version">@{__APP_VERSION__}</span>
        </h3>
        {#if error}
            <div class="error">:(</div>
            {#if error.message.indexOf("Request failed: rejected by server") != -1}
                <p>{@html $t("loading.error.rejected")}</p>
            {:else if error.message.indexOf("Request timed out") !== -1}
                <p>{@html $t("loading.error.timeout")}</p>
            {:else if error.message.indexOf("No opener found") !== -1}
                <p>{@html $t("loading.error.noopener")}</p>
            {:else}
                <p>{@html $t("loading.error.unknown")}</p>
                <pre class="error-text">{error.stack}</pre>
            {/if}
        {:else}
            <div class="spinner" />
            <p>{@html $messageText$}</p>
            {#if usedConstData.accepts.indexOf("jp") > -1}
                <p class="dim">
                    {@html $t("loading.constData", {
                        name: $t("settings.data.constData." + $usedConstData),
                    })}
                </p>
            {/if}
        {/if}
    </div>
</div>

<style lang="sass">
    .modal-wrapper
        position: fixed
        top: 0
        left: 0
        width: 100vw
        height: 100vh
        display: flex
        align-items: center
    .modal-bg
        position: fixed
        background: #0006
        top: 0
        left: 0
        width: 100vw
        height: 100vh
    .modal
        background: var(--theme-bg-main)
        width: 70%
        max-width: 32rem
        margin: auto
        padding: 2rem
        position: relative
        box-shadow: 2rem 2rem 10px #0008
        border-radius: 1rem
        text-align: center
    .app-version
        color: var(--theme-text-dim)
        font-weight: normal
        font-size: small
    .spinner
        margin: 2rem auto
        border: .5rem solid var(--theme-bg-sub)
        border-top-color: var(--theme-label)
        border-radius: 50%
        width: 4rem
        height: 4rem
        animation: spin 1s cubic-bezier(.5, .2, .5, .8) infinite
    .error
        margin: 4rem auto
        height: 4rem
        line-height: 4rem
        font-size: 5em
        color: var(--theme-label)
    .error-text
        color: #ff0000
        white-space: pre-line
        font-size: .8em
        text-align: left
        background-color: var(--theme-bg-sub)
        border-radius: .5em
        max-height: 15em
        overflow-y: scroll
        padding: 1em
    .dim
        color: var(--theme-text-dim)
    @keyframes spin
        0%
            transform: rotate(0deg)
        100%
            transform: rotate(360deg)
</style>
