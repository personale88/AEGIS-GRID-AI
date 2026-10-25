import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Send, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Compass, 
  Eye, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import { tacticalAudio } from '../utils/audioSystem';

export default function IncidentDetailPanel() {
  const { 
    selectedIncident, 
    isDetailPanelOpen, 
    setIsDetailPanelOpen, 
    responders, 
    assignResponder,
    updateIncidentStatus,
    setActiveNav
  } = useOperations();

  const [selectedResponderId, setSelectedResponderId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  if (!isDetailPanelOpen || !selectedIncident) return null;

  const isCritical = selectedIncident.triageCode === 'RED' || selectedIncident.severity?.includes('Immediate');

  const handleAssign = () => {
    if (!selectedResponderId) return;
    assignResponder(selectedIncident.id, selectedResponderId);
    setIsAssigning(false);
  };

  const handleStatusChange = (newStatus) => {
    updateIncidentStatus(selectedIncident.id, newStatus);
  };

  const handleInspectInLab = () => {
    setIsDetailPanelOpen(false);
    setActiveNav('ops-triage');
  };

  return (
    <aside className={`detail-drawer ${isDetailPanelOpen ? 'open' : ''}`}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: 'var(--surface-secondary)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedIncident.id.toUpperCase()}
            </span>
            <span className={`badge ${isCritical ? 'badge-critical' : 'badge-warning'}`}>
              {isCritical ? 'CRITICAL / P1' : 'MODERATE / P2'}
            </span>
            <span className="badge badge-info" style={{ fontSize: '10px' }}>
              VERIFIED
            </span>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0', color: 'var(--text-primary)' }}>
            {selectedIncident.title}
          </h3>
        </div>

        <button
          onClick={() => setIsDetailPanelOpen(false)}
          className="btn btn-ghost btn-sm"
          style={{ padding: '4px', borderRadius: '50%' }}
          title="Close Panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Drawer Body (Scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Status & Quick Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Operational Status</span>
            <strong style={{ fontSize: '13px', color: selectedIncident.dispatched ? 'var(--success)' : 'var(--critical)' }}>
              {selectedIncident.status || (selectedIncident.dispatched ? 'TASK FORCE EN ROUTE' : 'PENDING DISPATCH')}
            </strong>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => handleStatusChange('RESOLVED')}
              className="btn btn-secondary btn-xs"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => handleStatusChange('INVESTIGATING')}
              className="btn btn-secondary btn-xs"
            >
              Investigating
            </button>
          </div>
        </div>

        {/* Location & Coordinates Section */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Geospatial Location
          </div>
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
              <MapPin size={15} color="var(--accent)" />
              <span>{selectedIncident.location}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span className="mono">COORDS: X={selectedIncident.coords.x}%, Y={selectedIncident.coords.y}%</span>
              <span>CONFIDENCE: 99.4%</span>
            </div>
          </div>
        </div>

        {/* Operational Assessment & Multimodal Insights */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Incident Assessment & Casualties
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>TRAPPED CIVILIANS</span>
              <strong style={{ fontSize: '18px', color: 'var(--critical)', fontFamily: 'var(--font-mono)' }}>
                {selectedIncident.victims} Persons
              </strong>
            </div>

            <div style={{ padding: '10px', backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>STRUCTURAL DAMAGE</span>
              <strong style={{ fontSize: '18px', color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}>
                {selectedIncident.damageIndex}%
              </strong>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <strong>Hazard Dynamics:</strong> {selectedIncident.hazardType}
          </div>

          {selectedIncident.aiAnalysis && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-bg)',
              border: '1px solid var(--accent-border)',
              fontSize: '11px'
            }}>
              <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '4px' }}>
                AI Recommendation:
              </strong>
              <div style={{ color: 'var(--text-primary)' }}>
                {selectedIncident.aiAnalysis.recommendedAction}
              </div>
            </div>
          )}
        </div>

        {/* Responder Assignment Section */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Responder Deployment
          </div>

          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Currently Assigned:</span>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>
                  {selectedIncident.assignedUnit || (selectedIncident.dispatched ? 'Triton-1 (Airboat Squad)' : 'None')}
                </strong>
              </div>
              <span className={`badge ${selectedIncident.dispatched ? 'badge-success' : 'badge-neutral'}`}>
                {selectedIncident.dispatched ? 'Active' : 'Unassigned'}
              </span>
            </div>

            {isAssigning ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Select Available Rescue Squad:</label>
                <select
                  value={selectedResponderId}
                  onChange={e => setSelectedResponderId(e.target.value)}
                  className="select"
                  style={{ width: '100%', fontSize: '12px' }}
                >
                  <option value="">-- Choose Unit --</option>
                  {responders.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.callsign} ({r.type.toUpperCase()}) - {r.status}
                    </option>
                  ))}
                </select>

                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setIsAssigning(false)} className="btn btn-ghost btn-xs">
                    Cancel
                  </button>
                  <button onClick={handleAssign} disabled={!selectedResponderId} className="btn btn-primary btn-xs">
                    Confirm Dispatch
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAssigning(true)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                <Users size={14} />
                <span>{selectedIncident.dispatched ? 'Reassign / Deploy Additional Unit' : 'Assign Responder Task Force'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Operational Progression Timeline */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Progression Timeline
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '2px solid var(--border-medium)', paddingLeft: '12px', marginLeft: '6px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-18px', top: '3px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>Incident Created & Telemetry Ingested</div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>10:41:05 UTC • Automated P2P Mesh</span>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-18px', top: '3px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>AI Multimodal Triage Completed</div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>10:41:12 UTC • ResNet-152 Vision Model</span>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-18px', top: '3px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedIncident.dispatched ? 'var(--success)' : 'var(--text-muted)' }} />
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedIncident.dispatched ? 'Task Force Dispatched' : 'Pending Dispatch Authorization'}
              </div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {selectedIncident.dispatched ? '10:41:40 UTC • Command Console' : 'Standing By'}
              </span>
            </div>
          </div>
        </div>

        {/* Deep Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
          <button
            onClick={handleInspectInLab}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px' }}
          >
            <Eye size={15} />
            <span>Inspect in AI Triage Lab</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playTacticalBeep(1400, 0.05, 0.03);
              alert(`Official FEMA SitRep dossier for ${selectedIncident.id} generated and ready for transmission.`);
            }}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '10px' }}
          >
            <FileText size={15} />
            <span>Generate Incident Report</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
