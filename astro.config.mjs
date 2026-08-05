// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// GitHub Pages project site (subpath). Sin dominio propio.
	site: 'https://elijahizar.github.io',
	base: '/animal-rescue/',

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