import tailwindcss from '@tailwindcss/vite'
import { glob } from 'glob'
import path from 'node:path'
import { defineConfig } from 'vite'
import { viteDefine } from './vite.common.config.js'

// Get all TypeScript files in src/scripts
const scriptEntries = glob.sync('src/scripts/**/*.ts').reduce(
	(entries: Record<string, string>, file: string) => {
		const name = path.basename(file, '.ts')
		entries[name] = path.resolve(file)
		return entries
	},
	{} as Record<string, string>
)

const styleEntries = glob.sync('src/styles/**/*.css').reduce(
	(entries: Record<string, string>, file: string) => {
		const name = path.basename(file, '.css')
		entries[name] = path.resolve(file)
		return entries
	},
	{} as Record<string, string>
)

export default defineConfig({
	define: viteDefine,
	resolve: {
		alias: {
			$lib: path.resolve('src/lib')
		}
	},
	plugins: [tailwindcss()],
	build: {
		outDir: 'static',
		emptyOutDir: false,
		cssCodeSplit: true,
		lib: {
			entry: scriptEntries,
			formats: ['es'],
			fileName: (format, name) => `${name}.js`
		},
		rollupOptions: {
			input: { ...scriptEntries, ...styleEntries },
			output: {
				entryFileNames: (chunkInfo) => {
					// Check if this entry is a CSS file
					const isStyle = Object.keys(styleEntries).includes(chunkInfo.name)
					return isStyle ? 'styles/[name].js' : 'scripts/[name].js'
				},
				assetFileNames: (assetInfo) => {
					// Handle CSS assets
					if (assetInfo.name?.endsWith('.css')) {
						return 'styles/[name][extname]'
					}
					return '[name][extname]'
				},
				chunkFileNames: 'scripts/[name].js'
			}
		}
	}
})
