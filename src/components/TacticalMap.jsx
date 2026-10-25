import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Crosshair, 
  Globe2,
  Satellite,
  Compass,
  MapPin,
  AlertTriangle,
  Users,
  Home,
  Navigation
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
    routes,
    userLiveLocation,
    isDetectingLocation,
    detectLiveLocation
  } = useOperations();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const layersGroupRef = useRef({});

  const [basemapType, setBasemapType] = useState('vector'); // 'vector' | 'satellite'
  const [activeLayers, setActiveLayers] = useState({
    hazards: true,
    shelters: true,
    units: true,
    incidents: true,
    evacRoutes: true
  });
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [mouseCoords, setMouseCoords] = useState({ lat: 37.7749, lng: -122.4194 });

  const isLight = theme === 'light';

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const center = scenarioData.geoCenter || [37.7749, -122.4194];
      const zoom = scenarioData.zoom || 13;

      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Track cursor coordinates
      map.on('mousemove', (e) => {
        setMouseCoords({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      });

      mapInstanceRef.current = map;

      // Create feature layer groups
      layersGroupRef.current = {
        hazards: L.layerGroup().addTo(map),
        shelters: L.layerGroup().addTo(map),
        units: L.layerGroup().addTo(map),
        incidents: L.layerGroup().addTo(map),
        evacRoutes: L.layerGroup().addTo(map),
        userLocation: L.layerGroup().addTo(map)
      };
    }

    return () => {
      // Keep map alive during tab transitions
    };
  }, []);

  const referenceLayerRef = useRef(null);

  // 2. Manage Basemap Tiles (Esri Canvas Dark/Light / Satellite / OpenStreetMap - 100% Free, No API Key Required)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }
    if (referenceLayerRef.current) {
      map.removeLayer(referenceLayerRef.current);
      referenceLayerRef.current = null;
    }

    let tileUrl = '';
    let refUrl = '';
    let attribution = '';
    let maxZoom = 19;

    if (basemapType === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      refUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Earthstar Geographics';
    } else if (basemapType === 'osm') {
      tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    } else {
      // Tactical Canvas (Dark or Light)
      if (isLight) {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        refUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ';
      } else {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        refUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ';
      }
    }

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: maxZoom,
      attribution: attribution
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Add labels & street names reference overlay if available
    if (refUrl) {
      const refLayer = L.tileLayer(refUrl, {
        maxZoom: maxZoom
      }).addTo(map);
      referenceLayerRef.current = refLayer;
    }
  }, [basemapType, isLight]);

  // 3. Update Map Center & View when Scenario Changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !scenarioData.geoCenter) return;

    map.flyTo(scenarioData.geoCenter, scenarioData.zoom || 13, {
      duration: 1.2
    });
  }, [scenarioData.id]);

  // 4. Center / Fly to Selected Incident
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedIncidentId) return;

    const inc = incidents.find(i => i.id === selectedIncidentId);
    if (inc && inc.lat && inc.lng) {
      map.panTo([inc.lat, inc.lng], {
        animate: true,
        duration: 0.6
      });
    }
  }, [selectedIncidentId, incidents]);

  // 4b. Render Real Device Live GPS Location Pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layersGroupRef.current.userLocation) return;
    const group = layersGroupRef.current.userLocation;
    group.clearLayers();

    if (userLiveLocation && userLiveLocation.lat && userLiveLocation.lng) {
      const userIcon = L.divIcon({
        className: 'user-live-gps-pin',
        html: `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(37, 99, 235, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: #2563EB; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(37, 99, 235, 0.95); display: flex; align-items: center; justify-content: center;">
              <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const userMarker = L.marker([userLiveLocation.lat, userLiveLocation.lng], { icon: userIcon });
      userMarker.bindTooltip(`
        <strong>🎯 YOU ARE HERE (GPS TELEMETRY LOCKED)</strong><br/>
        <span>Lat: ${userLiveLocation.lat.toFixed(5)}° N, Lon: ${userLiveLocation.lng.toFixed(5)}° E</span><br/>
        <span style="color: #2563EB; font-weight: 600;">Accuracy: ±${Math.round(userLiveLocation.accuracy || 15)}m</span>
      `, {
        direction: 'top',
        className: 'tactical-map-tooltip'
      });
      group.addLayer(userMarker);

      map.flyTo([userLiveLocation.lat, userLiveLocation.lng], 14, { duration: 1.2 });
    }
  }, [userLiveLocation]);

  // 5. Render Real Geospatial Overlay Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layersGroupRef.current.incidents) return;

    const { hazards: hazardGroup, shelters: shelterGroup, units: unitGroup, incidents: incidentGroup, evacRoutes: routeGroup } = layersGroupRef.current;

    // A. HAZARDS LAYER
    hazardGroup.clearLayers();
    if (activeLayers.hazards) {
      hazards.forEach(h => {
        if (!h.lat || !h.lng) return;
        const isFire = h.type === 'fire' || h.type === 'smoke';
        const color = isFire ? '#DC2626' : '#0891B2';
        const fillCol = isFire ? '#FF4D5A' : '#22D3EE';

        const circle = L.circle([h.lat, h.lng], {
          radius: h.radiusMeters || 1000,
          color: color,
          weight: 2,
          dashArray: '5, 5',
          fillColor: fillCol,
          fillOpacity: isLight ? 0.22 : 0.28
        });

        circle.bindTooltip(`<strong>⚠️ ${h.label.toUpperCase()}</strong><br/>${h.depth ? 'Depth: ' + h.depth : h.danger || ''}`, {
          direction: 'top',
          className: 'tactical-map-tooltip'
        });

        hazardGroup.addLayer(circle);
      });
    }

    // B. EVACUATION ROUTES LAYER
    routeGroup.clearLayers();
    if (activeLayers.evacRoutes && routes) {
      // Legacy Blocked Route (Red Dashed)
      if (routes.legacyRoute?.geoPath) {
        const legacyLine = L.polyline(routes.legacyRoute.geoPath, {
          color: '#DC2626',
          weight: 4,
          dashArray: '6, 8',
          opacity: 0.85
        });
        legacyLine.bindTooltip(`<strong>🛑 ${routes.legacyRoute.name}</strong><br/>FATAL HAZARD: ${routes.legacyRoute.hazardBreach}`, {
          sticky: true
        });
        routeGroup.addLayer(legacyLine);
      }

      // Aegis Safe Route (Emerald Glowing Line)
      if (routes.aegisRoute?.geoPath) {
        const safeLine = L.polyline(routes.aegisRoute.geoPath, {
          color: '#059669',
          weight: 5,
          opacity: 0.95
        });
        safeLine.bindTooltip(`<strong>🛡️ ${routes.aegisRoute.name}</strong><br/>100% SECURE & CLEARED`, {
          sticky: true
        });
        routeGroup.addLayer(safeLine);

        // Waypoints
        routes.aegisRoute.geoPath.forEach((pt, idx) => {
          const wpMarker = L.circleMarker(pt, {
            radius: 5,
            fillColor: '#059669',
            color: '#FFFFFF',
            weight: 2,
            fillOpacity: 1
          });
          routeGroup.addLayer(wpMarker);
        });
      }
    }

    // C. SHELTERS LAYER
    shelterGroup.clearLayers();
    if (activeLayers.shelters) {
      shelters.forEach(s => {
        if (!s.lat || !s.lng) return;

        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div style="
              width: 28px; 
              height: 28px; 
              border-radius: 6px; 
              background: #059669; 
              color: white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              border: 2px solid white;
              font-size: 14px;
              font-weight: bold;
            ">
              +
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([s.lat, s.lng], { icon: shelterIcon });
        marker.bindTooltip(`<strong>🏥 ${s.name}</strong><br/>Occupancy: ${s.occupancy}/${s.capacity} (${Math.round((s.occupancy/s.capacity)*100)}%)`, {
          direction: 'top'
        });
        shelterGroup.addLayer(marker);
      });
    }

    // D. RESPONDER FLEET UNITS
    unitGroup.clearLayers();
    if (activeLayers.units) {
      responders.forEach(u => {
        if (!u.lat || !u.lng) return;

        const unitIcon = L.divIcon({
          className: 'custom-responder-marker',
          html: `
            <div style="
              width: 26px; 
              height: 26px; 
              border-radius: 50%; 
              background: #2563EB; 
              color: white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              border: 2px solid white;
              font-size: 11px;
            ">
              ▲
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([u.lat, u.lng], { icon: unitIcon });
        marker.bindTooltip(`<strong>${u.callsign}</strong><br/>Status: ${u.status}<br/>Target: ${u.target}`, {
          direction: 'top'
        });
        unitGroup.addLayer(marker);
      });
    }

    // E. INCIDENTS LAYER
    incidentGroup.clearLayers();
    if (activeLayers.incidents) {
      incidents.forEach(inc => {
        if (!inc.lat || !inc.lng) return;
        if (filterSeverity !== 'ALL' && inc.triageCode !== filterSeverity) return;

        const isSelected = selectedIncidentId === inc.id;
        const isRed = inc.triageCode === 'RED';
        const color = isRed ? '#DC2626' : '#D97706';

        const incidentIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: `
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              ${isSelected ? `
                <div style="
                  position: absolute;
                  inset: -4px;
                  border-radius: 50%;
                  border: 2px dashed ${color};
                  animation: pulse 1.5s infinite;
                "></div>
              ` : ''}
              <div style="
                width: 26px;
                height: 26px;
                border-radius: 50%;
                background: ${color};
                border: 2px solid #FFFFFF;
                box-shadow: 0 2px 10px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #FFFFFF;
                font-weight: 800;
                font-size: 11px;
                font-family: 'JetBrains Mono', monospace;
              ">
                !
              </div>
              <div style="
                position: absolute;
                bottom: -16px;
                background: ${color};
                color: #fff;
                padding: 1px 4px;
                border-radius: 3px;
                font-size: 9px;
                font-weight: 700;
                white-space: nowrap;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              ">
                ${inc.id.toUpperCase()}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([inc.lat, inc.lng], { icon: incidentIcon });

        marker.on('click', () => {
          selectIncident(inc.id, true);
        });

        marker.bindTooltip(`
          <strong>${inc.id.toUpperCase()}: ${inc.title}</strong><br/>
          Triage: ${inc.triageCode} | Victims: ${inc.victims} trapped<br/>
          <em>Click to inspect and dispatch</em>
        `, {
          direction: 'top',
          offset: [0, -14]
        });

        incidentGroup.addLayer(marker);
      });
    }
  }, [
    incidents, 
    selectedIncidentId, 
    activeLayers, 
    filterSeverity, 
    hazards, 
    shelters, 
    responders, 
    routes, 
    isLight
  ]);

  const toggleLayer = (key) => {
    tacticalAudio.playTacticalBeep(1000, 0.03, 0.02);
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetView = () => {
    const map = mapInstanceRef.current;
    if (map && scenarioData.geoCenter) {
      map.flyTo(scenarioData.geoCenter, scenarioData.zoom || 13, { duration: 0.8 });
      tacticalAudio.playTacticalBeep(900, 0.04, 0.02);
    }
  };

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
      {/* Top Floating Controls Bar */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 14,
        right: 14,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none'
      }}>
        {/* Layer Toggles Pill */}
        <div style={{
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(17, 24, 39, 0.94)',
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
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={13} />
            <span>GIS LAYERS:</span>
          </span>

          {[
            { key: 'hazards', label: 'Hazards', color: 'var(--critical)' },
            { key: 'incidents', label: 'Incidents', color: 'var(--warning)' },
            { key: 'shelters', label: 'Shelters', color: 'var(--success)' },
            { key: 'units', label: 'Fleet', color: 'var(--info)' },
            { key: 'evacRoutes', label: 'Routes', color: '#10B981' }
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

        {/* Basemap & Map Tools */}
        <div style={{
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(17, 24, 39, 0.94)',
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
          {/* Basemap Switcher (Canvas / Satellite / Streets) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            backgroundColor: 'var(--surface-secondary)',
            padding: '2px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => {
                setBasemapType('vector');
                tacticalAudio.playTacticalBeep(1200, 0.04, 0.02);
              }}
              className="btn btn-xs"
              style={{
                backgroundColor: basemapType === 'vector' ? 'var(--accent)' : 'transparent',
                color: basemapType === 'vector' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '11px',
                padding: '2px 7px',
                gap: '4px',
                border: 'none',
                height: '24px'
              }}
              title="Esri World Canvas Basemap (Theme Adaptive Grayscale)"
            >
              <Globe2 size={12} />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => {
                setBasemapType('satellite');
                tacticalAudio.playTacticalBeep(1200, 0.04, 0.02);
              }}
              className="btn btn-xs"
              style={{
                backgroundColor: basemapType === 'satellite' ? 'var(--accent)' : 'transparent',
                color: basemapType === 'satellite' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '11px',
                padding: '2px 7px',
                gap: '4px',
                border: 'none',
                height: '24px'
              }}
              title="Esri World Imagery (High-Resolution Satellite)"
            >
              <Satellite size={12} />
              <span>Satellite</span>
            </button>
            <button
              onClick={() => {
                setBasemapType('osm');
                tacticalAudio.playTacticalBeep(1200, 0.04, 0.02);
              }}
              className="btn btn-xs"
              style={{
                backgroundColor: basemapType === 'osm' ? 'var(--accent)' : 'transparent',
                color: basemapType === 'osm' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '11px',
                padding: '2px 7px',
                gap: '4px',
                border: 'none',
                height: '24px'
              }}
              title="OpenStreetMap Standard Street Layer"
            >
              <Navigation size={12} />
              <span>Streets</span>
            </button>
          </div>

          <span style={{ color: 'var(--border-medium)' }}>|</span>

          {/* Severity Filters */}
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>TRIAGE:</span>
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

          {/* Zoom & Fit */}
          <button 
            onClick={() => mapInstanceRef.current?.zoomIn()} 
            className="btn btn-ghost btn-xs" 
            style={{ padding: '3px' }} 
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>

          <button 
            onClick={() => mapInstanceRef.current?.zoomOut()} 
            className="btn btn-ghost btn-xs" 
            style={{ padding: '3px' }} 
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>

          <button 
            onClick={resetView} 
            className="btn btn-ghost btn-xs" 
            style={{ padding: '3px' }} 
            title="Center Operational Region"
          >
            <Crosshair size={14} />
          </button>

          {/* Quick GPS Locate Me Button */}
          <button 
            onClick={() => {
              if (userLiveLocation) {
                mapInstanceRef.current?.flyTo([userLiveLocation.lat, userLiveLocation.lng], 14, { duration: 1.0 });
                tacticalAudio.playRadarPing();
              } else {
                detectLiveLocation();
              }
            }} 
            className="btn btn-xs" 
            style={{ 
              padding: '2px 7px',
              fontSize: '11px',
              fontWeight: 600,
              gap: '4px',
              backgroundColor: userLiveLocation ? 'var(--accent)' : 'var(--surface-secondary)',
              color: userLiveLocation ? 'var(--text-on-accent)' : 'var(--text-secondary)'
            }} 
            title="Locate my real device GPS position on the map"
          >
            <Compass size={13} style={{ animation: isDetectingLocation ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isDetectingLocation ? 'GPS...' : userLiveLocation ? 'My GPS' : 'GPS'}</span>
          </button>

          {onToggleFullscreen && (
            <button 
              onClick={onToggleFullscreen} 
              className="btn btn-ghost btn-xs" 
              style={{ padding: '3px' }} 
              title="Toggle Fullscreen"
            >
              {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Real Leaflet Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          flex: 1, 
          width: '100%', 
          height: '100%',
          backgroundColor: isLight ? '#E5E7EB' : '#0B132B'
        }} 
      />

      {/* Bottom Coordinates & Real-World GIS Watermark */}
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: 12,
        zIndex: 1000,
        fontSize: '11px',
        color: isLight ? '#1F2937' : '#E2E8F0',
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(6px)',
        padding: '3px 8px',
        borderRadius: 'var(--radius-xs)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '12px',
        fontFamily: 'var(--font-mono)',
        pointerEvents: 'none'
      }}>
        <span>LAT: {mouseCoords.lat.toFixed(4)}° N</span>
        <span>LON: {mouseCoords.lng.toFixed(4)}° W</span>
        <span>MAP TILES: {basemapType === 'satellite' ? 'ESRI WORLD IMAGERY' : basemapType === 'osm' ? 'OPENSTREETMAP' : isLight ? 'ESRI LIGHT CANVAS' : 'ESRI DARK CANVAS'}</span>
      </div>

      {/* Bottom Right Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: 8,
        right: 12,
        zIndex: 1000,
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(6px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '4px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="status-dot status-dot-critical" />
          <span>P1 Critical</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="status-dot status-dot-warning" />
          <span>P2 Delayed</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="status-dot status-dot-success" />
          <span>Shelter</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="status-dot status-dot-info" />
          <span>Responder</span>
        </span>
      </div>
    </div>
  );
}
