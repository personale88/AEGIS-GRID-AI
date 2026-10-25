import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Radio, 
  Crosshair, 
  Navigation, 
  MapPin, 
  Wind, 
  Droplet, 
  Flame, 
  Activity, 
  Truck, 
  Send,
  Zap,
  Info
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioSystem';

export default function TacticalMap({ 
  scenario, 
  onSelectIncident, 
  onDispatchUnit,
  onNavigateToEvac,
  addedIncidents = []
}) {
  const [activeLayers, setActiveLayers] = useState({
    hazards: true,
    shelters: true,
    units: true,
    incidents: true,
    evacRoutes: true,
    radar: true
  });

  const [selectedPin, setSelectedPin] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const allIncidents = [...scenario.incidents, ...addedIncidents];

  const filteredIncidents = allIncidents.filter(inc => {
    if (filterSeverity === 'ALL') return true;
    return inc.triageCode === filterSeverity;
  });

  const toggleLayer = (layerKey) => {
    tacticalAudio.playTacticalBeep(900, 0.04, 0.03);
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handlePinClick = (pin, type) => {
    tacticalAudio.playTacticalBeep(1200, 0.08, 0.05);
    setSelectedPin({ ...pin, pinType: type });
  };

  const handleDispatch = (incidentId) => {
    tacticalAudio.playDispatchConfirmed();
    onDispatchUnit(incidentId);
    if (selectedPin && selectedPin.id === incidentId) {
      setSelectedPin(prev => ({ ...prev, dispatched: true }));
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', height: 'calc(100vh - 140px)', minHeight: '680px' }}>
      {/* Map Main Canvas Area */}
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Map Top Bar Controls */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          {/* Layer Toggles Pill */}
          <div style={{
            background: 'rgba(9, 13, 24, 0.88)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'auto',
            boxShadow: 'var(--shadow-card)'
          }}>
            <Layers size={14} color="var(--cyan)" />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Layers:</span>
            
            {[
              { key: 'hazards', label: 'Hazards', color: '#ff3366' },
              { key: 'incidents', label: 'Incidents', color: '#f59e0b' },
              { key: 'shelters', label: 'Shelters', color: '#10b981' },
              { key: 'units', label: 'Units', color: '#38bdf8' },
              { key: 'evacRoutes', label: 'Corridors', color: '#8b5cf6' },
              { key: 'radar', label: 'Radar', color: 'var(--cyan)' }
            ].map(l => (
              <button
                key={l.key}
                onClick={() => toggleLayer(l.key)}
                style={{
                  background: activeLayers[l.key] ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: activeLayers[l.key] ? `1px solid ${l.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  color: activeLayers[l.key] ? '#fff' : 'var(--text-muted)',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Incident Filter & Live Status */}
          <div style={{
            background: 'rgba(9, 13, 24, 0.88)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'auto'
          }}>
            <Crosshair size={14} color="var(--cyan)" />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Triage Filter:</span>
            {['ALL', 'RED', 'YELLOW'].map(f => (
              <button
                key={f}
                onClick={() => {
                  tacticalAudio.playTacticalBeep(1000, 0.03, 0.02);
                  setFilterSeverity(f);
                }}
                style={{
                  background: filterSeverity === f ? 'var(--cyan)' : 'transparent',
                  color: filterSeverity === f ? '#000' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Tactical Vector Map */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', background: '#070b14' }}>
          <svg 
            viewBox="0 0 100 100" 
            style={{ width: '100%', height: '100%', display: 'block' }}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Radar gradient */}
              <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 240, 255, 0.25)" />
                <stop offset="70%" stopColor="rgba(0, 240, 255, 0.04)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Hazard Flood gradient */}
              <radialGradient id="floodGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(37, 99, 235, 0.45)" />
                <stop offset="60%" stopColor="rgba(0, 240, 255, 0.25)" />
                <stop offset="100%" stopColor="rgba(0, 240, 255, 0.0)" />
              </radialGradient>

              {/* Hazard Fire gradient */}
              <radialGradient id="fireGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255, 51, 102, 0.6)" />
                <stop offset="60%" stopColor="rgba(245, 158, 11, 0.3)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Hazard Seismic gradient */}
              <radialGradient id="seismicGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.55)" />
                <stop offset="70%" stopColor="rgba(239, 68, 68, 0.2)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Tactical Grid Lines */}
            <g opacity="0.15" stroke="#38bdf8" strokeWidth="0.15">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(v => (
                <React.Fragment key={v}>
                  <line x1={v} y1="0" x2={v} y2="100" strokeDasharray="1, 2" />
                  <line x1="0" y1={v} x2="100" y2={v} strokeDasharray="1, 2" />
                </React.Fragment>
              ))}
            </g>

            {/* Concentric Tactical Coordinate Rings */}
            <circle cx="50" cy="50" r="20" fill="none" stroke="#00f0ff" strokeWidth="0.1" opacity="0.25" strokeDasharray="2, 2" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#00f0ff" strokeWidth="0.1" opacity="0.2" strokeDasharray="2, 2" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="#00f0ff" strokeWidth="0.1" opacity="0.15" />

            {/* Rotating Radar Sweep */}
            {activeLayers.radar && (
              <g className="radar-sweep-beam">
                <path d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z" fill="url(#radarSweep)" />
                <line x1="50" y1="50" x2="100" y2="50" stroke="var(--cyan)" strokeWidth="0.3" opacity="0.8" />
              </g>
            )}

            {/* Simulated Geographic Landmass / River Contour */}
            <path
              d="M 0,25 Q 25,35 45,28 T 85,42 T 100,38 L 100,100 L 0,100 Z"
              fill="rgba(255, 255, 255, 0.015)"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.2"
            />
            <path
              d="M 15,0 Q 30,45 28,65 T 48,100"
              fill="none"
              stroke="rgba(0, 240, 255, 0.2)"
              strokeWidth="1.2"
              strokeDasharray="2, 1"
            />

            {/* HAZARDS LAYER */}
            {activeLayers.hazards && scenario.hazards.map(h => {
              const grad = h.type === 'fire' || h.type === 'smoke' ? 'url(#fireGrad)' :
                           h.type === 'collapse' || h.type === 'gas' ? 'url(#seismicGrad)' : 'url(#floodGrad)';
              return (
                <g key={h.id}>
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={h.r}
                    fill={grad}
                    stroke={h.type === 'fire' ? '#ff3366' : '#00f0ff'}
                    strokeWidth="0.2"
                    strokeDasharray="1, 1"
                    opacity="0.85"
                  />
                  <text
                    x={h.x}
                    y={h.y - h.r - 1}
                    fill={h.type === 'fire' ? '#ff758f' : '#7dd3fc'}
                    fontSize="2.2"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                    opacity="0.85"
                  >
                    ⚠️ {h.label.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* EVACUATION CORRIDORS LAYER */}
            {activeLayers.evacRoutes && scenario.routes && (
              <g>
                {/* Legacy Dangerous Route (Red Dashed) */}
                <polyline
                  points={scenario.routes.legacyRoute.coordinates.map(c => `${c.x},${c.y}`).join(' ')}
                  fill="none"
                  stroke="#ff3366"
                  strokeWidth="0.6"
                  strokeDasharray="1.5, 1.5"
                  opacity="0.7"
                />
                {/* Dangerous Intersection Markers */}
                <circle cx={scenario.routes.legacyRoute.coordinates[2].x} cy={scenario.routes.legacyRoute.coordinates[2].y} r="2.2" fill="rgba(255, 51, 102, 0.4)" stroke="#ff3366" strokeWidth="0.3" />
                <text 
                  x={scenario.routes.legacyRoute.coordinates[2].x} 
                  y={scenario.routes.legacyRoute.coordinates[2].y - 3} 
                  fill="#ff3366" 
                  fontSize="2" 
                  textAnchor="middle"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  🛑 ROADWAY SEVERED
                </text>

                {/* AegisGrid Dynamic Safe Route (Glowing Cyan/Green) */}
                <polyline
                  points={scenario.routes.aegisRoute.coordinates.map(c => `${c.x},${c.y}`).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="0.9"
                  opacity="0.9"
                />
                {scenario.routes.aegisRoute.coordinates.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="1.2"
                    fill="#10b981"
                    stroke="#fff"
                    strokeWidth="0.3"
                  />
                ))}
              </g>
            )}

            {/* SHELTERS LAYER */}
            {activeLayers.shelters && scenario.shelters.map(s => (
              <g 
                key={s.id} 
                onClick={() => handlePinClick(s, 'shelter')}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={s.x} cy={s.y} r="3" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="0.4" />
                <circle cx={s.x} cy={s.y} r="1.5" fill="#10b981" />
                <text x={s.x} y={s.y + 4.5} fill="#34d399" fontSize="1.8" textAnchor="middle" fontFamily="Outfit" fontWeight="bold">
                  🏥 {s.name}
                </text>
              </g>
            ))}

            {/* FIRST RESPONDER UNITS LAYER */}
            {activeLayers.units && scenario.units.map(u => (
              <g 
                key={u.id}
                onClick={() => handlePinClick(u, 'unit')}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={u.x} cy={u.y} r="2.4" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" strokeWidth="0.4" />
                <polygon
                  points={`${u.x},${u.y - 1.5} ${u.x + 1.2},${u.y + 1.2} ${u.x - 1.2},${u.y + 1.2}`}
                  fill="#00f0ff"
                />
                <text x={u.x} y={u.y - 3} fill="#7dd3fc" fontSize="1.7" textAnchor="middle" fontFamily="JetBrains Mono">
                  ▲ {u.callsign}
                </text>
              </g>
            ))}

            {/* INCIDENTS LAYER */}
            {activeLayers.incidents && filteredIncidents.map(inc => {
              const isRed = inc.triageCode === 'RED';
              return (
                <g 
                  key={inc.id}
                  onClick={() => handlePinClick(inc, 'incident')}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Pulsing beacon ring */}
                  <circle 
                    cx={inc.coords.x} 
                    cy={inc.coords.y} 
                    r={isRed ? 4 : 3} 
                    fill={isRed ? "rgba(255, 51, 102, 0.25)" : "rgba(245, 158, 11, 0.2)"} 
                    stroke={isRed ? "#ff3366" : "#f59e0b"} 
                    strokeWidth="0.3"
                  />
                  <circle 
                    cx={inc.coords.x} 
                    cy={inc.coords.y} 
                    r="1.8" 
                    fill={isRed ? "#ff3366" : "#f59e0b"} 
                    stroke="#fff" 
                    strokeWidth="0.3"
                  />
                  {inc.dispatched && (
                    <text x={inc.coords.x} y={inc.coords.y + 4} fill="#10b981" fontSize="1.6" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">
                      ✓ DISPATCHED
                    </text>
                  )}
                  {!inc.dispatched && (
                    <text x={inc.coords.x} y={inc.coords.y + 4} fill={isRed ? "#ff758f" : "#fcd34d"} fontSize="1.6" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">
                      🚨 {inc.victims} TRAPPED
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Map Compass Rose & Lat/Long Watermark */}
          <div style={{
            position: 'absolute',
            bottom: 14,
            left: 16,
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            gap: '16px',
            pointerEvents: 'none'
          }}>
            <span>LAT: 37°46'29" N</span>
            <span>LON: 122°25'10" W</span>
            <span>ALT: +18m MSL</span>
            <span>DATUM: WGS-84</span>
          </div>

          <div style={{
            position: 'absolute',
            bottom: 14,
            right: 16,
            fontSize: '11px',
            color: 'var(--cyan)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(9, 13, 24, 0.85)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span className="live-dot" />
            <span>GEO-RADAR SWEEP: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Telemetry & Selected Pin Inspector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {/* Selected Pin Inspector */}
        {selectedPin ? (
          <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span className={`badge ${
                  selectedPin.triageCode === 'RED' ? 'badge-red' : 
                  selectedPin.triageCode === 'YELLOW' ? 'badge-yellow' : 'badge-cyan'
                }`}>
                  {selectedPin.pinType === 'incident' ? `TRIAGE: ${selectedPin.triageCode}` : selectedPin.pinType.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '15px', marginTop: '6px' }}>{selectedPin.title || selectedPin.name || selectedPin.callsign}</h3>
              </div>
              <button 
                onClick={() => setSelectedPin(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            {selectedPin.pinType === 'incident' && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  📍 {selectedPin.location}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '12px',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>TRAPPED CIVILIANS</span>
                    <strong style={{ color: '#ff3366', fontSize: '15px' }}>{selectedPin.victims} Persons</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>DAMAGE INDEX</span>
                    <strong style={{ color: '#fbbf24', fontSize: '15px' }}>{selectedPin.damageIndex}%</strong>
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <strong>Hazard:</strong> {selectedPin.hazardType}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => onSelectIncident(selectedPin)}
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: '12px', padding: '8px' }}
                  >
                    <Info size={14} />
                    <span>Run Full AI Triage Analysis</span>
                  </button>

                  <button
                    onClick={() => handleDispatch(selectedPin.id)}
                    className={`btn ${selectedPin.dispatched ? 'btn-outline' : 'btn-danger'}`}
                    style={{ width: '100%', fontSize: '12px', padding: '8px' }}
                    disabled={selectedPin.dispatched}
                  >
                    <Send size={14} />
                    <span>{selectedPin.dispatched ? 'Unit Dispatched & En Route' : 'Authorize Emergency Dispatch'}</span>
                  </button>
                </div>
              </div>
            )}

            {selectedPin.pinType === 'shelter' && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Status: <strong style={{ color: '#10b981' }}>{selectedPin.status}</strong>
                </p>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span>Capacity: {selectedPin.occupancy} / {selectedPin.capacity}</span>
                    <span style={{ color: 'var(--cyan)' }}>{Math.round((selectedPin.occupancy / selectedPin.capacity) * 100)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(selectedPin.occupancy / selectedPin.capacity) * 100}%`, height: '100%', background: 'var(--emerald-safe)' }} />
                  </div>
                </div>
                <div style={{ fontSize: '11px', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <div>Power: <strong>{selectedPin.power}</strong></div>
                  <div>Oxygen Tanks: <strong>{selectedPin.supplies.oxygenTanks} units</strong></div>
                  <div>Blood Units: <strong>{selectedPin.supplies.bloodUnits} units</strong></div>
                </div>
              </div>
            )}

            {selectedPin.pinType === 'unit' && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Status: <strong style={{ color: 'var(--cyan)' }}>{selectedPin.status}</strong>
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Current Target: <strong>{selectedPin.target}</strong>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <Crosshair size={28} color="var(--cyan)" style={{ margin: '8px auto', opacity: 0.6 }} />
            <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Tactical GIS Inspector</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Click any incident beacon, medical shelter, or rescue unit on the map to view real-time telemetry and dispatch resources.
            </p>
          </div>
        )}

        {/* Live Incident Priority Feed */}
        <div className="glass-panel" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="live-dot-red" />
              <span>Priority Incident Feed</span>
            </h4>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {filteredIncidents.length} Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            {filteredIncidents.map(inc => (
              <div
                key={inc.id}
                onClick={() => handlePinClick(inc, 'incident')}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-glow)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className={`badge ${inc.triageCode === 'RED' ? 'badge-red' : 'badge-yellow'}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                    {inc.triageCode}
                  </span>
                  <span className="mono" style={{ fontSize: '11px', color: inc.dispatched ? '#10b981' : '#ff3366', fontWeight: 600 }}>
                    {inc.dispatched ? '✓ EN ROUTE' : `🚨 ${inc.victims} TRAPPED`}
                  </span>
                </div>
                <h5 style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', marginBottom: '3px' }}>
                  {inc.title}
                </h5>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                  📍 {inc.location}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Evac Link */}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={onNavigateToEvac}
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '11px', padding: '8px' }}
            >
              <Navigation size={13} color="var(--cyan)" />
              <span>Open Evacuation Path Engine</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
