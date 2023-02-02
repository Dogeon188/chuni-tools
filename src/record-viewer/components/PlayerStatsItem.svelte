<script lang="ts">
    export let title: string
    export let content: string
</script>

<span class="title">{title}</span>
<span class="content">{content}</span>

<style lang="sass">
    span
        line-height: 1em
        margin: .4em 0
    .title
        color: var(--theme-label)
        text-align: right
        white-space: nowrap
    .content
        white-space: nowrap
</style>
