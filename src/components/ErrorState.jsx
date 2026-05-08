import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

const ErrorState = ({ message = 'Failed to fetch data', onRetry, compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span className="text-sm flex-1">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 p-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 pulse-dot" />
      </div>

      <div className="text-center">
        <h3 className="text-red-300 font-semibold mb-1">Connection Error</h3>
        <p className="text-slate-400 text-sm max-w-xs">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
