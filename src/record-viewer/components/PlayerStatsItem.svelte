<script lang="ts">
    export let title: string
    export let content: string
</script>

<span class="title">{title}</span>
<span class="content">{content}</span>

<style lang="sass">
    .title
        color: var(--theme-label)
        font-size: small
        justify-self: end
        white-space: nowrap
    .content
        justify-self: start
        white-space: nowrap
</style>
