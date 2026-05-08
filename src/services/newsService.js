import axios from 'axios';

const CACHE_KEY = 'iss_news_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const fetchNews = async (query = 'ISS', sortBy = 'publishedAt') => {
  // Check cache first
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { timestamp, articles } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return articles;
    }
  }

  try {
    // Using SpaceFlight News API (v4) - Professional, free, and no CORS issues for hosted sites
    const response = await axios.get('https://api.spaceflightnewsapi.net/v4/articles/', {
      params: {
        limit: 12,
        search: query === 'space exploration' ? '' : query,
        ordering: sortBy === 'publishedAt' ? '-published_at' : ''
      }
    });

    // Map to the common Article structure used by the dashboard
    const articles = response.data.results.map(article => ({
      title: article.title,
      source: { name: article.news_site || 'Space News' },
      author: article.news_site,
      publishedAt: article.published_at,
      urlToImage: article.image_url,
      description: article.summary,
      url: article.url
    }));
    
    // Save to cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      articles: articles,
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Fallback to dummy data if API is down
    return getDummyNews();
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
  }
];
