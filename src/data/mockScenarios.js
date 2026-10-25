// AegisGrid Comprehensive Disaster Intelligence Datasets

export const SCENARIOS = {
  hurricane: {
    id: 'hurricane',
    name: 'Hurricane Zephyr: Cat-5 Storm Surge & Inundation',
    type: 'Hydrological & Atmospheric',
    threatLevel: 'DEFCON 1 - CRITICAL',
    windSpeed: '145 mph',
    precipitation: '4.8 in/hr',
    affectedArea: 'Metropolis Bay & River Delta',
    floodStage: '+12.4 ft above baseline',
    meshNodesActive: 1482,
    activeIncidentsCount: 38,
    civiliansEvacuated: 14250,
    hazards: [
      { id: 'h1', x: 28, y: 35, r: 22, type: 'flood', label: 'Sector 4 Flash Flood Basin', depth: '6.8 ft', currentVelocity: '14 knots' },
      { id: 'h2', x: 62, y: 48, r: 18, type: 'surge', label: 'Harbor Gateway Tidal Surge', depth: '11.2 ft', currentVelocity: '22 knots' },
      { id: 'h3', x: 45, y: 72, r: 14, type: 'power', label: 'Substation Gamma Submerged & Downed Grid', danger: '480V Live Water Arc Risk' }
    ],
    shelters: [
      {
        id: 's1',
        name: 'Highland Arena Complex',
        x: 82,
        y: 20,
        capacity: 3500,
        occupancy: 2840,
        power: 'Aux Generator 94%',
        status: 'Optimal',
        supplies: { bloodUnits: 64, oxygenTanks: 42, waterLiters: 12500, traumaKits: 180, meals: 9500 }
      },
      {
        id: 's2',
        name: 'Bayou Valley Memorial Clinic',
        x: 35,
        y: 42,
        capacity: 800,
        occupancy: 780,
        power: 'Battery Inverter 18% (CRITICAL)',
        status: 'Critical Deficit',
        supplies: { bloodUnits: 4, oxygenTanks: 3, waterLiters: 800, traumaKits: 12, meals: 420 }
      },
      {
        id: 's3',
        name: 'Northern Ridge Technical Institute',
        x: 55,
        y: 15,
        capacity: 2200,
        occupancy: 1100,
        power: 'Grid Live 100%',
        status: 'Surplus Reserve',
        supplies: { bloodUnits: 88, oxygenTanks: 95, waterLiters: 24000, traumaKits: 310, meals: 18200 }
      }
    ],
    units: [
      { id: 'u1', callsign: 'Triton-1 (Airboat Rescue)', type: 'water_rescue', x: 30, y: 38, status: 'Active Mission', target: 'Elderly Care Facility' },
      { id: 'u2', callsign: 'Aegis Drone Mesh-4', type: 'drone', x: 42, y: 32, status: 'Airborne Transit', target: 'Medical Supply Drop' },
      { id: 'u3', callsign: 'USAR Alpha (High-Water)', type: 'ground_heavy', x: 70, y: 28, status: 'Staged / Ready', target: 'Sector 2 Staging' },
      { id: 'u4', callsign: 'LifeFlight Helo-9', type: 'helicopter', x: 60, y: 18, status: 'Refueling', target: 'Highland Helipad' }
    ],
    incidents: [
      {
        id: 'inc-101',
        title: 'Residential Block Submerged - 18 Citizens on Rooftops',
        location: 'Bayou View Blvd & 7th Ave',
        coords: { x: 26, y: 36 },
        triageCode: 'RED',
        severity: 'Immediate Life Threat',
        victims: 18,
        damageIndex: 88,
        hazardType: 'Flash Flood / Water Rising +1.2ft/hr',
        dispatched: false,
        image: '/triage_flood.jpg',
        aiAnalysis: {
          confidence: '98.2%',
          structureIntegrity: '12% (Severe Foundation Weakening)',
          waterDepthEst: '5.4 - 7.1 ft',
          detectedFeatures: [
            { label: 'Submerged Vehicles (Entrapment Risk)', conf: '99%' },
            { label: '18 Heat Signatures on Roof Structures', conf: '96%' },
            { label: 'Downed Utility Pole with Transformer', conf: '94%' },
            { label: 'Fast Inundation Current Vector (14kt)', conf: '92%' }
          ],
          recommendedAction: 'Deploy Amphibious Watercraft Triton-1 + Drone Line Tether',
          priorityUnits: '2x Swift Water Teams, 1x Paramedic Inflatable'
        }
      },
      {
        id: 'inc-102',
        title: 'Trapped Paramedic Rig in Underpass Backflow',
        location: 'Harbor Expressway Underpass at Canal 3',
        coords: { x: 48, y: 55 },
        triageCode: 'RED',
        severity: 'Immediate Life Threat',
        victims: 3,
        damageIndex: 74,
        hazardType: 'Deep Water Accumulation (8.2ft)',
        dispatched: true,
        image: '/triage_flood.jpg',
        aiAnalysis: {
          confidence: '96.5%',
          structureIntegrity: '40% (Hydrostatic Pressure on Barriers)',
          waterDepthEst: '8.2 ft',
          detectedFeatures: [
            { label: 'Ambulance Submerged Above Hood Level', conf: '98%' },
            { label: 'Active Water Whirlpool / Storm Drain Breach', conf: '95%' }
          ],
          recommendedAction: 'Helo Hoist Winch Extraction',
          priorityUnits: 'LifeFlight Helo-9'
        }
      },
      {
        id: 'inc-103',
        title: 'Pharmacy Warehouse Structural Roof Delamination',
        location: 'Industrial Park Way, Sector 6',
        coords: { x: 74, y: 44 },
        triageCode: 'YELLOW',
        severity: 'Delayed / Asset Salvage',
        victims: 2,
        damageIndex: 52,
        hazardType: 'Wind Shear / Partial Roof Loss',
        dispatched: false,
        image: '/triage_flood.jpg',
        aiAnalysis: {
          confidence: '91.8%',
          structureIntegrity: '48%',
          waterDepthEst: '1.2 ft',
          detectedFeatures: [
            { label: 'Delaminated Corrugated Steel Roof', conf: '94%' },
            { label: 'Preserved Refrigerated Insulin Vault', conf: '89%' }
          ],
          recommendedAction: 'Rapid Medical Cargo Extraction via Drone Cargo',
          priorityUnits: 'Drone Mesh-4 Logistics'
        }
      }
    ],
    routes: {
      origin: 'Bayou View Residential District',
      destination: 'Highland Arena Safe Shelter',
      legacyRoute: {
        name: 'Default Navigation (Shoreline Parkway)',
        distanceKm: '8.4 km',
        estimatedMinutes: 'DANGEROUS (TRAP)',
        riskScore: 96,
        status: 'LETHAL HAZARD',
        hazardBreach: 'Passes directly across Sector 4 Flash Flood Basin (6.8ft water) and Submerged Substation Gamma',
        elevationProfile: 'Depressed Basin (-4ft Sea Level)',
        coordinates: [
          { x: 26, y: 36 },
          { x: 34, y: 40 },
          { x: 45, y: 72 }, // Danger!
          { x: 65, y: 50 },
          { x: 82, y: 20 }
        ]
      },
      aegisRoute: {
        name: 'AegisGrid AI Dynamic Safe Corridor',
        distanceKm: '12.8 km',
        estimatedMinutes: '19 mins',
        riskScore: 4,
        status: '100% SECURE CORRIDOR',
        hazardBreach: 'Zero hazard proximity; routes via elevated north ridge bypass and reinforced concrete aqueduct viaduct',
        elevationProfile: 'Elevated Ridge (+45ft to +120ft)',
        coordinates: [
          { x: 26, y: 36 },
          { x: 28, y: 22 },
          { x: 42, y: 15 },
          { x: 62, y: 12 },
          { x: 82, y: 20 }
        ],
        steps: [
          { instruction: 'Depart Bayou View via Northbound Escarpment Ramp', alert: 'Do not turn onto Shoreline Parkway (Flooded)', dist: '1.2 km' },
          { instruction: 'Merge onto Ridgecrest Elevated Expressway (Grid Live)', alert: 'Cleared by Drone Mesh telemetry 3 mins ago', dist: '4.8 km' },
          { instruction: 'Cross North Viaduct Span at Milepost 14', alert: 'Structural strain sensors nominal (0.02 delta)', dist: '3.6 km' },
          { instruction: 'Take Exit 9A directly into Highland Arena Emergency Gate', alert: 'Triage reception bay active and ready', dist: '3.2 km' }
        ]
      }
    }
  },

  earthquake: {
    id: 'earthquake',
    name: 'Cascadia Fault: 7.2 Magnitude Seismic Rupture',
    type: 'Geophysical & Structural',
    threatLevel: 'DEFCON 1 - MAXIMUM SEISMIC',
    windSpeed: '12 mph',
    precipitation: '0.0 in/hr',
    affectedArea: 'Downtown Metro & Civic Financial Core',
    floodStage: 'Water Mains Fractured (140 psi burst)',
    meshNodesActive: 2140,
    activeIncidentsCount: 64,
    civiliansEvacuated: 29800,
    hazards: [
      { id: 'h4', x: 50, y: 50, r: 26, type: 'collapse', label: 'Civic Center Building Collapse Grid', debrisDepth: '14 ft concrete rubble', aftershockRisk: '84% prob > M5.5' },
      { id: 'h5', x: 22, y: 65, r: 16, type: 'gas', label: 'Gas Pipeline Rupture & Vapor Cloud', danger: 'Explosive Atmosphere Threshold 78%' },
      { id: 'h6', x: 75, y: 30, r: 18, type: 'structural', label: 'Interstate 80 Overpass Buckling', danger: 'Pylon 4 Shear Failure' }
    ],
    shelters: [
      {
        id: 's4',
        name: 'Olympic Park Open Air Triage Compound',
        x: 85,
        y: 80,
        capacity: 6000,
        occupancy: 4200,
        power: 'Field Solar & Diesel 88%',
        status: 'Optimal Intake',
        supplies: { bloodUnits: 140, oxygenTanks: 80, waterLiters: 45000, traumaKits: 450, meals: 24000 }
      },
      {
        id: 's5',
        name: 'Downtown Trauma Center Annex',
        x: 48,
        y: 52,
        capacity: 1200,
        occupancy: 1190,
        power: 'Seismic Generator 32%',
        status: 'Critically Overwhelmed',
        supplies: { bloodUnits: 6, oxygenTanks: 4, waterLiters: 1200, traumaKits: 14, meals: 900 }
      },
      {
        id: 's6',
        name: 'Westside Stadium Field Hospital',
        x: 18,
        y: 25,
        capacity: 4000,
        occupancy: 1900,
        power: 'Aux Generator 96%',
        status: 'Surplus Reserve',
        supplies: { bloodUnits: 110, oxygenTanks: 65, waterLiters: 32000, traumaKits: 290, meals: 16000 }
      }
    ],
    units: [
      { id: 'u5', callsign: 'USAR Heavy Dog Squad-3', type: 'k9_rescue', x: 46, y: 48, status: 'Active Search', target: 'Commercial Plaza Core' },
      { id: 'u6', callsign: 'Seismic Acoustic Sensor Drone-8', type: 'drone', x: 52, y: 46, status: 'Scanning Voids', target: 'Pancake Collapse Void 4' },
      { id: 'u7', callsign: 'Heavy Extrication Crane 12', type: 'ground_heavy', x: 62, y: 60, status: 'In Transit', target: 'Downtown Nexus' }
    ],
    incidents: [
      {
        id: 'inc-201',
        title: '7-Story Concrete Commercial Center Pancake Collapse',
        location: 'Grand Ave & Market St',
        coords: { x: 47, y: 49 },
        triageCode: 'RED',
        severity: 'Mass Casualty Extrication',
        victims: 34,
        damageIndex: 96,
        hazardType: 'Pancake Structural Failure / Secondary Collapse Threat',
        dispatched: true,
        image: '/triage_earthquake.jpg',
        aiAnalysis: {
          confidence: '99.1%',
          structureIntegrity: '4% (Imminent Total Rupture)',
          waterDepthEst: 'Dry / Gas hazard present',
          detectedFeatures: [
            { label: 'Sheared Concrete Columns & Rebar Exposure', conf: '99%' },
            { label: 'Multiple Confined Voids with Acoustic Movement', conf: '97%' },
            { label: 'Ruptured Commercial Gas Main at Sub-level', conf: '95%' },
            { label: 'Hazardous Glass Shards & Masonry Perimeter', conf: '98%' }
          ],
          recommendedAction: 'Immediate USAR Acoustic Listening Sticks + Heavy Crane Stabilization',
          priorityUnits: 'USAR Heavy Dog Squad-3, Crane 12, Trauma Med-5'
        }
      },
      {
        id: 'inc-202',
        title: 'Overpass Concrete Pylon Delamination with Suspended Bus',
        location: 'Interstate 80 Overpass Mile 11',
        coords: { x: 74, y: 32 },
        triageCode: 'RED',
        severity: 'Immediate Life Threat',
        victims: 22,
        damageIndex: 82,
        hazardType: 'Overpass Tilt 14 degrees',
        dispatched: false,
        image: '/triage_earthquake.jpg',
        aiAnalysis: {
          confidence: '95.4%',
          structureIntegrity: '18%',
          waterDepthEst: 'N/A',
          detectedFeatures: [
            { label: 'Pylon 4 Shear Crack Width > 12cm', conf: '96%' },
            { label: 'Transit Bus Teetering on Bridge Barrier', conf: '98%' }
          ],
          recommendedAction: 'Stabilization Cable Anchors + Aerial Snorkel Rescue Platform',
          priorityUnits: 'Heavy Rescue Squad 9'
        }
      }
    ],
    routes: {
      origin: 'Civic Financial Core',
      destination: 'Olympic Park Triage Compound',
      legacyRoute: {
        name: 'Direct Route (Grand Boulevard)',
        distanceKm: '4.6 km',
        estimatedMinutes: 'BLOCKED (COLLAPSE)',
        riskScore: 98,
        status: 'SEVERED ROADWAY',
        hazardBreach: 'Roadway blocked by 14ft concrete rubble pile and explosive gas plume',
        elevationProfile: 'Fissure Gap (3m lateral displacement)',
        coordinates: [
          { x: 47, y: 49 },
          { x: 55, y: 55 },
          { x: 68, y: 68 },
          { x: 85, y: 80 }
        ]
      },
      aegisRoute: {
        name: 'AegisGrid AI Structural Seismic Corridor',
        distanceKm: '7.8 km',
        estimatedMinutes: '14 mins',
        riskScore: 6,
        status: 'SEISMICALLY CLEARED',
        hazardBreach: 'Routes along grade-level wide boulevards with zero overhead overhang risks and clear sensor telemetry',
        elevationProfile: 'Stable Bedrock Arterial',
        coordinates: [
          { x: 47, y: 49 },
          { x: 44, y: 68 },
          { x: 52, y: 82 },
          { x: 72, y: 85 },
          { x: 85, y: 80 }
        ],
        steps: [
          { instruction: 'Exit Grand Ave via open-air West Plaza esplanade', alert: 'Clear of masonry overhangs; keep 20m from glass towers', dist: '0.8 km' },
          { instruction: 'Turn onto Bedrock Way (Geotechnical strain sensor safe)', alert: 'Roadway monitored by Aegis seismic mesh', dist: '2.5 km' },
          { instruction: 'Pass beneath clear-span skybridge at Perimeter Way', alert: 'Overpass certified safe by structural drone', dist: '2.4 km' },
          { instruction: 'Enter Olympic Park Gate 4 (Mass Triage Entry)', alert: 'Direct triage intake open with zero queue', dist: '2.1 km' }
        ]
      }
    }
  },

  wildfire: {
    id: 'wildfire',
    name: 'Diablo Firestorm: Gale-Driven Canyon Megafire',
    type: 'Thermal & Chemical Pyrogenic',
    threatLevel: 'DEFCON 1 - EXTREME FIRE SPREAD',
    windSpeed: '58 mph (Gusting 75 mph)',
    precipitation: '0.0 in/hr (Humidity 8%)',
    affectedArea: 'Canyon Ridge & Suburban Foothills',
    floodStage: 'Zero Water Pressure in Valley Hydrants',
    meshNodesActive: 1890,
    activeIncidentsCount: 42,
    civiliansEvacuated: 19400,
    hazards: [
      { id: 'h7', x: 38, y: 42, r: 24, type: 'fire', label: 'Active Flame Front: 80ft Flame Lengths', spreadRate: '45 acres/min', windVector: 'SSE @ 58mph' },
      { id: 'h8', x: 58, y: 60, r: 20, type: 'smoke', label: 'Zero Visibility Toxic Particulate Cloud', aqi: '840 (LETHAL CO/PM2.5)' },
      { id: 'h9', x: 25, y: 75, r: 15, type: 'ember', label: 'Ember Cast Zone (2.4-mile spot fires)', spotFireRisk: '98%' }
    ],
    shelters: [
      {
        id: 's7',
        name: 'Valley Expo Center (HEPA Filtration)',
        x: 88,
        y: 25,
        capacity: 4500,
        occupancy: 3100,
        power: 'Clean Grid & Microgrid 100%',
        status: 'Optimal Smoke Haven',
        supplies: { bloodUnits: 75, oxygenTanks: 110, waterLiters: 50000, traumaKits: 320, meals: 22000 }
      },
      {
        id: 's8',
        name: 'Canyon Middle School Shelter',
        x: 42,
        y: 50,
        capacity: 900,
        occupancy: 890,
        power: 'Smoke Infiltration Alert',
        status: 'Immediate Evacuation Required',
        supplies: { bloodUnits: 2, oxygenTanks: 1, waterLiters: 400, traumaKits: 8, meals: 300 }
      },
      {
        id: 's9',
        name: 'East Ridge Fairgrounds',
        x: 75,
        y: 70,
        capacity: 3000,
        occupancy: 1400,
        power: 'Stable Generator 92%',
        status: 'Active Intake',
        supplies: { bloodUnits: 55, oxygenTanks: 45, waterLiters: 28000, traumaKits: 180, meals: 12000 }
      }
    ],
    units: [
      { id: 'u8', callsign: 'Strike Team 4401 (Brush Breaker)', type: 'fire_rig', x: 34, y: 46, status: 'Flank Defense', target: 'Foothill Perimeter' },
      { id: 'u9', callsign: 'Thermal Recon Drone Sky-2', type: 'drone', x: 40, y: 40, status: 'Mapping Flame Perimeter', target: 'Canyon Throat' },
      { id: 'u10', callsign: 'Air Tanker 104 (Phos-Chek)', type: 'air_tanker', x: 50, y: 30, status: 'Drop Approach', target: 'Ridge Line Retardant' }
    ],
    incidents: [
      {
        id: 'inc-301',
        title: 'Foothill Estates Cut Off by Crown Fire & Road Ember Storm',
        location: 'Chaparral Crest & Ridge Point Rd',
        coords: { x: 39, y: 44 },
        triageCode: 'RED',
        severity: 'Thermal Surrender Threat',
        victims: 42,
        damageIndex: 94,
        hazardType: 'Crown Fire Spread @ 60mph / Spotting',
        dispatched: true,
        image: '/triage_wildfire.jpg',
        aiAnalysis: {
          confidence: '98.7%',
          structureIntegrity: '10% (Extreme Thermal Radiation)',
          waterDepthEst: 'Zero humidity / Spot fire rate extreme',
          detectedFeatures: [
            { label: '80ft Flame Wall Overrunning Ridge Road', conf: '99%' },
            { label: 'Multiple Burning Vehicles Blocking Cul-de-sac', conf: '97%' },
            { label: 'Dense Pyrocumulus Smoke Obscuring Vision', conf: '96%' },
            { label: 'Ember Shower Density: 400 sparks/sq meter', conf: '93%' }
          ],
          recommendedAction: 'Deploy Brush Breaker Escort + Tactical Retardant Airdrop Barrier',
          priorityUnits: 'Strike Team 4401, Air Tanker 104'
        }
      }
    ],
    routes: {
      origin: 'Chaparral Crest Residential',
      destination: 'Valley Expo Safe Smoke Haven',
      legacyRoute: {
        name: 'Direct Downhill Route (Canyon Road)',
        distanceKm: '6.2 km',
        estimatedMinutes: 'LETHAL TRAP (FLAME WALL)',
        riskScore: 99,
        status: 'OVERRUN BY FIRE',
        hazardBreach: 'Canyon Road is acting as a chimney chute with 80ft flames crossing both lanes and zero oxygen',
        elevationProfile: 'Narrow Choke Canyon Flume',
        coordinates: [
          { x: 39, y: 44 },
          { x: 45, y: 48 },
          { x: 55, y: 55 },
          { x: 75, y: 40 },
          { x: 88, y: 25 }
        ]
      },
      aegisRoute: {
        name: 'AegisGrid AI Windward Thermal Escape Corridor',
        distanceKm: '14.2 km',
        estimatedMinutes: '18 mins',
        riskScore: 5,
        status: 'UPWIND & CLEARED',
        hazardBreach: 'Routes counter-wind along the windward side of the granite ridge, away from flame propagation axis',
        elevationProfile: 'Granite Counter-Slope (Zero Fuel)',
        coordinates: [
          { x: 39, y: 44 },
          { x: 32, y: 30 },
          { x: 45, y: 18 },
          { x: 68, y: 16 },
          { x: 88, y: 25 }
        ],
        steps: [
          { instruction: 'Immediately turn North toward Granite Saddle Pass', alert: 'DO NOT head downhill into Canyon Road chimney flume', dist: '2.1 km' },
          { instruction: 'Pass over the mineralized fuel break at Tower Peak', alert: 'Ground bulldozed 80ft wide; zero combustible vegetation', dist: '4.2 km' },
          { instruction: 'Enter Downwind Shielded Arterial Highway 101 North', alert: 'Retardant line laid by Air Tanker 104 on southern flank', dist: '5.1 km' },
          { instruction: 'Proceed directly into Valley Expo HEPA Safe Enclosure', alert: 'Zero smoke particulate; medical inhaler triage on site', dist: '2.8 km' }
        ]
      }
    }
  }
};
