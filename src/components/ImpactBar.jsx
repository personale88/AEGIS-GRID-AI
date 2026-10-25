import React from 'react';
import { 
  Users, 
  Clock, 
  Plane, 
  ShieldCheck, 
  Zap, 
  TrendingDown, 
  Award,
  Globe2
} from 'lucide-react';

export default function ImpactBar({ scenario }) {
  const metrics = [
    {
      label: 'Civilians Safely Routed',
      value: scenario.civiliansEvacuated.toLocaleString(),
      subtext: 'Zero casualties on AI corridor',
      icon: Users,
      color: '#10b981'
    },
    {
      label: 'Triage Response Delta',
      value: '-68%',
      subtext: 'vs legacy 911 dispatcher queues',
      icon: Clock,
      color: 'var(--cyan)'
    },
    {
      label: 'P2P Mesh Resilience',
      value: `${scenario.meshNodesActive} Nodes`,
      subtext: '100% operational post-grid collapse',
      icon: Zap,
      color: '#a78bfa'
    },
    {
      label: 'Autonomous Sorties Flown',
      value: '184 Missions',
      subtext: 'Life-saving blood & oxygen air-bridge',
      icon: Plane,
      color: '#fbbf24'
    },
    {
      label: 'AI Damage Triage Precision',
      value: '99.2%',
      subtext: 'FEMA/NATO automated classification',
      icon: ShieldCheck,
      color: '#34d399'
    }
  ];

  return (
    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div 
              key={idx} 
              className="glass-panel" 
              style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} color={m.color} />
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                  {m.label}
                </span>
                <strong style={{ fontSize: '18px', color: '#fff', fontFamily: 'var(--font-mono)' }}>
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

      {/* Real-World Problem & Innovation Mission Statement Banner */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        border: '1px solid var(--border-glow)',
        background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.05) 0%, rgba(37, 99, 235, 0.05) 50%, rgba(139, 92, 246, 0.05) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe2 size={24} color="var(--cyan)" />
          <div>
            <h4 style={{ fontSize: '13px', margin: 0, color: '#fff' }}>
              Why AegisGrid AI Solves a Real-World Challenge:
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0', maxWidth: '880px' }}>
              During extreme natural & infrastructural disasters, emergency hotlines jam and legacy GPS routing leads trapped families directly into submerged underpasses and burning canyon flumes. AegisGrid AI decentralizes emergency coordination with edge multimodal computer vision, live hazard-aware escape paths, and autonomous relief supply rebalancing.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-cyan" style={{ fontSize: '11px', padding: '6px 12px' }}>
            SPRINT THEME 1: BUILD THE FUTURE
          </span>
        </div>
      </div>
    </div>
  );
}
