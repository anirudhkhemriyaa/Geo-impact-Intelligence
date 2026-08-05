'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  Clock, 
  Info, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  Bookmark,
  Share2
} from 'lucide-react';
import GraphView from '@/components/GraphView';

const MOCK_NODES = [
  { id: 'event', impact_score: 0, order: 0 },
  { id: 'energy_supply', impact_score: -72, order: 1 },
  { id: 'oil_prices', impact_score: -85, order: 2 },
  { id: 'maritime_costs', impact_score: -60, order: 1 },
  { id: 'defense_sector', impact_score: 45, order: 2 },
];

const MOCK_EDGES = [
  { source: 'event', target: 'energy_supply', type: 'Direct' },
  { source: 'energy_supply', target: 'oil_prices', type: 'Causal' },
  { source: 'event', target: 'maritime_costs', type: 'Direct' },
  { source: 'event', target: 'defense_sector', type: 'Direct' },
];

export default function AnalyzeEventPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* 1. TOP_EVENT_SUMMARY_BAR */}
      <div className="analyst-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-xl flex items-center justify-center font-black">
             H
          </div>
          <div className="space-y-1">
             <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-foreground tracking-tight">Red Sea Shipping Crisis</h1>
                <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-black uppercase rounded">Critical Severity</span>
             </div>
             <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-semibold">
                <span className="flex items-center gap-1.5"><Globe size={12} /> Middle East / Global Trade</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> Last updated: 4m ago</span>
                <span className="flex items-center gap-1.5 text-accent"><ShieldCheck size={12} /> Confidence: 92%</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"><Bookmark size={18} /></button>
           <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"><Share2 size={18} /></button>
           <div className="w-px h-8 bg-border mx-1" />
           <button className="bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-accent/20">Generate Briefing</button>
        </div>
      </div>

      {/* 2. THREE_COLUMN_INTELLIGENCE_LAYOUT */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
        
        {/* LEFT_COLUMN: IMPACT_SUMMARY (25%) */}
        <div className="col-span-12 lg:col-span-3 space-y-6 overflow-y-auto pr-2">
           <section className="space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Impact Vectors</h3>
              <div className="space-y-3">
                 {[
                   { label: 'Energy Markets', impact: 'Negative', score: -82, desc: 'High vulnerability due to choke point proximity.' },
                   { label: 'Retail Logistics', impact: 'Negative', score: -45, desc: 'Increased lead times for EU retailers.' },
                   { label: 'Defense Sector', impact: 'Positive', score: 24, desc: 'Increased demand for maritime escort services.' },
                 ].map((v, i) => (
                   <div key={i} className="analyst-card p-4">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-foreground">{v.label}</span>
                         <span className={`text-xs font-black ${v.score > 0 ? 'text-success' : 'text-destructive'}`}>
                           {v.score > 0 ? '+' : ''}{v.score}
                         </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{v.desc}</p>
                   </div>
                 ))}
              </div>
           </section>

           <section className="analyst-card p-5 space-y-4 bg-secondary/50">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Confidence Metrics</h3>
              <div className="space-y-4">
                 <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                       <span>Source Diversity</span>
                       <span>94%</span>
                    </div>
                    <div className="h-1 bg-white rounded-full"><div className="h-full bg-success w-[94%]" /></div>
                 </div>
                 <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                       <span>Causal Depth</span>
                       <span>72%</span>
                    </div>
                    <div className="h-1 bg-white rounded-full"><div className="h-full bg-accent w-[72%]" /></div>
                 </div>
              </div>
           </section>
        </div>

        {/* MIDDLE_COLUMN: GRAPH_HERO (50%) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col min-h-0">
           <div className="analyst-card flex-1 relative overflow-hidden flex flex-col bg-white">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white z-10">
                 <div className="flex items-center gap-4">
                    <div className="flex bg-secondary p-1 rounded-lg">
                       {['Graph', 'Timeline', 'Map'].map(t => (
                         <button 
                           key={t}
                           onClick={() => setActiveTab(t.toLowerCase())}
                           className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                             activeTab === t.toLowerCase() ? 'bg-white shadow text-foreground' : 'text-muted-foreground'
                           }`}
                         >
                           {t}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground"><Maximize2 size={14} /></button>
                 </div>
              </div>
              
              <div className="flex-1 relative">
                 <GraphView nodes={MOCK_NODES} edges={MOCK_EDGES} />
                 
                 {/* Legend Overlay */}
                 <div className="absolute top-6 left-6 analyst-card p-3 bg-white/80 backdrop-blur pointer-events-none">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-accent" />
                          <span className="text-[10px] font-bold text-foreground">Root Event</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-destructive" />
                          <span className="text-[10px] font-bold text-foreground">Negative Impact</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-success" />
                          <span className="text-[10px] font-bold text-foreground">Positive Impact</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="px-6 py-3 border-t border-border bg-secondary/30 flex items-center justify-between text-[10px]">
                 <div className="flex items-center gap-4 text-muted-foreground">
                    <span>Nodes: 5</span>
                    <span>Edges: 4</span>
                    <span>Density: 0.82</span>
                 </div>
                 <span className="font-mono text-muted-foreground">ENGINE: causal_v4_stable</span>
              </div>
           </div>
        </div>

        {/* RIGHT_COLUMN: EVIDENCE_PANEL (25%) */}
        <div className="col-span-12 lg:col-span-3 space-y-4 overflow-y-auto pl-2">
           <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Evidence & Reasoning</h3>
           <div className="space-y-4">
              {[
                { 
                  title: 'Energy Supply Chain', 
                  impact: -85, 
                  evidence: 'Lloyds List Intelligence reports 40% reduction in vessel transit through Bab-el-Mandeb.',
                  chain: ['Conflict', 'Shipping Obstruction', 'Fuel Price Spike']
                },
                { 
                  title: 'Retail Inventory Risk', 
                  impact: -32, 
                  evidence: 'Maersk indicates rerouting via Cape of Good Hope adds 10-14 days to EU transit.',
                  chain: ['Transit Lag', 'Logistics Bottleneck', 'Inflationary Margin']
                }
              ].map((item, i) => (
                <div key={i} className="analyst-card relative p-0 overflow-hidden">
                   <div className="p-4 bg-secondary/10 border-b border-border">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className="text-[11px] font-black text-foreground uppercase tracking-tight">{item.title}</h4>
                         <span className="text-destructive font-black text-xs">{item.impact}</span>
                      </div>
                      <div className="flex gap-1">
                        {item.chain.map((c, ic) => (
                          <React.Fragment key={ic}>
                            <span className="text-[8px] font-bold text-muted-foreground uppercase">{c}</span>
                            {ic < item.chain.length - 1 && <ChevronRight size={8} className="text-border mt-0.5" />}
                          </React.Fragment>
                        ))}
                      </div>
                   </div>
                   <div className="p-4 space-y-3">
                      <p className="text-[11px] text-muted-foreground italic leading-relaxed">"{item.evidence}"</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-[9px] font-black text-accent bg-accent/5 px-1.5 py-0.5 rounded">SOURCE: GDELT_V2</span>
                        <ExternalLink size={12} className="text-muted-foreground cursor-pointer" />
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="analyst-card p-4 border-dashed bg-secondary/10">
              <div className="flex items-center gap-3 text-muted-foreground mb-3">
                 <FileText size={16} />
                 <span className="text-xs font-bold">Raw Signal Feed</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">Real-time GDELT and Yahoo Finance data points are being streamed. Latest signal: Brent Crude @ $84.21 (+2.1%)</p>
           </div>
        </div>

      </div>
    </div>
  );
}
