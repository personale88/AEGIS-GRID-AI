import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  MapPin, 
  Users, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  X,
  Send,
  Wifi,
  Zap
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioSystem';

export default function CivilianSOSModal({ isOpen, onClose, onSubmitSOS }) {
  if (!isOpen) return null;

  const [headcount, setHeadcount] = useState(3);
  const [selectedConditions, setSelectedConditions] = useState(['Rising Floodwater']);
  const [details, setDetails] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);

  const emergencyConditions = [
    'Rising Floodwater',
    'Structural Collapse / Trapped',
    'Medical Oxygen / Insulin Required',
    'Elderly / Mobility Impaired',
    'Severe Smoke / Fire Proximity',
    'Severe Injury / Bleeding'
  ];

  const toggleCondition = (cond) => {
    setSelectedConditions(prev => 
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const toggleSiren = () => {
    const nextState = !isSirenActive;
    setIsSirenActive(nextState);
    if (nextState) {
      tacticalAudio.playAlertAlarm();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsTransmitting(true);
    tacticalAudio.playAlertAlarm();

    setTimeout(() => {
      setIsTransmitting(false);
      setIsSuccess(true);
      tacticalAudio.playSuccessChime();

      onSubmitSOS({
        id: `sos-${Date.now()}`,
        title: `CIVILIAN SOS: ${selectedConditions.join(', ')} (${headcount} People)`,
        location: 'Sector 4 Residential Block (Geo-Fixed)',
        coords: { x: 38 + Math.floor(Math.random() * 20), y: 35 + Math.floor(Math.random() * 20) },
        triageCode: 'RED',
        severity: 'Emergency Civilian Beacon',
        victims: headcount,
        damageIndex: 92,
        hazardType: selectedConditions.join(', '),
        dispatched: false,
        image: '/triage_flood.jpg',
        aiAnalysis: {
          confidence: '99.4%',
          structureIntegrity: '15%',
          waterDepthEst: 'Rapidly Rising',
          detectedFeatures: [
            { label: 'Cellular Tower Failure - Relayed via 3 P2P Mesh Handsets', conf: '99%' },
            { label: `Direct Civilian SOS Beacon: ${headcount} Souls`, conf: '100%' }
          ],
          recommendedAction: 'Immediate Task Force Extraction Dispatch',
          priorityUnits: 'Swift Water Inflatable + USAR K9'
        }
      });
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 5, 10, 0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-panel glow-border" 
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '28px',
          border: '1px solid var(--border-danger)',
          boxShadow: 'var(--shadow-red-glow)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(255, 51, 102, 0.2)',
            border: '1px solid var(--border-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={26} color="#ff3366" />
          </div>
          <div>
            <span className="badge badge-red" style={{ fontSize: '10px' }}>
              OFFLINE DECENTRALIZED MESH PROTOCOL
            </span>
            <h2 style={{ fontSize: '20px', margin: '4px 0 0', color: '#fff' }}>
              Civilian Emergency Distress Beacon
            </h2>
          </div>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--border-safe)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px' }}>
              SOS Beacon Successfully Broadcast!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Your distress packet has hopped across <strong>4 peer devices</strong> via LoRa/Wi-Fi Direct and reached the Incident Command Center. Rescue units have been assigned priority dispatch.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--cyan)'
            }}>
              ESTIMATED FIRST RESPONDER ARRIVAL: <strong>8 - 12 MINUTES</strong>
            </div>

            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Return to Operations HUD
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Broadcast your real-time distress coordinates directly to nearby search-and-rescue units, even when cellular coverage is offline.
            </p>

            {/* P2P Relay Status */}
            <div style={{
              background: 'rgba(0, 240, 255, 0.05)',
              border: '1px solid var(--border-glow)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wifi size={14} color="var(--cyan)" />
                <span>P2P Mesh Uplink: <strong style={{ color: '#fff' }}>Mesh-Relay Active (3 Hops)</strong></span>
              </span>
              <span className="mono" style={{ color: '#10b981' }}>BATTERY: 84%</span>
            </div>

            {/* Headcount */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Total Trapped Individuals:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={headcount}
                  onChange={e => setHeadcount(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#ff3366' }}
                />
                <span className="mono" style={{ fontSize: '16px', fontWeight: 700, color: '#ff3366', minWidth: '40px' }}>
                  {headcount}
                </span>
              </div>
            </div>

            {/* Critical Conditions Checklist */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Select Hazard / Medical Conditions:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {emergencyConditions.map(cond => {
                  const isChecked = selectedConditions.includes(cond);
                  return (
                    <button
                      type="button"
                      key={cond}
                      onClick={() => toggleCondition(cond)}
                      style={{
                        background: isChecked ? 'rgba(255, 51, 102, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        border: isChecked ? '1px solid var(--border-danger)' : '1px solid var(--border-subtle)',
                        color: isChecked ? '#ff758f' : 'var(--text-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isChecked ? '✓ ' : '+ '} {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional details */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Specific Landmarks / Floor / Apartment Number:
              </label>
              <input
                type="text"
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="e.g. 2nd floor balcony with red flag, water rising to stairs..."
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Siren toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSirenActive ? <Volume2 size={16} color="#ff3366" /> : <VolumeX size={16} color="var(--text-muted)" />}
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Acoustic Beacon Siren:
                </span>
              </div>
              <button
                type="button"
                onClick={toggleSiren}
                className={`btn ${isSirenActive ? 'btn-danger' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                {isSirenActive ? 'Siren Active (Sounding)' : 'Test Siren Tone'}
              </button>
            </div>

            {/* Transmit Button */}
            <button
              type="submit"
              disabled={isTransmitting}
              className="btn btn-danger"
              style={{ width: '100%', padding: '14px', fontSize: '14px', fontWeight: 800 }}
              id="btn-submit-civilian-sos"
            >
              <Send size={16} />
              <span>{isTransmitting ? 'Transmitting Distress Packets...' : 'TRANSMIT SOS TO RESCUE FLEET'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
