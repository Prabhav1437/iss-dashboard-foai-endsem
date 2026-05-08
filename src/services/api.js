import axios from 'axios';

// ── ISS real-time position ──────────────────────────────────────────────────
export const fetchISSPosition = async () => {
  try {
    const res = await axios.get('https://api.wheretheiss.at/v1/satellites/25544', {
      timeout: 8000,
    });
    return res.data;
  } catch {
    return {
      latitude: 28.6,
      longitude: 77.2,
      altitude: 408.5,
      velocity: 27576.3,
      visibility: 'daylight',
      footprint: 4500,
      timestamp: Date.now() / 1000,
      daynum: 2460455.7,
      solar_lat: 18.2,
      solar_lon: 120.5,
      units: 'kilometers',
    };
  }
};

// ── ISS pass times ──────────────────────────────────────────────────────────
export const fetchISSPassTimes = async (lat = 28.6, lon = 77.2) => {
  try {
    const res = await axios.get(
      `https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${Math.floor(Date.now()/1000)},${Math.floor(Date.now()/1000)+3600},${Math.floor(Date.now()/1000)+7200}`,
      { timeout: 8000 }
    );
    return res.data;
  } catch {
    return [];
  }
};

// ── Space news via SpaceFlightNews (free, no key needed) ────────────────────
export const fetchSpaceNews = async (limit = 8) => {
  try {
    const res = await axios.get(
      `https://api.spaceflightnewsapi.net/v4/articles/?limit=${limit}&ordering=-published_at`,
      { timeout: 8000 }
    );
    return res.data.results || [];
  } catch {
    return getDummyNews();
  }
};

// ── AI Chatbot via Hugging Face Inference API ───────────────────────────────
export const sendChatMessage = async (message, history = []) => {
  const token = import.meta.env.VITE_AI_TOKEN;
  if (!token || token === 'YOUR_HF_TOKEN') {
    return getLocalAIResponse(message);
  }
  try {
    const res = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        inputs: `<s>[INST] You are ARIA, an AI assistant specializing in space, the ISS, and astronomy. Answer concisely. ${message} [/INST]`,
        parameters: { max_new_tokens: 250, temperature: 0.7 },
      },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
    );
    const text = res.data[0]?.generated_text || '';
    const answer = text.split('[/INST]').pop()?.trim();
    return answer || getLocalAIResponse(message);
  } catch {
    return getLocalAIResponse(message);
  }
};

// ── Local fallback AI responses ─────────────────────────────────────────────
const getLocalAIResponse = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes('altitude') || m.includes('height'))
    return '🛸 The ISS orbits at approximately 408 km above Earth\'s surface — in Low Earth Orbit (LEO).';
  if (m.includes('speed') || m.includes('velocity') || m.includes('fast'))
    return '⚡ The ISS travels at ~7.66 km/s (27,576 km/h) — completing one orbit every ~90 minutes!';
  if (m.includes('crew') || m.includes('astronaut'))
    return '👨‍🚀 The ISS typically hosts 6–7 crew members from multiple agencies: NASA, Roscosmos, ESA, JAXA, and CSA.';
  if (m.includes('size') || m.includes('big') || m.includes('large'))
    return '📐 The ISS measures 109m × 73m — roughly the size of a football field — and weighs ~420,000 kg.';
  if (m.includes('launch') || m.includes('built'))
    return '🚀 ISS construction began in 1998. The first module (Zarya) launched November 20, 1998, and assembly completed in 2011.';
  if (m.includes('orbit') || m.includes('earth'))
    return '🌍 The ISS completes ~15.5 orbits per day around Earth. From the surface, you can spot it as a bright moving star!';
  if (m.includes('gravity') || m.includes('weightless'))
    return '🌀 The ISS is NOT gravity-free. It\'s in free fall around Earth, creating microgravity — about 90% of Earth\'s gravity still acts on it!';
  if (m.includes('hello') || m.includes('hi') || m.includes('hey'))
    return '👋 Hello! I\'m ARIA — your AI Space Assistant. Ask me anything about the ISS, space exploration, or astronomy!';
  return '🌌 Great question! The ISS is humanity\'s most complex engineering achievement. Try asking me about its speed, altitude, crew, or history!';
};

// ── Dummy news fallback ─────────────────────────────────────────────────────
const getDummyNews = () => [
  {
    id: 1, title: 'ISS Crew Completes Successful Spacewalk to Install New Solar Arrays',
    summary: 'Astronauts successfully installed upgraded solar arrays during a 7-hour EVA, boosting the station\'s power generation capacity by 20%.',
    url: '#', image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
    published_at: new Date().toISOString(), news_site: 'NASA',
  },
  {
    id: 2, title: 'SpaceX Dragon Cargo Ship Docks with ISS Delivering Critical Supplies',
    summary: 'The Dragon resupply craft brought 2,600 kg of science experiments, food, hardware, and crew supplies.',
    url: '#', image_url: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400',
    published_at: new Date(Date.now() - 86400000).toISOString(), news_site: 'SpaceX',
  },
  {
    id: 3, title: 'Researchers Observe Strange Behavior in Flames Aboard the Space Station',
    summary: 'Cool flames burning in microgravity could lead to cleaner, more efficient combustion engines on Earth.',
    url: '#', image_url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
    published_at: new Date(Date.now() - 172800000).toISOString(), news_site: 'ESA',
  },
  {
    id: 4, title: 'NASA Plans Major Structural Upgrades to ISS Life Support Systems',
    summary: 'A $300M upgrade plan will modernize water recycling and oxygen generation systems ahead of 2030 operations.',
    url: '#', image_url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400',
    published_at: new Date(Date.now() - 259200000).toISOString(), news_site: 'NASA',
  },
  {
    id: 5, title: 'Japan\'s HTV-X Cargo Vehicle Cleared for First ISS Mission',
    summary: 'JAXA\'s next-generation HTV-X spacecraft completes final testing and is cleared for its inaugural ISS cargo mission.',
    url: '#', image_url: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=400',
    published_at: new Date(Date.now() - 345600000).toISOString(), news_site: 'JAXA',
  },
  {
    id: 6, title: 'ISS Marks 25 Years of Continuous Human Presence in Space',
    summary: 'The station celebrates two and a half decades of uninterrupted human habitation since Expedition 1 in November 2000.',
    url: '#', image_url: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400',
    published_at: new Date(Date.now() - 432000000).toISOString(), news_site: 'Space.com',
  },
];
