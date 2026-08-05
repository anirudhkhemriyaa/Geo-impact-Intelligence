'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Globe, 
  Database, 
  Settings, 
  Shield, 
  Network, 
  Users, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: BarChart3, href: '/' },
  { label: 'Analyze Event', icon: Zap, href: '/analyze' },
  { label: 'Intelligence Graph', icon: Network, href: '/graph' },
  { label: 'Evidence', icon: FileText, href: '/evidence' },
  { label: 'Entities', icon: Users, href: '/entities' },
  { label: 'Reports', icon: Shield, href: '/reports' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={`bg-white border-r border-border h-screen sticky top-0 transition-all duration-300 flex flex-col z-50 ${collapsed ? 'w-20' : 'w-sidebar'}`}
    >
      <div className="h-header flex items-center px-6 border-b border-border justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <span className="font-black text-sm tracking-tight text-foreground uppercase">GeoImpact</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center mx-auto">
            <Globe size={18} className="text-white" />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground transition-colors absolute -right-3 top-[26px] bg-white border border-border shadow-sm z-10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                isActive 
                  ? 'bg-accent/5 text-accent font-semibold shadow-sm' 
                  : 'text-secondary-foreground hover:bg-secondary'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
              {isActive && !collapsed && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-5 bg-accent rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center gap-3 px-3 py-2">
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Nominal</span>
              </div>
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'p-3 hover:bg-secondary rounded-lg cursor-pointer transition-colors'}`}>
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-border flex items-center justify-center text-xs font-bold text-slate-600">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-foreground">John Doe</p>
              <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">Senior Analyst</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
