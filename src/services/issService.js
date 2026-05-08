import axios from 'axios';

// Global state for rate limiting and caching
let isFetchingISS = false;
let lastFetchTime = 0;
const THROTTLE_LIMIT = 5000; 
const CACHE_KEY = 'iss_telemetry_cache';

/**
 * Reverse Geocode coordinates using OpenStreetMap Nominatim via CORS Proxy
 */
export const getNearestPlace = async (lat, lon) => {
  try {
    // Switch to allorigins for production-grade proxy reliability
    const targetUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    
    const res = await axios.get(proxyUrl, { timeout: 5000 });
    const data = JSON.parse(res.data.contents);
    
    if (data.display_name) {
      const parts = data.display_name.split(',');
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
    // Adding timestamp for cache busting and using a reliable production proxy
    const targetUrl = `https://api.wheretheiss.at/v1/satellites/25544?t=${Date.now()}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    const response = await axios.get(proxyUrl, { timeout: 8000 });
    const rawData = JSON.parse(response.data.contents);

    const data = {
      latitude: parseFloat(rawData.latitude),
      longitude: parseFloat(rawData.longitude),
      timestamp: rawData.timestamp,
      velocity: rawData.velocity,
      altitude: rawData.altitude,
      visibility: rawData.visibility,
      footprint: rawData.footprint
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('ISS Telemetry Error:', error);
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
    const targetUrl = 'http://api.open-notify.org/astros.json';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    const response = await axios.get(proxyUrl, { timeout: 5000 });
    return JSON.parse(response.data.contents);
  } catch (err) {
    return {
      number: 7,
      people: [
        { name: 'Sergey Kud-Sverchkov', craft: 'ISS (Commander)' },
        { name: 'Sergey Mikayev', craft: 'ISS' },
        { name: 'Christopher Williams', craft: 'ISS' },
        { name: 'Jessica Meir', craft: 'ISS' },
        { name: 'Jack Hathaway', craft: 'ISS' },
        { name: 'Sophie Adenot', craft: 'ISS' },
        { name: 'Andrey Fedyaev', craft: 'ISS' }
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
