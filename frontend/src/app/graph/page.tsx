'use client';

import React, { useState } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Save, 
  Share2, 
  Filter, 
  Download,
  Layers,
  Search,
  Settings2,
  Database,
  History
} from 'lucide-react';
import GraphView from '@/components/GraphView';

const MOCK_NODES = [
  { id: 'event', impact_score: 0, order: 0 },
  { id: 'energy_supply', impact_score: -72, order: 1 },
  { id: 'oil_prices', impact_score: -85, order: 2 },
  { id: 'maritime_costs', impact_score: -60, order: 1 },
  { id: 'defense_sector', impact_score: 45, order: 2 },
  { id: 'insurance_premiums', impact_score: -30, order: 2 },
  { id: 'port_efficiency', impact_score: -45, order: 1 },
  { id: 'commodity_volatility', impact_score: -15, order: 3 },
];

const MOCK_EDGES = [
  { source: 'event', target: 'energy_supply', type: 'Direct' },
  { source: 'energy_supply', target: 'oil_prices', type: 'Causal' },
  { source: 'event', target: 'maritime_costs', type: 'Direct' },
  { source: 'event', target: 'defense_sector', type: 'Direct' },
  { source: 'maritime_costs', target: 'insurance_premiums', type: 'Secondary' },
  { source: 'event', target: 'port_efficiency', type: 'Direct' },
  { source: 'oil_prices', target: 'commodity_volatility', type: 'Causal' },
];

export default function InteractiveGraphPage() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className={`flex flex-col ${fullscreen ? 'fixed inset-0 z-[100] bg-white p-6' : 'h-full space-y-6'}`}>
      {/* 1. GRAPH_TOOLBAR */}
      <div className="analyst-card px-6 py-4 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-6">
           <div className="space-y-1">
              <h2 className="text-lg font-black text-foreground tracking-tight uppercase flex items-center gap-2">
                 <History size={16} className="text-accent" />
                 Interactive Intelligence Graph
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                 <span>Active Node: none</span>
                 <span>•</span>
                 <span>Context: global_causality_core</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="flex items-center bg-secondary p-1 rounded-lg mr-4">
              <button className="p-1.5 px-3 bg-white shadow rounded text-[10px] font-black text-foreground uppercase">2D View</button>
              <button className="p-1.5 px-3 text-[10px] font-black text-muted-foreground uppercase">3D Path</button>
           </div>
           
           <div className="flex items-center gap-1">
              {[
                { icon: Filter, label: 'Filters' },
                { icon: Layers, label: 'Layers' },
                { icon: Search, label: 'Refine' },
                { icon: Download, label: 'Export' },
              ].map(tool => (
                <button key={tool.label} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all flex items-center gap-2 group">
                   <tool.icon size={16} className="group-hover:text-accent" />
                   <span className="text-[10px] font-bold uppercase tracking-tight hidden lg:block">{tool.label}</span>
                </button>
              ))}
           </div>

           <div className="w-px h-6 bg-border mx-2" />
           <button 
              onClick={() => setFullscreen(!fullscreen)}
              className="p-2 hover:bg-accent hover:text-white rounded-lg text-muted-foreground transition-all"
           >
              {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
           </button>
        </div>
      </div>

      {/* 2. GRAPH_CANVAS_AREA */}
      <div className="flex-1 min-h-0 flex gap-6">
         {/* LEFT_FILTER_SIDEBAR */}
         <div className="w-64 bg-white border border-border rounded-xl p-6 space-y-8 hidden lg:flex flex-col shadow-sm">
            <section className="space-y-4">
               <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Visibility Filters</h3>
               <div className="space-y-3">
                  {['Causal Chains', 'Direct Effects', 'Secondary Vectors', 'Risk Heatmap'].map(f => (
                    <div key={f} className="flex items-center justify-between">
                       <span className="text-xs font-semibold text-foreground">{f}</span>
                       <div className="w-8 h-4 bg-accent rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full shadow" />
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            <section className="space-y-4">
               <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weight Threshold</h3>
               <div className="h-1 bg-secondary rounded-full relative">
                  <div className="absolute left-0 top-0 h-full w-2/3 bg-accent rounded-full" />
                  <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-accent rounded-full shadow-lg" />
               </div>
               <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                  <span>SKEPTICAL</span>
                  <span>AGGRESSIVE</span>
               </div>
            </section>

            <div className="flex-1" />

            <div className="analyst-card p-4 bg-secondary/50 border-dashed space-y-3">
               <div className="flex items-center gap-2 text-accent">
                  <Database size={14} />
                  <span className="text-[10px] font-black uppercase">Graph Database Status</span>
               </div>
               <p className="text-[9px] text-muted-foreground italic leading-relaxed">
                  Deeply traversal enabled. Traversing 3 orders of magnitude in Neo4j production cluster.
               </p>
            </div>
         </div>

         {/* MAIN_GRAPH_CENTER */}
         <div className="flex-1 analyst-card relative bg-white overflow-hidden p-0 border-none shadow-none">
            <GraphView nodes={MOCK_NODES} edges={MOCK_EDGES} />
            
            {/* Graph Breadcrumbs */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur p-2 rounded-lg border border-border shadow-xl">
               <span className="text-[10px] font-bold text-muted-foreground uppercase px-2">Clusters</span>
               <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded uppercase">Energy_Nexus</span>
                  <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-[9px] font-black rounded uppercase">Maritime_Block</span>
               </div>
            </div>

            {/* Layout Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
               {[Settings2, Maximize2, Share2, Save].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-all shadow-xl">
                     <Icon size={18} />
                  </button>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
