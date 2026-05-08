import React from 'react';
import {
  Gauge, MapPin, Mountain, Eye, Footprints, Clock, Globe, Zap, List
} from 'lucide-react';
import { CardSkeleton } from './Loader';
import ErrorState from './ErrorState';

const StatCard = ({ icon: Icon, label, value, unit, color = 'indigo', delay = 0 }) => {
  const colors = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    cyan:   'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    green:  'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    amber:  'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    pink:   'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400',
  };
  const cls = colors[color] || colors.indigo;

  return (
    <div
      className={`glass card-hover fade-in p-5 bg-gradient-to-br ${cls} flex flex-col gap-3`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</span>
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cls} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${cls.split(' ').pop()}`} />
        </div>
      </div>
      <div>
        <span className="font-orbitron text-2xl font-bold text-[var(--text-primary)]">{value}</span>
        {unit && <span className="ml-1.5 text-xs text-[var(--text-secondary)]">{unit}</span>}
      </div>
    </div>
  );
};

const ISSStats = ({ data, speed, positionsCount, loading, error, onRetry }) => {
  if (loading) {
    return (
      <section className="fade-in">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" /> Live Telemetry
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} rows={1} />)}
        </div>
      </section>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} compact />;
  }

  const stats = [
    {
      icon: MapPin, label: 'Latitude',
      value: data?.latitude?.toFixed(4) ?? '—',
      unit: '°', color: 'indigo',
    },
    {
      icon: Globe, label: 'Longitude',
      value: data?.longitude?.toFixed(4) ?? '—',
      unit: '°', color: 'purple',
    },
    {
      icon: Gauge, label: 'Velocity',
      value: (data?.velocity || speed) ? (data?.velocity || speed).toFixed(0) : '—',
      unit: 'km/h', color: 'green',
    },
    {
      icon: List, label: 'Positions',
      value: positionsCount ?? 0,
      unit: '/ 15', color: 'cyan',
    },
    {
      icon: Mountain, label: 'Altitude',
      value: data?.altitude?.toFixed(1) ?? '—',
      unit: 'km', color: 'amber',
    },
    {
      icon: Footprints, label: 'Footprint',
      value: data?.footprint?.toFixed(0) ?? '—',
      unit: 'km', color: 'pink',
    },
  ];

  return (
    <section id="tracker" className="fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" /> Live Telemetry
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <Clock className="w-3 h-3" />
          <span>Last Signal Pulse: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      {data?.place && (
        <div className="glass p-4 mb-6 border-indigo-500/20 bg-indigo-500/5 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Nearest Geographic Place</p>
            <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight">{data.place}</h3>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 80} />)}
      </div>
    </section>
  );
};

export default ISSStats;
