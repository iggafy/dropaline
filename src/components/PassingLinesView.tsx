
import React, { useState, useEffect } from 'react';
import { Creator } from '../types';
import { UserPlus, Check, RotateCcw } from 'lucide-react';

interface PassingLinesProps {
    creators: Creator[];
    onToggleFollow: (id: string) => void;
    onRefreshInfo?: () => void;
}

export const PassingLinesView: React.FC<PassingLinesProps> = ({ creators, onToggleFollow, onRefreshInfo }) => {
    // Basic rotation logic: show random 8 or rotate over time
    const [displayIndex, setDisplayIndex] = useState(0);
    const visibleCount = 8;

    // Auto-rotate every 10 seconds? User said "rotate through 4 corners". 
    // I'll implement a grid of 8 that refreshes or scrolls.

    const visibleCreators = creators.slice(displayIndex, displayIndex + visibleCount);

    // If we run out, loop
    const displayCreators = visibleCreators.length < visibleCount
        ? [...visibleCreators, ...creators.slice(0, visibleCount - visibleCreators.length)]
        : visibleCreators;

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayIndex(prev => (prev + 4) % Math.max(creators.length, 1));
        }, 8000);
        return () => clearInterval(interval);
    }, [creators.length]);

    return (
        <div className="h-full overflow-y-auto bg-[var(--primary-bg)] p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold font-serif mb-4">Passing Lines</h1>
                    <p className="text-xl opacity-60">A parade of active writers. Follow the ones that call to you.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayCreators.map((creator, i) => (
                        <div
                            key={`${creator.id}-${i}`} // Use index key to handle duplicates if looping
                            className="group relative aspect-[3/4] bg-[var(--secondary-bg)] rounded-2xl p-6 flex flex-col items-center justify-between border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-xl transition-all duration-500 animate-fadeIn"
                        >
                            <div className="flex flex-col items-center w-full">
                                <div className="relative w-24 h-24 mb-4">
                                    <img
                                        src={creator.avatar}
                                        alt={creator.name}
                                        className="w-full h-full rounded-full object-cover border-4 border-[var(--primary-bg)] shadow-md group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {creator.isFollowing && (
                                        <div className="absolute -bottom-2 -right-2 bg-[var(--accent-color)] text-white p-1.5 rounded-full shadow-sm">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-center leading-tight mb-1">{creator.name}</h3>
                                <p className="text-sm opacity-60 text-center mb-4">@{creator.handle}</p>
                                <p className="text-sm text-center line-clamp-3 opacity-80 italic">"{creator.bio || 'Just dropping a line...'}"</p>
                            </div>

                            <button
                                onClick={() => onToggleFollow(creator.id)}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${creator.isFollowing
                                    ? 'bg-transparent border border-[var(--accent-color)] text-[var(--text-main)]'
                                    : 'bg-[var(--text-main)] text-[var(--primary-bg)] hover:opacity-90 shadow-lg hover:shadow-xl hover:-translate-y-1'
                                    }`}
                            >
                                {creator.isFollowing ? (
                                    <>Following</>
                                ) : (
                                    <>
                                        <UserPlus size={16} />
                                        Follow
                                    </>
                                )}
                            </button>
                        </div>
                    ))}

                    {creators.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <RotateCcw className="animate-spin mx-auto mb-4 opacity-30" />
                            <p className="opacity-50">Syncing writers...</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
