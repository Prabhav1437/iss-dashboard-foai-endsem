import React from 'react';
import { Radio } from 'lucide-react';

// ── Generic card skeleton ───────────────────────────────────────────────────
export const CardSkeleton = ({ rows = 3 }) => (
  <div className="glass p-6 card-hover fade-in" role="status" aria-label="Loading...">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full shimmer bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded shimmer bg-white/5 w-2/3" />
        <div className="h-2 rounded shimmer bg-white/5 w-1/2" />
      </div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-3 rounded shimmer bg-white/5 mb-3" style={{ width: `${85 - i * 10}%` }} />
    ))}
  </div>
);

// ── Full-page loader ────────────────────────────────────────────────────────
const Loader = ({ message = 'Acquiring ISS signal…' }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
    {/* Advanced Orbit/Radar animation */}
    <div className="relative w-32 h-32 flex items-center justify-center overflow-hidden rounded-full">
      {/* Background Orbits */}
      <div className="absolute inset-0 rounded-full border border-indigo-500/10 scale-100" />
      <div className="absolute inset-4 rounded-full border border-indigo-500/5 scale-100" />
      <div className="absolute inset-8 rounded-full border border-indigo-500/5 scale-100" />
      
      {/* Spinning Orbits */}
      <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 orbit-spin opacity-40" />
      <div 
        className="absolute inset-4 rounded-full border-t-2 border-purple-500 orbit-spin opacity-40" 
        style={{ animationDuration: '5s', animationDirection: 'reverse' }}
      />
      
      {/* Radar Sweep */}
      <div className="radar-sweep" />
      
      {/* Center Icon */}
      <div className="relative z-10 w-16 h-16 rounded-full bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
        <Radio className="w-8 h-8 text-indigo-400 animate-pulse" />
      </div>
    </div>

    <div className="text-center space-y-3">
      <div className="space-y-1">
        <p className="text-indigo-400 font-bold text-xs tracking-[0.3em] uppercase opacity-70">
          Uplink Status
        </p>
        <h2 className="text-white font-orbitron text-sm md:text-base font-bold tracking-widest uppercase">
          {message}
        </h2>
      </div>
      
      {/* Dynamic Progress Indicator */}
      <div className="flex gap-2 justify-center items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
            style={{ animation: `pulse-dot 1s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
    
    {/* Background Scanline Effect */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,0,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  </div>
);

export default Loader;
