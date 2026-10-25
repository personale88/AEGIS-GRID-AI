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
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import { tacticalAudio } from '../utils/audioSystem';

export default function MultimodalTriageLab() {
  const { incidents, selectedIncidentId, selectIncident, assignResponder } = useOperations();
  
  const activeIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(true);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [customImage, setCustomImage] = useState(null);

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
    }, 1600);
  };

  const handleDispatch = () => {
    assignResponder(activeIncident.id, 'u1');
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

  // Sample computer vision bounding boxes
  const boundingBoxes = [
    { id: 'b1', top: '25%', left: '18%', width: '30%', height: '28%', label: 'Structural Breach (98%)', color: 'var(--critical)' },
    { id: 'b2', top: '55%', left: '38%', width: '35%', height: '32%', label: 'Entrapped Hazard (96%)', color: 'var(--warning)' },
    { id: 'b3', top: '15%', left: '60%', width: '22%', height: '24%', label: 'Isolated Civilians (94%)', color: 'var(--accent)' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', minHeight: '640px' }}>
      {/* Left Column: Image Viewer with Neural Scan Overlay */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Preset Selector */}
        <div className="card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} color="var(--accent)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Select Incident Feed:</span>
          </div>
          
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {incidents.slice(0, 3).map(inc => (
              <button
                key={inc.id}
                onClick={() => {
                  setCustomImage(null);
                  selectIncident(inc.id, false);
                  tacticalAudio.playTacticalBeep(1100, 0.04, 0.03);
                }}
                className="btn btn-xs"
                style={{
                  backgroundColor: activeIncident.id === inc.id && !customImage ? 'var(--accent-bg)' : 'var(--surface-secondary)',
                  color: activeIncident.id === inc.id && !customImage ? 'var(--accent)' : 'var(--text-secondary)',
                  borderColor: activeIncident.id === inc.id && !customImage ? 'var(--accent)' : 'var(--border-subtle)',
                  fontWeight: 600
                }}
              >
                <span>{inc.id.toUpperCase()}: {inc.title.slice(0, 18)}...</span>
              </button>
            ))}

            {/* Custom Upload Button */}
            <label 
              className="btn btn-secondary btn-xs" 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Upload your own disaster photo for instant AI triage"
            >
              <Upload size={12} color="var(--accent)" />
              <span>Upload Custom</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Main Image Stage */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#050811' }}>
          {/* Laser Scanner animation */}
          {isScanning && <div className="laser-scanner" />}

          <div style={{ position: 'relative', minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={customImage || activeIncident.image} 
              alt={activeIncident.title} 
              style={{
                width: '100%',
                height: '450px',
                objectFit: 'cover',
                display: 'block',
                filter: isScanning ? 'brightness(1.15) contrast(1.1)' : 'none',
                transition: 'filter 0.3s ease'
              }} 
            />

            {/* AI Bounding Boxes */}
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
                  backgroundColor: hoveredBox === b.id ? 'rgba(8, 145, 178, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                  boxShadow: hoveredBox === b.id ? `0 0 12px ${b.color}` : 'none',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  zIndex: 5
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '0',
                  backgroundColor: b.color,
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap'
                }}>
                  {b.label}
                </div>
              </div>
            ))}

            {/* Bottom HUD bar on image */}
            <div style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              right: 10,
              backgroundColor: 'rgba(10, 15, 28, 0.88)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              color: '#F8FAFC',
              fontFamily: 'var(--font-mono)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="status-dot status-dot-success" />
                <span>RESNET-152 + VISION TRANSFORMER</span>
              </div>
              <span style={{ color: '#22D3EE' }}>
                CONFIDENCE: {activeIncident.aiAnalysis?.confidence || '98.4%'}
              </span>
            </div>
          </div>

          {/* Trigger Scan Button Bar */}
          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-primary)' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>RECON ASSET:</span>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Autonomous Aerial Sensor Feed 04-A</strong>
            </div>

            <button
              onClick={runAiScan}
              disabled={isScanning}
              className="btn btn-primary btn-sm"
            >
              <Scan size={14} />
              <span>{isScanning ? 'Computing Damage Vectors...' : 'Re-Run AI Triage Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: AI Triage Intelligence Report */}
      <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className={`badge ${activeIncident.triageCode === 'RED' ? 'badge-critical' : 'badge-warning'}`}>
              NATO/FEMA CODE: {activeIncident.triageCode}
            </span>
            <span className="badge badge-accent">
              EDGE INFERENCE
            </span>
          </div>
          <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
            {activeIncident.title}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            📍 {activeIncident.location}
          </p>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Damage Index</span>
            <strong className="mono" style={{ fontSize: '18px', color: 'var(--critical)' }}>{activeIncident.damageIndex}%</strong>
            <span style={{ fontSize: '10px', color: 'var(--critical)', display: 'block' }}>Severe Failure</span>
          </div>

          <div style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Trapped Souls</span>
            <strong className="mono" style={{ fontSize: '18px', color: 'var(--warning)' }}>{activeIncident.victims}</strong>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Heat Verified</span>
          </div>

          <div style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Confidence</span>
            <strong className="mono" style={{ fontSize: '18px', color: 'var(--accent)' }}>{activeIncident.aiAnalysis?.confidence || '98%'}</strong>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Zero Ambiguity</span>
          </div>
        </div>

        {/* Detections */}
        <div>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.04em' }}>
            Vision Anomaly Detections:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(activeIncident.aiAnalysis?.detectedFeatures || []).map((f, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--surface-secondary)',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="var(--accent)" />
                  <span style={{ color: 'var(--text-primary)' }}>{f.label}</span>
                </span>
                <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                  {f.conf}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Actionable Directive */}
        <div style={{
          backgroundColor: 'var(--accent-bg)',
          border: '1px solid var(--accent-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px'
        }}>
          <h4 style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Cpu size={13} />
            <span>Algorithmic Triage Allocation:</span>
          </h4>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
            {activeIncident.aiAnalysis?.recommendedAction}
          </p>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            <strong>Allocated Units:</strong> {activeIncident.aiAnalysis?.priorityUnits}
          </div>
        </div>

        {/* Action Button Bar */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDispatch}
            disabled={activeIncident.dispatched}
            className={`btn ${activeIncident.dispatched ? 'btn-secondary' : 'btn-critical'}`}
            style={{ flex: 1, padding: '10px', fontWeight: 600 }}
          >
            <Send size={15} />
            <span>{activeIncident.dispatched ? '✓ Task Force En Route' : 'Authorize Emergency Dispatch'}</span>
          </button>

          <button
            onClick={() => alert(`SitRep Report for Incident ${activeIncident.id} copied to clipboard!`)}
            className="btn btn-secondary"
            style={{ padding: '10px 14px' }}
          >
            <FileText size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
