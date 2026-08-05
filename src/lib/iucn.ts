export const IUCN_STATUS = {
	CR: { label: 'En danger critique', color: '#c1121f', order: 0 },
	EN: { label: 'En danger', color: '#e76f51', order: 1 },
	VU: { label: 'Vulnérable', color: '#e9c46a', order: 2 },
	NT: { label: 'Quasi menacé', color: '#2a9d8f', order: 3 },
	LC: { label: 'Préoccupation mineure', color: '#588157', order: 4 },
} as const;

export type IucnStatusCode = keyof typeof IUCN_STATUS;