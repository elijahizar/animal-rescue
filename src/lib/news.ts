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
	'ours-a-lunettes': 'Ours à lunettes',
	'condor-des-andes': 'Condor des Andes',
	'chat-des-andes': 'Chat des Andes',
	'loutre-marine': 'Loutre marine',
	'loutre-geante': 'Loutre géante',
	'dauphin-rose-amazonie': 'Dauphin rose de l’Amazonie',
	'lamantin-amazonie': 'Lamantin d’Amazonie',
	'singe-araignee-noir': 'Singe-araignée noir',
	'singe-choro-queue-jaune': 'Singe choro à queue jaune',
	'singe-tocon-san-martin': 'Singe tocón de San Martín',
	'tapir-terrestre': 'Tapir terrestre',
	'tapir-des-andes': 'Tapir des Andes',
	'harpie-feroce': 'Harpie féroce',
	'grand-fourmilier': 'Grand fourmilier',
	'grebe-titicaca': 'Grèbe du lac Titicaca',
	'grenouille-titicaca': 'Grenouille géante du lac Titicaca',
	'pava-aliblanca': 'Pava à ailes blanches',
	'perruche-tumbes': 'Perruche de Tumbes',
	'crocodile-tumbes': 'Crocodile de Tumbes',
	'tortue-imbriquee': 'Tortue imbriquée',
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
