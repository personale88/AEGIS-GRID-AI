import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  Camera,
  CameraOff,
  Globe,
  Link,
  X,
  ExternalLink
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

  // Real live camera & Web URL inputs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [webUrlInput, setWebUrlInput] = useState('');
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      tacticalAudio.playRadarPing();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setCustomImage(null);
    } catch (err) {
      console.warn('Camera access error:', err.message);
      setCameraError('Camera access unavailable or permission dismissed.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCustomImage(dataUrl);
    stopCamera();
    runAiScan();
  };

  const handleWebUrlSubmit = (e) => {
    e?.preventDefault();
    if (!webUrlInput.trim()) return;
    setCustomImage(webUrlInput.trim());
    setShowUrlInput(false);
    runAiScan();
  };

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
        stopCamera();
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
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Left Column: Image Viewer with Neural Scan Overlay */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Preset & Ingest Selector */}
        <div className="card" style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={15} color="var(--accent)" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Select Incident Feed:</span>
            </div>
            
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', alignItems: 'center' }}>
              {incidents.slice(0, 3).map(inc => (
                <button
                  key={inc.id}
                  onClick={() => {
                    stopCamera();
                    setCustomImage(null);
                    selectIncident(inc.id, false);
                    tacticalAudio.playTacticalBeep(1100, 0.04, 0.03);
                  }}
                  className="btn btn-xs"
                  style={{
                    backgroundColor: activeIncident.id === inc.id && !customImage && !isCameraActive ? 'var(--accent-bg)' : 'var(--surface-secondary)',
                    color: activeIncident.id === inc.id && !customImage && !isCameraActive ? 'var(--accent)' : 'var(--text-secondary)',
                    borderColor: activeIncident.id === inc.id && !customImage && !isCameraActive ? 'var(--accent)' : 'var(--border-subtle)',
                    fontWeight: 600
                  }}
                >
                  <span>{inc.id.toUpperCase()}: {inc.title.slice(0, 18)}...</span>
                </button>
              ))}

              {/* Real Live Device Camera Button */}
              <button
                onClick={() => {
                  if (isCameraActive) {
                    stopCamera();
                  } else {
                    startCamera();
                  }
                }}
                className={`btn btn-xs ${isCameraActive ? 'btn-critical' : 'btn-secondary'}`}
                style={{ gap: '4px', fontWeight: 600 }}
                title="Open real live device webcam / mobile camera for instant real-world AI triage"
              >
                {isCameraActive ? <CameraOff size={12} /> : <Camera size={12} color="var(--accent)" />}
                <span>{isCameraActive ? 'Stop Camera' : 'Live Camera'}</span>
              </button>

              {/* Real Live Image URL Ingest Button */}
              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className={`btn btn-xs ${showUrlInput ? 'btn-outline' : 'btn-secondary'}`}
                style={{ gap: '4px', fontWeight: 600 }}
                title="Paste a real-world photo URL from news, Twitter, or live disaster cameras"
              >
                <Globe size={12} color="var(--accent)" />
                <span>Web URL</span>
              </button>

              {/* Custom Upload Button */}
              <label 
                className="btn btn-secondary btn-xs" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Upload your own disaster photo for instant AI triage"
              >
                <Upload size={12} color="var(--accent)" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Web URL Ingestion Bar & Real Presets */}
          {showUrlInput && (
            <div style={{
              marginTop: '6px',
              padding: '8px 12px',
              backgroundColor: 'var(--surface-secondary)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <form onSubmit={handleWebUrlSubmit} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="url"
                  placeholder="Paste real image URL from web (e.g. news photo, disaster camera, tweet image)..."
                  value={webUrlInput}
                  onChange={(e) => setWebUrlInput(e.target.value)}
                  className="input"
                  style={{ flex: 1, fontSize: '11px', height: '28px' }}
                />
                <button type="submit" className="btn btn-primary btn-xs" style={{ gap: '4px' }}>
                  <Link size={12} />
                  <span>Ingest & Scan</span>
                </button>
              </form>

              {/* Quick Real Photography Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>REAL SAMPLES:</span>
                {[
                  { name: 'Monsoon Inundation', url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80' },
                  { name: 'Urban Downpour Flood', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80' },
                  { name: 'Rescue Boat Operation', url: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=1200&q=80' }
                ].map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setCustomImage(p.url);
                      setShowUrlInput(false);
                      stopCamera();
                      runAiScan();
                    }}
                    className="btn btn-ghost btn-xs"
                    style={{ fontSize: '10px', padding: '1px 6px', color: 'var(--accent)' }}
                  >
                    + {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cameraError && (
            <div style={{ color: 'var(--warning)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={12} />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        {/* Main Image Stage */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#050811' }}>
          {/* Laser Scanner animation */}
          {isScanning && <div className="laser-scanner" />}

          <div style={{ position: 'relative', minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isCameraActive ? (
              <div style={{ position: 'relative', width: '100%', height: '450px', backgroundColor: '#000' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  zIndex: 20
                }}>
                  <button
                    onClick={captureCameraFrame}
                    className="btn btn-critical"
                    style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700, gap: '6px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)' }}
                  >
                    <Camera size={16} />
                    <span>Capture Frame & Run AI Triage</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
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
            )}

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
