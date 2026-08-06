import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const animals = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/animals/fr' }),
	schema: ({ image }) =>
		z.object({
			slug: z.string(),
			name: z.string(),
			scientificName: z.string(),
			iucnStatus: z.enum(['CR', 'EN', 'VU', 'NT', 'LC']),
			gallery: z.array(
				z.object({
					image: image(),
					author: z.string(),
					page: z.string(),
					licence: z.string(),
					alt: z.string().optional(),
				}),
			),
			causes: z.array(z.string()),
			aider: z.string(),
			regions: z.array(z.string()),
			tags: z.array(z.string()).optional(),
		}),
});

const regions = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/regions/fr' }),
	schema: z.object({
		id: z.string(),
		animalId: z.string(),
		label: z.string(),
		continent: z.string(),
		lat: z.number(),
		lng: z.number(),
	}),
});

const news = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/news/fr' }),
	schema: z.object({
		title: z.string(),
		date: z.string(),
		url: z.string(),
		source: z.string(),
		animal: z.string(),
	}),
});

export const collections = { animals, regions, news };