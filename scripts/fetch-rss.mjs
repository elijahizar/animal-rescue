import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const OUT_DIR = new URL('../src/content/news/fr/', import.meta.url);

const FEEDS = [
	{ name: 'UICN Comité Français', url: 'https://uicn.fr/feed/' },
	{ name: 'WWF France', url: 'https://www.wwf.fr/rss.xml' },
	{ name: 'Le Monde — Planète', url: 'https://www.lemonde.fr/planete/rss_full.xml' },
	{ name: 'Reporterre', url: 'https://reporterre.net/spip.php?page=backend' },
	{ name: 'Sciences & Avenir', url: 'https://www.sciencesetavenir.fr/rss.xml' },
	{ name: 'Fondation Tara Océan', url: 'https://fondationtaraocean.org/feed/' },
];

const KEYWORDS = {
	guepard: ['guepard', 'cheetah', 'guépard', 'guépards', 'guepards'],
	tigre: ['tigre', 'tigres', 'tiger'],
	corail: ['corail', 'coraux', 'recif', 'récif', 'blanchissement'],
	baleine: ['baleine', 'baleines', 'cétacé', 'cétacés'],
	dauphin: ['dauphin', 'dauphins'],
	requin: ['requin', 'requins'],
	'rhinoceros-noir': ['rhinocéros', 'rhinoceros'],
	lion: ['lion blanc', 'lion', 'lions'],
	'pingouin-humboldt': ['humboldt', 'manchot'],
	'thon-rouge': ['thon rouge', 'thon'],
'ours-a-lunettes': ['ours à lunettes', 'ours andin', 'ours'],
	'condor-des-andes': ['condor', 'condors', 'vautour'],
	'chat-des-andes': ['chat des andes', 'chat andin', 'gato andino'],
	'loutre-marine': ['loutre', 'loutres'],
	'loutre-geante': ['loutre géante', 'giant otter', 'loutre'],
	'dauphin-rose-amazonie': ['dauphin rose', 'boto', 'inia'],
	'lamantin-amazonie': ['lamantin', 'lamantins', 'manati'],
	'singe-araignee-noir': ['singe araignée', 'ateles', 'spider monkey'],
	'singe-choro-queue-jaune': ['choro', 'woolly monkey', 'lagothrix'],
	'singe-tocon-san-martin': ['tocón', 'tocon', 'ouakari', 'uakari'],
	'tapir-terrestre': ['tapir', 'tapirs', 'sachavaca'],
	'tapir-des-andes': ['tapir des andes', 'tapir de montagne', 'danta'],
	'harpie-feroce': ['harpie', 'harpies', 'harpy eagle'],
	'grand-fourmilier': ['fourmilier', 'fourmiliers', 'anteater', 'oso hormiguero'],
	'grebe-titicaca': ['grèbe', 'grebe', 'titicaca'],
	'grenouille-titicaca': ['grenouille', 'grenouilles', 'titicaca', 'frog'],
	'pava-aliblanca': ['pava', 'pava aliblanca', 'penelope'],
	'perruche-tumbes': ['perruche', 'perruches', 'tumbes'],
	'crocodile-tumbes': ['crocodile', 'crocodiles', 'crocodylus'],
	'tortue-imbriquee': ['tortue', 'tortues', 'turtle', 'imbriquee', 'hawksbill'],
	'leopard-de-l-amour': ['léopard de l’amour', 'leopard de l’amour', "léopard de l'amour", 'amur leopard', 'léopard', 'leopard'],
	'saola': ['saola', 'pseudoryx', 'licorne d’asie'],
	'koala': ['koala', 'koalas'],
	'tarsier-des-philippines': ['tarsier', 'tarsiers', 'carlito'],
	'orang-outan': ['orang-outan', 'orang-outans', 'orangoutan', 'orangutan', 'pongo'],
	'chimpanze': ['chimpanzé', 'chimpanze', 'chimpanzés', 'pan troglodytes', 'grand singe', 'grands singes'],
	IUCN: ['iucn', 'espèce menacée', 'espèces menacées', 'biodiversité', 'faune sauvage'],
};

const MAX_ITEMS = 30;
const parser = new XMLParser({ ignoreAttributes: false });

const normalize = (text) =>
	text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function matchAnimal(title, description) {
	const haystack = normalize(`${title} ${description}`);
	for (const [animal, words] of Object.entries(KEYWORDS)) {
		if (words.some((word) => new RegExp(`\\b${escapeRegExp(normalize(word))}\\b`).test(haystack))) {
			return animal;
		}
	}
	return null;
}

function stripHtml(html) {
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function slugify(text) {
	return normalize(text)
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

function toIsoDate(value) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function itemToEntry(item, feedName) {
	const title = item.title ?? '';
	const url = item.link ?? '';
	const pubDate = toIsoDate(item.pubDate ?? item.isoDate ?? item.date ?? '');
	const description = stripHtml(item.description ?? item['content:encoded'] ?? '');
	return {
		title,
		url,
		pubDate,
		description,
		animal: matchAnimal(title, description),
		feedName,
	};
}

async function fetchFeed(feed) {
	const response = await fetch(feed.url, {
		headers: { 'user-agent': 'animal-rescue/0.1 (contact: dev@example.org)' },
		signal: AbortSignal.timeout(20000),
	});
	if (!response.ok) {
		throw new Error(`${feed.name}: HTTP ${response.status}`);
	}
	const xml = await response.text();
	const parsed = parser.parse(xml);
	const channel = parsed.rss?.channel ?? parsed.feed ?? null;
	if (!channel) {
		throw new Error(`${feed.name}: format inconnu`);
	}
	const items = channel.item ?? channel.entry ?? [];
	return items.map((item) => itemToEntry(item, feed.name));
}

async function main() {
	await mkdir(OUT_DIR, { recursive: true });

	const existing = new Set((await readdir(OUT_DIR)).filter((f) => f.endsWith('.md')));

	const entries = [];
	for (const feed of FEEDS) {
		try {
			const items = await fetchFeed(feed);
			const matched = items.filter((item) => item.animal);
			console.log(`${feed.name}: ${items.length} articles, ${matched.length} correspondants`);
			entries.push(...matched);
		} catch (error) {
			console.error(`Erreur ${feed.name}:`, error.message);
		}
	}

	entries.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));
	const kept = entries.slice(0, MAX_ITEMS);
	const slugs = new Map();

	let written = 0;
	for (const entry of kept) {
		const base = slugify(entry.title);
		const count = slugs.get(base) ?? 0;
		slugs.set(base, count + 1);
		const name = count === 0 ? base : `${base}-${count}`;
		const fileName = `${name}.md`;
		if (existing.has(fileName)) {
			continue;
		}
		const body = entry.description || entry.title;
		const content = `---
title: ${JSON.stringify(entry.title)}
date: ${JSON.stringify(entry.pubDate)}
url: ${JSON.stringify(entry.url)}
source: ${JSON.stringify(entry.feedName)}
animal: ${JSON.stringify(entry.animal)}
---

${body}
`;
		await writeFile(new URL(fileName, OUT_DIR), content, 'utf8');
		written += 1;
	}

	console.log(`Nouvelles entrées écrites: ${written} (total fichier: ${kept.length})`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
