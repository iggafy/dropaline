
import React, { useState } from 'react';
import { Printer, Shield, Cloud, Camera, User, RefreshCw, Calendar, Clock, Play } from 'lucide-react';
import { PrinterState, UserProfile } from '../types';

interface SettingsViewProps {
  printer: PrinterState;
  setPrinter: React.Dispatch<React.SetStateAction<PrinterState>>;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  paperSaver: boolean;
  setPaperSaver: (value: boolean) => void;
  // Batching Props
  batching: string;
  setBatching: (value: string) => void;
  customDate: string;
  setCustomDate: (value: string) => void;
  customTime: string;
  setCustomTime: (value: string) => void;
  onProcessBatch: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  printer, 
  setPrinter, 
  userProfile, 
  setUserProfile,
  paperSaver,
  setPaperSaver,
  batching,
  setBatching,
  customDate,
  setCustomDate,
  customTime,
  setCustomTime,
  onProcessBatch
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Temporary profile state for editing mode
  const [tempProfile, setTempProfile] = useState(userProfile);

  const saveProfile = () => {
    setUserProfile(tempProfile);
    setIsEditingProfile(false);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <header className="h-16 flex items-center px-8 border-b border-[#f2f2f2] shrink-0">
        <h2 className="text-xl font-bold text-[#1d1d1f]">Settings</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-8 w-full bg-[#fafafa]">
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
          
          {/* Profile Section */}
          <section className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f2f2f2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#86868b]" />
                <h3 className="text-sm font-bold text-[#1d1d1f]">Public Profile</h3>
              </div>
              {isEditingProfile ? (
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={() => {
                       setTempProfile(userProfile); // Reset
                       setIsEditingProfile(false);
                     }}
                     className="px-3 py-1 text-xs font-semibold text-[#86868b] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={saveProfile}
                     className="px-3 py-1 text-xs font-semibold bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
                   >
                     Save Changes
                   </button>
                 </div>
              ) : (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-3 py-1 text-xs font-semibold text-[#0066cc] hover:bg-[#f0f7ff] rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            <div className="p-8 flex items-start gap-8">
               {/* Avatar */}
               <div className="relative group shrink-0">
                 <div className="w-24 h-24 rounded-full overflow-hidden border border-[#d1d1d6]">
                   <img src={isEditingProfile ? tempProfile.avatar : userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 {isEditingProfile && (
                   <button className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                     <Camera size={24} />
                   </button>
                 )}
               </div>

               {/* Inputs */}
               <div className="flex-1 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1">Display Name</label>
                     <input 
                       type="text" 
                       value={isEditingProfile ? tempProfile.name : userProfile.name}
                       disabled={!isEditingProfile}
                       onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                       className={`w-full text-sm font-medium text-[#1d1d1f] bg-transparent border-b ${isEditingProfile ? 'border-[#d1d1d6] focus:border-black' : 'border-transparent'} py-1 focus:outline-none transition-colors`}
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1">Handle</label>
                     <div className="flex items-center">
                        <span className="text-sm text-[#86868b] mr-0.5">@</span>
                        <input 
                          type="text" 
                          value={isEditingProfile ? tempProfile.handle : userProfile.handle}
                          disabled={!isEditingProfile}
                          onChange={(e) => setTempProfile({...tempProfile, handle: e.target.value})}
                          className={`w-full text-sm font-medium text-[#1d1d1f] bg-transparent border-b ${isEditingProfile ? 'border-[#d1d1d6] focus:border-black' : 'border-transparent'} py-1 focus:outline-none transition-colors`}
                        />
                     </div>
                   </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1">Bio</label>
                    <textarea 
                      value={isEditingProfile ? tempProfile.bio : userProfile.bio}
                      disabled={!isEditingProfile}
                      onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
                      rows={2}
                      className={`w-full text-sm text-[#48484a] bg-transparent border ${isEditingProfile ? 'border-[#d1d1d6] p-2 rounded-lg focus:border-black' : 'border-transparent p-0'} resize-none focus:outline-none transition-all`}
                    />
                 </div>
               </div>
            </div>
          </section>

          {/* Printer Config */}
          <section>
            <div className="flex items-center gap-2 mb-4 px-2">
              <Printer size={18} className="text-[#86868b]" />
              <h3 className="text-sm font-bold text-[#1d1d1f]">Local Printer Connection</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1d1d1f]">{printer.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`w-1.5 h-1.5 rounded-full ${printer.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                     <p className="text-xs text-[#86868b]">{printer.isConnected ? 'Ready to print' : 'Offline'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#f5f5f7] rounded-full text-[10px] font-bold text-[#86868b] border border-[#ebebeb]">
                  DEFAULT
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Options */}
          <section>
             <div className="flex items-center gap-2 mb-4 px-2">
              <Cloud size={18} className="text-[#86868b]" />
              <h3 className="text-sm font-bold text-[#1d1d1f]">Cloud Relay & Preferences</h3>
            </div>
            <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm overflow-hidden">
              <div className="flex flex-col border-b border-[#f2f2f2]">
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-medium text-[#1d1d1f]">Drop Batching</p>
                    <p className="text-[11px] text-[#86868b] mt-0.5">Queue drops to print at a specific time.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Manual Batch Trigger */}
                    {batching !== 'Instant' && (
                       <button 
                         onClick={onProcessBatch}
                         className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-wide rounded-md hover:bg-black/80 transition-all mr-2"
                         title="Force processing of queued drops now"
                       >
                         <Play size={10} className="fill-current" /> Run Batch
                       </button>
                    )}
                    
                    <div className="relative">
                      <select 
                        value={batching}
                        onChange={(e) => setBatching(e.target.value)}
                        className="appearance-none bg-[#f5f5f7] hover:bg-[#ebebeb] text-xs font-semibold text-[#1d1d1f] py-2 pl-3 pr-8 rounded-lg cursor-pointer transition-colors focus:outline-none"
                      >
                        <option value="Instant">Instant</option>
                        <option value="Daily">Daily at 8:00 AM</option>
                        <option value="Weekly">Weekly on Sundays</option>
                        <option value="Custom">Custom Schedule</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#86868b]">
                        <RefreshCw size={12} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Custom Date/Time Picker */}
                {batching === 'Custom' && (
                  <div className="px-5 pb-5 pt-0 bg-[#fbfbfd] border-t border-[#f2f2f2] animate-in slide-in-from-top-2 fade-in">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-2">
                          <Calendar size={12} /> Date
                        </label>
                        <input 
                          type="date"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="w-full bg-white border border-[#d1d1d6] rounded-lg px-3 py-2 text-sm text-[#1d1d1f] focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-2">
                          <Clock size={12} /> Time
                        </label>
                        <input 
                          type="time"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="w-full bg-white border border-[#d1d1d6] rounded-lg px-3 py-2 text-sm text-[#1d1d1f] focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-medium text-[#1d1d1f]">Paper Conservation</p>
                  <p className="text-[11px] text-[#86868b] mt-0.5">Format content to use less paper (e.g., smaller fonts).</p>
                </div>
                <div 
                   onClick={() => setPaperSaver(!paperSaver)}
                   className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${paperSaver ? 'bg-green-500' : 'bg-[#e5e5e5]'}`}
                 >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${paperSaver ? 'left-6' : 'left-1'}`}></div>
                 </div>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <div className="flex items-center gap-2 mb-4 px-2">
              <Shield size={18} className="text-[#86868b]" />
              <h3 className="text-sm font-bold text-[#1d1d1f]">Privacy & Security</h3>
            </div>
            <div className="bg-[#fff1f0] p-5 rounded-2xl border border-[#ffdcd9] flex gap-4">
               <Shield size={20} className="text-red-500 shrink-0 mt-0.5" />
               <div>
                 <h4 className="text-xs font-bold text-red-700 mb-1">End-to-End Encryption Active</h4>
                 <p className="text-[11px] text-red-600/80 leading-relaxed font-medium">
                   Your printer's address is hidden behind our relay. Only creators you strictly allow can send data packets to your device.
                 </p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
