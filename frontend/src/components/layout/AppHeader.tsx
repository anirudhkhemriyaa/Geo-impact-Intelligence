'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  Activity, 
  Clock, 
  ChevronDown,
  Monitor
} from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="h-header bg-white border-b border-border sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search events, entities, or intelligence reports (cmd+K)..."
            className="w-full bg-secondary border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Data Status */}
        <div className="hidden lg:flex items-center gap-6 h-full border-r border-border pr-6 mr-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">API HEALTH</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-success">
              <Activity size={12} />
              <span>99.9% / 24ms</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">DATA FRESHNESS</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-accent">
              <Clock size={12} />
              <span>LIVE / 2M AGO</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive border-2 border-white rounded-full" />
          </button>
          
          <div className="h-6 w-px bg-border mx-1" />
          
          <div className="flex items-center gap-2 pl-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
               <Monitor size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground leading-none mb-0.5">INTEL_NODE_01</span>
              <span className="text-[9px] text-muted-foreground uppercase font-black">Admin View</span>
            </div>
            <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
