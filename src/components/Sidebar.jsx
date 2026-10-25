import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  Eye, 
  Navigation, 
  Users, 
  Package, 
  Radio, 
  Home, 
  FileText, 
  Clock, 
  Cpu, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Plane,
  Activity,
  Layers
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { 
    activeNav, 
    setActiveNav, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    metrics
  } = useOperations();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'overview-dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
        { id: 'overview-map', label: 'Tactical Map', icon: Map, badge: metrics.activeIncidentsCount }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'ops-incidents', label: 'Incident Intelligence', icon: AlertTriangle, badge: metrics.criticalIncidentsCount, badgeCritical: true },
        { id: 'ops-triage', label: 'AI Triage Lab', icon: Eye },
        { id: 'ops-evac', label: 'Evacuation Planner', icon: Navigation },
        { id: 'ops-responders', label: 'Responder Coordination', icon: Users, badge: metrics.availableRespondersCount },
        { id: 'ops-supply', label: 'Resource Matrix', icon: Package, badge: metrics.criticalResourceShortagesCount ? `${metrics.criticalResourceShortagesCount} Deficit` : undefined },
        { id: 'ops-drones', label: 'Drone Operations', icon: Plane }
      ]
    },
    {
      title: 'COMMUNITY',
      items: [
        { id: 'community-sos', label: 'Civilian SOS', icon: Radio, badge: metrics.activeSOSReportsCount, badgeCritical: true },
        { id: 'community-shelters', label: 'Shelter Directory', icon: Home, badge: metrics.activeSheltersCount }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { id: 'insights-reports', label: 'Reports & Analytics', icon: FileText },
        { id: 'insights-activity', label: 'Activity History', icon: Clock }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'system-integrations', label: 'Integrations', icon: Cpu },
        { id: 'system-settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleItemClick = (id) => {
    setActiveNav(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldAlert size={19} color="var(--text-on-accent)" />
        </div>

        {!isSidebarCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                AEGISGRID AI
              </span>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Crisis Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Nav List */}
      <div className="sidebar-nav">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {!isSidebarCollapsed && (
              <div className="nav-section-title">
                {section.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    title={isSidebarCollapsed ? item.label : undefined}
                    id={`nav-${item.id}`}
                  >
                    <Icon size={17} style={{ flexShrink: 0 }} />
                    {!isSidebarCollapsed && (
                      <>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                        {item.badge !== undefined && (
                          <span 
                            className="nav-item-badge"
                            style={item.badgeCritical && !isActive ? { backgroundColor: 'var(--critical-bg)', color: 'var(--critical)' } : {}}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isSidebarCollapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-tertiary)',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  flexShrink: 0
                }}>
                  VK
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Cmdr. V. Kumar
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    Incident Commander (OES)
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="btn btn-ghost btn-xs"
                title="Collapse Sidebar"
                style={{ padding: '4px' }}
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            {/* System Environment Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '10px'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>Environment:</span>
              <span className="mono" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                DEMO / SYNTHETIC
              </span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="btn btn-ghost btn-xs"
              title="Expand Sidebar"
              style={{ padding: '6px' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
