import React from 'react';
import TacticalMap from '../components/TacticalMap';
import { useOperations } from '../context/OperationsContext';
import { Map, Layers, Radio } from 'lucide-react';

export default function ExpandedMapView() {
  const { scenarioData } = useOperations();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Expanded Tactical GIS Map</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Full viewport geospatial operational theater • {scenarioData.name}
          </p>
        </div>
      </div>

      <TacticalMap height="calc(100vh - 160px)" />
    </div>
  );
}
