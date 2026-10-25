import React, { useState } from 'react';
import { SCENARIOS } from './data/mockScenarios';
import Header from './components/Header';
import TacticalMap from './components/TacticalMap';
import MultimodalTriageLab from './components/MultimodalTriageLab';
import EvacuationEngine from './components/EvacuationEngine';
import ResourceMatrix from './components/ResourceMatrix';
import CommanderCopilot from './components/CommanderCopilot';
import CivilianSOSModal from './components/CivilianSOSModal';
import ImpactBar from './components/ImpactBar';
import { tacticalAudio } from './utils/audioSystem';
import { CheckCircle2, AlertTriangle, Send, Bell } from 'lucide-react';
import './App.css';

export default function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState('hurricane');
  const [activeTab, setActiveTab] = useState('map');
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [addedIncidents, setAddedIncidents] = useState([]);

  // Active scenario data
  const currentScenario = SCENARIOS[selectedScenarioId];

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleSelectScenario = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    setSelectedIncident(null);
    tacticalAudio.playRadarPing();
    showToast(`Operational Theater shifted to ${SCENARIOS[scenarioId].name}`, 'warning');
  };

  const handleSelectIncidentForTriage = (incident) => {
    setSelectedIncident(incident);
    setActiveTab('triage');
    tacticalAudio.playTacticalBeep(1200, 0.08, 0.05);
  };

  const handleDispatchUnit = (incidentId) => {
    showToast(`Tactical Task Force authorized & dispatched to Incident ${incidentId}!`, 'success');
  };

  const handleSOSSubmit = (newSOSIncident) => {
    setAddedIncidents(prev => [newSOSIncident, ...prev]);
    showToast(`CRITICAL: Civilian SOS Beacon received! Injected into Tactical Operations Grid.`, 'critical');
    setActiveTab('map');
  };

  return (
    <div className="app-container">
      {/* Tactical Header */}
      <Header
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerSOS={() => {
          tacticalAudio.playTacticalBeep(1400, 0.08, 0.06);
          setIsSOSModalOpen(true);
        }}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Workspace Stage */}
      <main className="main-content">
        {activeTab === 'map' && (
          <TacticalMap
            scenario={currentScenario}
            onSelectIncident={handleSelectIncidentForTriage}
            onDispatchUnit={handleDispatchUnit}
            onNavigateToEvac={() => setActiveTab('evac')}
            addedIncidents={addedIncidents}
          />
        )}

        {activeTab === 'triage' && (
          <MultimodalTriageLab
            selectedIncident={selectedIncident}
            allIncidents={[...currentScenario.incidents, ...addedIncidents]}
            onSelectIncident={setSelectedIncident}
            onDispatchUnit={handleDispatchUnit}
          />
        )}

        {activeTab === 'evac' && (
          <EvacuationEngine scenario={currentScenario} />
        )}

        {activeTab === 'supply' && (
          <ResourceMatrix scenario={currentScenario} />
        )}

        {activeTab === 'copilot' && (
          <CommanderCopilot scenario={currentScenario} />
        )}

        {/* Quantifiable Impact & Mission Banner */}
        <ImpactBar scenario={currentScenario} />
      </main>

      {/* Civilian SOS Modal */}
      <CivilianSOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        onSubmitSOS={handleSOSSubmit}
      />

      {/* Real-time Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            {t.type === 'critical' ? (
              <AlertTriangle size={18} color="#ff3366" />
            ) : t.type === 'success' ? (
              <CheckCircle2 size={18} color="#10b981" />
            ) : (
              <Bell size={18} color="var(--cyan)" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
