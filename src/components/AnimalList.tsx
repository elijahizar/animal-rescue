import { useMemo, useState } from 'react';
import { IUCN_STATUS } from '../lib/iucn';
import { CAUSES, CAUSE_IDS } from '../lib/causes';

export interface AnimalListItem {
	slug: string;
	name: string;
	scientificName: string;
	iucnStatus: keyof typeof IUCN_STATUS;
	causes: string[];
	continents: string[];
	image?: string;
}

interface Props {
	animals: AnimalListItem[];
	baseUrl: string;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
	return (
		<button
			type="button"
			className={`chip ${active ? 'chip-active' : ''}`}
			aria-pressed={active}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export default function AnimalList({ animals, baseUrl }: Props) {
	const [query, setQuery] = useState('');
	const [causes, setCauses] = useState<Set<string>>(new Set());
	const [statuses, setStatuses] = useState<Set<string>>(new Set());
	const [continents, setContinents] = useState<Set<string>>(new Set());

	const allContinents = useMemo(
		() => [...new Set(animals.flatMap((a) => a.continents))].sort(),
		[animals],
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return animals.filter((animal) => {
			if (causes.size && !animal.causes.some((c) => causes.has(c))) return false;
			if (statuses.size && !statuses.has(animal.iucnStatus)) return false;
			if (continents.size && !animal.continents.some((c) => continents.has(c))) return false;
			if (q) {
				const haystack = `${animal.name} ${animal.scientificName}`.toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			return true;
		});
	}, [animals, query, causes, statuses, continents]);

	const toggle = (set: Set<string>, setter: (s: Set<string>) => void, value: string) => {
		const next = new Set(set);
		if (next.has(value)) {
			next.delete(value);
		} else {
			next.add(value);
		}
		setter(next);
	};

	return (
		<div className="animal-list">
			<div className="filters">
				<input
					type="search"
					className="search-input"
					placeholder="Rechercher une espèce…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>

				<fieldset className="filter-group">
					<legend>Causes</legend>
					{CAUSE_IDS.map((id) => (
						<Chip
							key={id}
							active={causes.has(id)}
							onClick={() => toggle(causes, setCauses, id)}
						>
							{CAUSES[id].label}
						</Chip>
					))}
				</fieldset>

				<fieldset className="filter-group">
					<legend>Statut IUCN</legend>
					{Object.entries(IUCN_STATUS).map(([code, meta]) => (
						<Chip
							key={code}
							active={statuses.has(code)}
							onClick={() => toggle(statuses, setStatuses, code)}
						>
							{code} · {meta.label}
						</Chip>
					))}
				</fieldset>

				<fieldset className="filter-group">
					<legend>Continent</legend>
					{allContinents.map((continent) => (
						<Chip
							key={continent}
							active={continents.has(continent)}
							onClick={() => toggle(continents, setContinents, continent)}
						>
							{continent}
						</Chip>
					))}
				</fieldset>
			</div>

			{filtered.length === 0 ? (
				<p className="empty">Aucune espèce ne correspond à ces critères.</p>
			) : (
				<div className="cards">
					{filtered.map((animal) => {
						const status = IUCN_STATUS[animal.iucnStatus];
						return (
							<a className="card" href={`${baseUrl}/${animal.slug}/`} key={animal.slug}>
								{animal.image && <img src={animal.image} alt={animal.name} loading="lazy" />}
								<div className="card-body">
									<div className="card-title-row">
										<h3>{animal.name}</h3>
										<span className="status-badge" style={{ background: status.color }}>
											{animal.iucnStatus}
										</span>
									</div>
									<p className="card-scientific">{animal.scientificName}</p>
									<p className="card-continents">{animal.continents.join(' · ')}</p>
								</div>
							</a>
						);
					})}
				</div>
			)}
		</div>
	);
}
