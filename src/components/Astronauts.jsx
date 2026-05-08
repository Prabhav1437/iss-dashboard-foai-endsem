import React from 'react';
import { Users, User } from 'lucide-react';
import { CardSkeleton } from './Loader';
import ErrorState from './ErrorState';

const Astronauts = ({ data, loading, error, onRetry }) => {
  if (loading) {
    return <CardSkeleton rows={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} compact />;
  }

  return (
    <section id="astronauts" className="fade-in glass p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" /> Crew Aboard ISS
        </h2>
        <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
          {data?.number || 0} ASTRONAUTS
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data?.people?.map((person, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{person.name}</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">{person.craft}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Astronauts;
