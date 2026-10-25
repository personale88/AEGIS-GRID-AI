import React from 'react';
import { 
  Users, 
  Clock, 
  Plane, 
  ShieldCheck, 
  Zap, 
  Globe2
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export default function ImpactBar() {
  const { scenarioData } = useOperations();

  const metrics = [
    {
      label: 'Civilians Safely Routed',
      value: scenarioData.civiliansEvacuated.toLocaleString(),
      subtext: 'Zero casualties on AI corridor',
      icon: Users,
      color: 'var(--success)'
    },
    {
      label: 'Triage Response Delta',
      value: '-68%',
      subtext: 'vs legacy 911 queues',
      icon: Clock,
      color: 'var(--accent)'
    },
    {
      label: 'P2P Mesh Resilience',
      value: `${scenarioData.meshNodesActive} Nodes`,
      subtext: '100% operational post-grid collapse',
      icon: Zap,
      color: 'var(--info)'
    },
    {
      label: 'Autonomous Sorties',
      value: '184 Missions',
      subtext: 'Critical medical air-bridge',
      icon: Plane,
      color: 'var(--warning)'
    },
    {
      label: 'AI Triage Accuracy',
      value: '99.2%',
      subtext: 'FEMA/NATO classification',
      icon: ShieldCheck,
      color: 'var(--success)'
    }
  ];

  return (
    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div 
              key={idx} 
              className="card" 
              style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={18} color={m.color} />
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                  {m.label}
                </span>
                <strong className="mono" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                  {m.value}
                </strong>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>
                  {m.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise Operational Mission Banner */}
      <div className="card" style={{
        padding: '14px 18px',
        backgroundColor: 'var(--surface-primary)',
        borderLeft: '4px solid var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe2 size={22} color="var(--accent)" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '13px', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
              Operational Standard & Real-World Life-Safety Architecture
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0', maxWidth: '920px' }}>
              AegisGrid AI decentralizes emergency coordination with edge computer vision, real-time hazard-aware evacuation calculation, and automated constraint-satisfaction relief logistics during large-scale grid and telecommunication collapses.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-accent">
            FEMA ICS-209 COMPLIANT
          </span>
        </div>
      </div>
    </div>
  );
}
