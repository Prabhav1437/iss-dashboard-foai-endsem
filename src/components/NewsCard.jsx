import React from 'react';
import { ExternalLink, Calendar, User, Globe } from 'lucide-react';

const NewsCard = ({ article, index = 0 }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className="glass card-hover fade-in flex flex-col sm:flex-row gap-6 p-5 group overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image Container */}
      <div className="shrink-0 w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-indigo-500/10 relative">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML =
                '<div class="w-full h-full flex items-center justify-center text-4xl">🚀</div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🚀</div>
        )}
        <div className="absolute top-3 left-3 bg-indigo-600/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          {article.source?.name || 'News'}
        </div>
      </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
              {article.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] mb-3">
              {article.author && (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="truncate max-w-[120px]">{article.author}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
  
            <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-4">
              {article.description || 'No description available for this article.'}
            </p>
          </div>

        <div className="flex items-center justify-between">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all group/btn"
          >
            Read More
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <Globe className="w-3 h-3" />
            {article.source?.name?.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
