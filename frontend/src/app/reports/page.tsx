'use client';

import React from 'react';
import { 
  Shield, 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  Plus,
  BarChart2,
  Lock
} from 'lucide-react';

const REPORTS = [
  { id: 'INT-2026-042', title: 'Maritime Risk Assessment: Red Sea Corridors', date: 'May 20, 2026', classification: 'SECRET', author: 'AI_ANALYST_01' },
  { id: 'INT-2026-039', title: 'Semiconductor Supply Chain Vulnerability', date: 'May 18, 2026', classification: 'CONFIDENTIAL', author: 'J_DOE' },
  { id: 'INT-2026-035', title: 'Energy Market Volatility: Middle East Nexus', date: 'May 15, 2026', classification: 'TOP SECRET', author: 'S_SMITH' },
];

export default function ReportsPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[28px] font-black tracking-tight text-foreground uppercase">Intelligence Reports</h2>
          <p className="text-sm text-secondary-foreground font-medium">Archived briefings and institutional impact summaries.</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20">
          <Plus size={16} />
          Create Intelligence Brief
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="analyst-card p-6 bg-white border-l-4 border-accent">
           <BarChart2 className="text-accent mb-4" size={24} />
           <p className="text-2xl font-black text-foreground">42</p>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Briefs Published (Q2)</p>
        </div>
        <div className="analyst-card p-6 bg-white border-l-4 border-destructive">
           <Lock className="text-destructive mb-4" size={24} />
           <p className="text-2xl font-black text-foreground">12</p>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Classified (TS/SCI)</p>
        </div>
        <div className="analyst-card p-6 bg-white border-l-4 border-success">
           <FileText className="text-success mb-4" size={24} />
           <p className="text-2xl font-black text-foreground">89%</p>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Verification Rate</p>
        </div>
      </div>

      <div className="analyst-card overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/50 flex justify-between items-center">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input type="text" placeholder="Search report ID or title..." className="bg-white border border-border rounded-lg py-2 pl-9 pr-4 text-xs w-64" />
           </div>
        </div>

        <div className="divide-y divide-border">
           {REPORTS.map(report => (
             <div key={report.id} className="p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors group">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent">
                      <Shield size={24} />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <span className="text-[9px] font-black text-muted-foreground font-mono">{report.id}</span>
                         <h4 className="text-sm font-black text-foreground">{report.title}</h4>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
                         <span className="text-destructive">{report.classification}</span>
                         <span>•</span>
                         <span>{report.date}</span>
                         <span>•</span>
                         <span>{report.author}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground"><Download size={18} /></button>
                   <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground"><ExternalLink size={18} /></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
