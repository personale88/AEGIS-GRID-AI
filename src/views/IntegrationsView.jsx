import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Wifi, 
  Radio, 
  Satellite, 
  CheckCircle2, 
  RefreshCw, 
  Activity, 
  ShieldCheck,
  Server,
  ExternalLink,
  Globe,
  CloudRain,
  Wind,
  Compass,
  AlertTriangle,
  Flame,
  Waves
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import { 
  fetchLiveWeather, 
  fetchLiveEarthquakes, 
  fetchLiveNasaEvents, 
  LIVE_EMERGENCY_WEBSITES 
} from '../services/liveFeedsService';
import { tacticalAudio } from '../utils/audioSystem';

export default function IntegrationsView() {
  const { scenarioData, userLiveLocation } = useOperations();

  const [activeTab, setActiveTab] = useState('live-telemetry'); // 'live-telemetry' | 'live-radar' | 'official-portals'
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Live real data states
  const [liveWeather, setLiveWeather] = useState(null);
  const [liveQuakes, setLiveQuakes] = useState([]);
  const [liveNasa, setLiveNasa] = useState([]);

  const currentLat = userLiveLocation?.lat || scenarioData.geoCenter?.[0] || 13.0827;
  const currentLng = userLiveLocation?.lng || scenarioData.geoCenter?.[1] || 80.2707;

  const loadAllLiveFeeds = async () => {
    setLoading(true);
    tacticalAudio.playRadarPing();

    try {
      const [weatherRes, quakesRes, nasaRes] = await Promise.all([
        fetchLiveWeather(currentLat, currentLng),
        fetchLiveEarthquakes(),
        fetchLiveNasaEvents()
      ]);

      if (weatherRes.success) setLiveWeather(weatherRes.data);
      if (quakesRes.success) setLiveQuakes(quakesRes.quakes || []);
      if (nasaRes.success) setLiveNasa(nasaRes.events || []);

      setLastRefreshed(new Date().toLocaleTimeString());
      tacticalAudio.playTacticalBeep(1400, 0.04, 0.02);
    } catch (e) {
      console.warn('Live telemetry fetch warning:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllLiveFeeds();
    const interval = setInterval(loadAllLiveFeeds, 90000); // Auto-refresh every 90 seconds
    return () => clearInterval(interval);
  }, [currentLat, currentLng]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-dot" />
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Real-World Live Web Feeds & Telemetry Gateways
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Live public API ingest from USGS, Open-Meteo, NASA Earth Observatory & State Emergency Portals
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {lastRefreshed && (
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              SYNCED: {lastRefreshed}
            </span>
          )}
          <button 
            onClick={loadAllLiveFeeds} 
            disabled={loading}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px', fontWeight: 600 }}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>{loading ? 'Ingesting Live Web...' : 'Fetch Live Feeds'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '8px'
      }}>
        {[
          { id: 'live-telemetry', label: '🌐 Live Public APIs (USGS, Weather, NASA)', icon: Activity },
          { id: 'live-radar', label: '🛰️ Real-Time Satellite & Radar (Windy)', icon: Satellite },
          { id: 'official-portals', label: '🏛️ Official Emergency Portals (IMD, TNSDMA, NDMA)', icon: Globe }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="btn btn-sm"
              style={{
                backgroundColor: isActive ? 'var(--accent)' : 'var(--surface-secondary)',
                color: isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent)' : 'var(--border-subtle)',
                fontWeight: 600,
                fontSize: '12px',
                gap: '6px'
              }}
            >
              <Icon size={13} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: REAL LIVE TELEMETRY (OPEN-METEO, USGS, NASA) */}
      {activeTab === 'live-telemetry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Live Weather Station Banner */}
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid #0891B2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CloudRain size={18} color="#0891B2" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
                  Real Live Meteorological Ingest: {scenarioData.name} ({currentLat.toFixed(2)}°N, {currentLng.toFixed(2)}°E)
                </h3>
              </div>
              <span className="badge badge-info" style={{ fontFamily: 'var(--font-mono)' }}>
                FEED: OPEN-METEO GLOBAL WEATHER
              </span>
            </div>

            {liveWeather ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>SURFACE TEMP</span>
                  <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{liveWeather.temperature_2m}°C</strong>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Feels like {liveWeather.apparent_temperature}°C</span>
                </div>

                <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>WIND SPEED</span>
                  <strong style={{ fontSize: '18px', color: '#2563EB' }}>{liveWeather.wind_speed_10m} km/h</strong>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Dir: {liveWeather.wind_direction_10m}°</span>
                </div>

                <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>RELATIVE HUMIDITY</span>
                  <strong style={{ fontSize: '18px', color: '#059669' }}>{liveWeather.relative_humidity_2m}%</strong>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Atmospheric Moisture</span>
                </div>

                <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>BAROMETRIC PRESSURE</span>
                  <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{liveWeather.surface_pressure} hPa</strong>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Cyclone Barometer</span>
                </div>

                <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>CURRENT RAIN</span>
                  <strong style={{ fontSize: '18px', color: liveWeather.rain > 0 ? '#DC2626' : 'var(--text-primary)' }}>
                    {liveWeather.rain || 0} mm
                  </strong>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Precipitation Rate</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Connecting to Open-Meteo satellite weather telemetry...
              </div>
            )}
          </div>

          {/* Grid of USGS Earthquakes & NASA Natural Hazards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
            {/* USGS Live Earthquakes Column */}
            <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} color="#DC2626" />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
                    USGS Real-Time Earthquakes (M2.5+ Global)
                  </h3>
                </div>
                <a 
                  href="https://earthquake.usgs.gov/earthquakes/map/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-ghost btn-xs"
                  style={{ gap: '4px', fontSize: '11px', color: 'var(--accent)' }}
                >
                  <span>USGS Map</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
                {liveQuakes.length > 0 ? liveQuakes.map(q => (
                  <div key={q.id} style={{
                    backgroundColor: 'var(--surface-secondary)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>
                        {q.place}
                      </strong>
                      <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        TIME: {q.time} • DEPTH: {q.depthKm} km
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${q.mag >= 5.0 ? 'badge-critical' : q.mag >= 4.0 ? 'badge-warning' : 'badge-info'}`} style={{ fontWeight: 700, fontSize: '12px' }}>
                        M {q.mag.toFixed(1)}
                      </span>
                      {q.url && (
                        <a href={q.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading USGS real-time seismic feeds...
                  </div>
                )}
              </div>
            </div>

            {/* NASA EONET Active Natural Hazards */}
            <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={16} color="#F59E0B" />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
                    NASA EONET Active Satellite Hazards
                  </h3>
                </div>
                <a 
                  href="https://eonet.gsfc.nasa.gov/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-ghost btn-xs"
                  style={{ gap: '4px', fontSize: '11px', color: 'var(--accent)' }}
                >
                  <span>NASA Portal</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
                {liveNasa.length > 0 ? liveNasa.map(e => (
                  <div key={e.id} style={{
                    backgroundColor: 'var(--surface-secondary)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'block' }}>
                        {e.title}
                      </strong>
                      <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        CATEGORY: {e.category.toUpperCase()} • {e.date}
                      </span>
                    </div>

                    {e.link && (
                      <a href={e.link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-xs" style={{ color: 'var(--accent)' }}>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                )) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading NASA Earth Observatory events...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE WINDY WEATHER RADAR */}
      {activeTab === 'live-radar' && (
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
                Live Interactive Satellite Weather & Cyclone Radar
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Real-time Doppler precipitation radar and wind velocity modeling over Chennai & Bay of Bengal
              </p>
            </div>
            <a 
              href="https://www.windy.com/?13.08,80.27,8" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-outline btn-xs"
              style={{ gap: '4px' }}
            >
              <span>Open Fullscreen in Windy</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div style={{ width: '100%', height: '540px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-medium)' }}>
            <iframe
              src={`https://embed.windy.com/embed2.html?lat=${currentLat}&lon=${currentLng}&detailLat=${currentLat}&detailLon=${currentLng}&width=100%25&height=100%25&zoom=8&level=surface&overlay=radar&product=radar&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`}
              title="Windy Live Radar"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
            />
          </div>
        </div>
      )}

      {/* TAB 3: OFFICIAL EMERGENCY WEBSITES & PORTALS */}
      {activeTab === 'official-portals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {LIVE_EMERGENCY_WEBSITES.map(portal => (
            <div key={portal.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span className="badge badge-info" style={{ fontSize: '10px' }}>
                    {portal.category}
                  </span>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {portal.region}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0', color: 'var(--text-primary)' }}>
                  {portal.name}
                </h3>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', marginTop: '6px' }}>
                  {portal.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--success)' }}>
                  ● OFFICIAL ACTIVE PORTAL
                </span>

                <a 
                  href={portal.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-outline btn-xs"
                  style={{ gap: '4px', fontWeight: 600 }}
                >
                  <span>Launch Official Site</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
