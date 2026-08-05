export const CAUSES = {
	deforestation: {
		label: 'Déforestation',
		color: '#2d6a4f',
	},
	braconnage: {
		label: 'Braconnage',
		color: '#bc6c25',
	},
	pollution: {
		label: 'Pollution',
		color: '#4263eb',
	},
	'changement-climatique': {
		label: 'Changement climatique',
		color: '#e76f51',
	},
	'perte-habitat': {
		label: "Perte d'habitat",
		color: '#6d597a',
	},
	surpeche: {
		label: 'Surpêche',
		color: '#0077b6',
	},
	'especes-invasives': {
		label: 'Espèces invasives',
		color: '#9d4edd',
	},
	'trafic-especes': {
		label: "Trafic d'espèces",
		color: '#c1121f',
	},
} as const;

export type CauseId = keyof typeof CAUSES;

export const CAUSE_IDS = Object.keys(CAUSES) as CauseId[];