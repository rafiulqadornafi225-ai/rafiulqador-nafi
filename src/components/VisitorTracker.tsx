import React, { useState } from 'react';
import { 
  Eye, 
  Users, 
  Globe, 
  Activity, 
  RefreshCw, 
  Trash2, 
  UserPlus, 
  Monitor, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Search, 
  UserCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VisitorLog } from '../types';

interface VisitorTrackerProps {
  viewsCount: number;
  visitorLogs: VisitorLog[];
  onClearLogs: () => void;
  onAddTestVisitor: () => void;
  onResetViews: () => void;
}

export default function VisitorTracker({
  viewsCount,
  visitorLogs,
  onClearLogs,
  onAddTestVisitor,
  onResetViews
}: VisitorTrackerProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'real' | 'simulated'>('all');

  const filteredLogs = visitorLogs.filter(log => {
    const matchesSearch = 
      log.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.device.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.ip.toLowerCase().includes(filterQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'real') return matchesSearch && log.isReal;
    if (activeTab === 'simulated') return matchesSearch && !log.isReal;
    return matchesSearch;
  });

  // Calculate quick stats
  const activeNowCount = Math.max(1, Math.floor(visitorLogs.length / 4) + (visitorLogs.filter(l => l.isReal).length));
  
  // Get city distribution counts
  const cityCounts: { [key: string]: number } = {};
  visitorLogs.forEach(log => {
    const city = log.location.split(',')[0].trim();
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  const cityData = Object.entries(cityCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#00e194]">
              System Operations
            </span>
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight mt-1 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            Website Traffic & Audience Monitor
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Auditing active viewer credentials, estimated locations and real-time page hits.
          </p>
        </div>

        {/* Operational buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAddTestVisitor}
            className="flex items-center gap-1 bg-indigo-600/15 hover:bg-indigo-600/35 border border-indigo-500/25 text-indigo-300 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-sm active:scale-95 transition-all"
            title="Simulate a new customer visiting from Dhaka"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Simulate Traffic</span>
          </button>
          
          <button
            onClick={onResetViews}
            className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-sm active:scale-95 transition-all"
            title="Reset counter to baseline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Count</span>
          </button>

          <button
            onClick={onClearLogs}
            className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-sm active:scale-95 transition-all"
            title="Wipe out local log storage"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Grid Bento stats list */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Stat 1: Accumulative Views */}
        <div className="bg-black/55 border border-white/10 p-4 rounded-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <Eye className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Total Hits</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">{viewsCount}</p>
          </div>
        </div>

        {/* Stat 2: Active Leads */}
        <div className="bg-black/55 border border-white/10 p-4 rounded-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Simulated Online</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5 flex items-center gap-1.5">
              {activeNowCount} 
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/10 animate-pulse">LIVE</span>
            </p>
          </div>
        </div>

        {/* Stat 3: Real sessions */}
        <div className="bg-black/55 border border-white/10 p-4 rounded-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
            <UserCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Actual Sessions</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">
              {visitorLogs.filter(l => l.isReal).length}
            </p>
          </div>
        </div>

        {/* Stat 4: Top Region */}
        <div className="bg-black/55 border border-white/10 p-4 rounded-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
            <Globe className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Top Dispatch City</p>
            <p className="text-sm font-black text-white mt-0.5 uppercase truncate max-w-[120px]">
              {cityData[0]?.city || "Dhaka"}
            </p>
          </div>
        </div>
      </div>

      {/* Main breakdown section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Geographic summary box */}
        <div className="lg:col-span-4 bg-black/40 border border-white/5 p-4 rounded-lg space-y-4">
          <div>
            <h4 className="text-xs font-bold text-[#b4b4b4] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-450" />
              Regional Audience Distribution
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">Estimated query analysis per Bangladesh city hubs</p>
          </div>

          <div className="space-y-2.5">
            {cityData.length === 0 ? (
              <p className="text-zinc-650 text-xs text-center py-4 font-mono">No city distribution metrics logged.</p>
            ) : (
              cityData.map((data, index) => {
                const total = visitorLogs.length || 1;
                const pct = Math.round((data.count / total) * 100);
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium uppercase font-sans flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" /> {data.city}
                      </span>
                      <span className="font-mono text-zinc-400 font-semibold">{data.count} hits ({pct}%)</span>
                    </div>
                    <div className="w-full bg-zinc-900/90 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${
                          index === 0 ? 'from-[#00e194] to-emerald-500' :
                          index === 1 ? 'from-indigo-500 to-indigo-650' :
                          index === 2 ? 'from-blue-500 to-sky-400' : 'from-zinc-500 to-zinc-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity rows list */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          
          {/* List header search/filtering panel */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#161616] border border-white/5 p-3 rounded-lg">
            
            {/* Tab buttons */}
            <div className="flex items-center gap-1 shrink-0 bg-black/55 p-0.5 rounded border border-white/5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${activeTab === 'all' ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                All Logs ({visitorLogs.length})
              </button>
              <button
                onClick={() => setActiveTab('real')}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${activeTab === 'real' ? 'bg-[#003824] text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Real ({visitorLogs.filter(l => l.isReal).length})
              </button>
              <button
                onClick={() => setActiveTab('simulated')}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${activeTab === 'simulated' ? 'bg-indigo-950/45 text-indigo-400 border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Simulated ({visitorLogs.filter(l => !l.isReal).length})
              </button>
            </div>

            {/* Filter Search */}
            <div className="relative flex-1 max-w-xs self-stretch sm:self-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-550" />
              <input
                type="text"
                placeholder="Search visitor location or actions..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-indigo-500 rounded text-xs px-8 py-1.5 focus:outline-none text-zinc-200 placeholder-zinc-650"
              />
            </div>
          </div>

          {/* Actual Log entries list */}
          <div className="border border-white/5 rounded-lg bg-black/25 overflow-hidden">
            <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
              <AnimatePresence initial={false}>
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-10 font-mono text-zinc-600 text-xs">
                    No matching activity events log found in register.
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-sans"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Live pulsating dot or icon */}
                        <div className="mt-0.5">
                          {log.isReal ? (
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-505 bg-emerald-500 border border-black"></span>
                            </span>
                          ) : (
                            <span className="block h-2.5 w-2.5 rounded-full bg-indigo-500/70 border border-black"></span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-bold text-white uppercase tracking-tight">
                              {log.name || "Anonymous Visitor"}
                            </span>
                            {log.isReal && (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-1 py-0.2 rounded-xs uppercase font-bold font-mono">
                                Real Session
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-500 font-mono font-medium">
                              ({log.ip})
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1">
                            <Activity className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span className="text-zinc-300 font-medium font-sans">
                              {log.action}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Device meta */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 shrink-0 text-right sm:text-left self-start sm:self-auto pl-5 sm:pl-0">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase font-mono">
                          <MapPin className="w-3 h-3 text-zinc-550 shrink-0" />
                          <span className="truncate max-w-[120px]">{log.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase font-mono">
                          <Monitor className="w-3 h-3 text-zinc-550 shrink-0" />
                          <span>{log.device}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-550 font-mono">
                          <Clock className="w-3 h-3 text-zinc-650 shrink-0" />
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            
            {/* Quick status bar */}
            <div className="bg-[#111] p-2 px-3 border-t border-white/5 text-[10px] font-mono text-zinc-550 flex justify-between items-center">
              <span>LEDGER COMPLIANCE ENFORCED</span>
              <span>FEED RATE: 100% REAL-TIME SECURE LOG</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
