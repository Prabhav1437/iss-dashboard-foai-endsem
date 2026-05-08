import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CardSkeleton } from './Loader';
import ErrorState from './ErrorState';
import { Map, Navigation } from 'lucide-react';

const issIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:44px;height:44px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:rgba(99,102,241,0.2);
        border:2px solid rgba(99,102,241,0.6);
        animation:pulse-dot 2s infinite;
      "></div>
      <div style="
        position:absolute;inset:6px;border-radius:50%;
        background:linear-gradient(135deg,#6366f1,#a855f7);
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 0 20px rgba(99,102,241,0.8);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 10.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z"/>
          <path d="M2 10.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
          <path d="M7 7V5.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V7"/>
          <path d="M7 17v1.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V17"/>
          <path d="M12 7v10"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -24],
});

const MapUpdater = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], map.getZoom(), { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
};

const ISSMap = ({ data, positions, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="glass fade-in" style={{ height: '380px' }}>
        <CardSkeleton rows={4} />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  const lat = data?.latitude ?? 0;
  const lng = data?.longitude ?? 0;
  const path = positions?.map(p => [p.latitude, p.longitude]) || [];

  return (
    <div className="glass fade-in overflow-hidden" style={{ height: '380px' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium text-slate-200">ISS Ground Track</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Navigation className="w-3 h-3 text-cyan-400" />
          <span className="font-mono">{lat.toFixed(4)}°, {lng.toFixed(4)}°</span>
        </div>
      </div>

      <MapContainer
        center={[lat, lng]}
        zoom={3}
        style={{ height: 'calc(100% - 48px)', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <MapUpdater lat={lat} lng={lng} />
        {path.length > 1 && (
          <Polyline positions={path} color="#6366f1" weight={3} opacity={0.6} dashArray="5, 10" />
        )}
        <Marker position={[lat, lng]} icon={issIcon}>
          <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
            ISS is here
          </Tooltip>
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '160px' }}>
              <strong style={{ color: '#6366f1', display: 'block', marginBottom: '6px' }}>🛸 ISS Position</strong>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.8' }}>
                <div>📍 {lat.toFixed(4)}°, {lng.toFixed(4)}°</div>
                <div>⏱ {new Date(data?.timestamp * 1000).toLocaleTimeString()}</div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ISSMap;
