import React, { useState } from 'react';
import { 
  Cpu, 
  Send, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldAlert, 
  Activity, 
  Radio
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import { tacticalAudio } from '../utils/audioSystem';

export default function CommanderCopilot() {
  const { scenarioData } = useOperations();

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'aegis',
      timestamp: '10:42:15',
      text: `**AegisGrid Tactical Incident Commander Copilot v3.8 initialized.**
Current operational theater: **${scenarioData.name}**
Threat Level: **${scenarioData.threatLevel}**
Active Incidents: **${scenarioData.activeIncidentsCount}** | Mesh Nodes: **${scenarioData.meshNodesActive}**

I am ready to synthesize military-grade Situation Reports (SitRep), compute dynamic hazard dispersion models, or coordinate cross-agency resource allocation. Select a command directive below or enter custom instructions.`
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const predefinedPrompts = [
    { label: '📋 Generate FEMA SitRep', prompt: 'Generate an official FEMA / State OES Situation Report (SitRep) summarizing current casualties, structural damage, and operational bottlenecks.' },
    { label: '🌬️ Drone Mesh Viability', prompt: `Analyze autonomous drone flight viability considering the current atmospheric conditions (${scenarioData.windSpeed}, ${scenarioData.precipitation}).` },
    { label: '⏳ Casualty Risk Forecast', prompt: 'Calculate the expected casualty increase rate if evacuation of the primary residential zone is delayed by 45 minutes.' },
    { label: '📢 Draft Emergency Alert', prompt: 'Draft a clear, urgent multi-channel civilian emergency alert for cell-broadcast and P2P mesh radios.' }
  ];

  const handleSendPrompt = (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    tacticalAudio.playTacticalBeep(1200, 0.05, 0.04);

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toTimeString().slice(0, 8),
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    setTimeout(() => {
      let reply = '';
      if (query.includes('SitRep') || query.includes('FEMA')) {
        reply = `### [CONFIDENTIAL // FEMA-ICS-209] INCIDENT SITUATION REPORT
**INCIDENT:** ${scenarioData.name}  
**OPERATIONAL PERIOD:** 0600 - 1800 LOCAL  
**THREAT LEVEL:** ${scenarioData.threatLevel}  

#### 1. EXECUTIVE SUMMARY:
- **Active Incident Hotspots:** ${scenarioData.activeIncidentsCount} critical sites triaged.
- **Evacuation Status:** ${scenarioData.civiliansEvacuated.toLocaleString()} civilians routed via AegisGrid dynamic corridors.
- **Fatal Hazard Intercepts:** Shoreline underpass submerged to 6.8ft; primary arterial blocked. Zero casualties recorded on AegisGrid recommended detour.

#### 2. RESOURCE MOBILIZATION:
- **Swift-Water & USAR Squads:** 8 units active; 2 teams en route to Rooftop Extrication.
- **Autonomous Drone Air-Bridge:** 14 sorties flown; 32 oxygen cylinders successfully transitioned to frontline field clinic.
- **Power Grid Telemetry:** 2 substations offline; microgrid inverters sustaining clinic life-support.

#### 3. COMMANDER DIRECTIVES:
1. Maintain strict perimeter on blocked arterial bypass.
2. Authorize second drone swarm wave for pediatric insulin delivery.
3. Keep peer-to-peer mesh frequencies open on 433 MHz and 915 MHz bands.`;
      } else if (query.includes('Drone') || query.includes('Viability')) {
        reply = `### [AEGIS-AERO] AUTONOMOUS DRONE FLIGHT RISK ASSESSMENT
**ATMOSPHERIC TELEMETRY:** Wind: ${scenarioData.windSpeed} | Rain: ${scenarioData.precipitation}  

- **Heavy-Lift Hexacopters (Cargo 25kg+):** **GO / CLEARED (92% Stability Margin).** Advanced gyro-stabilization accommodates gusts up to 65 mph along sheltered ridgeline waypoints.
- **Lightweight Thermal Recon Drones:** **CONDITIONAL GO.** Advised to maintain low-altitude corridor (<60m AGL) to avoid cross-canyon thermal turbulence.
- **Corridor Recommendation:** Transit via North Ridge Lee-side waypoint. Zero collision hazards detected with emergency helicopters.`;
      } else if (query.includes('Casualty') || query.includes('Risk')) {
        reply = `### [AEGIS-PREDICT] CASUALTY PROBABILITY DELTA MODEL
**SCENARIO PARAMETER:** 45-Minute Evacuation Delay  

- **Inundation / Thermal Spread Rate:** Rising at +1.2 ft/hr (or 45 acres/min fire flank expansion).
- **Projected Casualty Multiplier:** **+340% increase** in trapped civilians if evacuation is not initiated before next tide/wind surge.
- **Critical Failure Point:** Underpass bridges will exceed safe vehicular clearance in 22 minutes.
- **Action Required:** Immediate activation of loud-hailer sirens and automated SMS dispatch push.`;
      } else {
        reply = `### [AEGIS-COPILOT] DIRECTIVE SYNTHESIS
Query acknowledged: "${query}".

Based on live telemetry from ${scenarioData.meshNodesActive} mesh nodes and real-time GIS mapping:
1. All critical priority task forces have been synchronized.
2. Recommended route clearance remains active with 98% safety confidence.
3. Logistics mesh has stabilized frontline oxygen and blood supply reserves.

Tactical command standing by for further instructions.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'aegis',
          timestamp: new Date().toTimeString().slice(0, 8),
          text: reply
        }
      ]);

      setIsGenerating(false);
      tacticalAudio.playDispatchConfirmed();
    }, 1100);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    tacticalAudio.playTacticalBeep(1600, 0.05, 0.04);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: '620px', overflow: 'hidden' }}>
      {/* Header Bar */}
      <div className="card-header" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={18} color="var(--text-on-accent)" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
              Tactical AI Incident Commander Copilot
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
              Real-Time ICS-209 Synthesis, Predictive Risk Modeling & Operational Directives
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="status-dot status-dot-success" />
          <span className="mono" style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>INFERENCE ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Predefined Prompts */}
      <div style={{
        padding: '10px 18px',
        backgroundColor: 'var(--surface-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto'
      }}>
        {predefinedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(p.prompt)}
            className="btn btn-secondary btn-xs"
            style={{ whiteSpace: 'nowrap' }}
          >
            <Sparkles size={12} color="var(--accent)" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map(m => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '75%' : '85%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {isUser ? 'INCIDENT COMMANDER' : 'AEGIS-AI COPILOT'} • {m.timestamp}
                </span>
                {!isUser && (
                  <button
                    onClick={() => copyToClipboard(m.text, m.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px' }}
                    title="Copy to clipboard"
                  >
                    {copiedId === m.id ? <Check size={11} color="var(--success)" /> : <Copy size={11} />}
                    <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div style={{
                backgroundColor: isUser ? 'var(--accent-bg)' : 'var(--surface-secondary)',
                border: isUser ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                lineHeight: '1.55',
                whiteSpace: 'pre-wrap'
              }}>
                {m.text}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '12px' }}>
            <span className="status-dot status-dot-info pulse-subtle" />
            <span>AegisGrid Copilot synthesizing strategic disaster telemetry...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div style={{
        padding: '12px 18px',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-secondary)',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendPrompt()}
          placeholder="Enter operational directive or query (e.g. 'Draft emergency broadcast' or 'Assess bridge structural load')..."
          className="input"
          style={{ flex: 1, height: '38px', fontSize: '13px' }}
        />

        <button
          onClick={() => handleSendPrompt()}
          disabled={isGenerating || !inputPrompt.trim()}
          className="btn btn-primary"
          style={{ height: '38px', padding: '0 18px' }}
        >
          <Send size={14} />
          <span>Transmit</span>
        </button>
      </div>
    </div>
  );
}
