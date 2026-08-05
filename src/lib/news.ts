export const NEWS_TAG_LABELS: Record<string, string> = {
	guepard: 'Guépard',
	tigre: 'Tigre',
	corail: 'Corail',
	baleine: 'Baleine',
	dauphin: 'Dauphin',
	requin: 'Requin',
	'rhinoceros-noir': 'Rhinocéros noir',
	lion: 'Lion',
	'pingouin-humboldt': 'Pingouin de Humboldt',
	'thon-rouge': 'Thon rouge',
	IUCN: 'Biodiversité',
};

export function newsTagLabel(tag: string): string {
	return NEWS_TAG_LABELS[tag] ?? tag;
}

export function formatDate(iso: string): string {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) {
		return iso;
	}
	return new Intl.DateTimeFormat('fr-FR', {
		dateStyle: 'long',
		timeZone: 'UTC',
	}).format(date);
}

export function excerpt(body: string | undefined, max = 220): string {
	const text = (body ?? '').replace(/[#*_\[\]]/g, ' ').replace(/\s+/g, ' ').trim();
	return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}
