import React, { useState } from 'react';
import { 
  Navigation, 
  AlertOctagon, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Compass, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Radio, 
  Car, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioSystem';

export default function EvacuationEngine({ scenario }) {
  const routes = scenario.routes;
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', minHeight: '680px' }}>
      {/* Left Column: Side-by-Side Route Comparison & Vector Pathway */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Origin / Destination Header */}
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 51, 102, 0.2)', border: '1px solid var(--border-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="#ff3366" />
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>EVACUATION ORIGIN</span>
              <h4 style={{ fontSize: '14px', margin: 0, color: '#fff' }}>{routes.origin}</h4>
            </div>
          </div>

          <ArrowRight size={20} color="var(--cyan)" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--border-safe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#10b981" />
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SAFE HAVEN SHELTER</span>
              <h4 style={{ fontSize: '14px', margin: 0, color: '#fff' }}>{routes.destination}</h4>
            </div>
          </div>
        </div>

        {/* Comparative Cards: Legacy GPS vs AegisGrid AI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Legacy GPS Route Card */}
          <div className="glass-panel" style={{
            padding: '18px',
            border: '1px solid rgba(255, 51, 102, 0.4)',
            background: 'linear-gradient(180deg, rgba(255, 51, 102, 0.08) 0%, rgba(14, 21, 37, 0.8) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span className="badge badge-red">
                🛑 LEGACY CONSUMER GPS
              </span>
              <span className="mono" style={{ fontSize: '12px', color: '#ff3366', fontWeight: 700 }}>
                FATAL HAZARD
              </span>
            </div>

            <h3 style={{ fontSize: '15px', marginBottom: '6px' }}>{routes.legacyRoute.name}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Standard road distance & speed optimization without real-time disaster hazard modeling.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', fontSize: '11px' }}>
              <div style={{ color: '#ff758f', fontWeight: 600, marginBottom: '4px' }}>
                ⚠️ CRITICAL HAZARD INTERCEPT:
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {routes.legacyRoute.hazardBreach}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <span>Dist: {routes.legacyRoute.distanceKm}</span>
              <span style={{ color: '#ff3366' }}>Risk: {routes.legacyRoute.riskScore}/100</span>
            </div>
          </div>

          {/* AegisGrid AI Corridor Card */}
          <div className="glass-panel" style={{
            padding: '18px',
            border: '1px solid var(--border-safe)',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 21, 37, 0.8) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span className="badge badge-green">
                🛡️ AEGISGRID AI CORRIDOR
              </span>
              <span className="mono" style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>
                100% SECURE
              </span>
            </div>

            <h3 style={{ fontSize: '15px', marginBottom: '6px' }}>{routes.aegisRoute.name}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Autonomous topological & micro-meteorological perimeter routing with real-time drone verification.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', fontSize: '11px' }}>
              <div style={{ color: '#34d399', fontWeight: 600, marginBottom: '4px' }}>
                ✓ SAFETY VERIFICATION:
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {routes.aegisRoute.hazardBreach}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <span>Dist: {routes.aegisRoute.distanceKm}</span>
              <span style={{ color: '#10b981' }}>Est: {routes.aegisRoute.estimatedMinutes} (Risk: {routes.aegisRoute.riskScore}/100)</span>
            </div>
          </div>
        </div>

        {/* Visual Route Corridor Geometry Preview */}
        <div className="glass-panel" style={{ padding: '16px', flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={14} color="var(--cyan)" />
              <span>Tactical Elevation & Corridor Vector Map</span>
            </h4>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              GEO-MESH RESOLUTION: 0.5m
            </span>
          </div>

          <div style={{ height: '220px', background: '#070b14', borderRadius: 'var(--radius-md)', position: 'relative', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%' }}>
              {/* Grid lines */}
              <g opacity="0.1" stroke="#38bdf8" strokeWidth="0.2">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(x => (
                  <line key={x} x1={x} y1="0" x2={x} y2="60" />
                ))}
                {[15, 30, 45].map(y => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} />
                ))}
              </g>

              {/* Hazard Zone Blob */}
              <circle cx="50" cy="35" r="16" fill="rgba(255, 51, 102, 0.25)" stroke="#ff3366" strokeWidth="0.4" strokeDasharray="1, 1" />
              <text x="50" y="36" fill="#ff758f" fontSize="2.8" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">
                ⚠️ ACTIVE HAZARD ZONE
              </text>

              {/* Dangerous Legacy Route cutting straight through hazard */}
              <line x1="15" y1="35" x2="85" y2="35" stroke="#ff3366" strokeWidth="0.8" strokeDasharray="1.5, 1" />
              <circle cx="50" cy="35" r="2.5" fill="#ff3366" />
              <text x="50" y="27" fill="#ff3366" fontSize="2.4" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">
                🛑 FATAL BREACH POINT
              </text>

              {/* Safe Aegis AI Corridor curving around the top */}
              <path
                d="M 15,35 Q 25,12 50,12 T 85,35"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.2"
              />
              <circle cx="15" cy="35" r="2" fill="#38bdf8" stroke="#fff" strokeWidth="0.4" />
              <text x="15" y="42" fill="#38bdf8" fontSize="2.4" textAnchor="middle" fontFamily="JetBrains Mono">
                ORIGIN
              </text>

              <circle cx="85" cy="35" r="2.4" fill="#10b981" stroke="#fff" strokeWidth="0.4" />
              <text x="85" y="42" fill="#34d399" fontSize="2.4" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">
                SAFE HAVEN
              </text>

              {/* Elevation profile line */}
              <text x="50" y="10" fill="#34d399" fontSize="2.2" textAnchor="middle" fontFamily="JetBrains Mono">
                ▲ SAFE ELEVATION BYPASS (+85ft)
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Right Column: Step-by-Step Tactical Waypoints & Audio Guidance */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', margin: 0 }}>Turn-by-Turn Tactical Waypoints</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Real-time hazard-cleared route steps
            </p>
          </div>

          <button
            onClick={startVoiceGuidance}
            className={`btn ${isVoiceActive ? 'btn-cyan' : 'btn-primary'}`}
            style={{ fontSize: '12px', padding: '8px 14px' }}
            id="btn-voice-evac-guidance"
          >
            <Volume2 size={15} />
            <span>{isVoiceActive ? 'Voice Guidance Active' : 'Start Voice Guidance'}</span>
          </button>
        </div>

        {/* Step List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1 }}>
          {routes.aegisRoute.steps.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => handleStepClick(idx)}
                style={{
                  background: isSelected ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid var(--border-glow)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="mono" style={{ fontSize: '11px', color: isSelected ? 'var(--cyan)' : 'var(--text-muted)', fontWeight: 700 }}>
                    WAYPOINT {idx + 1}
                  </span>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {step.dist}
                  </span>
                </div>

                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  {step.instruction}
                </h4>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.06)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <CheckCircle2 size={12} color="#10b981" />
                  <span>{step.alert}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Civilian Broadcast Push Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>BROADCAST TO CELLULAR & MESH:</span>
            <strong style={{ fontSize: '12px', color: '#fff' }}>Transmit Route to 14,250 Evacuees</strong>
          </div>
          <button
            onClick={() => {
              tacticalAudio.playTacticalBeep(1400, 0.08, 0.05);
              alert('AegisGrid Evacuation Corridor broadcast transmitted across citizen mesh network & emergency cellular SMS cells!');
            }}
            className="btn btn-primary"
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            Transmit Push Alert
          </button>
        </div>
      </div>
    </div>
  );
}
