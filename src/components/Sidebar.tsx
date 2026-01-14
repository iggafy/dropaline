
import React from 'react';
import {
  Inbox,
  PenTool,
  Users,
  Settings,
  Layout
} from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  userProfile: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userProfile }) => {
  const navItems = [
    { id: AppView.READER, label: 'Reader', icon: Inbox },
    { id: AppView.WRITER, label: 'Writer', icon: PenTool },
    { id: AppView.FOLLOWING, label: 'Following', icon: Users },
    { id: AppView.MY_DROPS, label: 'My Drops', icon: Layout },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-full bg-[#ebebeb]/80 backdrop-blur-xl border-r border-[#d1d1d6] flex flex-col p-4 select-none">
      {/* User Profile Snippet */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#d1d1d6] shadow-sm bg-white flex items-center justify-center p-1.5">
          <img src="./logo.png" alt="Logo" className="w-full object-contain" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-[#1d1d1f] leading-tight">Drop a Line</h1>
          <span className="text-[11px] text-[#86868b] font-medium">@{userProfile.handle}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${currentView === item.id
              ? 'bg-black/5 text-[#1d1d1f] shadow-sm'
              : 'text-[#48484a] hover:bg-black/5'
              }`}
          >
            <item.icon size={18} className={currentView === item.id ? 'text-black' : 'text-[#86868b]'} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-[#d1d1d6]">
        <div className="px-3 py-2 text-[10px] font-bold text-[#86868b] uppercase tracking-widest flex items-center justify-between">
          <span>Relay Status</span>
          <div className="flex items-center gap-1.5 text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            Online
          </div>
        </div>
      </div>
    </div>
  );
};
