import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  Users, 
  Home, 
  Package, 
  Clock, 
  RefreshCw, 
  Download, 
  ChevronRight, 
  Filter, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import TacticalMap from '../components/TacticalMap';
import { tacticalAudio } from '../utils/audioSystem';

export default function CommandDashboard() {
  const { 
    scenarioData, 
    incidents, 
    selectedIncidentId, 
    selectIncident, 
    metrics, 
    activityEvents,
    setActiveNav
  } = useOperations();

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredIncidents = incidents.filter(inc => {
    if (severityFilter === 'ALL') return true;
    return inc.triageCode === severityFilter;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    tacticalAudio.playRadarPing();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExport = () => {
    tacticalAudio.playTacticalBeep(1400, 0.05, 0.04);
    alert('FEMA ICS-209 Operational Briefing successfully generated and ready for export.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        paddingBottom: '4px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Command Center
            </h1>
            <span className="badge badge-accent">
              DEMO ENVIRONMENT
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Unified Emergency Operations & Situational Awareness • {scenarioData.name}
          </p>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            padding: '6px 10px',
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <Calendar size={13} color="var(--text-muted)" />
            <span className="mono">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <button
            onClick={handleRefresh}
            className="btn btn-secondary btn-sm"
            title="Refresh Operational Feeds"
          >
            <RefreshCw size={13} className={isRefreshing ? 'pulse-subtle' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExport}
            className="btn btn-primary btn-sm"
          >
            <Download size={13} />
            <span>Export SitRep</span>
          </button>
        </div>
      </div>

      {/* 2. Operational Metrics Cards (Row of 6 compact cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px'
      }}>
        {/* Card 1: Active Incidents */}
        <div 
          className="card"
          onClick={() => setActiveNav('ops-incidents')}
          style={{ padding: '14px 16px', cursor: 'pointer', position: 'relative' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Incidents
            </span>
            <AlertTriangle size={15} color="var(--warning)" />
          </div>
          <div className="mono" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {metrics.activeIncidentsCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="status-dot status-dot-warning" />
            <span>Across 4 sectors</span>
          </div>
        </div>

        {/* Card 2: Critical Incidents (P1) */}
        <div 
          className="card"
          onClick={() => setSeverityFilter('RED')}
          style={{ padding: '14px 16px', cursor: 'pointer', borderLeft: '3px solid var(--critical)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Critical Incidents
            </span>
            <ShieldAlert size={15} color="var(--critical)" />
          </div>
          <div className="mono" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--critical)' }}>
            {metrics.criticalIncidentsCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--critical)', marginTop: '4px', fontWeight: 500 }}>
            Immediate Life-Threat P1
          </div>
        </div>

        {/* Card 3: Active SOS Reports */}
        <div 
          className="card"
          onClick={() => setActiveNav('community-sos')}
          style={{ padding: '14px 16px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active SOS Reports
            </span>
            <Radio size={15} color="var(--accent)" />
          </div>
          <div className="mono" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {metrics.activeSOSReportsCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            54 trapped verified
          </div>
        </div>

        {/* Card 4: Available Responders */}
        <div 
          className="card"
          onClick={() => setActiveNav('ops-responders')}
          style={{ padding: '14px 16px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Available Fleet
            </span>
            <Users size={15} color="var(--info)" />
          </div>
          <div className="mono" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {metrics.availableRespondersCount} / 4
          </div>
          <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>
            Ready for deployment
          </div>
        </div>

        {/* Card 5: Active Shelters */}
        <div 
          className="card"
          onClick={() => setActiveNav('community-shelters')}
          style={{ padding: '14px 16px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Shelters
            </span>
            <Home size={15} color="var(--success)" />
          </div>
          <div className="mono" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {metrics.activeSheltersCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            6,500 total capacity
          </div>
        </div>

        {/* Card 6: Critical Shortages */}
        <div 
          className="card"
          onClick={() => setActiveNav('ops-supply')}
          style={{ padding: '14px 16px', cursor: 'pointer', borderLeft: metrics.criticalResourceShortagesCount ? '3px solid var(--warning)' : 'none' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Supply Deficits
            </span>
            <Package size={15} color="var(--warning)" />
          </div>
          <div className="mono" style={{ fontSize: '24px', fontWeight: 700, color: metrics.criticalResourceShortagesCount ? 'var(--warning)' : 'var(--success)' }}>
            {metrics.criticalResourceShortagesCount} Center
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Bayou Clinic O2 low
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Grid (Left: Tactical Map ~68%, Right: Priority Incidents ~32%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left: Tactical Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                Geospatial Operational Map
              </h3>
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                LIVE FEED
              </span>
            </div>
            
            <button
              onClick={() => setActiveNav('overview-map')}
              className="btn btn-ghost btn-xs"
              style={{ gap: '4px' }}
            >
              <span>Expanded Map View</span>
              <ArrowUpRight size={12} />
            </button>
          </div>

          <TacticalMap height="510px" />
        </div>

        {/* Right: Priority Incidents Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '545px', overflow: 'hidden' }}>
          <div className="card-header" style={{ padding: '12px 16px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Priority Incidents</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{filteredIncidents.length} requiring response</span>
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {['ALL', 'RED'].map(f => (
                <button
                  key={f}
                  onClick={() => setSeverityFilter(f)}
                  className="btn btn-xs"
                  style={{
                    backgroundColor: severityFilter === f ? 'var(--accent)' : 'var(--surface-secondary)',
                    color: severityFilter === f ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px 6px',
                    fontWeight: 600
                  }}
                >
                  {f === 'ALL' ? 'All' : 'Critical'}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents List (Scrollable) */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredIncidents.map(inc => {
                const isSelected = selectedIncidentId === inc.id;
                const isRed = inc.triageCode === 'RED';
                return (
                  <div
                    key={inc.id}
                    onClick={() => selectIncident(inc.id, true)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface-primary)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {inc.id.toUpperCase()}
                        </span>
                        <span className={`badge ${isRed ? 'badge-critical' : 'badge-warning'}`}>
                          {isRed ? 'P1 CRITICAL' : 'P2 DELAYED'}
                        </span>
                      </div>

                      <span className="mono" style={{ fontSize: '11px', color: inc.dispatched ? 'var(--success)' : 'var(--critical)', fontWeight: 600 }}>
                        {inc.dispatched ? '✓ DISPATCHED' : `${inc.victims} TRAPPED`}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: '1.3' }}>
                      {inc.title}
                    </h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <MapPin size={11} color="var(--text-muted)" />
                        <span>{inc.location}</span>
                      </span>
                      <ChevronRight size={14} color="var(--text-muted)" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel Footer */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-secondary)' }}>
            <button
              onClick={() => setActiveNav('ops-incidents')}
              className="btn btn-secondary btn-xs"
              style={{ width: '100%' }}
            >
              <span>View All Incidents in Intelligence Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom: Operational Activity Timeline */}
      <div className="card">
        <div className="card-header" style={{ padding: '12px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} color="var(--accent)" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Operational Activity Timeline</h3>
            <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
              REAL-TIME LOG
            </span>
          </div>

          <button
            onClick={() => setActiveNav('insights-activity')}
            className="btn btn-ghost btn-xs"
            style={{ gap: '4px' }}
          >
            <span>Full Activity History</span>
            <ArrowUpRight size={12} />
          </button>
        </div>

        <div style={{ padding: '14px 18px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '18px', minWidth: '780px' }}>
            {activityEvents.slice(0, 4).map(evt => (
              <div 
                key={evt.id}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 600 }}>
                    {evt.timestamp}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '9px', padding: '1px 5px' }}>
                    {evt.incidentId}
                  </span>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {evt.title}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {evt.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
