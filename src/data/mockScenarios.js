// AegisGrid Comprehensive Disaster Intelligence Datasets with Real-World GIS Coordinates

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
    geoCenter: [37.7749, -122.4194],
    zoom: 13,
    hazards: [
      { 
        id: 'h1', 
        x: 28, y: 35, r: 22, 
        lat: 37.7650, lng: -122.4250, radiusMeters: 1300,
        type: 'flood', label: 'Sector 4 Flash Flood Basin', depth: '6.8 ft', currentVelocity: '14 knots' 
      },
      { 
        id: 'h2', 
        x: 62, y: 48, r: 18, 
        lat: 37.7910, lng: -122.3920, radiusMeters: 1100,
        type: 'surge', label: 'Harbor Gateway Tidal Surge', depth: '11.2 ft', currentVelocity: '22 knots' 
      },
      { 
        id: 'h3', 
        x: 45, y: 72, r: 14, 
        lat: 37.7480, lng: -122.4080, radiusMeters: 800,
        type: 'power', label: 'Substation Gamma Submerged & Downed Grid', danger: '480V Live Water Arc Risk' 
      }
    ],
    shelters: [
      {
        id: 's1',
        name: 'Highland Arena Complex',
        x: 82, y: 20,
        lat: 37.7940, lng: -122.4080,
        capacity: 3500,
        occupancy: 2840,
        power: 'Aux Generator 94%',
        status: 'Optimal',
        supplies: { bloodUnits: 64, oxygenTanks: 42, waterLiters: 12500, traumaKits: 180, meals: 9500 }
      },
      {
        id: 's2',
        name: 'Bayou Valley Memorial Clinic',
        x: 35, y: 42,
        lat: 37.7580, lng: -122.4260,
        capacity: 800,
        occupancy: 780,
        power: 'Battery Inverter 18% (CRITICAL)',
        status: 'Critical Deficit',
        supplies: { bloodUnits: 4, oxygenTanks: 3, waterLiters: 800, traumaKits: 12, meals: 420 }
      },
      {
        id: 's3',
        name: 'Northern Ridge Technical Institute',
        x: 55, y: 15,
        lat: 37.7880, lng: -122.4380,
        capacity: 2200,
        occupancy: 1100,
        power: 'Grid Live 100%',
        status: 'Surplus Reserve',
        supplies: { bloodUnits: 88, oxygenTanks: 95, waterLiters: 24000, traumaKits: 310, meals: 18200 }
      }
    ],
    units: [
      { id: 'u1', callsign: 'Triton-1 (Airboat Rescue)', type: 'water_rescue', x: 30, y: 38, lat: 37.7660, lng: -122.4280, status: 'Active Mission', target: 'Elderly Care Facility' },
      { id: 'u2', callsign: 'Aegis Drone Mesh-4', type: 'drone', x: 42, y: 32, lat: 37.7720, lng: -122.4180, status: 'Airborne Transit', target: 'Medical Supply Drop' },
      { id: 'u3', callsign: 'USAR Alpha (High-Water)', type: 'ground_heavy', x: 70, y: 28, lat: 37.7840, lng: -122.4060, status: 'Staged / Ready', target: 'Sector 2 Staging' },
      { id: 'u4', callsign: 'LifeFlight Helo-9', type: 'helicopter', x: 60, y: 18, lat: 37.7920, lng: -122.4120, status: 'Refueling', target: 'Highland Helipad' }
    ],
    incidents: [
      {
        id: 'inc-101',
        title: 'Residential Block Submerged - 18 Citizens on Rooftops',
        location: 'Bayou View Blvd & 7th Ave',
        coords: { x: 26, y: 36 },
        lat: 37.7630,
        lng: -122.4310,
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
        lat: 37.7810,
        lng: -122.4010,
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
        lat: 37.7510,
        lng: -122.3900,
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
          { x: 45, y: 72 },
          { x: 65, y: 50 },
          { x: 82, y: 20 }
        ],
        geoPath: [
          [37.7630, -122.4310],
          [37.7660, -122.4200],
          [37.7480, -122.4080],
          [37.7780, -122.4000],
          [37.7940, -122.4080]
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
        geoPath: [
          [37.7630, -122.4310],
          [37.7710, -122.4430],
          [37.7840, -122.4460],
          [37.7920, -122.4300],
          [37.7940, -122.4080]
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
    geoCenter: [47.6080, -122.3350],
    zoom: 13,
    hazards: [
      { 
        id: 'h4', 
        x: 50, y: 50, r: 26, 
        lat: 47.6050, lng: -122.3320, radiusMeters: 1100,
        type: 'collapse', label: 'Civic Center Collapse Grid', debrisDepth: '14 ft concrete rubble', aftershockRisk: '84% prob > M5.5' 
      },
      { 
        id: 'h5', 
        x: 22, y: 65, r: 16, 
        lat: 47.5960, lng: -122.3240, radiusMeters: 800,
        type: 'gas', label: 'Gas Pipeline Rupture & Vapor Cloud', danger: 'Explosive Atmosphere Threshold 78%' 
      },
      { 
        id: 'h6', 
        x: 75, y: 30, r: 18, 
        lat: 47.6190, lng: -122.3220, radiusMeters: 900,
        type: 'structural', label: 'Interstate Overpass Buckling', danger: 'Pylon 4 Shear Failure' 
      }
    ],
    shelters: [
      {
        id: 's4',
        name: 'Olympic Park Open Air Triage Compound',
        x: 85, y: 80,
        lat: 47.6215, lng: -122.3520,
        capacity: 6000,
        occupancy: 4200,
        power: 'Field Solar & Diesel 88%',
        status: 'Optimal Intake',
        supplies: { bloodUnits: 140, oxygenTanks: 80, waterLiters: 45000, traumaKits: 450, meals: 24000 }
      },
      {
        id: 's5',
        name: 'Downtown Trauma Center Annex',
        x: 48, y: 52,
        lat: 47.6060, lng: -122.3210,
        capacity: 1200,
        occupancy: 1190,
        power: 'Seismic Generator 32%',
        status: 'Critically Overwhelmed',
        supplies: { bloodUnits: 6, oxygenTanks: 4, waterLiters: 1200, traumaKits: 14, meals: 900 }
      },
      {
        id: 's6',
        name: 'Westside Stadium Field Hospital',
        x: 18, y: 25,
        lat: 47.5950, lng: -122.3310,
        capacity: 4000,
        occupancy: 1900,
        power: 'Aux Generator 96%',
        status: 'Surplus Reserve',
        supplies: { bloodUnits: 110, oxygenTanks: 65, waterLiters: 32000, traumaKits: 290, meals: 16000 }
      }
    ],
    units: [
      { id: 'u5', callsign: 'USAR Heavy Dog Squad-3', type: 'k9_rescue', x: 46, y: 48, lat: 47.6090, lng: -122.3370, status: 'Active Search', target: 'Commercial Plaza Core' },
      { id: 'u6', callsign: 'Acoustic Sensor Drone-8', type: 'drone', x: 52, y: 46, lat: 47.6020, lng: -122.3300, status: 'Scanning Voids', target: 'Pancake Collapse Void 4' },
      { id: 'u7', callsign: 'Extrication Crane 12', type: 'ground_heavy', x: 62, y: 60, lat: 47.6140, lng: -122.3250, status: 'In Transit', target: 'Downtown Nexus' }
    ],
    incidents: [
      {
        id: 'inc-201',
        title: '7-Story Concrete Commercial Center Pancake Collapse',
        location: 'Grand Ave & Market St',
        coords: { x: 47, y: 49 },
        lat: 47.6040,
        lng: -122.3330,
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
        lat: 47.6180,
        lng: -122.3270,
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
        ],
        geoPath: [
          [47.6040, -122.3330],
          [47.6090, -122.3300],
          [47.6160, -122.3420],
          [47.6215, -122.3520]
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
        geoPath: [
          [47.6040, -122.3330],
          [47.6010, -122.3450],
          [47.6120, -122.3580],
          [47.6215, -122.3520]
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
    geoCenter: [37.8650, -122.2450],
    zoom: 13,
    hazards: [
      { 
        id: 'h7', 
        x: 38, y: 42, r: 24, 
        lat: 37.8680, lng: -122.2380, radiusMeters: 1400,
        type: 'fire', label: 'Active Flame Front: 80ft Flames', spreadRate: '45 acres/min', windVector: 'SSE @ 58mph' 
      },
      { 
        id: 'h8', 
        x: 58, y: 60, r: 20, 
        lat: 37.8540, lng: -122.2280, radiusMeters: 1200,
        type: 'smoke', label: 'Toxic Particulate Cloud (AQI 840)', aqi: '840 (LETHAL CO/PM2.5)' 
      },
      { 
        id: 'h9', 
        x: 25, y: 75, r: 15, 
        lat: 37.8820, lng: -122.2460, radiusMeters: 900,
        type: 'ember', label: 'Ember Shower Risk (2.4-mile spotting)', spotFireRisk: '98%' 
      }
    ],
    shelters: [
      {
        id: 's7',
        name: 'Valley Expo Center (HEPA Filtration)',
        x: 88, y: 25,
        lat: 37.8760, lng: -122.2740,
        capacity: 4500,
        occupancy: 3100,
        power: 'Clean Grid & Microgrid 100%',
        status: 'Optimal Smoke Haven',
        supplies: { bloodUnits: 75, oxygenTanks: 110, waterLiters: 50000, traumaKits: 320, meals: 22000 }
      },
      {
        id: 's8',
        name: 'Canyon Middle School Shelter',
        x: 42, y: 50,
        lat: 37.8610, lng: -122.2480,
        capacity: 900,
        occupancy: 890,
        power: 'Smoke Infiltration Alert',
        status: 'Immediate Evacuation Required',
        supplies: { bloodUnits: 2, oxygenTanks: 1, waterLiters: 400, traumaKits: 8, meals: 300 }
      },
      {
        id: 's9',
        name: 'East Ridge Fairgrounds',
        x: 75, y: 70,
        lat: 37.8480, lng: -122.2620,
        capacity: 3000,
        occupancy: 1400,
        power: 'Stable Generator 92%',
        status: 'Active Intake',
        supplies: { bloodUnits: 55, oxygenTanks: 45, waterLiters: 28000, traumaKits: 180, meals: 12000 }
      }
    ],
    units: [
      { id: 'u8', callsign: 'Strike Team 4401 (Brush Breaker)', type: 'fire_rig', x: 34, y: 46, lat: 37.8655, lng: -122.2410, status: 'Flank Defense', target: 'Foothill Perimeter' },
      { id: 'u9', callsign: 'Thermal Recon Drone Sky-2', type: 'drone', x: 40, y: 40, lat: 37.8690, lng: -122.2360, status: 'Mapping Flame Perimeter', target: 'Canyon Throat' },
      { id: 'u10', callsign: 'Air Tanker 104 (Phos-Chek)', type: 'air_tanker', x: 50, y: 30, lat: 37.8780, lng: -122.2510, status: 'Drop Approach', target: 'Ridge Line Retardant' }
    ],
    incidents: [
      {
        id: 'inc-301',
        title: 'Foothill Estates Cut Off by Crown Fire & Road Ember Storm',
        location: 'Chaparral Crest & Ridge Point Rd',
        coords: { x: 39, y: 44 },
        lat: 37.8670,
        lng: -122.2360,
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
        ],
        geoPath: [
          [37.8670, -122.2360],
          [37.8630, -122.2470],
          [37.8590, -122.2580],
          [37.8760, -122.2740]
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
        geoPath: [
          [37.8670, -122.2360],
          [37.8750, -122.2390],
          [37.8840, -122.2530],
          [37.8760, -122.2740]
        ],
        steps: [
          { instruction: 'Immediately turn North toward Granite Saddle Pass', alert: 'DO NOT head downhill into Canyon Road chimney flume', dist: '2.1 km' },
          { instruction: 'Pass over the mineralized fuel break at Tower Peak', alert: 'Ground bulldozed 80ft wide; zero combustible vegetation', dist: '4.2 km' },
          { instruction: 'Enter Downwind Shielded Arterial Highway 101 North', alert: 'Retardant line laid by Air Tanker 104 on southern flank', dist: '5.1 km' },
          { instruction: 'Proceed directly into Valley Expo HEPA Safe Enclosure', alert: 'Zero smoke particulate; medical inhaler triage on site', dist: '2.8 km' }
        ]
      }
    }
  },

  chennai: {
    id: 'chennai',
    name: 'Cyclone Michaung: Chennai Coastal Surge & Adyar River Inundation',
    type: 'Hydrological & Cyclone Storm Surge',
    threatLevel: 'DEFCON 1 - CRITICAL RED ALERT',
    windSpeed: '110 km/h (Cyclonic Gale)',
    precipitation: '195 mm / 24hr',
    affectedArea: 'Greater Chennai Corporation (GCC) & Coastal Lowlands',
    floodStage: '+3.6m Adyar & Cooum Inundation',
    meshNodesActive: 3840,
    activeIncidentsCount: 46,
    civiliansEvacuated: 24500,
    geoCenter: [13.0450, 80.2400],
    zoom: 12,
    hazards: [
      {
        id: 'h_ch1',
        x: 48, y: 55, r: 24,
        lat: 13.0180, lng: 80.2240, radiusMeters: 1400,
        type: 'flood', label: 'Adyar River Basin & Saidapet Causeway Breach', depth: '3.8 meters', currentVelocity: '18 knots'
      },
      {
        id: 'h_ch2',
        x: 35, y: 68, r: 26,
        lat: 12.9780, lng: 80.2210, radiusMeters: 1600,
        type: 'flood', label: 'Velachery Low-Lying Residential Lake Inundation', depth: '4.2 meters (Rooftop Level)', currentVelocity: '12 knots'
      },
      {
        id: 'h_ch3',
        x: 75, y: 38, r: 20,
        lat: 13.0550, lng: 80.2850, radiusMeters: 1200,
        type: 'surge', label: 'Marina Beach & Santhome Coastal Tidal Surge', depth: '2.5 meters', currentVelocity: '24 knots'
      },
      {
        id: 'h_ch4',
        x: 52, y: 32, r: 18,
        lat: 13.0730, lng: 80.2580, radiusMeters: 1000,
        type: 'power', label: 'Cooum River Urban Drainage Stagnation & Downed 230kV Feeder', danger: 'Grid Short Circuit & Water Electrification Risk'
      }
    ],
    shelters: [
      {
        id: 's_ch1',
        name: 'Jawaharlal Nehru Indoor Stadium Disaster Camp (Central)',
        x: 65, y: 22,
        lat: 13.0836, lng: 80.2780,
        capacity: 6500,
        occupancy: 4820,
        power: 'High-Capacity Diesel Genset 96%',
        status: 'Optimal Intake',
        supplies: { bloodUnits: 120, oxygenTanks: 75, waterLiters: 48000, traumaKits: 380, meals: 28000 }
      },
      {
        id: 's_ch2',
        name: 'Anna University Guindy Engineering Relief Hub',
        x: 42, y: 58,
        lat: 13.0125, lng: 80.2355,
        capacity: 4000,
        occupancy: 2950,
        power: 'Rooftop Solar Microgrid 92%',
        status: 'Optimal Intake',
        supplies: { bloodUnits: 90, oxygenTanks: 50, waterLiters: 32000, traumaKits: 260, meals: 18000 }
      },
      {
        id: 's_ch3',
        name: 'Tambaram Air Force Base Medical Staging Field Hospital',
        x: 20, y: 85,
        lat: 12.9250, lng: 80.1200,
        capacity: 5000,
        occupancy: 3100,
        power: 'Auxiliary Military Turbine 98%',
        status: 'Trauma Hub Active',
        supplies: { bloodUnits: 180, oxygenTanks: 110, waterLiters: 65000, traumaKits: 520, meals: 34000 }
      },
      {
        id: 's_ch4',
        name: 'Loyola College Relief Center (Nungambakkam)',
        x: 50, y: 35,
        lat: 13.0640, lng: 80.2400,
        capacity: 3200,
        occupancy: 2750,
        power: 'Dual Generator 88%',
        status: 'Optimal Intake',
        supplies: { bloodUnits: 65, oxygenTanks: 35, waterLiters: 24000, traumaKits: 170, meals: 14000 }
      }
    ],
    units: [
      { id: 'u_ch1', callsign: 'NDRF 04 Battalion (Arakkonam QRF - Inflatable Zodiac Boats)', type: 'water_rescue', x: 44, y: 56, lat: 13.0190, lng: 80.2260, status: 'Active Extraction', target: 'Saidapet Causeway' },
      { id: 'u_ch2', callsign: 'TNSDMA Autonomous Thermal Recon Drone Swarm-7', type: 'drone', x: 36, y: 66, lat: 12.9810, lng: 80.2230, status: 'Acoustic Void Scanning', target: 'Velachery Terraces' },
      { id: 'u_ch3', callsign: 'Greater Chennai Corporation Heavy De-watering Team 12', type: 'ground_heavy', x: 54, y: 34, lat: 13.0710, lng: 80.2550, status: 'Active Pumping', target: 'Cooum Sluice Gate 4' },
      { id: 'u_ch4', callsign: 'Indian Coast Guard SAR Hovercraft Taskforce', type: 'water_rescue', x: 73, y: 40, lat: 13.0530, lng: 80.2820, status: 'Coastal Patrol', target: 'Marina Fishermen Quarters' }
    ],
    incidents: [
      {
        id: 'inc-301',
        title: 'Velachery Gandhi Nagar: 4-Story Apartment Submerged — 28 Citizens on Terrace',
        location: 'Gandhi Nagar 2nd Main Rd, Velachery, Chennai',
        coords: { x: 36, y: 67 },
        lat: 12.9785,
        lng: 80.2205,
        triageCode: 'RED',
        severity: 'Immediate Life Threat (Rising Water Level)',
        victims: 28,
        damageIndex: 94,
        hazardType: 'Flash Flood / Ground Floor Fully Inundated (12ft depth)',
        dispatched: true,
        image: '/triage_flood.jpg',
        aiAnalysis: {
          confidence: '99.4%',
          structureIntegrity: '44% (Hydrodynamic Scour at Foundation)',
          waterDepthEst: '3.9 meters (Ground floor + Mezzanine under water)',
          detectedFeatures: [
            { label: 'Elderly Heart Patient & 3 Infants Signal SOS from Terrace', conf: '99%' },
            { label: 'Submerged Electrical Junction Box (High Shock Hazard)', conf: '96%' },
            { label: 'Strong Current Vectors toward Velachery Lake Sluice', conf: '94%' },
            { label: 'Clear Terrace LZ for Drone Medical Drops & Winch Helicopter', conf: '97%' }
          ],
          recommendedAction: 'Deploy NDRF Inflatable Zodiacs via 100-ft Road + Drone Emergency Insulin Drop',
          priorityUnits: 'NDRF 04 Battalion, TNSDMA Thermal Drone-7'
        }
      },
      {
        id: 'inc-302',
        title: 'Saidapet Maraimalai Adigal Bridge Causeway Overflow (Critical Stranding)',
        location: 'Anna Salai / Adyar River Causeway, Saidapet, Chennai',
        coords: { x: 47, y: 54 },
        lat: 13.0185,
        lng: 80.2235,
        triageCode: 'RED',
        severity: 'Mass Transit Evacuation',
        victims: 16,
        damageIndex: 88,
        hazardType: 'Adyar River Overtopping Road by 4.5 feet with violent 16-knot current',
        dispatched: false,
        image: '/triage_flood.jpg',
        aiAnalysis: {
          confidence: '97.2%',
          structureIntegrity: '62%',
          waterDepthEst: '1.4 meters on bridge roadway',
          detectedFeatures: [
            { label: 'MTC Transit Bus Trapped with 16 Passengers Inside', conf: '98%' },
            { label: 'Water Level Rising 8cm every 15 minutes', conf: '95%' }
          ],
          recommendedAction: 'Anchor Heavy Tow Line from Guindy approach + High-Clearance Amphibious Truck',
          priorityUnits: 'Tamil Nadu Fire & Rescue Services (TNFRS) Station 9'
        }
      },
      {
        id: 'inc-303',
        title: 'OMR IT Corridor Thoraipakkam 230kV Substation Submerged',
        location: 'Rajiv Gandhi Salai (OMR), Thoraipakkam, Chennai',
        coords: { x: 40, y: 76 },
        lat: 12.9410,
        lng: 80.2370,
        triageCode: 'YELLOW',
        severity: 'Critical Infrastructure Hazard',
        victims: 4,
        damageIndex: 78,
        hazardType: 'TANGEDCO Transformer Yard Submerged',
        dispatched: false,
        image: '/triage_flood.jpg',
        aiAnalysis: {
          confidence: '95.1%',
          structureIntegrity: '72%',
          waterDepthEst: '1.8 meters',
          detectedFeatures: [
            { label: 'Automated Breaker Trip Active; Emergency Shutdown Verified', conf: '96%' },
            { label: 'Auxiliary Generator Diesel Tanks Floating', conf: '92%' }
          ],
          recommendedAction: 'Deploy GCC Heavy Dewatering Diesel Pump + TANGEDCO Linemen Escort',
          priorityUnits: 'GCC Dewatering Team 12'
        }
      },
      {
        id: 'inc-304',
        title: 'Royapuram Kasimedu Fishing Harbor Sea Surge & Boat Mooring Breach',
        location: 'Kasimedu Wharf, Royapuram, North Chennai',
        coords: { x: 72, y: 18 },
        lat: 13.1120,
        lng: 80.2970,
        triageCode: 'YELLOW',
        severity: 'Maritime & Coastal Hazard',
        victims: 9,
        damageIndex: 71,
        hazardType: 'Cat-1 Cyclonic Wave Surge & Breakwater Breach',
        dispatched: false,
        image: '/triage_flood.jpg',
        aiAnalysis: {
          confidence: '93.8%',
          structureIntegrity: '68%',
          waterDepthEst: '2.4 meters tidal surge',
          detectedFeatures: [
            { label: 'Mechanized Trawlers Severed from Pylons', conf: '95%' },
            { label: 'Coast Guard Patrol Warning Siren Active', conf: '99%' }
          ],
          recommendedAction: 'Coast Guard Hovercraft Rescue Line + Move Fishermen inland to Royapuram Relief Camp',
          priorityUnits: 'Indian Coast Guard Hovercraft'
        }
      }
    ],
    routes: {
      origin: 'Velachery Gandhi Nagar Residential Lowlands',
      destination: 'Anna University Guindy Engineering Relief Hub',
      legacyRoute: {
        name: 'Direct Saidapet Causeway Route (Anna Salai)',
        distanceKm: '4.8 km',
        estimatedMinutes: 'IMPASSABLE (RIVER BREACH)',
        riskScore: 96,
        status: 'SUBMERGED & CLOSED',
        hazardBreach: 'Saidapet bridge road is submerged under 4.5 feet of turbulent Adyar river surge with 18-knot cross-current',
        elevationProfile: 'Low-Lying Causeway (+2m MSL)',
        coordinates: [
          { x: 36, y: 67 },
          { x: 42, y: 60 },
          { x: 47, y: 54 },
          { x: 42, y: 58 }
        ],
        geoPath: [
          [12.9785, 80.2205],
          [12.9980, 80.2215],
          [13.0185, 80.2235],
          [13.0125, 80.2355]
        ]
      },
      aegisRoute: {
        name: 'AegisGrid AI High-Elevation Corridor (via Guindy Flyover & Sardar Patel Rd)',
        distanceKm: '6.4 km',
        estimatedMinutes: '14 mins',
        riskScore: 6,
        status: '100% ELEVATED & SECURE',
        hazardBreach: 'Zero river crossing; routes via Sardar Patel elevated road & Guindy Kathipara Grade Separator',
        elevationProfile: 'Elevated Flyover (+18m to +28m MSL)',
        coordinates: [
          { x: 36, y: 67 },
          { x: 34, y: 62 },
          { x: 38, y: 56 },
          { x: 42, y: 58 }
        ],
        geoPath: [
          [12.9785, 80.2205],
          [12.9920, 80.2090],
          [13.0070, 80.2080],
          [13.0090, 80.2210],
          [13.0125, 80.2355]
        ],
        steps: [
          { instruction: 'Depart Velachery via Inner Ring Road Elevated Ramp toward GST Road', alert: 'Do not enter 100-Ft Road underpass (Severely Inundated)', dist: '1.8 km' },
          { instruction: 'Take the Kathipara Grade Separator Loop toward Guindy', alert: 'Verified 100% dry by TNSDMA Drone Mesh telemetry', dist: '2.4 km' },
          { instruction: 'Merge onto Sardar Patel Road high-ridge boulevard', alert: 'Clear flow; dedicated emergency convoy corridor open', dist: '1.4 km' },
          { instruction: 'Enter Anna University Main Campus North Gate directly to Shelter Reception', alert: 'Triage team standing by with dry intake and hot meals', dist: '0.8 km' }
        ]
      }
    }
  }
};
