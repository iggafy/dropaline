
import React, { useState } from 'react';
import { UserPlus, Search, AtSign, UserCheck, X, Printer, Users } from 'lucide-react';
import { Creator } from '../types';

interface SubscriptionsViewProps {
  creators: Creator[];
  onToggleSubscription: (id: string) => void;
  onToggleAutoPrint: (id: string) => void;
  onSearch: (query: string) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  creators,
  onToggleSubscription,
  onToggleAutoPrint,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  const following = creators.filter(c => c.isFollowing);

  // Search logic: If searching, show all in 'creators' (which App filters for us)
  const searchResults = searchQuery.trim() === '' ? [] : creators;

  return (
    <div className="h-full flex flex-col bg-[var(--primary-bg)] overflow-hidden text-[var(--text-main)]">
      {/* Header */}
      <header className="h-24 flex flex-col justify-center px-8 border-b border-[var(--border-main)] bg-[var(--primary-bg)] z-10 shrink-0">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className="text-xl font-bold text-[var(--text-main)]">Following</h2>

          {/* Search Input */}
          <div className="relative group w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--text-main)]">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Find writers to follow..."
              className="w-full pl-10 pr-10 py-2.5 bg-[var(--text-main)]/[0.05] rounded-xl text-sm focus:outline-none focus:bg-[var(--card-bg)] focus:ring-2 focus:ring-[var(--accent-blue)]/10 transition-all placeholder:[var(--text-secondary)] text-[var(--text-main)]"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); onSearch(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-main)] p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 w-full">
        <div className="max-w-3xl mx-auto">
          {/* Search Results State */}
          {searchQuery ? (
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-widest mb-6">
                Search Results
              </h3>

              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map(creator => (
                    <CreatorCard
                      key={creator.id}
                      creator={creator}
                      onToggle={() => onToggleSubscription(creator.id)}
                      onToggleAutoPrint={() => onToggleAutoPrint(creator.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[var(--card-bg)] rounded-3xl border border-dashed border-[var(--border-main)] shadow-sm">
                  <div className="w-16 h-16 bg-[var(--text-main)]/[0.05] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-secondary)]">
                    <AtSign size={32} />
                  </div>
                  <h4 className="text-base font-semibold text-[var(--text-main)]">No creator found</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    We couldn't find anyone with the handle "@{searchQuery}".<br />Check the spelling or ask them for their Drop a Line link.
                  </p>
                </div>
              )}
            </section>
          ) : (
            /* Default State: My Subscriptions */
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  Your Network
                </h3>
                <span className="text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--text-main)]/[0.05] px-2 py-1 rounded-md">
                  {following.length} FOLLOWING
                </span>
              </div>

              {following.length > 0 ? (
                <div className="space-y-4">
                  {following.map(creator => (
                    <CreatorCard
                      key={creator.id}
                      creator={creator}
                      onToggle={() => onToggleSubscription(creator.id)}
                      onToggleAutoPrint={() => onToggleAutoPrint(creator.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[var(--card-bg)] rounded-3xl border border-dashed border-[var(--border-main)] shadow-sm">
                  <div className="w-16 h-16 bg-[var(--text-main)]/[0.05] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-secondary)]">
                    <Users size={32} />
                  </div>
                  <h4 className="text-base font-semibold text-[var(--text-main)]">Your network is empty</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Connect with writers, artists, and thinkers by searching for their unique Drop a Line handle above.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const CreatorCard: React.FC<{ creator: Creator; onToggle: () => void; onToggleAutoPrint: () => void }> = ({ creator, onToggle, onToggleAutoPrint }) => (
  <div className="flex items-center justify-between p-5 rounded-2xl border border-[var(--border-main)] bg-[var(--card-bg)] shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-5">
      <div className="relative">
        <img
          src={creator.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${creator.handle}`}
          alt={creator.name}
          className="w-14 h-14 rounded-full border border-[var(--border-main)] object-cover bg-[var(--primary-bg)]"
        />
        {creator.isFollowing && (
          <div className="absolute -bottom-1 -right-1 bg-[var(--accent-green)] text-white p-0.5 rounded-full border-2 border-[var(--card-bg)]">
            <UserCheck size={10} />
          </div>
        )}
      </div>
      <div>
        <h4 className="text-base font-bold text-[var(--text-main)] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          {creator.name}
          <span className="text-xs font-medium text-[var(--accent-blue)] bg-[var(--accent-blue)]/[0.1] px-1.5 py-0.5 rounded-md w-fit">
            @{creator.handle}
          </span>
        </h4>
        <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 max-w-[200px] sm:max-w-xs">{creator.bio}</p>

        {/* Social Links Sub-row */}
        {creator.socialLinks && creator.socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {creator.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent-blue)] hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent-blue)]/[0.1] flex items-center justify-center">
                  <AtSign size={8} />
                </div>
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] font-medium text-[var(--text-secondary)]">{creator.followerCount.toLocaleString()} followers</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      {creator.isFollowing && (
        <button
          onClick={onToggleAutoPrint}
          className={`p-2 rounded-full transition-all border ${creator.autoPrint
            ? 'bg-[var(--accent-green)] text-white border-[var(--accent-green)] shadow-md'
            : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border-main)] hover:bg-[var(--text-main)]/[0.05]'
            }`}
          title={creator.autoPrint ? "Auto-print enabled" : "Enable auto-print"}
        >
          <Printer size={14} />
        </button>
      )}

      <button
        onClick={onToggle}
        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${creator.isFollowing
          ? 'bg-[var(--text-main)]/[0.05] text-[var(--text-main)] hover:bg-[var(--text-main)]/[0.1] border border-transparent'
          : 'bg-[var(--text-main)] text-[var(--card-bg)] hover:opacity-90 hover:scale-105 shadow-lg shadow-black/10'
          }`}
      >
        {creator.isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  </div>
);
