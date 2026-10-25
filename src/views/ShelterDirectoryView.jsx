import React from 'react';
import { 
  Home, 
  Droplet, 
  HeartPulse, 
  Wind, 
  Zap, 
  Package, 
  Users, 
  MapPin, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export default function ShelterDirectoryView() {
  const { shelters, setActiveNav } = useOperations();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Regional Shelter & Safe Haven Directory</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Evacuee intake capacity, generator grid status, and life-support supply inventories
          </p>
        </div>

        <button
          onClick={() => setActiveNav('ops-supply')}
          className="btn btn-primary btn-sm"
        >
          <Package size={14} />
          <span>Open Resource Balancing Matrix</span>
        </button>
      </div>

      {/* Shelter Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {shelters.map(s => {
          const occupancyPercent = Math.round((s.occupancy / s.capacity) * 100);
          const isCritical = s.supplies.oxygenTanks <= 10;
          const isSurplus = s.supplies.oxygenTanks > 50;

          return (
            <div key={s.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SECTOR {s.id.toUpperCase()}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                    {s.name}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Power: <strong>{s.power}</strong>
                  </span>
                </div>

                <span className={`badge ${isCritical ? 'badge-critical' : isSurplus ? 'badge-success' : 'badge-info'}`}>
                  {s.status}
                </span>
              </div>

              {/* Occupancy bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Evacuee Intake Capacity:</span>
                  <span className="mono" style={{ fontWeight: 600 }}>{s.occupancy.toLocaleString()} / {s.capacity.toLocaleString()} ({occupancyPercent}%)</span>
                </div>
                <div style={{ width: '100%', height: '7px', backgroundColor: 'var(--surface-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${occupancyPercent}%`,
                    height: '100%',
                    backgroundColor: occupancyPercent > 90 ? 'var(--critical)' : occupancyPercent > 75 ? 'var(--warning)' : 'var(--success)'
                  }} />
                </div>
              </div>

              {/* Supply Inventory Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px' }}>
                <div style={{ padding: '8px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>O2 CYLINDERS</span>
                  <strong className="mono" style={{ color: s.supplies.oxygenTanks <= 10 ? 'var(--critical)' : 'var(--text-primary)', fontSize: '14px' }}>
                    {s.supplies.oxygenTanks} units
                  </strong>
                </div>

                <div style={{ padding: '8px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>O- BLOOD</span>
                  <strong className="mono" style={{ color: s.supplies.bloodUnits <= 10 ? 'var(--critical)' : 'var(--text-primary)', fontSize: '14px' }}>
                    {s.supplies.bloodUnits} units
                  </strong>
                </div>

                <div style={{ padding: '8px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>WATER</span>
                  <strong className="mono" style={{ fontSize: '14px' }}>
                    {(s.supplies.waterLiters / 1000).toFixed(1)}k L
                  </strong>
                </div>
              </div>

              <button
                onClick={() => alert(`Medical triage team notification pushed to ${s.name}.`)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: 'auto' }}
              >
                <span>Notify Shelter Command</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
