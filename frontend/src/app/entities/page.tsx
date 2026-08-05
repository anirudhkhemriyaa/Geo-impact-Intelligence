'use client';

import React from 'react';
import { 
  Users, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  ArrowUpRight,
  Shield,
  Activity,
  Globe
} from 'lucide-react';

const ENTITIES = [
  { id: '1', name: 'Global Oil Markets', category: 'Commodity', exposure: 'High', impact: -85, trend: 'Down' },
  { id: '2', name: 'Lockheed Martin', category: 'Industry', exposure: 'Moderate', impact: 24, trend: 'Up' },
  { id: '3', name: 'Maersk Logistics', category: 'Corporation', exposure: 'Extreme', impact: -62, trend: 'Down' },
  { id: '4', name: 'Suez Canal Authority', category: 'Infrastructure', exposure: 'High', impact: -50, trend: 'Stable' },
  { id: '5', name: 'European Tech Index', category: 'Index', exposure: 'Low', impact: -12, trend: 'Down' },
];

export default function EntitiesPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[28px] font-black tracking-tight text-foreground">Entity Intelligence</h2>
          <p className="text-sm text-secondary-foreground">Monitoring risk exposure and impact across global actors.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input 
              type="text" 
              placeholder="Filter entities..."
              className="bg-white border border-border rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:border-accent transition-all">
            <Filter size={14} />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="analyst-card p-5 bg-white space-y-4">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Top Exposure</span>
              <Activity size={14} className="text-accent" />
           </div>
           <p className="text-2xl font-black text-foreground">Maersk Logistics</p>
           <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive text-[9px] font-black rounded">EXTREME EXPOSURE</span>
           </div>
        </div>
        <div className="analyst-card p-5 bg-white space-y-4">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dominant Category</span>
              <Globe size={14} className="text-success" />
           </div>
           <p className="text-2xl font-black text-foreground">Energy Infrastructure</p>
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Across 14 active events</p>
        </div>
        <div className="analyst-card p-5 bg-white space-y-4">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Protection Matrix</span>
              <Shield size={14} className="text-accent" />
           </div>
           <p className="text-2xl font-black text-foreground">Aero/Defense</p>
           <div className="flex items-center gap-2 text-success font-bold text-xs">
              <TrendingUp size={12} /> Positive Hedge +12%
           </div>
        </div>
      </div>

      <div className="analyst-card overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-border">
              <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Entity Name</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Category</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Risk Exposure</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Impact Delta</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Confidence</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ENTITIES.map((entity) => (
              <tr key={entity.id} className="hover:bg-secondary/30 transition-colors group">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-accent/5 flex items-center justify-center text-accent">
                         <Users size={16} />
                      </div>
                      <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{entity.name}</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-xs font-semibold text-secondary-foreground">{entity.category}</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 text-[9px] font-black rounded uppercase ${
                    entity.exposure === 'Extreme' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                  }`}>
                    {entity.exposure}
                  </span>
                </td>
                <td className={`px-6 py-5 text-xs font-black ${entity.impact > 0 ? 'text-success' : 'text-destructive'}`}>
                  {entity.impact > 0 ? '+' : ''}{entity.impact}
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-secondary rounded-full overflow-hidden">
                         <div className="h-full bg-accent w-[88%]" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground">88%</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                   <ArrowUpRight size={16} className="text-border group-hover:text-accent transition-colors ml-auto cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
