'use client';

import React from 'react';
import { 
  FileText, 
  Search, 
  ExternalLink, 
  Filter, 
  Database, 
  Link as LinkIcon,
  ShieldCheck,
  Download,
  MoreVertical,
  Activity
} from 'lucide-react';

const SOURCES = [
  { id: '1', title: 'GDELT Project Event Feed', category: 'Raw News', reliability: 82, freshness: '2m ago', signals: 1420 },
  { id: '2', title: 'Yahoo Finance Market Data', category: 'Market Data', reliability: 98, freshness: 'Live', signals: 45 },
  { id: '3', title: 'UN ReliefWeb Disaster Updates', category: 'Official Report', reliability: 94, freshness: '1h ago', signals: 12 },
  { id: '4', title: 'Lloyds List Intelligence', category: 'Maritime Intel', reliability: 96, freshness: '15m ago', signals: 89 },
];

export default function EvidencePage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[28px] font-black tracking-tight text-foreground uppercase">Evidence & Sources</h2>
          <p className="text-sm text-secondary-foreground font-medium">Underlying data provenance and signal verification logs.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20">
            <Database size={16} />
            Ingest Signal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR: DATA_HEALTH */}
        <div className="lg:col-span-1 space-y-6">
           <div className="analyst-card p-6 space-y-6">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Source Reliability Matrix</h3>
              <div className="space-y-4">
                 {[
                   { label: 'OSINT', value: 78, color: 'bg-accent' },
                   { label: 'Market Streams', value: 96, color: 'bg-success' },
                   { label: 'Official Gov', value: 92, color: 'bg-accent' },
                   { label: 'Satellite', value: 85, color: 'bg-success' },
                 ].map(s => (
                   <div key={s.label} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold">
                         <span>{s.label}</span>
                         <span>{s.value}%</span>
                      </div>
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                         <div className={`h-full ${s.color} w-[${s.value}%]`} style={{ width: `${s.value}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="analyst-card p-6 bg-secondary/30 space-y-4 border-dashed">
              <div className="flex items-center gap-2 text-foreground">
                 <Activity size={16} />
                 <span className="text-[10px] font-black uppercase">Ingestion Log</span>
              </div>
              <div className="space-y-3 font-mono text-[9px] text-muted-foreground">
                 <p className="leading-tight border-l-2 border-accent pl-2">[14:42] GDELT_V2 Polling Success: 42 new signals</p>
                 <p className="leading-tight border-l-2 border-success pl-2">[14:40] Yahoo_Finance Sync: 12 symbols updated</p>
                 <p className="leading-tight border-l-2 border-border pl-2">[14:35] AlphaV_API: Rate limit check passed</p>
              </div>
           </div>
        </div>

        {/* MAIN: SOURCE_LIST */}
        <div className="lg:col-span-3 space-y-4">
           <div className="flex items-center justify-between mb-2">
              <div className="flex gap-4">
                 {['Archive', 'Live Streams', 'Verified Only'].map(t => (
                   <button key={t} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
                      {t}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              {SOURCES.map(source => (
                <div key={source.id} className="analyst-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent group">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all">
                         <FileText size={24} />
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-3">
                            <h4 className="text-sm font-black text-foreground">{source.title}</h4>
                            <span className="text-[9px] font-bold bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{source.category}</span>
                         </div>
                         <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
                            <span className="flex items-center gap-1"><LinkIcon size={12} /> Source ID: {source.id}</span>
                            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Reliability Index: {source.reliability}%</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-8">
                      <div className="flex flex-col items-end">
                         <span className="text-[9px] font-black text-muted-foreground uppercase">Live Signals</span>
                         <span className="text-sm font-black text-foreground">{source.signals.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[9px] font-black text-muted-foreground uppercase">Last Sync</span>
                         <span className="text-sm font-black text-accent">{source.freshness}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground"><Download size={18} /></button>
                         <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground"><ExternalLink size={18} /></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="p-8 analyst-card bg-secondary/10 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-4">
              <Database className="text-border" size={32} />
              <div className="space-y-1">
                 <p className="text-xs font-bold text-foreground">Archive Storage Utilization</p>
                 <p className="text-[10px] text-muted-foreground">8.2TB / 12TB institutional tier capacity.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
