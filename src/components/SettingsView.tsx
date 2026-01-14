
import React, { useState } from 'react';
import { Printer, Shield, Cloud, Camera, User, RefreshCw, Calendar, Clock, Play, LogOut, Sun, Moon, Monitor, Info, Link as LinkIcon, Globe, ExternalLink, Plus, Trash2, X } from 'lucide-react';
import { PrinterState, UserProfile } from '../types';

interface SettingsViewProps {
  printer: PrinterState;
  setPrinter: React.Dispatch<React.SetStateAction<PrinterState>>;
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  onAvatarUpload: (file: File) => void;
  doubleSided: boolean;
  setDoubleSided: (value: boolean) => void;
  // Batching Props
  batching: string;
  setBatching: (value: string) => void;
  customDate: string;
  setCustomDate: (value: string) => void;
  customTime: string;
  setCustomTime: (value: string) => void;
  onProcessBatch: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  availablePrinters?: any[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  printer,
  setPrinter,
  userProfile,
  onProfileUpdate,
  onAvatarUpload,
  doubleSided,
  setDoubleSided,
  batching,
  setBatching,
  customDate,
  setCustomDate,
  customTime,
  setCustomTime,
  onProcessBatch,
  onLogout,
  onDeleteAccount,
  availablePrinters = []
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Local profile state for staging changes before save
  const [tempProfile, setTempProfile] = useState(userProfile);

  const saveProfile = () => {
    onProfileUpdate(tempProfile);
    setIsEditingProfile(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarUpload(e.target.files[0]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--primary-bg)] overflow-hidden text-[var(--text-main)]">
      <header className="h-16 flex items-center px-8 border-b border-[var(--border-main)] shrink-0 bg-[var(--primary-bg)]">
        <h2 className="text-xl font-bold text-[var(--text-main)]">Settings</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-8 w-full bg-[var(--primary-bg)]">
        <div className="max-w-2xl mx-auto space-y-8 pb-12">

          {/* Profile Section */}
          <section className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-main)] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[var(--border-main)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[var(--text-secondary)]" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">Public Profile</h3>
              </div>
              {isEditingProfile ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTempProfile(userProfile); // Reset
                      setIsEditingProfile(false);
                    }}
                    className="px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--text-main)]/[0.05] rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="px-3 py-1 text-xs font-semibold bg-[var(--text-main)] text-[var(--card-bg)] rounded-lg hover:opacity-90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTempProfile(userProfile);
                    setIsEditingProfile(true);
                  }}
                  className="px-3 py-1 text-xs font-semibold text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/[0.1] rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="p-8 flex items-start gap-8">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-[var(--border-main)] bg-[var(--primary-bg)]">
                  <img
                    src={(isEditingProfile ? tempProfile.avatar : userProfile.avatar) || `https://api.dicebear.com/7.x/shapes/svg?seed=${userProfile.handle}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center text-white transition-opacity rounded-full ${isEditingProfile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <Camera size={24} />
                </button>
              </div>

              {/* Inputs */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Display Name</label>
                    <input
                      type="text"
                      value={isEditingProfile ? tempProfile.name : userProfile.name}
                      disabled={!isEditingProfile}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      className={`w-full text-sm font-medium text-[var(--text-main)] bg-transparent border-b ${isEditingProfile ? 'border-[var(--text-secondary)] focus:border-[var(--text-main)]' : 'border-transparent'} py-1 focus:outline-none transition-colors`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Handle</label>
                    <div className="flex items-center">
                      <span className="text-sm text-[var(--text-secondary)] mr-0.5">@</span>
                      <input
                        type="text"
                        value={isEditingProfile ? tempProfile.handle : userProfile.handle}
                        disabled={!isEditingProfile}
                        onChange={(e) => setTempProfile({ ...tempProfile, handle: e.target.value })}
                        className={`w-full text-sm font-medium text-[var(--text-main)] bg-transparent border-b ${isEditingProfile ? 'border-[var(--border-main)] focus:border-[var(--text-main)]' : 'border-transparent'} py-1 focus:outline-none transition-colors`}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Bio</label>
                  <textarea
                    value={isEditingProfile ? tempProfile.bio : userProfile.bio}
                    disabled={!isEditingProfile}
                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                    rows={2}
                    className={`w-full text-sm text-[var(--text-main)] bg-transparent border ${isEditingProfile ? 'border-[var(--border-main)] p-2 rounded-lg focus:border-[var(--text-main)]' : 'border-transparent p-0'} resize-none focus:outline-none transition-all`}
                  />
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-[var(--border-main)]">
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Social & Support Links</label>
                  <div className="space-y-2">
                    {(isEditingProfile ? tempProfile.socialLinks : userProfile.socialLinks)?.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[var(--text-main)]/[0.05] p-2 rounded-xl group transition-all">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Globe size={14} className="text-[var(--text-secondary)] shrink-0" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-[11px] font-bold text-[var(--text-main)] truncate">{link.label}</span>
                            <span className="text-[10px] text-[var(--accent-blue)] hover:underline cursor-pointer truncate" onClick={() => window.open(link.url, '_blank')}>{link.url}</span>
                          </div>
                        </div>
                        {isEditingProfile && (
                          <button
                            onClick={() => {
                              const newLinks = [...(tempProfile.socialLinks || [])];
                              newLinks.splice(idx, 1);
                              setTempProfile({ ...tempProfile, socialLinks: newLinks });
                            }}
                            className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}

                    {isEditingProfile && (
                      <div className="flex flex-col gap-2 p-3 border border-dashed border-[var(--border-main)] rounded-xl bg-[var(--text-main)]/[0.02]">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Label (e.g. Patreon)"
                            id="newLinkLabel"
                            className="text-[11px] bg-[var(--card-bg)] border border-[var(--border-main)] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[var(--text-main)] text-[var(--text-main)]"
                          />
                          <input
                            type="text"
                            placeholder="URL"
                            id="newLinkUrl"
                            className="text-[11px] bg-[var(--card-bg)] border border-[var(--border-main)] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[var(--text-main)] text-[var(--text-main)]"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const labelEl = document.getElementById('newLinkLabel') as HTMLInputElement;
                            const urlEl = document.getElementById('newLinkUrl') as HTMLInputElement;
                            if (labelEl.value && urlEl.value) {
                              setTempProfile({
                                ...tempProfile,
                                socialLinks: [...(tempProfile.socialLinks || []), { label: labelEl.value, url: urlEl.value }]
                              });
                              labelEl.value = '';
                              urlEl.value = '';
                            }
                          }}
                          className="flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--text-main)] text-[var(--card-bg)] rounded-lg hover:opacity-90 transition-colors"
                        >
                          <Plus size={12} /> Add Link
                        </button>
                      </div>
                    )}
                    {!isEditingProfile && (!userProfile.socialLinks || userProfile.socialLinks.length === 0) && (
                      <p className="text-[10px] text-[var(--text-secondary)] italic">No social links added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Printer Config */}
          <section>
            <div className="flex items-center gap-2 mb-4 px-2">
              <Printer size={18} className="text-[var(--text-secondary)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Local Printer Connection</h3>
            </div>
            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-main)] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-main)]">
                    Printer Status
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${printer.isConnected ? 'bg-[var(--accent-green)]' : 'bg-[var(--accent-pink)]'}`}></span>
                    <p className="text-xs text-[var(--text-secondary)]">{printer.isConnected ? 'Ready to print' : 'Offline'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[var(--text-main)] text-[var(--card-bg)] rounded-full text-[10px] font-bold border border-[var(--border-main)] uppercase tracking-widest">
                  {printer.name === 'SAVE_AS_PDF' ? 'Digital PDF' : 'Active Device'}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Select Output Device</label>
                <div className="grid grid-cols-1 gap-2">
                  {/* PDF OPTION */}
                  <button
                    onClick={() => setPrinter({ ...printer, name: 'SAVE_AS_PDF', isConnected: true })}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${printer.name === 'SAVE_AS_PDF'
                      ? 'bg-[var(--accent-blue)]/[0.05] border-[var(--accent-blue)] ring-1 ring-[var(--accent-blue)]'
                      : 'bg-[var(--text-main)]/[0.05] border-transparent hover:border-[var(--border-main)]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Cloud size={16} className={printer.name === 'SAVE_AS_PDF' ? 'text-[var(--accent-blue)]' : 'text-[var(--text-secondary)]'} />
                      <div>
                        <p className={`text-xs font-bold ${printer.name === 'SAVE_AS_PDF' ? 'text-[var(--accent-blue)]' : 'text-[var(--text-main)]'}`}>Digital PDF</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">Opens system save dialog</p>
                      </div>
                    </div>
                  </button>

                  {/* HARDWARE PRINTERS */}
                  {availablePrinters.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => setPrinter({ ...printer, name: p.name, isConnected: true })}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${printer.name === p.name
                        ? 'bg-[var(--accent-blue)]/[0.05] border-[var(--accent-blue)] ring-1 ring-[var(--accent-blue)]'
                        : 'bg-[var(--text-main)]/[0.05] border-transparent hover:border-[var(--border-main)]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Printer size={16} className={printer.name === p.name ? 'text-[#0066cc]' : 'text-[#86868b]'} />
                        <div>
                          <p className={`text-xs font-bold ${printer.name === p.name ? 'text-[var(--accent-blue)]' : 'text-[var(--text-main)]'}`}>{p.name}</p>
                          <p className="text-[10px] text-[var(--text-secondary)]">{p.status === 0 ? 'Ready' : 'In Use'}</p>
                        </div>
                      </div>
                      {p.isDefault && <span className="text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--card-bg)] px-2 py-0.5 rounded border border-[var(--border-main)]">SYSTEM DEFAULT</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section >

          {/* Delivery Options */}
          < section >
            <div className="flex items-center gap-2 mb-4 px-2">
              <Cloud size={18} className="text-[var(--text-secondary)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Cloud Relay & Preferences</h3>
            </div>
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-main)] shadow-sm overflow-hidden">
              <div className="flex flex-col border-b border-[var(--border-main)]">
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-main)]">Drop Batching</p>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Queue drops to print at a specific time.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Manual Batch Trigger */}
                    {batching !== 'Instant' && (
                      <button
                        onClick={onProcessBatch}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--text-main)] text-[var(--card-bg)] text-[10px] font-bold uppercase tracking-wide rounded-md hover:opacity-90 transition-all mr-2"
                        title="Force processing of queued drops now"
                      >
                        <Play size={10} className="fill-current" /> Run Batch
                      </button>
                    )}

                    <div className="relative">
                      <select
                        value={batching}
                        onChange={(e) => onProfileUpdate({ ...userProfile, batchMode: e.target.value as any })}
                        className="appearance-none bg-[var(--accent-blue)]/[0.08] hover:bg-[var(--accent-blue)]/[0.15] text-xs font-bold text-[var(--accent-blue)] py-2 pl-3 pr-8 rounded-lg cursor-pointer transition-colors focus:outline-none border border-[var(--accent-blue)]/20 shadow-sm"
                      >
                        <option value="Instant" className="bg-[var(--card-bg)] text-[var(--text-main)]">Instant</option>
                        <option value="Daily" className="bg-[var(--card-bg)] text-[var(--text-main)]">Daily at 8:00 AM</option>
                        <option value="Weekly" className="bg-[var(--card-bg)] text-[var(--text-main)]">Weekly on Sundays</option>
                        <option value="Custom" className="bg-[var(--card-bg)] text-[var(--text-main)]">Custom Schedule</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--accent-blue)]">
                        <RefreshCw size={12} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Date/Time Picker */}
                {batching === 'Custom' && (
                  <div className="px-5 pb-5 pt-0 bg-[var(--primary-bg)] border-t border-[var(--border-main)] animate-in slide-in-from-top-2 fade-in">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                          <Calendar size={12} /> Date
                        </label>
                        <input
                          type="date"
                          value={customDate}
                          onChange={(e) => onProfileUpdate({ ...userProfile, batchDate: e.target.value })}
                          className="w-full bg-[var(--card-bg)] border border-[var(--border-main)] rounded-lg px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                          <Clock size={12} /> Time
                        </label>
                        <input
                          type="time"
                          value={customTime}
                          onChange={(e) => onProfileUpdate({ ...userProfile, batchTime: e.target.value })}
                          className="w-full bg-[var(--card-bg)] border border-[var(--border-main)] rounded-lg px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-5 border-t border-[var(--border-main)]">
                <div>
                  <p className="text-sm font-medium text-[var(--text-main)]">Duplex Output</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Enable double-sided printing (Duplex) if supported by your device.</p>
                </div>
                <div
                  onClick={() => onProfileUpdate({ ...userProfile, doubleSided: !doubleSided })}
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-all border-2 ${doubleSided ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)]' : 'bg-[var(--text-main)]/[0.1] border-[var(--border-main)]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all ${doubleSided ? 'left-5' : 'left-0.5'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 border-t border-[var(--border-main)]">
                <div>
                  <p className="text-sm font-medium text-[var(--text-main)]">Print Color Mode</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Select your preferred output color.</p>
                </div>
                <div className="flex bg-[var(--text-main)]/[0.05] p-1 rounded-lg border border-[var(--border-main)]">
                  <button
                    onClick={() => onProfileUpdate({ ...userProfile, printColorMode: 'bw' })}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${userProfile.printColorMode === 'bw' ? 'bg-[var(--accent-blue)] text-white shadow-lg shadow-[var(--accent-blue)]/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
                  >
                    B&W
                  </button>
                  <button
                    onClick={() => onProfileUpdate({ ...userProfile, printColorMode: 'color' })}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${userProfile.printColorMode !== 'bw' ? 'bg-[var(--accent-blue)] text-white shadow-lg shadow-[var(--accent-blue)]/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
                  >
                    Color
                  </button>
                </div>
              </div>
            </div>
          </section >

          {/* Display & Theme */}
          < section >
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg">
                <Sun size={16} />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">Display & Appearance</h3>
            </div>
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-main)] shadow-sm p-5">
              <p className="text-sm font-medium text-[var(--text-main)] mb-3">Theme Preference</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onProfileUpdate({ ...userProfile, theme: t.id as any });
                    }}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${userProfile.theme === t.id
                      ? 'bg-[var(--accent-blue)]/[0.1] border-[var(--accent-blue)] text-[var(--accent-blue)] ring-1 ring-[var(--accent-blue)]'
                      : 'bg-[var(--primary-bg)] border-transparent text-[var(--text-secondary)] hover:border-[var(--border-main)]'
                      }`}
                  >
                    <t.icon size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section >

          {/* Privacy */}
          < section >
            <div className="flex items-center gap-2 mb-4 px-2">
              <Shield size={18} className="text-[var(--text-secondary)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Privacy & Security</h3>
            </div>
            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-main)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-main)]">Private Lines</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Allow incoming secure transmissions</p>
                </div>
                <button
                  onClick={() => onProfileUpdate({ ...userProfile, allowPrivateDrops: userProfile.allowPrivateDrops === false ? true : false })}
                  className={`w-11 h-6 rounded-full relative transition-all border-2 ${userProfile.allowPrivateDrops !== false ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)]' : 'bg-[var(--text-main)]/[0.1] border-[var(--border-main)]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-md ${userProfile.allowPrivateDrops !== false ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="bg-[var(--text-main)]/[0.02] rounded-xl p-4 border border-[var(--border-main)] animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Trusted Handles</label>
                  <span className="text-[9px] text-[var(--text-secondary)]">Allowed even if disabled</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {(userProfile.privateLineExceptions || [])?.map(handle => (
                    <div key={handle} className="flex items-center gap-1.5 bg-[var(--card-bg)] border border-[var(--border-main)] px-2 py-1 rounded-lg text-xs font-medium text-[var(--text-main)]">
                      @{handle}
                      <button
                        onClick={() => {
                          const newExceptions = (userProfile.privateLineExceptions || []).filter(h => h !== handle);
                          onProfileUpdate({ ...userProfile, privateLineExceptions: newExceptions });
                        }}
                        className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-500/10"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {(!userProfile.privateLineExceptions || userProfile.privateLineExceptions.length === 0) && (
                    <p className="text-[10px] text-[var(--text-secondary)] italic">No trusted handles added.</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-[var(--card-bg)] border border-[var(--border-main)] rounded-lg px-2 py-1">
                    <span className="text-[var(--text-secondary)] text-xs">@</span>
                    <input
                      type="text"
                      placeholder="handle"
                      className="w-full text-xs font-medium focus:outline-none ml-0.5 bg-transparent text-[var(--text-main)]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim().replace(/[@,]/g, '');
                          if (val && !(userProfile.privateLineExceptions || []).includes(val)) {
                            const newExceptions = [...(userProfile.privateLineExceptions || []), val];
                            onProfileUpdate({ ...userProfile, privateLineExceptions: newExceptions });
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.includes(',')) {
                          const parts = val.split(',').map(p => p.trim().replace('@', '')).filter(p => p);
                          const current = userProfile.privateLineExceptions || [];
                          const newAdded = parts.filter(p => !current.includes(p));
                          if (newAdded.length > 0) {
                            onProfileUpdate({
                              ...userProfile,
                              privateLineExceptions: [...current, ...newAdded]
                            });
                          }
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-[var(--text-secondary)]">Use commas or Enter to add</p>
                </div>
              </div>
            </div>
          </section >

          {/* Software Updates */}
          <section>
            <div className="flex items-center gap-2 mb-4 px-2">
              <RefreshCw size={18} className="text-[var(--text-secondary)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Software Updates</h3>
            </div>
            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-main)] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-main)]">Application version</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">DROP A LINE V1.0.7</p>
                </div>
                <button
                  onClick={async () => {
                    if ((window as any).electron?.checkUpdates) {
                      const success = await (window as any).electron.checkUpdates();
                      if (success) alert('Checking for updates...');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--text-main)] text-[var(--card-bg)] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-sm"
                >
                  <RefreshCw size={12} />
                  Check for Updates
                </button>
              </div>

              <div className="p-4 bg-[var(--text-main)]/[0.03] rounded-xl border border-[var(--border-main)]">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-[var(--accent-blue)]" />
                  <p className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-wider">Independent Software Notice</p>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Drop a Line is an open-source protocol built for freedom. Because we do not use corporate certificates (Apple/Microsoft), you may see security warnings during installation.
                  <br /><br />
                  This is a <strong>feature</strong> of our independence. To trust the app, windows users click "More Info" → "Run Anyway". Mac users go to "System Settings" → "Privacy & Security" → "Open Anyway".
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://github.com/iggafy/dropaline/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--accent-blue)] hover:underline"
                  >
                    <ExternalLink size={12} /> Official Releases
                  </a>
                  <a
                    href="https://github.com/iggafy/dropaline"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-secondary)] hover:underline"
                  >
                    <Globe size={12} /> Source Code
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Account Management */}
          < section className="pt-8 border-t border-[var(--border-main)]" >
            <div className="space-y-3">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-[var(--text-secondary)] bg-[var(--text-main)]/[0.05] hover:bg-[var(--text-main)]/[0.1] rounded-xl border border-[var(--border-main)] transition-all w-full justify-center shadow-sm"
              >
                <LogOut size={18} />
                Log Out
              </button>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full text-center py-2 text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--accent-pink)] transition-colors uppercase tracking-widest"
                >
                  Delete Account...
                </button>
              ) : (
                <div className="bg-[var(--accent-pink)]/10 border border-[var(--accent-pink)]/20 rounded-xl p-4 animate-in slide-in-from-bottom-2 fade-in">
                  <p className="text-[10px] font-bold text-[var(--accent-pink)] uppercase tracking-wider mb-3 text-center">
                    Warning: This will permanently delete your profile, all drops, and comments.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-main)] text-[var(--text-main)] rounded-lg text-xs font-bold hover:bg-[var(--text-main)]/[0.05]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onDeleteAccount}
                      className="flex-1 px-4 py-2 bg-[var(--accent-pink)] text-white rounded-lg text-xs font-bold hover:opacity-90 shadow-sm"
                    >
                      Permenantly Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[10px] text-center text-[#86868b] mt-4 uppercase tracking-[0.2em]">
              DROP A LINE V1.0.0
            </p>
          </section >
        </div >
      </div >
    </div >
  );
};
