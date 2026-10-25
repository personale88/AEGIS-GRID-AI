import React, { createContext, useContext, useState, useEffect } from 'react';
import { SCENARIOS } from '../data/mockScenarios';
import { tacticalAudio } from '../utils/audioSystem';

const OperationsContext = createContext();

export function OperationsProvider({ children }) {
  // Theme state: default to 'light' (as specified in prompt: "Use the light theme as the default first-visit experience")
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aegisgrid_theme');
      return saved || 'light';
    }
    return 'light';
  });

  // Apply data-theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aegisgrid_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    tacticalAudio.playTacticalBeep(1200, 0.04, 0.03);
  };

  // Scenario selection ('hurricane' | 'earthquake' | 'wildfire')
  const [selectedScenarioId, setSelectedScenarioId] = useState('hurricane');
  const scenarioData = SCENARIOS[selectedScenarioId];

  // Incidents state
  const [incidents, setIncidents] = useState(scenarioData.incidents);
  const [selectedIncidentId, setSelectedIncidentId] = useState('inc-101');
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  // Responders state
  const [responders, setResponders] = useState(scenarioData.units);

  // Shelters state
  const [shelters, setShelters] = useState(scenarioData.shelters);

  // Hazards & Routes
  const [hazards, setHazards] = useState(scenarioData.hazards);
  const [routes, setRoutes] = useState(scenarioData.routes);

  // Active navigation tab
  const [activeNav, setActiveNav] = useState('overview-dashboard');

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global search query
  const [searchQuery, setSearchQuery] = useState('');

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Civilian SOS modal state
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  // Notification / Toasts system
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Cat-5 Storm Surge Alert',
      message: 'Hydrostatic pressure breach detected in Sector 4 Basin.',
      severity: 'critical',
      timestamp: '2 mins ago',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Autonomous Drone Sortie Complete',
      message: 'Life-safety cargo delivered to Bayou Memorial Clinic.',
      severity: 'success',
      timestamp: '8 mins ago',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Evacuation Corridor Verified',
      message: 'North Ridge Viaduct confirmed safe by structural sensors.',
      severity: 'info',
      timestamp: '14 mins ago',
      read: true
    }
  ]);

  // Operational Activity Timeline (dynamic real-time log)
  const [activityEvents, setActivityEvents] = useState([
    {
      id: 'act-1',
      type: 'INCIDENT_VERIFIED',
      title: 'Multimodal Drone Verified Structural Breach',
      incidentId: 'INC-101',
      actor: 'Drone Mesh Recon-4',
      timestamp: '10:41:05 UTC',
      outcome: 'Confirmed 18 citizens trapped on rooftops. Damage Index: 88%.'
    },
    {
      id: 'act-2',
      type: 'RESPONDER_DISPATCHED',
      title: 'LifeFlight Helo-9 Dispatched to Underpass Breach',
      incidentId: 'INC-102',
      actor: 'OES Central Command',
      timestamp: '10:38:22 UTC',
      outcome: 'Winch extraction team airborne. ETA 6 mins.'
    },
    {
      id: 'act-3',
      type: 'RESOURCE_TRANSFER',
      title: 'Autonomous Drone Rebalance Corridor Opened',
      incidentId: 'LOG-304',
      actor: 'Supply Constraint Solver',
      timestamp: '10:35:10 UTC',
      outcome: 'Highland Arena surplus transferred to Bayou Valley Clinic.'
    },
    {
      id: 'act-4',
      type: 'SHELTER_UPDATE',
      title: 'Highland Arena Intake Surged to 81%',
      incidentId: 'SHELTER-1',
      actor: 'Shelter Logistics Chief',
      timestamp: '10:29:45 UTC',
      outcome: '2,840 evacuees processed. Auxiliary generator 94% optimal.'
    },
    {
      id: 'act-5',
      type: 'EVAC_CORRIDOR_VERIFIED',
      title: 'Aegis Dynamic Safe Route Cleared',
      incidentId: 'CORRIDOR-A',
      actor: 'Geotechnical Mesh',
      timestamp: '10:22:18 UTC',
      outcome: 'Submerged Shoreline Hwy flagged as lethal trap. Bypass active.'
    }
  ]);

  // When scenario changes, synchronize internal state
  const changeScenario = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    const newScen = SCENARIOS[scenarioId];
    setIncidents(newScen.incidents);
    setResponders(newScen.units);
    setShelters(newScen.shelters);
    setHazards(newScen.hazards);
    setRoutes(newScen.routes);
    setSelectedIncidentId(newScen.incidents[0]?.id || null);
    tacticalAudio.playRadarPing();

    addToast(`Operational region shifted to ${newScen.name}`, 'info');
    logActivity({
      type: 'REGION_SHIFT',
      title: `Operational Theater Shifted: ${newScen.name}`,
      incidentId: 'GEO-01',
      actor: 'Incident Commander',
      outcome: `Switched operational context to ${newScen.type}.`
    });
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const logActivity = (event) => {
    const newEvent = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toUTCString().slice(17, 25) + ' UTC',
      ...event
    };
    setActivityEvents(prev => [newEvent, ...prev]);
  };

  // Select incident & open drawer
  const selectIncident = (id, openDrawer = true) => {
    setSelectedIncidentId(id);
    if (openDrawer) {
      setIsDetailPanelOpen(true);
    }
    tacticalAudio.playTacticalBeep(1200, 0.05, 0.04);
  };

  // Dispatch / Assign Responder to Incident
  const assignResponder = (incidentId, responderId) => {
    const resp = responders.find(r => r.id === responderId);
    const inc = incidents.find(i => i.id === incidentId);

    setIncidents(prev => prev.map(i => {
      if (i.id === incidentId) {
        return {
          ...i,
          dispatched: true,
          assignedUnit: resp ? resp.callsign : 'Assigned Squad',
          status: 'DISPATCHED'
        };
      }
      return i;
    }));

    if (resp) {
      setResponders(prev => prev.map(r => {
        if (r.id === responderId) {
          return {
            ...r,
            status: 'En Route',
            target: inc ? inc.location : 'Assigned Incident'
          };
        }
        return r;
      }));
    }

    tacticalAudio.playDispatchConfirmed();
    addToast(`Task Force ${resp ? resp.callsign : 'Unit'} deployed to ${inc ? inc.title : incidentId}`, 'success');

    logActivity({
      type: 'RESPONDER_DISPATCHED',
      title: `${resp ? resp.callsign : 'Rescue Task Force'} Dispatched`,
      incidentId: incidentId,
      actor: 'Command Dispatcher',
      outcome: `Assigned to ${inc?.location || 'scene'}. Status updated to En Route.`
    });
  };

  // Update incident status
  const updateIncidentStatus = (incidentId, newStatus) => {
    setIncidents(prev => prev.map(i => {
      if (i.id === incidentId) {
        return { ...i, status: newStatus };
      }
      return i;
    }));
    tacticalAudio.playTacticalBeep(1400, 0.04, 0.03);
    addToast(`Incident ${incidentId} status updated to ${newStatus}`, 'info');

    logActivity({
      type: 'STATUS_UPDATE',
      title: `Incident ${incidentId} Updated`,
      incidentId: incidentId,
      actor: 'Operations Chief',
      outcome: `Incident status transitioned to ${newStatus}.`
    });
  };

  // Add Civilian SOS
  const addSOSReport = (newSOS) => {
    setIncidents(prev => [newSOS, ...prev]);
    setSelectedIncidentId(newSOS.id);
    setIsDetailPanelOpen(true);
    tacticalAudio.playAlertAlarm();
    addToast(`CRITICAL: Civilian SOS Beacon received! Added to operations grid.`, 'critical');

    logActivity({
      type: 'SOS_BEACON_RECEIVED',
      title: `Civilian Distress Beacon: ${newSOS.victims} Trapped`,
      incidentId: newSOS.id,
      actor: 'Civilian P2P Mesh Relay',
      outcome: `Transmitted via decentralized LoRa mesh. Immediate dispatch recommended.`
    });
  };

  // Rebalance shelter inventory
  const rebalanceShelterSupplies = (fromId, toId, transferAmounts) => {
    setShelters(prev => prev.map(s => {
      if (s.id === toId) {
        return {
          ...s,
          status: 'Rebalanced / Stabilized',
          supplies: {
            ...s.supplies,
            oxygenTanks: s.supplies.oxygenTanks + (transferAmounts.oxygenTanks || 25),
            bloodUnits: s.supplies.bloodUnits + (transferAmounts.bloodUnits || 15),
            traumaKits: s.supplies.traumaKits + (transferAmounts.traumaKits || 40)
          }
        };
      }
      if (s.id === fromId) {
        return {
          ...s,
          supplies: {
            ...s.supplies,
            oxygenTanks: Math.max(0, s.supplies.oxygenTanks - (transferAmounts.oxygenTanks || 25)),
            bloodUnits: Math.max(0, s.supplies.bloodUnits - (transferAmounts.bloodUnits || 15)),
            traumaKits: Math.max(0, s.supplies.traumaKits - (transferAmounts.traumaKits || 40))
          }
        };
      }
      return s;
    }));

    logActivity({
      type: 'SUPPLY_REBALANCED',
      title: `Autonomous Drone Air-Bridge Delivery Confirmed`,
      incidentId: 'LOG-REBALANCE',
      actor: 'Autonomous Hexacopter Flight 07',
      outcome: `Critical supplies transitioned from surplus to deficit clinic. Zero road hazards encountered.`
    });
  };

  // Computed live metrics
  const activeIncidentsCount = incidents.length;
  const criticalIncidentsCount = incidents.filter(i => i.triageCode === 'RED' || i.severity?.includes('Immediate')).length;
  const activeSOSReportsCount = incidents.filter(i => i.id.startsWith('sos-')).length + 4; // realistic baseline
  const availableRespondersCount = responders.filter(r => r.status.toLowerCase().includes('ready') || r.status.toLowerCase().includes('available') || r.status.toLowerCase().includes('staged')).length;
  const activeSheltersCount = shelters.length;
  const criticalResourceShortagesCount = shelters.filter(s => s.supplies.oxygenTanks <= 10 || s.supplies.bloodUnits <= 10).length;

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  return (
    <OperationsContext.Provider
      value={{
        theme,
        toggleTheme,
        selectedScenarioId,
        scenarioData,
        changeScenario,
        incidents,
        selectedIncidentId,
        selectedIncident,
        selectIncident,
        isDetailPanelOpen,
        setIsDetailPanelOpen,
        responders,
        assignResponder,
        updateIncidentStatus,
        shelters,
        rebalanceShelterSupplies,
        hazards,
        routes,
        activeNav,
        setActiveNav,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        searchQuery,
        setSearchQuery,
        isMuted,
        setIsMuted,
        isSOSModalOpen,
        setIsSOSModalOpen,
        toasts,
        addToast,
        notifications,
        activityEvents,
        logActivity,
        addSOSReport,
        metrics: {
          activeIncidentsCount,
          criticalIncidentsCount,
          activeSOSReportsCount,
          availableRespondersCount,
          activeSheltersCount,
          criticalResourceShortagesCount
        }
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return context;
}
