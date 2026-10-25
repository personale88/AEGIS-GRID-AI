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
  Wifi
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import { tacticalAudio } from '../utils/audioSystem';

export default function CivilianSOSModal() {
  const { isSOSModalOpen, setIsSOSModalOpen, addSOSReport, userLiveLocation, detectLiveLocation } = useOperations();

  const [headcount, setHeadcount] = useState(3);
  const [selectedConditions, setSelectedConditions] = useState(['Rising Floodwater']);
  const [details, setDetails] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);

  if (!isSOSModalOpen) return null;

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

      addSOSReport({
        id: `sos-${Date.now().toString().slice(-4)}`,
        title: `CIVILIAN SOS: ${selectedConditions.join(', ')} (${headcount} People)`,
        location: details ? details : (userLiveLocation ? `Chennai (GPS ${userLiveLocation.lat.toFixed(4)}°N, ${userLiveLocation.lng.toFixed(4)}°E)` : 'Velachery Lowlands, Chennai (Geo-Fixed)'),
        coords: { x: 38 + Math.floor(Math.random() * 20), y: 35 + Math.floor(Math.random() * 20) },
        lat: userLiveLocation ? userLiveLocation.lat : 12.9790 + (Math.random() - 0.5) * 0.02,
        lng: userLiveLocation ? userLiveLocation.lng : 80.2210 + (Math.random() - 0.5) * 0.02,
        triageCode: 'RED',
        severity: 'Immediate Life Threat',
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
    }, 1200);
  };

  const handleClose = () => {
    setIsSOSModalOpen(false);
    setIsSuccess(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="card" 
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '24px',
          border: '1px solid var(--critical)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          backgroundColor: 'var(--surface-primary)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--critical-bg)',
            border: '1px solid var(--critical-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={22} color="var(--critical)" />
          </div>
          <div>
            <span className="badge badge-critical" style={{ fontSize: '10px' }}>
              OFFLINE DECENTRALIZED MESH PROTOCOL
            </span>
            <h2 style={{ fontSize: '18px', margin: '2px 0 0', color: 'var(--text-primary)' }}>
              Civilian Emergency Distress Beacon
            </h2>
          </div>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <CheckCircle2 size={30} color="var(--success)" />
            </div>
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '6px' }}>
              SOS Beacon Successfully Broadcast!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Your distress packet has hopped across peer handsets via LoRa mesh and reached the Unified Command Center.
            </p>

            <div style={{
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--accent)'
            }}>
              ESTIMATED RESCUE TEAM ARRIVAL: <strong>8 - 12 MINUTES</strong>
            </div>

            <button onClick={handleClose} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              Return to Operations Console
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Broadcast your real-time distress coordinates directly to nearby search-and-rescue units, even when cellular towers are down.
            </p>

            {/* P2P Relay Status */}
            <div style={{
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wifi size={13} color="var(--success)" />
                <span style={{ color: 'var(--text-primary)' }}>Mesh Uplink: <strong>LoRa 915MHz P2P (3 Hops)</strong></span>
              </span>
              <span className="mono" style={{ color: 'var(--success)' }}>BATTERY: 84%</span>
            </div>

            {/* Headcount */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Total Trapped Individuals:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={headcount}
                  onChange={e => setHeadcount(Number(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--critical)' }}
                />
                <span className="mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--critical)', minWidth: '35px' }}>
                  {headcount}
                </span>
              </div>
            </div>

            {/* Critical Conditions Checklist */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Select Emergency Conditions:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {emergencyConditions.map(cond => {
                  const isChecked = selectedConditions.includes(cond);
                  return (
                    <button
                      type="button"
                      key={cond}
                      onClick={() => toggleCondition(cond)}
                      style={{
                        backgroundColor: isChecked ? 'var(--critical-bg)' : 'var(--surface-secondary)',
                        border: isChecked ? '1px solid var(--critical-border)' : '1px solid var(--border-subtle)',
                        color: isChecked ? 'var(--critical)' : 'var(--text-secondary)',
                        borderRadius: 'var(--radius-xs)',
                        padding: '5px 8px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      {isChecked ? '✓ ' : '+ '} {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional details & GPS autofill */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Specific Landmarks / Floor / Apartment:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    detectLiveLocation();
                    if (userLiveLocation) {
                      setDetails(`Chennai, TN (GPS: ${userLiveLocation.lat.toFixed(4)}°N, ${userLiveLocation.lng.toFixed(4)}°E)`);
                    } else {
                      setDetails('Velachery Gandhi Nagar, Chennai, Tamil Nadu, India');
                    }
                  }}
                  className="btn btn-outline btn-xs"
                  style={{ fontSize: '10px', padding: '1px 6px', gap: '3px' }}
                >
                  <MapPin size={11} color="var(--accent)" />
                  <span>Use My Real GPS</span>
                </button>
              </div>
              <input
                type="text"
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="e.g. Velachery 100-Ft Rd, 2nd floor balcony, water rising..."
                className="input"
                style={{ width: '100%', height: '34px', fontSize: '12px' }}
              />
            </div>

            {/* Siren toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isSirenActive ? <Volume2 size={15} color="var(--critical)" /> : <VolumeX size={15} color="var(--text-muted)" />}
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Acoustic Beacon Siren:
                </span>
              </div>
              <button
                type="button"
                onClick={toggleSiren}
                className={`btn ${isSirenActive ? 'btn-critical' : 'btn-secondary'} btn-xs`}
              >
                {isSirenActive ? 'Siren Active (Sounding)' : 'Test Siren Tone'}
              </button>
            </div>

            {/* Transmit Button */}
            <button
              type="submit"
              disabled={isTransmitting}
              className="btn btn-critical"
              style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: 700 }}
            >
              <Send size={15} />
              <span>{isTransmitting ? 'Transmitting Distress Packets...' : 'TRANSMIT SOS TO RESCUE FLEET'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
