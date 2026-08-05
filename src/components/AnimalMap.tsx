import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface RegionMarker {
	id: string;
	label: string;
	lat: number;
	lng: number;
	detailUrl?: string;
	detailLabel?: string;
}

interface Props {
	regions: RegionMarker[];
	height?: number;
	fitToMarkers?: boolean;
}

const pinIcon = L.divIcon({
	className: 'animal-pin',
	html: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.7 0 0 6.7 0 15c0 11.3 15 25 15 25s15-13.7 15-25C30 6.7 23.3 0 15 0z" fill="#2d6a4f"/><circle cx="15" cy="15" r="6" fill="#fefae0"/></svg>`,
	iconSize: [30, 40],
	iconAnchor: [15, 40],
	popupAnchor: [0, -38],
});

export default function AnimalMap({ regions, height = 320, fitToMarkers = true }: Props) {
	const bounds = L.latLngBounds(regions.map((r) => [r.lat, r.lng] as [number, number]));

	return (
		<div style={{ height: `${height}px` }}>
			<MapContainer
				bounds={bounds}
				boundsOptions={fitToMarkers ? { padding: [40, 40], maxZoom: 5 } : undefined}
				center={fitToMarkers ? undefined : [20, 10]}
				zoom={fitToMarkers ? undefined : 2}
				scrollWheelZoom={false}
				style={{ height: '100%', width: '100%' }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{regions.map((region) => (
					<Marker key={region.id} position={[region.lat, region.lng]} icon={pinIcon}>
						<Popup>
							<strong>{region.label}</strong>
							{region.detailUrl && region.detailLabel && (
								<div>
									<a href={region.detailUrl} target="_self">
										{region.detailLabel}
									</a>
								</div>
							)}
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}