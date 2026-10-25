import React from 'react';
import { 
  Plane, 
  Wind, 
  Activity, 
  Battery, 
  MapPin, 
  Compass, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Eye
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export default function DroneOperationsView() {
  const { scenarioData } = useOperations();

  const droneSorties = [
    {
      id: 'DRONE-01',
      model: 'Heavy-Lift Hexacopter Aegis-4',
      mission: 'Medical O2 Logistics Air-Bridge',
      status: 'Airborne Transit',
      altitude: '120m AGL',
      battery: '82%',
      payload: '18x Medical O2 Tanks (24kg)',
      target: 'Bayou Valley Memorial Clinic'
    },
    {
      id: 'DRONE-02',
      model: 'Thermal Optical Recon Sky-2',
      mission: 'Rooftop Civilian Heat Mapping',
      status: 'Hovering on Scene',
      altitude: '45m AGL',
      battery: '68%',
      payload: 'FLIR Thermal 4K Gimbal',
      target: 'Bayou View 7th Ave Rooftops'
    },
    {
      id: 'DRONE-03',
      model: 'Relay Tether Hexacopter Mesh-9',
      mission: 'Decentralized 915MHz P2P Uplink',
      status: 'Stationary Tethered Station',
      altitude: '90m AGL',
      battery: 'Direct Power Line 100%',
      payload: 'Emergency LTE/LoRa Transceiver',
      target: 'North Ridge Hub'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Autonomous Drone Fleet & Cargo Air-Bridge</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Atmospheric flight risk calculations, high-altitude mesh relays, and automated medical drops
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-info">
            WIND TELEMETRY: {scenarioData.windSpeed}
          </span>
          <span className="badge badge-accent">
            3 ACTIVE SORTIES
          </span>
        </div>
      </div>

      {/* Drone Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {droneSorties.map(d => (
          <div key={d.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{d.id}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {d.model}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>
                  {d.mission}
                </span>
              </div>

              <span className="badge badge-info">
                {d.status}
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>TARGET:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{d.target}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>PAYLOAD:</span>
                <span>{d.payload}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>ALTITUDE:</span>
                <span className="mono">{d.altitude}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>BATTERY:</span>
                <span className="mono" style={{ color: 'var(--success)', fontWeight: 600 }}>{d.battery}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Live drone video telemetry linked for ${d.id}.`)}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              <Eye size={13} />
              <span>View Drone Gimbal Stream</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
