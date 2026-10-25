import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Scan, 
  AlertTriangle, 
  ShieldCheck, 
  Upload, 
  Send, 
  CheckCircle2, 
  Cpu, 
  FileText, 
  Layers, 
  Crosshair, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioSystem';

export default function MultimodalTriageLab({ 
  selectedIncident, 
  allIncidents, 
  onSelectIncident,
  onDispatchUnit
}) {
  const activeIncident = selectedIncident || allIncidents[0];
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(true);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [dispatchStatus, setDispatchStatus] = useState(activeIncident?.dispatched || false);
  const [customImage, setCustomImage] = useState(null);

  useEffect(() => {
    if (activeIncident) {
      setDispatchStatus(activeIncident.dispatched);
      setScanCompleted(true);
    }
  }, [activeIncident]);

  const runAiScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
    tacticalAudio.playRadarPing();

    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
      tacticalAudio.playTacticalBeep(1600, 0.1, 0.08);
      tacticalAudio.speakTacticalAlert(
        `AI Triage complete. Structural Damage index: ${activeIncident.damageIndex} percent. Triage level: ${activeIncident.triageCode}.`
      );
    }, 1800);
  };

  const handleDispatch = () => {
    tacticalAudio.playDispatchConfirmed();
    setDispatchStatus(true);
    onDispatchUnit(activeIncident.id);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
        runAiScan();
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample bounding boxes for visual overlay
  const boundingBoxes = [
    { id: 'b1', top: '25%', left: '18%', width: '30%', height: '28%', label: 'Structural Breach (98%)', tag: 'CRITICAL', color: '#ff3366' },
    { id: 'b2', top: '55%', left: '38%', width: '35%', height: '32%', label: 'Entrapped Hazard Zone (96%)', tag: 'HIGH HAZARD', color: '#f59e0b' },
    { id: 'b3', top: '15%', left: '60%', width: '22%', height: '24%', label: 'Civilians Isolated (94%)', tag: 'RESCUE PRIORITY', color: '#00f0ff' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', minHeight: '680px' }}>
      {/* Left Column: Image Viewer with Neural Scan Overlay */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Preset Selector */}
        <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--cyan)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>Select Incident Feed to Analyze:</span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {allIncidents.map(inc => (
              <button
                key={inc.id}
                onClick={() => {
                  setCustomImage(null);
                  onSelectIncident(inc);
                  tacticalAudio.playTacticalBeep(1100, 0.04, 0.03);
                }}
                className="btn"
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  background: activeIncident.id === inc.id && !customImage ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  color: activeIncident.id === inc.id && !customImage ? 'var(--cyan)' : 'var(--text-secondary)',
                  border: activeIncident.id === inc.id && !customImage ? '1px solid var(--border-glow)' : '1px solid var(--border-subtle)'
                }}
              >
                <span>{inc.title.slice(0, 24)}...</span>
              </button>
            ))}

            {/* Custom Upload Button */}
            <label 
              className="btn btn-outline" 
              style={{ padding: '5px 10px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Upload your own disaster photo for instant AI triage"
            >
              <Upload size={12} color="var(--cyan)" />
              <span>Upload Custom</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Main Image Stage */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: '#030509' }}>
          {/* Laser Scanner animation */}
          {isScanning && <div className="laser-scanner" />}

          <div style={{ position: 'relative', minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={customImage || activeIncident.image} 
              alt={activeIncident.title} 
              style={{
                width: '100%',
                height: '460px',
                objectFit: 'cover',
                display: 'block',
                filter: isScanning ? 'brightness(1.15) contrast(1.1)' : 'none',
                transition: 'filter 0.3s ease'
              }} 
            />

            {/* Neural Overlay Grid */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(6, 9, 15, 0.7) 100%)',
              pointerEvents: 'none'
            }} />

            {/* AI Bounding Boxes (active when scan completed) */}
            {scanCompleted && boundingBoxes.map(b => (
              <div
                key={b.id}
                onMouseEnter={() => setHoveredBox(b.id)}
                onMouseLeave={() => setHoveredBox(null)}
                style={{
                  position: 'absolute',
                  top: b.top,
                  left: b.left,
                  width: b.width,
                  height: b.height,
                  border: `2px solid ${b.color}`,
                  background: hoveredBox === b.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                  boxShadow: hoveredBox === b.id ? `0 0 15px ${b.color}` : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  zIndex: 5
                }}
              >
                {/* Box Tag */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '0',
                  background: b.color,
                  color: '#000',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  fontFamily: 'var(--font-mono)',
                  borderRadius: '2px 2px 0 0',
                  whiteSpace: 'nowrap'
                }}>
                  {b.label}
                </div>
                {/* Crosshairs at box corners */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 6, height: 6, borderTop: `2px solid #fff`, borderLeft: `2px solid #fff` }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: 6, height: 6, borderTop: `2px solid #fff`, borderRight: `2px solid #fff` }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 6, height: 6, borderBottom: `2px solid #fff`, borderLeft: `2px solid #fff` }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 6, height: 6, borderBottom: `2px solid #fff`, borderRight: `2px solid #fff` }} />
              </div>
            ))}

            {/* Bottom HUD bar on image */}
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              background: 'rgba(7, 11, 20, 0.88)',
              backdropFilter: 'blur(10px)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-dot" />
                <span>NEURAL INFERENCE: RESNET-152 + VISION TRANSFORMER</span>
              </div>
              <span style={{ color: 'var(--cyan)' }}>
                CONFIDENCE: {activeIncident.aiAnalysis.confidence}
              </span>
            </div>
          </div>

          {/* Trigger Scan Button */}
          <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>SURVEILLANCE ASSET:</span>
              <strong style={{ fontSize: '13px', color: '#fff' }}>Autonomous Drone Recon Feed 04-A</strong>
            </div>

            <button
              onClick={runAiScan}
              disabled={isScanning}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '8px 16px' }}
              id="btn-run-ai-scan"
            >
              <Scan size={14} className={isScanning ? 'radar-sweep-beam' : ''} />
              <span>{isScanning ? 'Computing Neural Damage Vectors...' : 'Re-Run AI Triage Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: AI Triage Intelligence Report */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className={`badge ${activeIncident.triageCode === 'RED' ? 'badge-red' : 'badge-yellow'}`}>
                  NATO/FEMA CODE: {activeIncident.triageCode}
                </span>
                <span className="badge badge-purple" style={{ fontSize: '9px' }}>
                  AI EDGE INFERENCE
                </span>
              </div>
              <h2 style={{ fontSize: '18px', margin: 0 }}>{activeIncident.title}</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                📍 {activeIncident.location}
              </p>
            </div>
          </div>

          {/* Key Damage & Casualty Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Structural Damage</span>
              <strong style={{ fontSize: '20px', color: '#ff3366', fontFamily: 'var(--font-mono)' }}>{activeIncident.damageIndex}%</strong>
              <span style={{ fontSize: '10px', color: '#ff758f', display: 'block' }}>Severe Failure</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Trapped Civilians</span>
              <strong style={{ fontSize: '20px', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{activeIncident.victims}</strong>
              <span style={{ fontSize: '10px', color: '#fcd34d', display: 'block' }}>Heat Verified</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Model Confidence</span>
              <strong style={{ fontSize: '20px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{activeIncident.aiAnalysis.confidence}</strong>
              <span style={{ fontSize: '10px', color: 'var(--text-cyan)', display: 'block' }}>Zero Ambiguity</span>
            </div>
          </div>

          {/* AI Feature Detections */}
          <div>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Computer Vision Anomaly Detections:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeIncident.aiAnalysis.detectedFeatures.map((f, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    fontSize: '12px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} color="var(--cyan)" />
                    <span>{f.label}</span>
                  </span>
                  <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                    {f.conf}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action & Unit Allocation */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.04)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '14px'
          }}>
            <h4 style={{ fontSize: '12px', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} />
              <span>Algorithmic Triage Recommendation:</span>
            </h4>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '8px' }}>
              {activeIncident.aiAnalysis.recommendedAction}
            </p>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              <strong>Allocated Units:</strong> {activeIncident.aiAnalysis.priorityUnits}
            </div>
          </div>

          {/* Action Dispatch Bar */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
            <button
              onClick={handleDispatch}
              disabled={dispatchStatus}
              className={`btn ${dispatchStatus ? 'btn-outline' : 'btn-danger'}`}
              style={{ flex: 1, padding: '12px', fontSize: '13px', fontWeight: 700 }}
              id="btn-authorize-dispatch"
            >
              <Send size={16} />
              <span>{dispatchStatus ? '✓ Rescue Task Force En Route' : 'Authorize Emergency Dispatch'}</span>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playTacticalBeep(1400, 0.05, 0.04);
                alert(`SitRep Report for Incident ${activeIncident.id} copied to clipboard!`);
              }}
              className="btn btn-outline"
              style={{ padding: '12px 16px', fontSize: '12px' }}
              title="Export Incident Dossier"
            >
              <FileText size={16} />
              <span>Export SitRep</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
