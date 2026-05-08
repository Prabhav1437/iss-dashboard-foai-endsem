import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { CardSkeleton } from './Loader';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 text-xs space-y-1.5 min-w-[140px] border-indigo-500/30">
      <p className="text-[var(--text-secondary)] font-medium border-b border-white/10 pb-1.5 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--text-secondary)] capitalize">Velocity:</span>
          <span className="font-mono font-semibold text-[var(--text-primary)]">
            {p.value.toFixed(2)} km/h
          </span>
        </div>
      ))}
    </div>
  );
};

const SpeedChart = ({ speedHistory, loading }) => {
  if (loading) return <CardSkeleton rows={5} />;

  return (
    <div className="glass fade-in p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Velocity Analysis</h3>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Real-time km/h tracking</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold animate-pulse">
          LIVE
        </div>
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={speedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#64748b', fontSize: 9 }} 
              axisLine={false} 
              tickLine={false}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 9 }} 
              axisLine={false} 
              tickLine={false} 
              domain={['dataMin - 5', 'dataMax + 5']}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="speed"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#speedGradient)"
              animationDuration={1500}
              isAnimationActive={true}
              dot={{ r: 2, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpeedChart;
