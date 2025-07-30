import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import { defineConfig } from 'vitest/config';
import { viteDefine } from './vite.common.config.js';

export default defineConfig({
	define: viteDefine,
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './i18n/project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ["cookie", "baseLocale"]
		})
	],
	server: {
		cors: {
			origin: '*',
			credentials: true
		},
		fs: {
			allow: ['..']
		},
		hmr: {
			overlay: false
		},
		https: {
			key: fs.readFileSync('./.cert/key.pem'),
			cert: fs.readFileSync('./.cert/cert.pem')
		}
	},
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
