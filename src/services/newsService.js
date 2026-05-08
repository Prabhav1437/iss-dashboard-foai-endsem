import axios from 'axios';

const CACHE_KEY = 'iss_news_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const fetchNews = async (query = 'space exploration', sortBy = 'publishedAt') => {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  
  // Check cache first
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { timestamp, articles } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log('Returning news from cache');
      return articles;
    }
  }

  // If no API key, use the fallback SpaceFlightNews logic we had before or dummy data
  if (!apiKey || apiKey === 'YOUR_KEY') {
    console.warn('NewsAPI key missing, using fallback dummy data');
    return getDummyNews();
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        sortBy: sortBy,
        pageSize: 10,
        apiKey: apiKey,
      },
    });

    const articles = response.data.articles;
    
    // Save to cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      articles: articles,
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

const getDummyNews = () => [
  {
    title: "NASA's James Webb Space Telescope Captures Stunning New Image of Pillars of Creation",
    source: { name: "NASA News" },
    author: "Jane Doe",
    publishedAt: new Date().toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=800",
    description: "The James Webb Space Telescope has provided a new, highly detailed look at the iconic Pillars of Creation, revealing new stars and intricate details of the gas and dust.",
    url: "#"
  },
  {
    title: "SpaceX Successfully Launches Falcon Heavy with Multiple Satellites",
    source: { name: "SpaceX" },
    author: "Elon Musk",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    description: "SpaceX has completed another successful Falcon Heavy launch, placing several communications satellites into geostationary orbit.",
    url: "#"
  },
  {
    title: "Mars Rover Perseverance Finds Potential Signs of Ancient Microbial Life",
    source: { name: "Mars Daily" },
    author: "Dr. Aris Thorne",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800",
    description: "In a groundbreaking discovery, the Perseverance rover has collected samples that may contain organic molecules, hinting at past life on Mars.",
    url: "#"
  },
  {
    title: "Europe's Ariane 6 Rocket Prepares for Inaugural Flight",
    source: { name: "ESA" },
    author: "Marco Rossi",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800",
    description: "The European Space Agency is entering the final testing phase for Ariane 6, its next-generation heavy-lift launch vehicle.",
    url: "#"
  },
  {
    title: "China's Tiangong Space Station Welcomes New Crew Members",
    source: { name: "Global Space News" },
    author: "Li Wei",
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80&w=800",
    description: "The Shenzhou-18 mission has successfully docked with Tiangong, bringing a fresh crew to continue scientific experiments in orbit.",
    url: "#"
  },
  {
    title: "India's Gaganyaan Mission Completes Critical Crew Escape System Test",
    source: { name: "ISRO Watch" },
    author: "Amit Sharma",
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    description: "ISRO has achieved another milestone in its human spaceflight program by successfully demonstrating the abort capabilities at high altitudes.",
    url: "#"
  },
  {
    title: "Astronomers Detect Strongest Magnetic Field Ever Found in the Universe",
    source: { name: "Science Daily" },
    author: "Sarah Jenkins",
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    description: "Using high-resolution telescopes, researchers have identified a neutron star with a magnetic field billions of times stronger than Earth's.",
    url: "#"
  },
  {
    title: "New Lunar Base Designs Unveiled for Upcoming Artemis Missions",
    source: { name: "Lunar Living" },
    author: "Bob Miller",
    publishedAt: new Date(Date.now() - 518400000).toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=800",
    description: "Architects and engineers are collaborating on modular living spaces that can withstand the harsh conditions of the Moon's South Pole.",
    url: "#"
  },
  {
    title: "Search for Dark Matter Heats Up as Underground Lab Completes Upgrade",
    source: { name: "Physics World" },
    author: "Dr. Elena Vance",
    publishedAt: new Date(Date.now() - 604800000).toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=800",
    description: "The LUX-ZEPLIN experiment is now operational with 50 times more sensitivity, aiming to detect WIMPs directly for the first time.",
    url: "#"
  },
  {
    title: "NASA's Voyager 1 Resumes Sending Science Data After Technical Glitch",
    source: { name: "Deep Space Network" },
    author: "Kevin Wright",
    publishedAt: new Date(Date.now() - 691200000).toISOString(),
    urlToImage: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&q=80&w=800",
    description: "Against all odds, the 46-year-old spacecraft is once again communicating its observations from interstellar space back to Earth.",
    url: "#"
  }
];
