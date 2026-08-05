'use client';

import React from 'react';
import { Info, History, ShieldAlert, ExternalLink, Filter } from 'lucide-react';

export default function ContextPanel() {
  return (
    <aside className="w-80 border-l border-border bg-secondary flex flex-col h-screen sticky top-0 overflow-y-auto hidden xl:flex">
      <div className="h-header flex items-center px-6 border-b border-border bg-white sticky top-0 z-10">
        <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
          <Info size={14} className="text-accent" />
          Intelligence Log
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Risk Alerts */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Critical Vectors</h4>
          {[
            { tag: 'ENERGY', risk: 'HIGH', label: 'Oil Supply Chain Contraction' },
            { tag: 'SECURITY', risk: 'CRITICAL', label: 'Cross-Strait Naval Activity' },
          ].map((item, i) => (
            <div key={i} className="analyst-card p-3 border-l-4 border-destructive">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-[9px] font-black bg-destructive/10 text-destructive px-1.5 py-0.5 rounded uppercase">{item.tag}</span>
                 <span className="text-[9px] font-bold text-destructive underline">{item.risk} RISK</span>
               </div>
               <p className="text-xs font-semibold text-foreground">{item.label}</p>
            </div>
          ))}
        </section>

        {/* Global Timeline */}
        <section className="space-y-4">
           <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Signal Timeline</h4>
              <Filter size={12} className="text-muted-foreground cursor-pointer" />
           </div>
           
           <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
              {[
                { time: '14:22', title: 'Carrier movement detected', desc: 'USS Ronald Reagan repositioning near TS-01' },
                { time: '13:05', title: 'Energy futures spike', desc: 'WTI Crude jumps 2.4% following supply warnings' },
                { time: '09:41', title: 'Satellite update received', desc: 'Updated imaging for Red Sea corridor finalized' }
              ].map((item, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-white bg-accent shadow-sm" />
                  <span className="text-[9px] font-mono text-muted-foreground block mb-1">{item.time} UTC</span>
                  <h5 className="text-[11px] font-bold text-foreground leading-tight mb-1">{item.title}</h5>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Export/Reports */}
        <button className="w-full py-4 bg-white border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2">
          <ExternalLink size={14} />
          Export Intelligence Briefing
        </button>
      </div>
    </aside>
  );
}
