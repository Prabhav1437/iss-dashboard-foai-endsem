import React, { useState, useMemo } from 'react';
import { Newspaper, RefreshCw, Search, SortDesc, Filter, FilterX } from 'lucide-react';
import NewsCard from './NewsCard';
import { CardSkeleton } from './Loader';
import ErrorState from './ErrorState';

const NewsSection = ({ articles, loading, error, onRetry, activeSource }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'source'

  const filteredAndSorted = useMemo(() => {
    if (!articles) return [];
    
    return articles
      .filter((a) =>
        (a.title + (a.description || '') + (a.source?.name || '')).toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        } else {
          return (a.source?.name || '').localeCompare(b.source?.name || '');
        }
      });
  }, [articles, search, sortBy]);

  return (
    <section id="news" className="fade-in space-y-6">
      {/* Header Controls */}
      <div className="glass p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Space News</h2>
              {activeSource && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">
                  <Filter className="w-2.5 h-2.5" /> {activeSource}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Latest Updates & Discoveries</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search space news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-48 lg:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-[var(--text-muted)]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-40 pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="date" className="bg-[var(--bg-primary)]">Recent First</option>
              <option value="source" className="bg-[var(--bg-primary)]">By Source</option>
            </select>
          </div>

          {/* Refresh */}
          <button
            onClick={onRetry}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
            title="Refresh News"
          >
            <RefreshCw className={`w-4 h-4 group-active:rotate-180 transition-transform ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} rows={3} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} compact />
      ) : filteredAndSorted.length === 0 ? (
        <div className="glass p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">No articles found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 animate-in fade-in duration-500">
          {filteredAndSorted.slice(0, 10).map((article, i) => (
            <NewsCard key={article.url || i} article={article} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewsSection;
