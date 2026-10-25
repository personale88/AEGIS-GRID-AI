import React, { useState } from 'react';
import { 
  Clock, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Activity, 
  FileText,
  Radio,
  Users
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export default function ActivityHistoryView() {
  const { activityEvents } = useOperations();
  const [filterType, setFilterType] = useState('ALL');

  const filteredEvents = activityEvents.filter(e => {
    if (filterType === 'ALL') return true;
    return e.type.includes(filterType);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Operational Activity & Audit Trail</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Immutable chronological telemetry log of all incident updates, dispatches, and life-safety events
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'RESPONDER', 'INCIDENT', 'SOS', 'SHELTER'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className="btn btn-xs"
              style={{
                backgroundColor: filterType === f ? 'var(--accent)' : 'var(--surface-primary)',
                color: filterType === f ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 600
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredEvents.map(evt => (
            <div
              key={evt.id}
              style={{
                display: 'flex',
                gap: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-secondary)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={15} color="var(--accent)" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {evt.title}
                  </h4>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {evt.timestamp}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>ACTOR: <strong style={{ color: 'var(--text-secondary)' }}>{evt.actor}</strong></span>
                  <span>•</span>
                  <span>TARGET: <strong className="mono" style={{ color: 'var(--accent)' }}>{evt.incidentId}</strong></span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {evt.outcome}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
