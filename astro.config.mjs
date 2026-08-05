// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// TODO: remplacer par l'URL finale après le déploiement Cloudflare Pages
	site: 'https://animal-rescue.pages.dev',

	i18n: {
		locales: ['fr'],
		defaultLocale: 'fr',
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: true,
		},
	},

	integrations: [react(), sitemap()],
});