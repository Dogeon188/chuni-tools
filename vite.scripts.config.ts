import { glob } from 'glob'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'

// Get all TypeScript files in src/scripts
const scriptEntries = glob.sync('src/scripts/**/*.ts').reduce(
	(entries: Record<string, string>, file: string) => {
		const name = path.basename(file, '.ts')
		entries[name] = path.resolve(file)
		return entries
	},
	{} as Record<string, string>
)

export default defineConfig({
	publicDir: 'build',
	define: {
		__ENV__: JSON.stringify(process.env.ENV || 'development')
	},
	resolve: {
		alias: {
			$lib: path.resolve('src/lib')
		}
	},
	server: {
		port: 5174,
		fs: {
			allow: ['..']
		},
		https: {
			key: fs.readFileSync('./.cert/key.pem'),
			cert: fs.readFileSync('./.cert/cert.pem')
		}
	},
	build: {
		outDir: 'build/scripts',
		emptyOutDir: true,
		lib: {
			entry: scriptEntries,
			formats: ['es'],
			fileName: (format, name) => `${name}.js`
		},
		rollupOptions: {
			output: {
				entryFileNames: '[name].js'
			}
		}
	}
})
