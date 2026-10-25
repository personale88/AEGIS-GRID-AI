import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Flame, 
  Waves, 
  Activity, 
  Compass, 
  Eye, 
  Share2, 
  Cpu, 
  Navigation,
  Clock,
  Wifi
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioSystem';

export default function Header({ 
  currentScenario, 
  onSelectScenario, 
  activeTab, 
  setActiveTab, 
  onTriggerSOS,
  isMuted,
  setIsMuted
}) {
  const [time, setTime] = useState(new Date().toUTCString().slice(17, 25));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toUTCString().slice(17, 25));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabClick = (tabId) => {
    tacticalAudio.playTacticalBeep(1400, 0.05, 0.04);
    setActiveTab(tabId);
  };

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    tacticalAudio.setMuted(nextMuted);
    if (!nextMuted) {
      tacticalAudio.playRadarPing();
    }
  };

  return (
    <header className="tactical-header" style={{
      background: 'rgba(7, 10, 18, 0.92)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px'
    }}>
      {/* Top Telemetry Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        fontSize: '11px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-dot" />
            <strong style={{ color: 'var(--cyan)' }}>AEGIS-NET MESH:</strong> 
            <span className="mono" style={{ color: '#fff' }}>{currentScenario.meshNodesActive} ACTIVE NODES</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={12} color="#10b981" />
            <span>P2P SATCOM RELAY: <strong style={{ color: '#10b981' }}>ONLINE (0.18ms)</strong></span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={12} color="#f59e0b" />
            <span>THREAT LEVEL: <strong style={{ color: '#ff3366' }}>{currentScenario.threatLevel}</strong></span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} color="var(--text-secondary)" />
            <span>UTC {time}</span>
          </span>

          {/* Sound Toggle */}
          <button 
            onClick={toggleAudio} 
            className="btn btn-outline" 
            style={{ padding: '3px 8px', fontSize: '11px', height: '26px' }}
            title={isMuted ? "Unmute Tactical Soundscape" : "Mute Soundscape"}
          >
            {isMuted ? <VolumeX size={13} color="#94a3b8" /> : <Volume2 size={13} color="var(--cyan)" />}
            <span style={{ fontSize: '11px' }}>{isMuted ? "MUTED" : "AUDIO ON"}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation & Brand Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(37, 99, 235, 0.4))',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <ShieldAlert size={24} color="var(--cyan)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>
                AEGIS<span style={{ color: 'var(--cyan)' }}>GRID</span>
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '9px', padding: '2px 6px' }}>
                AI DISASTER MESH
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
              Autonomous Multi-Agency Crisis Intelligence & Life-Safety Network
            </p>
          </div>
        </div>

        {/* Tactical Scenario Quick Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Crisis Mode:
          </span>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => onSelectScenario('hurricane')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                background: currentScenario.id === 'hurricane' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: currentScenario.id === 'hurricane' ? 'var(--cyan)' : 'var(--text-secondary)',
                border: currentScenario.id === 'hurricane' ? '1px solid var(--border-glow)' : '1px solid transparent'
              }}
            >
              <Waves size={14} />
              <span>Hurricane Zephyr</span>
            </button>

            <button
              onClick={() => onSelectScenario('earthquake')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                background: currentScenario.id === 'earthquake' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: currentScenario.id === 'earthquake' ? '#fbbf24' : 'var(--text-secondary)',
                border: currentScenario.id === 'earthquake' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent'
              }}
            >
              <Activity size={14} />
              <span>Cascadia 7.2 Quake</span>
            </button>

            <button
              onClick={() => onSelectScenario('wildfire')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                background: currentScenario.id === 'wildfire' ? 'rgba(255, 51, 102, 0.18)' : 'transparent',
                color: currentScenario.id === 'wildfire' ? '#ff3366' : 'var(--text-secondary)',
                border: currentScenario.id === 'wildfire' ? '1px solid var(--border-danger)' : '1px solid transparent'
              }}
            >
              <Flame size={14} />
              <span>Diablo Megafire</span>
            </button>
          </div>
        </div>

        {/* SOS Distress Beacon Trigger */}
        <button
          onClick={onTriggerSOS}
          className="btn btn-danger"
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            animation: 'pulse 2s infinite'
          }}
          id="btn-civilian-sos-trigger"
        >
          <AlertTriangle size={16} />
          <span>CIVILIAN SOS BEACON</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        paddingTop: '4px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'map', label: 'Tactical GIS Map', icon: Compass },
          { id: 'triage', label: 'AI Multimodal Triage Lab', icon: Eye, count: currentScenario.incidents.length },
          { id: 'evac', label: 'Dynamic Evacuation Engine', icon: Navigation },
          { id: 'supply', label: 'Autonomous Supply Mesh', icon: Share2 },
          { id: 'copilot', label: 'AI Tactical Copilot', icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--cyan)' : '2px solid transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              id={`tab-btn-${tab.id}`}
            >
              <Icon size={16} color={isActive ? 'var(--cyan)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '10px',
                  background: isActive ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
