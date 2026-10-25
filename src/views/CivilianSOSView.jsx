import React from 'react';
import { 
  Radio, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Clock, 
  Send, 
  ShieldAlert, 
  Wifi,
  CheckCircle2
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export default function CivilianSOSView() {
  const { incidents, setIsSOSModalOpen, selectIncident, assignResponder } = useOperations();

  const sosIncidents = incidents.filter(i => i.id.startsWith('sos-') || i.triageCode === 'RED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Civilian Emergency Distress Mesh</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Real-time peer-to-peer LoRa/Wi-Fi Direct citizen emergency distress beacon intake
          </p>
        </div>

        <button
          onClick={() => setIsSOSModalOpen(true)}
          className="btn btn-critical btn-sm"
          style={{ fontWeight: 600 }}
        >
          <Radio size={14} />
          <span>Broadcast New SOS Distress Beacon</span>
        </button>
      </div>

      {/* SOS Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {sosIncidents.map(sos => (
          <div key={sos.id} className="card" style={{ padding: '18px', borderLeft: '3px solid var(--critical)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--critical)', fontWeight: 700 }}>
                  EMERGENCY BEACON
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {sos.title}
                </h3>
              </div>

              <span className="badge badge-critical">
                {sos.triageCode}
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>LOCATION:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{sos.location}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>TRAPPED SOULS:</span>
                <strong style={{ color: 'var(--critical)' }}>{sos.victims} Persons</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>UPLINK:</span>
                <span style={{ color: 'var(--success)' }}>P2P Mesh (3 Hops Relay)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                onClick={() => selectIncident(sos.id, true)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                Inspect Details
              </button>

              <button
                onClick={() => assignResponder(sos.id, 'u1')}
                disabled={sos.dispatched}
                className={`btn ${sos.dispatched ? 'btn-secondary' : 'btn-critical'} btn-sm`}
                style={{ flex: 1 }}
              >
                <Send size={13} />
                <span>{sos.dispatched ? 'Dispatched' : 'Dispatch Squad'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
