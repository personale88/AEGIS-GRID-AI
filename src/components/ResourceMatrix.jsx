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
  Plane
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOperations } from '../context/OperationsContext';
import { tacticalAudio } from '../utils/audioSystem';

export default function ResourceMatrix() {
  const { shelters, rebalanceShelterSupplies } = useOperations();
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceProgress, setRebalanceProgress] = useState(0);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);

  // Identify Deficit Shelter (lowest O2) and Surplus Shelter (highest O2)
  const deficitShelter = [...shelters].sort((a, b) => a.supplies.oxygenTanks - b.supplies.oxygenTanks)[0] || shelters[0];
  const surplusShelter = [...shelters].sort((a, b) => b.supplies.oxygenTanks - a.supplies.oxygenTanks)[0] || shelters[0];

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

        rebalanceShelterSupplies(surplusShelter.id, deficitShelter.id, {
          oxygenTanks: 25,
          bloodUnits: 15,
          traumaKits: 40
        });
      }
    }, 350);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', minHeight: '640px' }}>
      {/* Left Column: Regional Shelters Resource Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={16} color="var(--accent)" />
              <span>Regional Shelter Resource Mesh & Logistics Grid</span>
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Algorithmic constraint-satisfaction supply balancing across emergency centers
            </p>
          </div>

          <span className="badge badge-accent">
            AUTONOMOUS BALANCER ACTIVE
          </span>
        </div>

        {/* Shelter Cards Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {shelters.map(s => {
            const isDeficit = s.supplies.oxygenTanks <= 10;
            const isSurplus = s.supplies.oxygenTanks > 50;

            return (
              <div 
                key={s.id} 
                className="card"
                style={{
                  padding: '16px',
                  borderLeft: isDeficit ? '3px solid var(--critical)' : isSurplus ? '3px solid var(--success)' : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '14px', margin: 0, fontWeight: 700 }}>{s.name}</h4>
                      <span className={`badge ${isDeficit ? 'badge-critical' : isSurplus ? 'badge-success' : 'badge-info'}`}>
                        {s.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Capacity: {s.occupancy.toLocaleString()} / {s.capacity.toLocaleString()} ({Math.round((s.occupancy / s.capacity) * 100)}%) • Power: {s.power}
                    </span>
                  </div>

                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    SECTOR {s.id.toUpperCase()}
                  </span>
                </div>

                {/* Supply Meters Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <Wind size={11} color="var(--accent)" />
                      <span>O2 CYLINDERS</span>
                    </div>
                    <strong className="mono" style={{ fontSize: '14px', color: s.supplies.oxygenTanks <= 10 ? 'var(--critical)' : 'var(--text-primary)' }}>
                      {s.supplies.oxygenTanks} units
                    </strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <HeartPulse size={11} color="var(--critical)" />
                      <span>O- BLOOD</span>
                    </div>
                    <strong className="mono" style={{ fontSize: '14px', color: s.supplies.bloodUnits <= 10 ? 'var(--critical)' : 'var(--text-primary)' }}>
                      {s.supplies.bloodUnits} units
                    </strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <Droplet size={11} color="var(--info)" />
                      <span>WATER</span>
                    </div>
                    <strong className="mono" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {(s.supplies.waterLiters / 1000).toFixed(1)}k L
                    </strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <Package size={11} color="var(--warning)" />
                      <span>TRAUMA KITS</span>
                    </div>
                    <strong className="mono" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {s.supplies.traumaKits}
                    </strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <Zap size={11} color="var(--accent)" />
                      <span>RATIONS</span>
                    </div>
                    <strong className="mono" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
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
      <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <span className="badge badge-accent" style={{ marginBottom: '6px' }}>
            AUTONOMOUS LOGISTICS DISPATCH
          </span>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Automated Relief Air-Bridge</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            AI detected acute supply deficit in triage clinics and established a high-priority drone aerial flight corridor.
          </p>
        </div>

        {/* Transfer Flow Visualizer */}
        <div style={{
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '45%' }}>
              <span style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 600 }}>SURPLUS SOURCE:</span>
              <h5 style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '2px 0' }}>{surplusShelter.name}</h5>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Oxygen: {surplusShelter.supplies.oxygenTanks} units
              </span>
            </div>

            <Plane size={18} color="var(--accent)" style={{ transform: 'rotate(90deg)' }} />

            <div style={{ width: '45%', textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: 'var(--critical)', fontWeight: 600 }}>DEFICIT TARGET:</span>
              <h5 style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '2px 0' }}>{deficitShelter.name}</h5>
              <span className="mono" style={{ fontSize: '11px', color: deficitShelter.supplies.oxygenTanks <= 10 ? 'var(--critical)' : 'var(--success)' }}>
                Oxygen: {deficitShelter.supplies.oxygenTanks} units
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--surface-primary)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-xs)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            justifyContent: 'space-between',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span>CORRIDOR: AIR-WAY SKY-7</span>
            <span>EST FLIGHT: 5.4 MINS</span>
            <span style={{ color: 'var(--accent)' }}>AIRSPEED: 92 KM/H</span>
          </div>
        </div>

        {/* Progress bar during rebalance */}
        {isRebalancing && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Drone Hexacopter Cargo In Flight...</span>
              <span className="mono">{rebalanceProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '7px', backgroundColor: 'var(--surface-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${rebalanceProgress}%`, height: '100%', backgroundColor: 'var(--accent)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}

        {deliveryCompleted && (
          <div style={{
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} color="var(--success)" />
            <div>
              <strong style={{ fontSize: '12px', color: 'var(--success)', display: 'block' }}>Delivery Verified & Logged</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                +25 O2 Tanks and +15 Blood Units transitioned to {deficitShelter.name}.
              </span>
            </div>
          </div>
        )}

        <button
          onClick={triggerDroneRebalance}
          disabled={isRebalancing}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', marginTop: 'auto', fontWeight: 600 }}
        >
          <Plane size={15} />
          <span>{isRebalancing ? 'Drone Logistics Mesh Dispatched...' : 'Trigger Autonomous Drone Rebalancing'}</span>
        </button>
      </div>
    </div>
  );
}
