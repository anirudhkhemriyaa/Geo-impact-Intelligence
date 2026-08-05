'use client';

import React from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Zap, 
  Lock, 
  Eye, 
  Cloud,
  ChevronRight
} from 'lucide-react';

const SETTINGS_SECTIONS = [
  { group: 'Account', items: [
    { label: 'Profile Intelligence', icon: User, desc: 'Manage your analyst credentials and hierarchy permissions.' },
    { label: 'System Access', icon: Lock, desc: 'API key management and institutional access control.' }
  ]},
  { group: 'Preferences', items: [
    { label: 'Alert Configurations', icon: Bell, desc: 'Configure severity thresholds for real-time signal notifications.' },
    { label: 'Visualization Engine', icon: Eye, desc: 'Customize graph rendering and spatial layout defaults.' }
  ]},
  { group: 'Infrastructure', items: [
    { label: 'Data Sources (GDELT)', icon: Database, desc: 'Manage external signal ingestion feeds and rate limits.' },
    { label: 'LLM Reasoning Config', icon: Zap, desc: 'Configure primary and fallback model traversal depths.' }
  ]}
];

export default function SettingsPage() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-10">
      <div className="space-y-2">
        <h2 className="text-[28px] font-black tracking-tight text-foreground uppercase">System Settings</h2>
        <p className="text-sm text-secondary-foreground font-medium">Global configuration for the GeoImpact Intelligence Terminal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-4">
           {['General', 'Security', 'Data & Ingestion', 'Integration', 'System Status'].map((cat, i) => (
             <button 
               key={cat} 
               className={`w-full text-left px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                 i === 0 ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white border border-border text-muted-foreground hover:bg-secondary'
               }`}
             >
               {cat}
             </button>
           ))}
           
           <div className="analyst-card p-6 bg-secondary/30 mt-8 border-dashed space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                 <Cloud size={14} />
                 <span className="text-[10px] font-black uppercase">Infrastructure</span>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-foreground">v1.2.4-STABLE</p>
                 <p className="text-[9px] text-muted-foreground">Region: us-east-1 (Internal)</p>
              </div>
           </div>
        </div>

        <div className="md:col-span-8 space-y-10">
           {SETTINGS_SECTIONS.map((section) => (
             <section key={section.group} className="space-y-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{section.group}</h3>
                <div className="divide-y divide-border analyst-card overflow-hidden">
                   {section.items.map((item, i) => (
                     <div key={i} className="p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-6">
                           <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all">
                              <item.icon size={20} />
                           </div>
                           <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-border group-hover:text-accent transition-colors" />
                     </div>
                   ))}
                </div>
             </section>
           ))}

           <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                 <Shield size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">Enterprise Danger Zone</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                 <button className="flex-1 py-3 px-6 bg-white border border-destructive text-destructive text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-destructive hover:text-white transition-all">Reset Analysis Cache</button>
                 <button className="flex-1 py-3 px-6 bg-destructive text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/20">Decommission Node</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
