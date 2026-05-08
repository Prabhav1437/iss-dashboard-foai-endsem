import axios from 'axios';

// Global state for rate limiting and caching
let isFetchingISS = false;
let lastFetchTime = 0;
const THROTTLE_LIMIT = 5000; 
const CACHE_KEY = 'iss_telemetry_cache';

/**
 * Reverse Geocode coordinates using OpenStreetMap Nominatim
 */
export const getNearestPlace = async (lat, lon) => {
  try {
    // Attempt direct fetch first
    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, { 
      timeout: 5000
    });
    
    if (res.data.display_name) {
      const parts = res.data.display_name.split(',');
      return parts.slice(0, 3).join(',').trim();
    }
    return "Over International Waters";
  } catch (err) {
    return "Orbital Track Active";
  }
};

/**
 * Fetches current ISS position via professional-grade wheretheiss.at API
 */
export const fetchISSNow = async () => {
  if (isFetchingISS) return null;

  const now = Date.now();
  if (now - lastFetchTime < THROTTLE_LIMIT) {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  }

  isFetchingISS = true;
  lastFetchTime = now;

  try {
    // DIRECT FETCH - REMOVED PROXIES
    const response = await axios.get(`https://api.wheretheiss.at/v1/satellites/25544?t=${Date.now()}`, { 
      timeout: 8000 
    });

    const data = {
      latitude: parseFloat(response.data.latitude),
      longitude: parseFloat(response.data.longitude),
      timestamp: response.data.timestamp,
      velocity: response.data.velocity,
      altitude: response.data.altitude,
      visibility: response.data.visibility,
      footprint: response.data.footprint
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('ISS Telemetry Error (Direct):', error);
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } finally {
    isFetchingISS = false;
  }
};

/**
 * Fetches current astronauts with professional Expedition 74 fallback
 */
export const fetchAstros = async () => {
  try {
    // DIRECT FETCH
    const response = await axios.get('https://api.open-notify.org/astros.json', { timeout: 5000 });
    return response.data;
  } catch (err) {
    // Professional Expedition 74 Fallback
    return {
      number: 7,
      people: [
        { name: 'Sergey Kud-Sverchkov', craft: 'ISS (Commander)' },
        { name: 'Sergei Mikayev', craft: 'ISS' },
        { name: 'Christopher Williams', craft: 'ISS' },
        { name: 'Jessica Meir', craft: 'ISS (Crew-12 Commander)' },
        { name: 'Jack Hathaway', craft: 'ISS (Crew-12 Pilot)' },
        { name: 'Sophie Adenot', craft: 'ISS (Crew-12 Mission Specialist)' },
        { name: 'Andrey Fedyaev', craft: 'ISS (Crew-12 Mission Specialist)' }
      ]
    };
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const calculateSpeed = (pos1, pos2) => {
  if (!pos1 || !pos2) return 0;
  const distance = calculateDistance(pos1.latitude, pos1.longitude, pos2.latitude, pos2.longitude);
  const timeDiff = (pos2.timestamp - pos1.timestamp) / 3600;
  return timeDiff > 0 ? distance / timeDiff : 0;
};
