import React, { useState } from 'react';
import { OperationsProvider, useOperations } from './context/OperationsContext';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import IncidentDetailPanel from './components/IncidentDetailPanel';
import CivilianSOSModal from './components/CivilianSOSModal';
import VoiceoverTourModal from './components/VoiceoverTourModal';
import ImpactBar from './components/ImpactBar';

// Views
import CommandDashboard from './views/CommandDashboard';
import ExpandedMapView from './views/ExpandedMapView';
import IncidentIntelligenceView from './views/IncidentIntelligenceView';
import MultimodalTriageLab from './components/MultimodalTriageLab';
import EvacuationEngine from './components/EvacuationEngine';
import ResponderCoordinationView from './views/ResponderCoordinationView';
import ResourceMatrix from './components/ResourceMatrix';
import DroneOperationsView from './views/DroneOperationsView';
import CivilianSOSView from './views/CivilianSOSView';
import ShelterDirectoryView from './views/ShelterDirectoryView';
import CommanderCopilot from './components/CommanderCopilot';
import ActivityHistoryView from './views/ActivityHistoryView';
import IntegrationsView from './views/IntegrationsView';
import SettingsView from './views/SettingsView';

import { AlertTriangle, CheckCircle2, Bell } from 'lucide-react';
import './App.css';

function MainAppShell() {
  const { activeNav, isSidebarCollapsed, toasts, isTourOpen, setIsTourOpen } = useOperations();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Persistent Left Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className={`main-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Navigation Bar */}
        <TopNav onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Operational Workspace View Switcher */}
        <main className="content-stage">
          {activeNav === 'overview-dashboard' && <CommandDashboard />}
          {activeNav === 'overview-map' && <ExpandedMapView />}
          {activeNav === 'ops-incidents' && <IncidentIntelligenceView />}
          {activeNav === 'ops-triage' && <MultimodalTriageLab />}
          {activeNav === 'ops-evac' && <EvacuationEngine />}
          {activeNav === 'ops-responders' && <ResponderCoordinationView />}
          {activeNav === 'ops-supply' && <ResourceMatrix />}
          {activeNav === 'ops-drones' && <DroneOperationsView />}
          {activeNav === 'community-sos' && <CivilianSOSView />}
          {activeNav === 'community-shelters' && <ShelterDirectoryView />}
          {activeNav === 'insights-reports' && <CommanderCopilot />}
          {activeNav === 'insights-activity' && <ActivityHistoryView />}
          {activeNav === 'system-integrations' && <IntegrationsView />}
          {activeNav === 'system-settings' && <SettingsView />}

          {/* Operational Impact Bar (Rendered at bottom of dashboard and overview views) */}
          {(activeNav === 'overview-dashboard' || activeNav === 'overview-map') && <ImpactBar />}
        </main>
      </div>

      {/* Context-Aware Incident Detail Panel (Right-Side Drawer) */}
      <IncidentDetailPanel />

      {/* Civilian SOS Modal */}
      <CivilianSOSModal />

      {/* Guided Voiceover Tour Modal with Spoken Audio */}
      <VoiceoverTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* Real-time Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast-item">
            {t.type === 'critical' ? (
              <AlertTriangle size={16} color="var(--critical)" />
            ) : t.type === 'success' ? (
              <CheckCircle2 size={16} color="var(--success)" />
            ) : (
              <Bell size={16} color="var(--accent)" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <OperationsProvider>
      <MainAppShell />
    </OperationsProvider>
  );
}
