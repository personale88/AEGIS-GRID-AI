import React, { useState } from 'react';
import { 
  Navigation, 
  AlertOctagon, 
  ShieldCheck, 
  Volume2, 
  ArrowRight, 
  Compass, 
  MapPin, 
  CheckCircle2,
  Radio
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import { tacticalAudio } from '../utils/audioSystem';

export default function EvacuationEngine() {
  const { routes, theme } = useOperations();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const startVoiceGuidance = () => {
    setIsVoiceActive(true);
    tacticalAudio.playDispatchConfirmed();

    const textToSpeak = `AegisGrid Evacuation Corridor initiated. Departing ${routes.origin}. Step one: ${routes.aegisRoute.steps[0].instruction}. ${routes.aegisRoute.steps[0].alert}.`;
    tacticalAudio.speakTacticalAlert(textToSpeak);
  };

  const handleStepClick = (idx) => {
    setActiveStepIndex(idx);
    tacticalAudio.playTacticalBeep(1200, 0.05, 0.04);
    if (isVoiceActive) {
      const step = routes.aegisRoute.steps[idx];
      tacticalAudio.speakTacticalAlert(`Step ${idx + 1}: ${step.instruction}. Note: ${step.alert}`);
    }
  };

  const isLight = theme === 'light';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', minHeight: '640px' }}>
      {/* Left Column: Side-by-Side Route Comparison & Vector Pathway */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Origin / Destination Header */}
        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--critical-bg)', border: '1px solid var(--critical-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={16} color="var(--critical)" />
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>EVACUATION ORIGIN</span>
              <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--text-primary)' }}>{routes.origin}</h4>
            </div>
          </div>

          <ArrowRight size={18} color="var(--accent)" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={16} color="var(--success)" />
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SAFE HAVEN SHELTER</span>
              <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--text-primary)' }}>{routes.destination}</h4>
            </div>
          </div>
        </div>

        {/* Comparative Cards: Legacy GPS vs AegisGrid AI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Legacy GPS Route Card */}
          <div className="card" style={{ padding: '16px', borderLeft: '3px solid var(--critical)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className="badge badge-critical">
                🛑 CONSUMER GPS
              </span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--critical)', fontWeight: 700 }}>
                FATAL HAZARD
              </span>
            </div>

            <h3 style={{ fontSize: '14px', marginBottom: '4px', color: 'var(--text-primary)' }}>{routes.legacyRoute.name}</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Standard road distance optimization with zero real-time disaster hazard modeling.
            </p>

            <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '8px', borderRadius: 'var(--radius-sm)', marginBottom: '10px', fontSize: '11px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--critical)', fontWeight: 600, marginBottom: '2px' }}>
                ⚠️ FATAL HAZARD INTERCEPT:
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {routes.legacyRoute.hazardBreach}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span>Dist: {routes.legacyRoute.distanceKm}</span>
              <span style={{ color: 'var(--critical)', fontWeight: 600 }}>Risk: {routes.legacyRoute.riskScore}/100</span>
            </div>
          </div>

          {/* AegisGrid AI Corridor Card */}
          <div className="card" style={{ padding: '16px', borderLeft: '3px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className="badge badge-success">
                🛡️ AEGIS AI CORRIDOR
              </span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700 }}>
                100% SECURE
              </span>
            </div>

            <h3 style={{ fontSize: '14px', marginBottom: '4px', color: 'var(--text-primary)' }}>{routes.aegisRoute.name}</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Autonomous topological & micro-meteorological perimeter routing with sensor verification.
            </p>

            <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '8px', borderRadius: 'var(--radius-sm)', marginBottom: '10px', fontSize: '11px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '2px' }}>
                ✓ SAFETY VERIFICATION:
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {routes.aegisRoute.hazardBreach}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span>Dist: {routes.aegisRoute.distanceKm}</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Est: {routes.aegisRoute.estimatedMinutes}</span>
            </div>
          </div>
        </div>

        {/* Visual Route Corridor Geometry Preview */}
        <div className="card" style={{ padding: '16px', flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              <Compass size={14} color="var(--accent)" />
              <span>Elevation Profile & Corridor Vector Geometry</span>
            </h4>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              GEO-MESH: 0.5m ACCURACY
            </span>
          </div>

          <div style={{ height: '210px', backgroundColor: isLight ? 'var(--map-land)' : '#070b14', borderRadius: 'var(--radius-sm)', position: 'relative', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%' }}>
              {/* Hazard Zone */}
              <circle cx="50" cy="35" r="16" fill="rgba(220, 38, 38, 0.18)" stroke="var(--critical)" strokeWidth="0.4" strokeDasharray="1.5, 1" />
              <text x="50" y="36" fill="var(--critical)" fontSize="2.8" textAnchor="middle" fontFamily="Inter" fontWeight="bold">
                ⚠️ ACTIVE HAZARD ZONE
              </text>

              {/* Legacy Blocked Route */}
              <line x1="15" y1="35" x2="85" y2="35" stroke="var(--map-route-danger)" strokeWidth="0.8" strokeDasharray="1.5, 1" />
              <circle cx="50" cy="35" r="2.2" fill="var(--critical)" />
              <text x="50" y="27" fill="var(--critical)" fontSize="2.4" textAnchor="middle" fontFamily="Inter" fontWeight="bold">
                🛑 FATAL INTERCEPT
              </text>

              {/* Safe Aegis Corridor */}
              <path
                d="M 15,35 Q 25,12 50,12 T 85,35"
                fill="none"
                stroke="var(--map-route-safe)"
                strokeWidth="1.2"
              />
              <circle cx="15" cy="35" r="2" fill="var(--accent)" stroke="#fff" strokeWidth="0.4" />
              <circle cx="85" cy="35" r="2.2" fill="var(--success)" stroke="#fff" strokeWidth="0.4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Column: Step-by-Step Tactical Waypoints & Audio Guidance */}
      <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Turn-by-Turn Waypoints</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Real-time hazard-cleared route steps
            </p>
          </div>

          <button
            onClick={startVoiceGuidance}
            className={`btn ${isVoiceActive ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          >
            <Volume2 size={14} />
            <span>{isVoiceActive ? 'Voice Active' : 'Start Voice Guidance'}</span>
          </button>
        </div>

        {/* Step List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
          {routes.aegisRoute.steps.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => handleStepClick(idx)}
                style={{
                  backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface-secondary)',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className="mono" style={{ fontSize: '11px', color: isSelected ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 700 }}>
                    WAYPOINT {idx + 1}
                  </span>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {step.dist}
                  </span>
                </div>

                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {step.instruction}
                </h4>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: 'var(--success)',
                  backgroundColor: 'var(--success-bg)',
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-xs)'
                }}>
                  <CheckCircle2 size={12} color="var(--success)" />
                  <span>{step.alert}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Push to Evacuees Bar */}
        <div style={{
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>BROADCAST TO CELLULAR & MESH:</span>
            <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Push Route to Evacuees</strong>
          </div>
          <button
            onClick={() => {
              tacticalAudio.playTacticalBeep(1400, 0.08, 0.05);
              alert('AegisGrid Evacuation Corridor broadcast pushed across civilian mesh & emergency cell broadcast!');
            }}
            className="btn btn-primary btn-sm"
          >
            Push Alert
          </button>
        </div>
      </div>
    </div>
  );
}
