
import React, { useState } from 'react';
import { UserPlus, Search, AtSign, UserCheck, X, Printer } from 'lucide-react';
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

  const following = creators.filter(c => c.isSubscribed);

  // Search logic: If searching, show all in 'creators' (which App filters for us)
  const searchResults = searchQuery.trim() === '' ? [] : creators;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="h-24 flex flex-col justify-center px-8 border-b border-[#f2f2f2] bg-white z-10 shrink-0">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className="text-xl font-bold text-[#1d1d1f]">Subscriptions</h2>

          {/* Search Input */}
          <div className="relative group w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] transition-colors group-focus-within:text-[#1d1d1f]">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter a handle (e.g. @writer) to connect..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#f5f5f7] rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5 transition-all placeholder-[#86868b]"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); onSearch(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] p-1"
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
                <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-dashed border-[#d1d1d6]">
                  <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4 text-[#86868b]">
                    <AtSign size={32} />
                  </div>
                  <h4 className="text-base font-semibold text-[#1d1d1f]">No creator found</h4>
                  <p className="text-sm text-[#86868b] mt-1">
                    We couldn't find anyone with the handle "@{searchQuery}".<br />Check the spelling or ask them for their DropaLine link.
                  </p>
                </div>
              )}
            </section>
          ) : (
            /* Default State: My Subscriptions */
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-widest">
                  Your Network
                </h3>
                <span className="text-[10px] font-bold text-[#86868b] bg-[#f5f5f7] px-2 py-1 rounded-md">
                  {following.length} FOLLOWING
                </span>
              </div>

              {following.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="text-center py-24 px-4 bg-white rounded-2xl">
                  <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6 text-[#d1d1d6]">
                    <UserPlus size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">Build your physical feed</h3>
                  <p className="text-[#86868b] max-w-sm mx-auto leading-relaxed text-sm">
                    Connect with writers, artists, and thinkers by searching for their unique DropaLine handle above.
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
  <div className="flex items-center justify-between p-5 rounded-2xl border border-[#f2f2f2] bg-white shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-5">
      <div className="relative">
        <img src={creator.avatar} alt={creator.name} className="w-14 h-14 rounded-full border border-[#e5e5e5] object-cover bg-gray-100" />
        {creator.isSubscribed && (
          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white">
            <UserCheck size={10} />
          </div>
        )}
      </div>
      <div>
        <h4 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
          {creator.name}
          <span className="text-xs font-medium text-[#0066cc] bg-[#f0f7ff] px-1.5 py-0.5 rounded-md">
            @{creator.handle}
          </span>
        </h4>
        <p className="text-xs text-[#48484a] mt-1 line-clamp-1 max-w-[200px] sm:max-w-xs">{creator.bio}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] font-medium text-[#86868b]">{creator.subscriberCount.toLocaleString()} subscribers</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      {creator.isSubscribed && (
        <button
          onClick={onToggleAutoPrint}
          className={`p-2 rounded-full transition-all border ${creator.autoPrint
              ? 'bg-green-500 text-white border-green-600 shadow-md'
              : 'bg-white text-[#86868b] border-[#e5e5e5] hover:bg-[#f5f5f7]'
            }`}
          title={creator.autoPrint ? "Auto-print enabled" : "Enable auto-print"}
        >
          <Printer size={14} />
        </button>
      )}

      <button
        onClick={onToggle}
        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${creator.isSubscribed
            ? 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5e5] border border-transparent'
            : 'bg-black text-white hover:bg-black/80 hover:scale-105 shadow-lg shadow-black/10'
          }`}
      >
        {creator.isSubscribed ? 'Following' : 'Follow'}
      </button>
    </div>
  </div>
);
