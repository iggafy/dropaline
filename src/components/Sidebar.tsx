
import React from 'react';
import {
  Inbox,
  PenTool,
  Users,
  Settings,
  FileText,
  Lock,
  BarChart3,
  Compass
} from 'lucide-react';
import { AppView, UserProfile } from '../types';

import logo from '../assets/logo.png';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  userProfile: UserProfile;
  unreadPrivateCount?: number;
}


export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userProfile, unreadPrivateCount = 0 }) => {
  const navItems = [
    { id: AppView.PASSING_LINES, label: 'Passing Lines', icon: Compass, colorClass: 'nav-icon-following' }, // Reusing following color style or new one
    { id: AppView.INBOX, label: 'Inbox', icon: Inbox, colorClass: 'nav-icon-inbox' },
    { id: AppView.WRITER, label: 'Writer', icon: PenTool, colorClass: 'nav-icon-writer' },
    { id: AppView.DRAFTS, label: 'Drafts', icon: FileText, colorClass: 'nav-icon-drafts' },
    { id: AppView.PRIVATE_DROPS, label: 'Private Lines', icon: Lock, colorClass: 'nav-icon-private', badge: unreadPrivateCount },
    { id: AppView.FOLLOWING, label: 'Following', icon: Users, colorClass: 'nav-icon-following' },
    { id: AppView.MY_DROPS, label: 'My Stats', icon: BarChart3, colorClass: 'nav-icon-stats' },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings, colorClass: 'nav-icon-settings' },
  ];

  const activeIndex = navItems.findIndex(item => item.id === currentView);

  return (
    <div className="w-72 h-full bg-[var(--sidebar-bg)] backdrop-blur-2xl border-r border-[var(--glass-border)] flex flex-col p-6 select-none sidebar-container">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <img src={logo} alt="Drop a Line" className="w-7 h-7 object-contain mix-blend-multiply dark:mix-blend-normal" />
      </div>

      {/* User Profile - Premium Style */}
      <div className="flex flex-col gap-4 mb-10 px-2 bg-[var(--text-main)]/[0.02] p-4 rounded-3xl border border-[var(--glass-border)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl shadow-black/10 ring-2 ring-[var(--card-bg)] ring-offset-2 ring-offset-black/5 bg-[var(--card-bg)] group cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => setView(AppView.SETTINGS)}>
            <img src={userProfile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-[var(--text-main)] tracking-tight">{userProfile.name}</h1>
            <span className="text-[11px] text-[var(--text-secondary)] font-semibold opacity-70">@{userProfile.handle}</span>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent mt-2"></div>
      </div>

      <div className="relative flex-1 flex flex-col gap-1">
        {/* Animated Active Pill */}
        <div
          className="sidebar-active-pill"
          style={{
            transform: `translateY(${Math.max(0, activeIndex) * 44}px)`,
            top: '0px',
            opacity: activeIndex === -1 ? 0 : 1
          }}
        />

        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`sidebar-nav-item ${currentView === item.id ? 'sidebar-nav-active' : ''}`}
          >
            <div className={`transition-all duration-300 ${currentView === item.id ? 'scale-110' : 'opacity-80'}`}>
              <item.icon
                size={18}
                className={currentView === item.id ? item.colorClass : 'text-[var(--text-secondary)]'}
                strokeWidth={currentView === item.id ? 2.5 : 2}
              />
            </div>

            <span className={`flex-1 text-sm transition-all duration-300 ${currentView === item.id ? 'font-bold tracking-tight' : 'font-medium'}`}>
              {item.label}
            </span>

            {item.badge && item.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black shadow-lg shadow-red-500/30 animate-pulse-subtle">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer Branding */}
      <div className="mt-auto pt-6 border-t border-[var(--glass-border)]">
        <div className="px-2 py-3 bg-[var(--text-main)]/[0.03] rounded-2xl flex items-center justify-between group cursor-default border border-transparent hover:border-[var(--glass-border)] transition-all">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25"></span>
            </div>
            <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.15em]">Relay Online</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-main)]/[0.05] group-hover:bg-[var(--text-main)]/[0.2] transition-colors"></div>
        </div>
      </div>
    </div>
  );
};

