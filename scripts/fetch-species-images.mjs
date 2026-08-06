import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ANIMALS_DIR = new URL('../src/content/animals/fr/', import.meta.url);
const ASSETS_DIR = fileURLToPath(new URL('../src/assets/species/', import.meta.url));

const USER_AGENT = 'animal-rescue/1.0 (self-hosted migration)';
const PAUSE_MS = 700;
const RETRIES = 5;
const BASE_BACKOFF_MS = 1500;
const TIMEOUT_MS = 30_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function exists(p) {
	try {
		await access(p);
		return true;
	} catch {
		return false;
	}
}

function frontmatterOf(raw) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	return m ? m[1] : null;
}

function gallerySrcs(frontmatter) {
	const srcs = [];
	const re = /^\s*-\s*src:\s*(\S+)$/gm;
	let m;
	while ((m = re.exec(frontmatter)) !== null) srcs.push(m[1]);
	return srcs;
}

function extOf(url) {
	const clean = decodeURIComponent(url.split(/[?#]/)[0]).toLowerCase();
	const m = clean.match(/\.(jpe?g|png|gif|webp|svg|avif|tiff?)$/);
	if (!m) return 'jpg';
	return m[1] === 'jpeg' ? 'jpg' : m[1];
}

async function downloadTo(url, dest) {
	for (let attempt = 0; attempt <= RETRIES; attempt++) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
		try {
			const res = await fetch(url, {
				signal: controller.signal,
				headers: { 'User-Agent': USER_AGENT },
				redirect: 'follow',
			});
			if (!res.ok && !(attempt < RETRIES)) {
				throw new Error(`HTTP ${res.status}`);
			}
			if (!res.ok) {
				const retryAfter = Number(res.headers.get('retry-after')) || 0;
				const wait = Math.max(retryAfter * 1000, BASE_BACKOFF_MS * 2 ** attempt);
				console.warn(`↻ retry ${attempt + 1} en ${Math.round(wait / 1000)}s (HTTP ${res.status})`);
				clearTimeout(timer);
				await sleep(wait);
				continue;
			}
			const buf = Buffer.from(await res.arrayBuffer());
			await writeFile(dest, buf);
			return { bytes: buf.length, size: buf.length };
		} catch (err) {
			if (attempt >= RETRIES) throw err;
			if (err.name === 'AbortError') {
				console.warn(`↻ timeout, retry ${attempt + 1}`);
				clearTimeout(timer);
				await sleep(BASE_BACKOFF_MS * 2 ** attempt);
				continue;
			}
			clearTimeout(timer);
			throw err;
		} finally {
			clearTimeout(timer);
		}
	}
	throw new Error('retries agotados');
}

async function migrateFicha(fileName, opts = {}) {
	const { dryRun = false } = opts;
	const raw = await readFile(new URL(fileName, ANIMALS_DIR), 'utf8');
	const fm = frontmatterOf(raw);
	if (!fm) return { fileName, ok: false, reason: 'frontmatter' };

	const srcs = gallerySrcs(fm);
	if (srcs.length === 0) return { fileName, ok: false, reason: 'sin imagenes' };

	const slug = fileName.replace(/\.md$/, '');
	const dir = path.join(ASSETS_DIR, slug);
	if (!dryRun) await mkdir(dir, { recursive: true });

	const maps = new Map(); // src -> image key
	let failed = 0;

	for (let i = 0; i < srcs.length; i++) {
		const url = srcs[i];
		const ext = extOf(url);
		const key = `${i}.${ext}`;
		const dest = path.join(dir, key);

		if (dryRun) {
			maps.set(url, key);
			continue;
		}

		if (await exists(dest)) {
			maps.set(url, key);
			console.log(`= ${slug}/${key} (existe)`);
			continue;
		}

		try {
			const { size } = await downloadTo(url, dest);
			maps.set(url, key);
			console.log(`✓ ${slug}/${key} (${(size / 1024).toFixed(0)}Ko)`);
		} catch (err) {
			failed++;
			console.error(`✗ ${slug}/${key} (${i}): ${err.message}`);
		}
		await sleep(PAUSE_MS);
	}

	if (failed > 0) return { fileName, ok: false, reason: `${failed} descarga(s) fallida(s)` };
	if (dryRun) return { fileName, ok: true, images: srcs.length };

	let newFm = fm;
	for (const [url, key] of maps) {
		if (!newFm.includes(`src: ${url}`)) {
			return { fileName, ok: false, reason: `no-match: ${url.slice(0, 42)}` };
		}
		newFm = newFm.replaceAll(`src: ${url}`, `image: ../../../assets/species/${slug}/${key}`);
	}

	if (!dryRun) {
		await writeFile(new URL(fileName, ANIMALS_DIR), raw.replace(fm, newFm), 'utf8');
	}
	return { fileName, ok: true, images: srcs.length };
}

async function main() {
	const files = (await readdir(ANIMALS_DIR)).filter((f) => f.endsWith('.md')).sort();
	const dryRun = process.argv.includes('--dry-run');
	console.log(`Fichas: ${files.length} (${dryRun ? 'DRY RUN' : 'descarga'})`);

	if (!dryRun) await mkdir(ASSETS_DIR, { recursive: true });

	const results = [];
	for (const f of files) results.push(await migrateFicha(f, { dryRun }));

	const ok = results.filter((r) => r.ok);
	const bad = results.filter((r) => !r.ok);
	console.log(`\nResumen: ${ok.length}/${files.length} fichas OK`);
	for (const b of bad) console.log(`  - ${b.fileName}: ${b.reason}`);
	process.exitCode = bad.length ? 1 : 0;
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});