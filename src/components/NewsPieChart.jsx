import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { PieChart as PieIcon, FilterX } from 'lucide-react';
import { CardSkeleton } from './Loader';

const COLORS = ['#6366f1', '#a855f7', '#22d3ee', '#10b981', '#f59e0b', '#f43f5e'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, percent } = payload[0];
  return (
    <div className="glass p-3 text-xs">
      <p className="text-[var(--text-primary)] font-semibold mb-1">{name}</p>
      <p className="text-[var(--text-secondary)]">
        {value} article{value !== 1 ? 's' : ''} ·{' '}
        <span className="text-indigo-400">{(percent * 100).toFixed(0)}%</span>
      </p>
      <p className="text-[9px] text-[var(--text-muted)] mt-2 uppercase tracking-tighter italic">Click to filter</p>
    </div>
  );
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.08) return null;
  const rad = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + rad * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + rad * Math.sin((-midAngle * Math.PI) / 180);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const NewsPieChart = ({ articles, activeFilter, onFilterChange, loading }) => {
  const chartData = useMemo(() => {
    if (!articles?.length) return [];
    const counts = {};
    articles.forEach((a) => {
      const site = a.source?.name || 'Unknown';
      counts[site] = (counts[site] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [articles]);

  const handleClick = (data) => {
    if (onFilterChange) {
      onFilterChange(data.name === activeFilter ? null : data.name);
    }
  };

  if (loading) return <CardSkeleton rows={4} />;

  return (
    <div className="glass fade-in p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <PieIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Source Distribution</h3>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Article Origins</p>
          </div>
        </div>
        
        {activeFilter && (
          <button 
            onClick={() => onFilterChange(null)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-400 hover:text-white transition-all"
          >
            <FilterX className="w-3 h-3" /> Clear Filter
          </button>
        )}
      </div>

      <div className="flex-1 min-h-[250px]">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={activeFilter === entry.name ? '#fff' : 'rgba(255,255,255,0.08)'}
                    strokeWidth={activeFilter === entry.name ? 2 : 1}
                    opacity={!activeFilter || activeFilter === entry.name ? 1 : 0.4}
                    className="transition-all duration-300"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span className={`text-[10px] transition-colors ${activeFilter === value ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {activeFilter && (
        <p className="text-center text-[10px] text-indigo-400 font-medium mt-2">
          Showing only from: {activeFilter}
        </p>
      )}
    </div>
  );
};

export default NewsPieChart;
