export function siteUrl(path = ''): string {
	const site = import.meta.env.SITE as string;
	const base = import.meta.env.BASE_URL as string;
	const baseNoSlash = base.replace(/^\/|\/$/g, '');
	let cleanPath = path.replace(/^\/+/, '');
	if (cleanPath === baseNoSlash || cleanPath.startsWith(`${baseNoSlash}/`)) {
		cleanPath = cleanPath.slice(baseNoSlash.length).replace(/^\/+/, '');
	}
	return new URL(`${base}${cleanPath}`, site).href;
}

// Wikimedia solo genera thumbnails en pasos estándar (T414805);
// anchos arbitrarios responden HTTP 400.
const WIKIMEDIA_THUMB_STEPS = [20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840] as const;

export function commonsSrcset(src: string, widths: readonly number[] = [500, 960]): string {
	const steps: readonly number[] = WIKIMEDIA_THUMB_STEPS;
	return widths
		.filter((width) => steps.includes(width))
		.map((width) => `${src.replace(/\/[0-9]+px-(?=[^/]*$)/, `/${width}px-`)} ${width}w`)
		.join(', ');
}