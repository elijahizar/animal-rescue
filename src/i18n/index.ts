export const locales = ['fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const ui = {
	fr: {
		'brand.name': 'Animal Rescue',
		'brand.tagline': "Protéger les espèces menacées",
		'nav.aide': 'Aide',
		'nav.infos': 'Infos',
		'nav.carte': 'Carte',
		'nav.aider': 'Aider',
		'nav.apropos': 'À propos',
		'footer.legal.mentions': 'Mentions légales',
		'footer.legal.confidentialite': 'Politique de confidentialité',
	},
} as const;

export type UiKeys = keyof (typeof ui)[Locale];

export function getUi(locale: Locale = defaultLocale) {
	return ui[locale];
}
