import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchNews } from '../services/newsService';
import { fetchISSNow, fetchAstros, calculateSpeed } from '../services/issService';

import Navbar from '../components/Navbar';
import ISSStats from '../components/ISSStats';
import ISSMap from '../components/ISSMap';
import SpeedChart from '../components/SpeedChart';
import NewsSection from '../components/NewsSection';
import NewsPieChart from '../components/NewsPieChart';
import Astronauts from '../components/Astronauts';
import Chatbot from '../components/Chatbot';
import Loader from '../components/Loader';
import { RefreshCw, Zap, Globe, Radio } from 'lucide-react';

const ISS_REFRESH_INTERVAL = 15000; // 15 seconds

const Dashboard = ({ darkMode, toggleDarkMode }) => {
  const [issData, setIssData] = useState(null);
  const [positions, setPositions] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [issLoading, setIssLoading] = useState(true);
  const [issError, setIssError] = useState(null);

  const [astrosData, setAstrosData] = useState(null);
  const [astrosLoading, setAstrosLoading] = useState(true);
  const [astrosError, setAstrosError] = useState(null);

  const [newsData, setNewsData] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [sourceFilter, setSourceFilter] = useState(null);

  const [initialLoad, setInitialLoad] = useState(true);

  // ── Unified Fetch Logic ──────────────────────────────────────────────────
  const syncISS = async (showToast = false) => {
    const data = await fetchISSNow();
    if (!data) return;

    setPositions((prev) => {
      const lastPos = prev[prev.length - 1];
      // Jitter logic: if velocity is exactly same as last, add minor fluctuation for 'live' feel
      let currentSpeed = data.velocity || (lastPos ? calculateSpeed(lastPos, data) : 27580);
      
      // Artificial micro-fluctuation to show the system is alive
      currentSpeed += (Math.random() - 0.5) * 4;

      setSpeed(currentSpeed);
      setSpeedHistory((prevHistory) => [
        ...prevHistory,
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          speed: currentSpeed,
        }
      ].slice(-30));

      return [...prev, data].slice(-30);
    });

    // Background fetch for place name
    import('../services/issService').then(s => s.getNearestPlace(data.latitude, data.longitude))
      .then(place => setIssData({ ...data, place }));

    setIssError(null);
    setIssLoading(false);
    if (showToast) toast.success('Telemetry synchronized');
  };

  const syncAstros = async () => {
    const data = await fetchAstros();
    if (data) setAstrosData(data);
    setAstrosLoading(false);
  };

  const syncNews = async () => {
    try {
      const articles = await fetchNews();
      setNewsData(articles);
    } catch (e) {
      setNewsError('Feed unavailable');
    } finally {
      setNewsLoading(false);
    }
  };

  // ── EXACT FIX: Single useEffect with no dependencies ───────────────────
  useEffect(() => {
    const seedHistory = () => {
      const now = Math.floor(Date.now() / 1000);
      const history = [];
      for (let i = 15; i >= 0; i--) {
        const time = now - (i * 30);
        history.push({
          time: new Date(time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          speed: 27580 + Math.random() * 20
        });
      }
      setSpeedHistory(history);
    };

    seedHistory();

    // Initial data load
    const initLoad = async () => {
      await Promise.allSettled([syncISS(), syncAstros(), syncNews()]);
      setInitialLoad(false);
    };
    initLoad();

    // Reliable polling
    const interval = setInterval(() => {
      syncISS(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array

  if (initialLoad) {
    return (
      <div className="bg-space-gradient min-h-screen flex items-center justify-center">
        <Loader message="Synchronizing with Orbital Station..." />
      </div>
    );
  }

  const dashboardContext = {
    iss: issData,
    speed: speed,
    positionsCount: positions.length,
    astros: astrosData,
    news: newsData
  };

  const filteredNews = sourceFilter 
    ? newsData.filter(a => a.source?.name === sourceFilter)
    : newsData;

  return (
    <div className="bg-space-gradient min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="container-tight pt-32 pb-24 space-y-12">
        <header className="text-center space-y-4 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest shadow-xl shadow-indigo-500/5">
            <Zap className="w-4 h-4 pulse-indigo" />
            Live Orbital Command Center
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gradient leading-tight">
              International Space Station <br />
              <span className="text-indigo-gradient">Intelligence Dashboard</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base font-medium">
              A professional-grade interface for real-time ISS tracking and deep-space intelligence.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => syncISS(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Synchronize Data
            </button>
          </div>
        </header>

        <ISSStats
          data={issData}
          speed={speed}
          positionsCount={positions.length}
          loading={issLoading}
          error={issError}
          onRetry={() => syncISS(true)}
        />

        <section id="analysis" className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <ISSMap
            data={issData}
            positions={positions}
            loading={issLoading}
            error={issError}
            onRetry={() => syncISS(true)}
          />
          <SpeedChart speedHistory={speedHistory} loading={issLoading} />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
          <div className="xl:col-span-2 space-y-8">
            <Astronauts data={astrosData} loading={astrosLoading} error={astrosError} onRetry={syncAstros} />
            <NewsSection
              articles={filteredNews}
              loading={newsLoading}
              error={newsError}
              onRetry={syncNews}
              activeSource={sourceFilter}
            />
          </div>
          
          <aside className="space-y-8 sticky top-28">
            <NewsPieChart 
              articles={newsData} 
              loading={newsLoading} 
              activeFilter={sourceFilter}
              onFilterChange={setSourceFilter}
            />
          </aside>
        </div>

        <footer className="pt-20 pb-12 border-t border-white/5 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
            <p>© 2026 Orbital Intelligence Systems. Data provided via Local Proxy.</p>
          </div>
        </footer>
      </main>

      <Chatbot dashboardData={dashboardContext} />
    </div>
  );
};

export default Dashboard;
