import React, { useState } from 'react';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Crosshair, 
  Filter, 
  Radio, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Home, 
  Navigation,
  Compass,
  CheckCircle2,
  Minimize2
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import { tacticalAudio } from '../utils/audioSystem';

export default function TacticalMap({ 
  fullscreen = false, 
  onToggleFullscreen,
  height = '520px'
}) {
  const { 
    theme, 
    scenarioData, 
    incidents, 
    selectedIncidentId, 
    selectIncident, 
    responders, 
    shelters, 
    hazards, 
    routes 
  } = useOperations();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayers, setActiveLayers] = useState({
    hazards: true,
    shelters: true,
    units: true,
    incidents: true,
    evacRoutes: true,
    radar: true
  });
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const toggleLayer = (layerKey) => {
    tacticalAudio.playTacticalBeep(1000, 0.03, 0.02);
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity === 'ALL') return true;
    return inc.triageCode === filterSeverity;
  });

  const handleIncidentClick = (inc) => {
    selectIncident(inc.id, true);
    setSelectedEntity({ type: 'incident', data: inc });
  };

  const handleShelterClick = (s) => {
    tacticalAudio.playTacticalBeep(1200, 0.05, 0.03);
    setSelectedEntity({ type: 'shelter', data: s });
  };

  const handleResponderClick = (u) => {
    tacticalAudio.playTacticalBeep(1100, 0.05, 0.03);
    setSelectedEntity({ type: 'responder', data: u });
  };

  const resetView = () => {
    setZoomLevel(1);
    tacticalAudio.playTacticalBeep(900, 0.04, 0.02);
  };

  const isLight = theme === 'light';

  return (
    <div className="card" style={{
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: fullscreen ? 'calc(100vh - 100px)' : height,
      backgroundColor: 'var(--surface-primary)',
      border: '1px solid var(--border-subtle)'
    }}>
      {/* Top Map Action Bar */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 14,
        right: 14,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none'
      }}>
        {/* Layer Controls Pill */}
        <div style={{
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(17, 24, 39, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'auto',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <button
            onClick={() => setIsLayerPanelOpen(prev => !prev)}
            className="btn btn-ghost btn-xs"
            style={{ fontWeight: 600, gap: '5px' }}
          >
            <Layers size={13} color="var(--accent)" />
            <span>LAYERS</span>
          </button>

          <span style={{ color: 'var(--border-medium)' }}>|</span>

          {/* Quick Layer Toggles */}
          {[
            { key: 'hazards', label: 'Hazards', color: 'var(--critical)' },
            { key: 'incidents', label: 'Incidents', color: 'var(--warning)' },
            { key: 'shelters', label: 'Shelters', color: 'var(--success)' },
            { key: 'units', label: 'Fleet', color: 'var(--accent)' },
            { key: 'evacRoutes', label: 'Routes', color: 'var(--info)' }
          ].map(l => (
            <button
              key={l.key}
              onClick={() => toggleLayer(l.key)}
              className="btn btn-xs"
              style={{
                backgroundColor: activeLayers[l.key] ? (isLight ? 'var(--surface-tertiary)' : 'var(--surface-secondary)') : 'transparent',
                borderColor: activeLayers[l.key] ? 'var(--border-medium)' : 'transparent',
                color: activeLayers[l.key] ? 'var(--text-primary)' : 'var(--text-muted)',
                padding: '2px 7px',
                fontSize: '11px'
              }}
            >
              <span className="status-dot" style={{ backgroundColor: activeLayers[l.key] ? l.color : 'var(--border-medium)', width: '6px', height: '6px' }} />
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Severity Filter & Map Zoom Tools */}
        <div style={{
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(17, 24, 39, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'auto',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>PRIORITY:</span>
          {['ALL', 'RED', 'YELLOW'].map(f => (
            <button
              key={f}
              onClick={() => {
                tacticalAudio.playTacticalBeep(1100, 0.03, 0.02);
                setFilterSeverity(f);
              }}
              className="btn btn-xs"
              style={{
                backgroundColor: filterSeverity === f ? 'var(--accent)' : 'transparent',
                color: filterSeverity === f ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '10px',
                padding: '2px 6px'
              }}
            >
              {f === 'ALL' ? 'ALL' : f === 'RED' ? 'P1' : 'P2'}
            </button>
          ))}

          <span style={{ color: 'var(--border-medium)' }}>|</span>

          {/* Zoom controls */}
          <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))} className="btn btn-ghost btn-xs" style={{ padding: '3px' }} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.8))} className="btn btn-ghost btn-xs" style={{ padding: '3px' }} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <button onClick={resetView} className="btn btn-ghost btn-xs" style={{ padding: '3px' }} title="Fit to Region">
            <Crosshair size={14} />
          </button>
          {onToggleFullscreen && (
            <button onClick={onToggleFullscreen} className="btn btn-ghost btn-xs" style={{ padding: '3px' }} title="Toggle Fullscreen">
              {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* SVG Canvas Stage */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-main)' }}>
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s ease-out'
          }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradients tailored for Light and Dark themes */}
            <radialGradient id="floodHazardGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isLight ? "rgba(37, 99, 235, 0.25)" : "rgba(37, 99, 235, 0.45)"} />
              <stop offset="70%" stopColor={isLight ? "rgba(8, 145, 178, 0.12)" : "rgba(34, 211, 238, 0.25)"} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <radialGradient id="fireHazardGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isLight ? "rgba(220, 38, 38, 0.3)" : "rgba(255, 77, 90, 0.55)"} />
              <stop offset="70%" stopColor={isLight ? "rgba(217, 119, 6, 0.15)" : "rgba(251, 191, 36, 0.25)"} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <radialGradient id="radarBeamGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isLight ? "rgba(8, 145, 178, 0.18)" : "rgba(34, 211, 238, 0.2)"} />
              <stop offset="80%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Cartographic Land & River Background */}
          <rect width="100" height="100" fill={isLight ? "var(--map-land)" : "#0c1220"} />
          
          {/* Simulated River / Coastline */}
          <path
            d="M 0,28 Q 28,38 48,26 T 85,42 T 100,36 L 100,100 L 0,100 Z"
            fill={isLight ? "var(--map-water)" : "#080E1C"}
            stroke={isLight ? "var(--map-land-stroke)" : "#1B2A47"}
            strokeWidth="0.3"
          />

          {/* Subtle Grid Lines */}
          <g stroke="var(--map-grid)" strokeWidth="0.15">
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(c => (
              <React.Fragment key={c}>
                <line x1={c} y1="0" x2={c} y2="100" strokeDasharray="1, 3" />
                <line x1="0" y1={c} x2="100" y2={c} strokeDasharray="1, 3" />
              </React.Fragment>
            ))}
          </g>

          {/* Radar Sweep Animation (Restrained & smooth) */}
          {activeLayers.radar && (
            <g className="radar-sweep-beam">
              <path d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z" fill="url(#radarBeamGrad)" opacity={isLight ? 0.6 : 0.8} />
              <line x1="50" y1="50" x2="100" y2="50" stroke="var(--accent)" strokeWidth="0.25" opacity="0.6" />
            </g>
          )}

          {/* HAZARDS LAYER */}
          {activeLayers.hazards && hazards.map(h => {
            const isFire = h.type === 'fire' || h.type === 'smoke';
            return (
              <g key={h.id}>
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={h.r}
                  fill={isFire ? "url(#fireHazardGrad)" : "url(#floodHazardGrad)"}
                  stroke={isFire ? "var(--critical)" : "var(--accent)"}
                  strokeWidth="0.25"
                  strokeDasharray="1.5, 1"
                />
                <text
                  x={h.x}
                  y={h.y - h.r - 1.2}
                  fill={isFire ? "var(--critical)" : "var(--accent)"}
                  fontSize="2"
                  textAnchor="middle"
                  fontFamily="Inter"
                  fontWeight="600"
                >
                  {h.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* EVACUATION CORRIDORS */}
          {activeLayers.evacRoutes && routes && (
            <g>
              {/* Legacy Blocked Route */}
              <polyline
                points={routes.legacyRoute.coordinates.map(c => `${c.x},${c.y}`).join(' ')}
                fill="none"
                stroke="var(--map-route-danger)"
                strokeWidth="0.55"
                strokeDasharray="1.5, 1.5"
                opacity="0.8"
              />

              {/* Dynamic Aegis Safe Route */}
              <polyline
                points={routes.aegisRoute.coordinates.map(c => `${c.x},${c.y}`).join(' ')}
                fill="none"
                stroke="var(--map-route-safe)"
                strokeWidth="0.9"
                opacity="0.95"
              />

              {/* Safe Waypoints */}
              {routes.aegisRoute.coordinates.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="1.1"
                  fill="var(--map-route-safe)"
                  stroke="#fff"
                  strokeWidth="0.3"
                />
              ))}
            </g>
          )}

          {/* SHELTERS */}
          {activeLayers.shelters && shelters.map(s => (
            <g
              key={s.id}
              onClick={() => handleShelterClick(s)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={s.x} cy={s.y} r="2.8" fill={isLight ? "#ECFDF5" : "rgba(52, 211, 153, 0.2)"} stroke="var(--success)" strokeWidth="0.4" />
              <rect x={s.x - 1} y={s.y - 1} width="2" height="2" fill="var(--success)" rx="0.3" />
              <text x={s.x} y={s.y + 4.4} fill={isLight ? "#065F46" : "#A7F3D0"} fontSize="1.8" textAnchor="middle" fontFamily="Inter" fontWeight="600">
                {s.name}
              </text>
            </g>
          ))}

          {/* RESPONDER UNITS */}
          {activeLayers.units && responders.map(u => (
            <g
              key={u.id}
              onClick={() => handleResponderClick(u)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={u.x} cy={u.y} r="2.4" fill={isLight ? "#EFF6FF" : "rgba(96, 165, 250, 0.2)"} stroke="var(--info)" strokeWidth="0.4" />
              <polygon
                points={`${u.x},${u.y - 1.2} ${u.x + 1},${u.y + 1} ${u.x - 1},${u.y + 1}`}
                fill="var(--info)"
              />
              <text x={u.x} y={u.y - 3} fill={isLight ? "#1E40AF" : "#BFDBFE"} fontSize="1.6" textAnchor="middle" fontFamily="JetBrains Mono">
                {u.callsign.split(' ')[0]}
              </text>
            </g>
          ))}

          {/* INCIDENTS */}
          {activeLayers.incidents && filteredIncidents.map(inc => {
            const isSelected = selectedIncidentId === inc.id;
            const isRed = inc.triageCode === 'RED';
            return (
              <g
                key={inc.id}
                onClick={() => handleIncidentClick(inc)}
                style={{ cursor: 'pointer' }}
              >
                {/* Selection halo */}
                {isSelected && (
                  <circle
                    cx={inc.coords.x}
                    cy={inc.coords.y}
                    r="4.2"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="0.5"
                    strokeDasharray="1, 1"
                  />
                )}

                {/* Marker circle */}
                <circle
                  cx={inc.coords.x}
                  cy={inc.coords.y}
                  r={isRed ? 2.4 : 2}
                  fill={isRed ? "var(--critical)" : "var(--warning)"}
                  stroke="#FFFFFF"
                  strokeWidth="0.4"
                />

                {/* Label */}
                <text
                  x={inc.coords.x}
                  y={inc.coords.y + 4}
                  fill={isRed ? "var(--critical)" : "var(--warning)"}
                  fontSize="1.7"
                  textAnchor="middle"
                  fontFamily="Inter"
                  fontWeight="700"
                >
                  {inc.id.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Bottom Status & Coordinates Watermark */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: 14,
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          gap: '14px',
          fontFamily: 'var(--font-mono)',
          pointerEvents: 'none'
        }}>
          <span>37°46'29" N, 122°25'10" W</span>
          <span>DATUM: WGS-84</span>
          <span>PROJECTION: WEB MERCATOR</span>
        </div>

        {/* Bottom Right Map Legend */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          right: 14,
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(17, 24, 39, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="status-dot status-dot-critical" />
            <span>P1 Critical</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="status-dot status-dot-warning" />
            <span>P2 Delayed</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="status-dot status-dot-success" />
            <span>Shelter</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="status-dot status-dot-info" />
            <span>Responder</span>
          </span>
        </div>
      </div>
    </div>
  );
}
