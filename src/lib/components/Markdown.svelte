<script lang="ts">
	import MarkdownIt from 'markdown-it'
	import MarkdownItContainer from 'markdown-it-container'
	import { onMount } from 'svelte'

	let { className: className = '', content }: { className?: string; content: string } = $props()

	let htmlContent = $state('')
	let mounted = false

	// Function to convert markdown to HTML
	async function convertMarkdownToHtml(markdown: string): Promise<string> {
		try {
			// Use dynamic import to load markdown-it
			const md = new MarkdownIt({
				html: true, // Enable HTML tags in source
				linkify: false, // Auto-convert URL-like text to links
				typographer: true // Enable some language-neutral replacement + quotes beautification
			})
			md.use(MarkdownItContainer, 'note', {
				validate: (params: string) => params.trim().match(/^note\s+(.*)$/),
				render: (tokens: any[], idx: number) => {
					if (tokens[idx].nesting === 1) {
						// Opening tag
						return `<div class="info-box"><p>${md.render(tokens[idx].info.trim().match(/^note\s+(.*)$/)[1])}</p>`
					} else {
						// Closing tag
						return '</div>'
					}
				}
			})

			return md.render(markdown)
		} catch (error) {
			console.error('Error converting markdown to HTML:', error)
			// Fallback: return the original content with basic line break conversion
			return markdown.replace(/\n/g, '<br>')
		}
	}

	// Effect to update HTML when content changes
	$effect(() => {
		if (mounted && content) {
			convertMarkdownToHtml(content).then((html) => {
				htmlContent = html
			})
		}
	})

	onMount(() => {
		mounted = true
		if (content) {
			convertMarkdownToHtml(content).then((html) => {
				htmlContent = html
			})
		}
	})
</script>

<div class="markdown-content {className}">
	{@html htmlContent}
</div>
