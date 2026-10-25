import React, { useState } from 'react';
import { 
  Users, 
  Send, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  Radio, 
  Battery, 
  Plane,
  Anchor,
  Truck
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export default function ResponderCoordinationView() {
  const { responders, incidents, assignResponder } = useOperations();
  const [selectedUnit, setSelectedUnit] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Responder Fleet & Task Force Coordination</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Multi-agency tactical search, extrication, and aerial fleet deployment
          </p>
        </div>

        <span className="badge badge-success">
          {responders.filter(r => r.status.toLowerCase().includes('ready') || r.status.toLowerCase().includes('staged')).length} UNITS AVAILABLE
        </span>
      </div>

      {/* Fleet Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {responders.map(unit => {
          const isAvailable = unit.status.toLowerCase().includes('ready') || unit.status.toLowerCase().includes('staged');
          const isEnRoute = unit.status.toLowerCase().includes('active') || unit.status.toLowerCase().includes('transit');

          return (
            <div key={unit.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>UNIT ID: {unit.id.toUpperCase()}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                    {unit.callsign}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {unit.type.replace('_', ' ')}
                  </span>
                </div>

                <span className={`badge ${isAvailable ? 'badge-success' : isEnRoute ? 'badge-info' : 'badge-warning'}`}>
                  {unit.status}
                </span>
              </div>

              {/* Mission Target & Coordinates */}
              <div style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '12px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>CURRENT ASSIGNMENT</div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>
                  {unit.target}
                </strong>
                <div className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  LOC: X={unit.x}%, Y={unit.y}% • RADAR PING NOMINAL
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => alert(`Radio link established with ${unit.callsign} on tactical band 142.85 MHz.`)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Radio size={13} />
                  <span>Radio Link</span>
                </button>
                <button
                  onClick={() => alert(`Manual task force override initiated for ${unit.callsign}.`)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <span>Reassign Task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
