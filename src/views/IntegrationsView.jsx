import React from 'react';
import { 
  Cpu, 
  Wifi, 
  Radio, 
  Satellite, 
  CheckCircle2, 
  RefreshCw, 
  Activity, 
  ShieldCheck,
  Server
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export default function IntegrationsView() {
  const { scenarioData } = useOperations();

  const feeds = [
    {
      name: 'Sentinel-2 SAR Satellite Imagery Feed',
      provider: 'ESA / NASA CopHub',
      status: 'Connected',
      latency: '18ms',
      bandwidth: '48.2 MB/s',
      description: 'Optical and infrared multispectral thermal imaging with automated flood/flame boundary masking.'
    },
    {
      name: 'Decentralized P2P Citizen LoRa Mesh',
      provider: 'AegisGrid Radio Core',
      status: 'Operational',
      latency: '4ms (3-hop relay)',
      bandwidth: `${scenarioData.meshNodesActive} Nodes Online`,
      description: 'Zero-cellular emergency fallback radio mesh operating on 433 MHz and 915 MHz bands.'
    },
    {
      name: 'USGS Real-Time Seismic & Geotechnical Ingest',
      provider: 'USGS Earthquake Early Warning',
      status: 'Connected',
      latency: '12ms',
      bandwidth: 'Telemetry nominal',
      description: 'Sub-surface strain sensors and accelerometer arrays monitoring bridge & overpass stability.'
    },
    {
      name: 'NOAA High-Resolution Rapid Refresh (HRRR)',
      provider: 'National Weather Service',
      status: 'Connected',
      latency: '24ms',
      bandwidth: '15-min cycle',
      description: `Surface wind vectors (${scenarioData.windSpeed}) and precipitation radar modeling.`
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>System Telemetry & External Integrations</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Satellite feeds, early warning sensors, P2P mesh radios, and multi-agency gateways
          </p>
        </div>

        <button onClick={() => alert('Diagnostic ping: All 4 telemetry bridges verified at 99.8% uptime.')} className="btn btn-secondary btn-sm">
          <RefreshCw size={13} />
          <span>Run Diagnostic Ping</span>
        </button>
      </div>

      {/* Feeds List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {feeds.map((f, idx) => (
          <div key={idx} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {f.name}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>
                  {f.provider}
                </span>
              </div>

              <span className="badge badge-success">
                {f.status}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              {f.description}
            </p>

            <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span className="mono">LATENCY: {f.latency}</span>
              <span className="mono" style={{ color: 'var(--accent)' }}>{f.bandwidth}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
