<script context="module">
    import { t } from "../store"
    
    const bookmarkletScript = `javascript:(function(d,s){s=d.createElement('script');s.src='https://dogeon188.github.io/chuni-tools/scripts/chuni-tools.js?t='+Math.floor(Date.now()/60000);d.body.append(s);})(document);`
</script>

<h2>{$t("howto.title")}</h2>

<ol>
    <li>
        <span>{@html $t("howto.step.copyLink")}</span>
        <div class="pre-wrapper">
            <pre>{bookmarkletScript}</pre>
        </div>
        <button
            type="button"
            class="btn-copy"
            on:click={() => {
                navigator.clipboard.writeText(bookmarkletScript)
            }}
            >{@html $t("howto.step.copyLink.button")}
        </button>
    </li>
    <li>{@html $t("howto.step.bookmarkAdd")}</li>
    <li>{@html $t("howto.step.bookmarkEdit")}</li>
    <li>{@html $t("howto.step.gotoNet")}</li>
    <li>{@html $t("howto.step.run")}</li>
    <li>
        <span>{@html $t("howto.step.done")}</span>
        <img
            src="./images/chuni-net-viewer-button.jpg"
            alt={$t("howto.step.done.imgAlt")} />
    </li>
</ol>
<p>{@html $t("howto.afterward")}</p>

<style lang="sass">
    .pre-wrapper
        box-sizing: border-box
        width: 100%
        padding: 1em
        margin: 1em 0
        border-radius: 2em
        background-color: var(--theme-bg-sub)
        border: 2px solid var(--theme-border)
    pre
        margin: 0
        overflow-x: scroll
        &::-webkit-scrollbar
            display: none
    li
        margin: 1em 0
    .btn-copy
        padding: .5em 1em
        border-radius: 1em
        background-color: var(--theme-control)
</style>
