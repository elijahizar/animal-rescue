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