import React, { useState } from 'react';
import { 
  Share2, 
  Droplet, 
  HeartPulse, 
  Wind, 
  Zap, 
  Package, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  TrendingDown,
  Plane,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { tacticalAudio } from '../utils/audioSystem';

export default function ResourceMatrix({ scenario }) {
  const [shelters, setShelters] = useState(scenario.shelters);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceProgress, setRebalanceProgress] = useState(0);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);

  // Identify Deficit Shelter (lowest O2) and Surplus Shelter (highest O2)
  const deficitShelter = [...shelters].sort((a, b) => a.supplies.oxygenTanks - b.supplies.oxygenTanks)[0];
  const surplusShelter = [...shelters].sort((a, b) => b.supplies.oxygenTanks - a.supplies.oxygenTanks)[0];

  const triggerDroneRebalance = () => {
    setIsRebalancing(true);
    setDeliveryCompleted(false);
    setRebalanceProgress(0);
    tacticalAudio.playDispatchConfirmed();

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setRebalanceProgress(progress);
      tacticalAudio.playTacticalBeep(900 + progress * 8, 0.04, 0.02);

      if (progress >= 100) {
        clearInterval(interval);
        setIsRebalancing(false);
        setDeliveryCompleted(true);
        tacticalAudio.playSuccessChime();

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // Confetti fallback
        }

        // Dynamically rebalance supplies in state
        setShelters(prev => prev.map(s => {
          if (s.id === deficitShelter.id) {
            return {
              ...s,
              status: 'Rebalanced / Stabilized',
              supplies: {
                ...s.supplies,
                oxygenTanks: s.supplies.oxygenTanks + 25,
                bloodUnits: s.supplies.bloodUnits + 15,
                traumaKits: s.supplies.traumaKits + 40
              }
            };
          }
          if (s.id === surplusShelter.id) {
            return {
              ...s,
              supplies: {
                ...s.supplies,
                oxygenTanks: s.supplies.oxygenTanks - 25,
                bloodUnits: s.supplies.bloodUnits - 15,
                traumaKits: s.supplies.traumaKits - 40
              }
            };
          }
          return s;
        }));
      }
    }, 400);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', minHeight: '680px' }}>
      {/* Left Column: Regional Shelters Resource Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header & Overview */}
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={18} color="var(--cyan)" />
              <span>Regional Shelter Resource Mesh & Logistics Grid</span>
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Algorithmic constraint-satisfaction supply balancing across emergency centers
            </p>
          </div>

          <span className="badge badge-purple" style={{ fontFamily: 'var(--font-mono)' }}>
            AUTONOMOUS BALANCER ACTIVE
          </span>
        </div>

        {/* Shelter Cards Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {shelters.map(s => {
            const isDeficit = s.supplies.oxygenTanks <= 10;
            const isSurplus = s.supplies.oxygenTanks > 50;

            return (
              <div 
                key={s.id} 
                className="glass-panel"
                style={{
                  padding: '16px',
                  border: isDeficit ? '1px solid rgba(255, 51, 102, 0.45)' : 
                          isSurplus ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid var(--border-subtle)',
                  background: isDeficit ? 'linear-gradient(135deg, rgba(255, 51, 102, 0.05) 0%, rgba(14, 21, 37, 0.75) 100%)' :
                              isSurplus ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(14, 21, 37, 0.75) 100%)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '15px', margin: 0 }}>{s.name}</h4>
                      <span className={`badge ${isDeficit ? 'badge-red' : isSurplus ? 'badge-green' : 'badge-cyan'}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                        {s.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Capacity: {s.occupancy} / {s.capacity} ({Math.round((s.occupancy / s.capacity) * 100)}%) • Power: {s.power}
                    </span>
                  </div>

                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    SECTOR {s.id.toUpperCase()}
                  </span>
                </div>

                {/* Supply Meters Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {/* Oxygen */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <Wind size={12} color="var(--cyan)" />
                      <span>O2 CYLINDERS</span>
                    </div>
                    <strong style={{ fontSize: '15px', color: s.supplies.oxygenTanks <= 10 ? '#ff3366' : '#fff', fontFamily: 'var(--font-mono)' }}>
                      {s.supplies.oxygenTanks} units
                    </strong>
                  </div>

                  {/* Blood */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <HeartPulse size={12} color="#ff3366" />
                      <span>O- BLOOD</span>
                    </div>
                    <strong style={{ fontSize: '15px', color: s.supplies.bloodUnits <= 10 ? '#ff3366' : '#fff', fontFamily: 'var(--font-mono)' }}>
                      {s.supplies.bloodUnits} units
                    </strong>
                  </div>

                  {/* Water */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <Droplet size={12} color="#38bdf8" />
                      <span>WATER</span>
                    </div>
                    <strong style={{ fontSize: '15px', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      {(s.supplies.waterLiters / 1000).toFixed(1)}k L
                    </strong>
                  </div>

                  {/* Trauma Kits */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <Package size={12} color="#fbbf24" />
                      <span>TRAUMA KITS</span>
                    </div>
                    <strong style={{ fontSize: '15px', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      {s.supplies.traumaKits}
                    </strong>
                  </div>

                  {/* Meals */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <Zap size={12} color="#a78bfa" />
                      <span>RATIONS</span>
                    </div>
                    <strong style={{ fontSize: '15px', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      {(s.supplies.meals / 1000).toFixed(1)}k
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: AI Autonomous Rebalancing Commander */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              AUTONOMOUS LOGISTICS DISPATCH
            </span>
            <h3 style={{ fontSize: '17px', margin: 0 }}>Automated Relief Air-Bridge</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              AI detected acute supply deficit in triage clinics and established a high-priority drone aerial flight corridor.
            </p>
          </div>

          {/* Transfer Flow Visualizer */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '45%' }}>
                <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 600 }}>SURPLUS PROVIDER:</span>
                <h5 style={{ fontSize: '13px', color: '#fff', margin: '2px 0' }}>{surplusShelter.name}</h5>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Oxygen: {surplusShelter.supplies.oxygenTanks} units
                </span>
              </div>

              <Plane size={20} color="var(--cyan)" style={{ transform: 'rotate(90deg)' }} />

              <div style={{ width: '45%', textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: '#ff3366', fontWeight: 600 }}>DEFICIT RECIPIENT:</span>
                <h5 style={{ fontSize: '13px', color: '#fff', margin: '2px 0' }}>{deficitShelter.name}</h5>
                <span className="mono" style={{ fontSize: '11px', color: deficitShelter.supplies.oxygenTanks <= 10 ? '#ff3366' : '#10b981' }}>
                  Oxygen: {deficitShelter.supplies.oxygenTanks} units
                </span>
              </div>
            </div>

            {/* Flight Corridor Telemetry */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              justifyContent: 'space-between',
              color: 'var(--text-secondary)'
            }}>
              <span>CORRIDOR: AIR-WAY SKY-7</span>
              <span>EST FLIGHT: 5.4 MINS</span>
              <span style={{ color: 'var(--cyan)' }}>AIRSPEED: 92 KM/H</span>
            </div>
          </div>

          {/* Progress bar during rebalance */}
          {isRebalancing && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Drone Swarm Cargo In Transit...</span>
                <span className="mono" style={{ color: '#fff' }}>{rebalanceProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${rebalanceProgress}%`, height: '100%', background: 'linear-gradient(90deg, #00f0ff, #10b981)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}

          {deliveryCompleted && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--border-safe)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={20} color="#10b981" />
              <div>
                <strong style={{ fontSize: '13px', color: '#34d399', display: 'block' }}>Delivery Confirmed & Verified</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  +25 O2 Tanks and +15 Blood Units delivered to {deficitShelter.name}. Crisis deficit neutralized!
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={triggerDroneRebalance}
              disabled={isRebalancing}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '13px', fontWeight: 700 }}
              id="btn-trigger-drone-rebalance"
            >
              <Plane size={16} />
              <span>{isRebalancing ? 'Drone Logistics Mesh Dispatched...' : 'Trigger Autonomous Drone Rebalancing'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
