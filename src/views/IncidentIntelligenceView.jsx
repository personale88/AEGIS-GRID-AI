import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Send, 
  Eye, 
  MapPin, 
  Users, 
  Activity, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export default function IncidentIntelligenceView() {
  const { 
    incidents, 
    selectedIncidentId, 
    selectIncident, 
    assignResponder,
    responders,
    setActiveNav
  } = useOperations();

  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredIncidents = incidents.filter(i => {
    if (filterSeverity !== 'ALL' && i.triageCode !== filterSeverity) return false;
    if (filterStatus === 'DISPATCHED' && !i.dispatched) return false;
    if (filterStatus === 'PENDING' && i.dispatched) return false;
    if (search) {
      const q = search.toLowerCase();
      return i.title.toLowerCase().includes(q) || i.location.toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Incident Intelligence Grid</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Comprehensive priority triage roster and multi-agency dispatch matrix
          </p>
        </div>

        <button
          onClick={() => setActiveNav('ops-triage')}
          className="btn btn-primary btn-sm"
        >
          <Eye size={14} />
          <span>Open AI Multimodal Triage Lab</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by title, street address, or incident ID..."
            className="input"
            style={{ width: '100%', maxWidth: '380px', height: '32px', fontSize: '12px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>PRIORITY:</span>
          {['ALL', 'RED', 'YELLOW'].map(f => (
            <button
              key={f}
              onClick={() => setFilterSeverity(f)}
              className="btn btn-xs"
              style={{
                backgroundColor: filterSeverity === f ? 'var(--accent)' : 'var(--surface-secondary)',
                color: filterSeverity === f ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 600
              }}
            >
              {f === 'ALL' ? 'All Codes' : f === 'RED' ? 'P1 Critical' : 'P2 Delayed'}
            </button>
          ))}

          <span style={{ color: 'var(--border-medium)' }}>|</span>

          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS:</span>
          {['ALL', 'PENDING', 'DISPATCHED'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="btn btn-xs"
              style={{
                backgroundColor: filterStatus === s ? 'var(--surface-tertiary)' : 'transparent',
                color: filterStatus === s ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 600
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Records Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Incident ID</th>
                <th style={{ padding: '12px 16px' }}>Triage Code</th>
                <th style={{ padding: '12px 16px' }}>Incident Summary</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px' }}>Trapped</th>
                <th style={{ padding: '12px 16px' }}>Damage %</th>
                <th style={{ padding: '12px 16px' }}>Assigned Unit</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map(inc => {
                const isSelected = selectedIncidentId === inc.id;
                const isRed = inc.triageCode === 'RED';
                return (
                  <tr
                    key={inc.id}
                    onClick={() => selectIncident(inc.id, true)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--surface-hover)' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => !isSelected && (e.currentTarget.style.backgroundColor = 'var(--surface-secondary)')}
                    onMouseLeave={e => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 700 }} className="mono">
                      {inc.id.toUpperCase()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${isRed ? 'badge-critical' : 'badge-warning'}`}>
                        {isRed ? 'P1 CRITICAL' : 'P2 DELAYED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '300px' }}>
                      {inc.title}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="var(--text-muted)" />
                        <span>{inc.location}</span>
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: isRed ? 'var(--critical)' : 'var(--text-primary)' }} className="mono">
                      {inc.victims} souls
                    </td>
                    <td style={{ padding: '12px 16px' }} className="mono">
                      <span style={{ color: inc.damageIndex > 80 ? 'var(--critical)' : 'var(--warning)', fontWeight: 600 }}>
                        {inc.damageIndex}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {inc.dispatched ? (
                        <span className="badge badge-success">
                          ✓ {inc.assignedUnit || 'Triton-1 Squad'}
                        </span>
                      ) : (
                        <span className="badge badge-neutral">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectIncident(inc.id, true);
                        }}
                        className="btn btn-secondary btn-xs"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
