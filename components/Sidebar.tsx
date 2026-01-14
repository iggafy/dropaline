
import React from 'react';
import { 
  Inbox, 
  PenTool, 
  Users, 
  Settings, 
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
    { id: AppView.SUBSCRIPTIONS, label: 'Follows', icon: Users },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-full bg-[#ebebeb]/80 backdrop-blur-xl border-r border-[#d1d1d6] flex flex-col p-4 select-none">
      {/* User Profile Snippet */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#d1d1d6] shadow-sm">
          <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
           <h1 className="text-sm font-semibold text-[#1d1d1f] leading-tight">DropaLine</h1>
           <span className="text-[11px] text-[#86868b] font-medium">@{userProfile.handle}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <p className="px-2 text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-2">Main</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${
              currentView === item.id 
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
        <div className="px-3 py-2 text-[11px] text-[#86868b] flex items-center justify-between">
          <span>Connected</span>
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        </div>
      </div>
    </div>
  );
};
