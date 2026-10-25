import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  MapPin, 
  Radio, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  Volume2,
  VolumeX,
  RefreshCw,
  ExternalLink,
  Crosshair
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import { tacticalAudio } from '../utils/audioSystem';

export default function TopNav({ onOpenMobileSidebar }) {
  const { 
    theme, 
    toggleTheme, 
    selectedScenarioId, 
    changeScenario, 
    activeNav, 
    searchQuery, 
    setSearchQuery,
    isMuted,
    setIsMuted,
    setIsSOSModalOpen,
    notifications,
    incidents,
    selectIncident,
    shelters,
    responders,
    userLiveLocation,
    isDetectingLocation,
    detectLiveLocation
  } = useOperations();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [syncSeconds, setSyncSeconds] = useState(0);

  // Dynamic relative last synchronization time
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncSeconds(prev => (prev >= 60 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navTitles = {
    'overview-dashboard': { title: 'Command Center', section: 'Overview' },
    'overview-map': { title: 'Tactical GIS Map', section: 'Overview' },
    'ops-incidents': { title: 'Incident Intelligence', section: 'Operations' },
    'ops-triage': { title: 'AI Multimodal Triage Lab', section: 'Operations' },
    'ops-evac': { title: 'Dynamic Evacuation Planner', section: 'Operations' },
    'ops-responders': { title: 'Responder Coordination', section: 'Operations' },
    'ops-supply': { title: 'Autonomous Resource Matrix', section: 'Operations' },
    'ops-drones': { title: 'Autonomous Drone Operations', section: 'Operations' },
    'community-sos': { title: 'Civilian Emergency SOS', section: 'Community' },
    'community-shelters': { title: 'Regional Shelter Directory', section: 'Community' },
    'insights-reports': { title: 'FEMA ICS-209 Reports & Analytics', section: 'Insights' },
    'insights-activity': { title: 'Operational Activity History', section: 'Insights' },
    'system-integrations': { title: 'System Feeds & Integrations', section: 'System' },
    'system-settings': { title: 'Command Center Settings', section: 'System' }
  };

  const currentNav = navTitles[activeNav] || { title: 'Command Center', section: 'Overview' };

  // Search matches
  const filteredIncidents = searchQuery ? incidents.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.id.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4) : [];

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    tacticalAudio.setMuted(nextMuted);
    if (!nextMuted) {
      tacticalAudio.playRadarPing();
    }
  };

  return (
    <header className="topbar">
      {/* LEFT: Mobile Menu + Breadcrumb & Region Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onOpenMobileSidebar}
          className="btn btn-ghost btn-sm"
          style={{ display: 'none' }}
          id="btn-mobile-sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>{currentNav.section}</span>
            <span>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentNav.title}</span>
          </div>
          <h2 style={{ fontSize: '16px', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
            {currentNav.title}
          </h2>
        </div>

        {/* Operational Region Selector & GPS Quick-Lock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--accent)" />
            <select
              value={selectedScenarioId}
              onChange={(e) => changeScenario(e.target.value)}
              className="select"
              style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 600 }}
              id="region-selector"
            >
              <option value="chennai">Chennai (Cyclone Michaung)</option>
              <option value="hurricane">Metropolis Bay (Hurricane Zephyr)</option>
              <option value="earthquake">Cascadia Core (M7.2 Quake)</option>
              <option value="wildfire">Diablo Canyon (Megafire)</option>
            </select>
          </div>

          {/* Real Device GPS Locate Me Button */}
          <button
            onClick={() => detectLiveLocation()}
            className="btn btn-outline btn-xs"
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 600,
              gap: '4px',
              borderColor: userLiveLocation ? 'var(--accent)' : 'var(--border-medium)',
              backgroundColor: userLiveLocation ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              color: userLiveLocation ? 'var(--accent)' : 'var(--text-secondary)'
            }}
            title="Lock on to your real device GPS coordinates"
            id="btn-gps-locate"
          >
            <Crosshair size={12} style={{ animation: isDetectingLocation ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isDetectingLocation ? 'Locating...' : userLiveLocation ? 'GPS Live' : 'Locate Me'}</span>
          </button>
        </div>
      </div>

      {/* CENTER: Global Search Bar */}
      <div style={{ flex: 1, maxWidth: '420px', margin: '0 20px', position: 'relative' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
            placeholder="Search incidents, shelters, responders, or GPS coords..."
            className="input"
            style={{
              width: '100%',
              paddingLeft: '32px',
              paddingRight: '12px',
              fontSize: '12px',
              height: '34px'
            }}
            id="global-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Interactive Search Popover Results */}
        {isSearchActive && searchQuery && (
          <div style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            padding: '8px',
            maxHeight: '320px',
            overflowY: 'auto'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', padding: '4px 8px', textTransform: 'uppercase' }}>
              Incident Matches ({filteredIncidents.length})
            </div>
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => {
                    selectIncident(inc.id);
                    setIsSearchActive(false);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginRight: '6px' }}>{inc.id.toUpperCase()}:</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{inc.title}</span>
                  </div>
                  <span className={`badge ${inc.triageCode === 'RED' ? 'badge-critical' : 'badge-warning'}`}>
                    {inc.triageCode}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                No active incidents found matching "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: Live Data Status, Theme Toggle, Notifications, User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Connection Status: DEMO MODE / SYNTHETIC DATA as strictly required */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '4px 9px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-subtle)',
          fontSize: '11px'
        }}>
          <span className="status-dot status-dot-success pulse-subtle" />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>DEMO ENVIRONMENT</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
            SYNC {syncSeconds}s AGO
          </span>
        </div>

        {/* Audio Mute / Unmute */}
        <button
          onClick={toggleSound}
          className="btn btn-ghost btn-sm"
          title={isMuted ? "Unmute Tactical Audio" : "Mute Tactical Audio"}
          style={{ padding: '6px' }}
        >
          {isMuted ? <VolumeX size={16} color="var(--text-muted)" /> : <Volume2 size={16} color="var(--accent)" />}
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{ padding: '6px 10px', gap: '6px' }}
          id="btn-theme-toggle"
        >
          {theme === 'light' ? (
            <>
              <Moon size={14} color="var(--text-secondary)" />
              <span style={{ fontSize: '11px' }}>Dark</span>
            </>
          ) : (
            <>
              <Sun size={14} color="#FBBF24" />
              <span style={{ fontSize: '11px' }}>Light</span>
            </>
          )}
        </button>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', position: 'relative' }}
            id="btn-notifications"
          >
            <Bell size={17} color="var(--text-secondary)" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--critical)'
              }} />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div style={{
              position: 'absolute',
              top: '38px',
              right: 0,
              width: '320px',
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Operational Alerts</span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--accent)' }}>3 NEW</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '11px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{n.title}</strong>
                      <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{n.timestamp}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{n.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={() => {
            tacticalAudio.playAlertAlarm();
            setIsSOSModalOpen(true);
          }}
          className="btn btn-critical btn-sm"
          style={{ fontWeight: 600, padding: '6px 12px' }}
          id="btn-topbar-sos"
        >
          <Radio size={14} />
          <span>CIVILIAN SOS</span>
        </button>
      </div>
    </header>
  );
}
