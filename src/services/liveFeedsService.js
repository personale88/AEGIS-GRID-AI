// Live Real-World Disaster & Meteorological Telemetry Feeds
// Connects directly to official public APIs (USGS, Open-Meteo, NASA EONET)

export const LIVE_EMERGENCY_WEBSITES = [
  {
    id: 'tnsdma',
    name: 'Tamil Nadu State Disaster Management (TNSDMA)',
    url: 'https://tnsdma.tn.gov.in/',
    category: 'State Emergency Authority',
    region: 'Tamil Nadu / Chennai',
    description: 'Official cyclone alerts, flood evacuation advisories, relief camp statuses, and emergency helplines (1070 / 1077).'
  },
  {
    id: 'imd',
    name: 'India Meteorological Department (IMD Mausam)',
    url: 'https://mausam.imd.gov.in/',
    category: 'National Meteorological Feed',
    region: 'India / Bay of Bengal',
    description: 'Doppler weather radar, cyclone tracking tracks, heavy rainfall warnings, and coastal storm surge advisories.'
  },
  {
    id: 'ndma',
    name: 'National Disaster Management Authority (NDMA India)',
    url: 'https://ndma.gov.in/',
    category: 'Federal Disaster Command',
    region: 'India',
    description: 'National emergency guidelines, NDRF deployment coordination, flood risk atlas, and CAP early warning alerts.'
  },
  {
    id: 'usgs',
    name: 'USGS Real-Time Earthquake Hazards Program',
    url: 'https://earthquake.usgs.gov/earthquakes/map/',
    category: 'Global Seismic Network',
    region: 'Global / Real-Time',
    description: 'Real-time global seismic sensor telemetry recording earthquakes, fault slip measurements, and tsunami watches.'
  },
  {
    id: 'nasa',
    name: 'NASA Earth Observatory (EONET)',
    url: 'https://eonet.gsfc.nasa.gov/',
    category: 'Orbital Earth Observation',
    region: 'Global Satellites',
    description: 'Continuous satellite detection of active severe storms, wildfires, thermal anomalies, and volcanic plumes.'
  },
  {
    id: 'gdacs',
    name: 'Global Disaster Alert and Coordination System (GDACS)',
    url: 'https://www.gdacs.org/',
    category: 'UN / EC International Alerts',
    region: 'Worldwide',
    description: 'Real-time automated alerts for tropical cyclones, floods, tsunamis, and earthquakes with disaster severity scoring.'
  }
];

// 1. Fetch Real Live Weather (Open-Meteo API - 100% Free, Zero Key, Real-Time)
export async function fetchLiveWeather(lat = 13.0827, lng = 80.2707) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather HTTP ${res.status}`);
    const data = await res.json();
    return {
      success: true,
      data: data.current,
      location: { lat, lng },
      fetchedAt: new Date().toLocaleTimeString()
    };
  } catch (err) {
    console.warn('Live weather fetch error:', err.message);
    return {
      success: false,
      error: err.message
    };
  }
}

// 2. Fetch Real USGS Earthquakes (Last 24 Hours, M2.5+)
export async function fetchLiveEarthquakes() {
  try {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`USGS HTTP ${res.status}`);
    const data = await res.json();
    const quakes = (data.features || []).slice(0, 15).map(f => ({
      id: f.id,
      title: f.properties.title,
      mag: f.properties.mag,
      place: f.properties.place,
      time: new Date(f.properties.time).toLocaleTimeString(),
      date: new Date(f.properties.time).toLocaleDateString(),
      url: f.properties.url,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      depthKm: f.geometry.coordinates[2]
    }));
    return {
      success: true,
      quakes,
      totalCount: data.metadata?.count || quakes.length,
      fetchedAt: new Date().toLocaleTimeString()
    };
  } catch (err) {
    console.warn('Live USGS earthquakes fetch error:', err.message);
    return {
      success: false,
      error: err.message,
      quakes: []
    };
  }
}

// 3. Fetch Real NASA EONET Active Natural Events
export async function fetchLiveNasaEvents() {
  try {
    const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?limit=10&status=open';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NASA EONET HTTP ${res.status}`);
    const data = await res.json();
    const events = (data.events || []).map(e => ({
      id: e.id,
      title: e.title,
      category: e.categories?.[0]?.title || 'Natural Hazard',
      date: e.geometry?.[0]?.date ? new Date(e.geometry[0].date).toLocaleDateString() : 'Active',
      link: e.link || e.sources?.[0]?.url,
      coordinates: e.geometry?.[0]?.coordinates
    }));
    return {
      success: true,
      events,
      fetchedAt: new Date().toLocaleTimeString()
    };
  } catch (err) {
    console.warn('Live NASA EONET fetch error:', err.message);
    return {
      success: false,
      error: err.message,
      events: []
    };
  }
}
