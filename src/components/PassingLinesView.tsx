
import React, { useState, useEffect } from 'react';
import { Creator } from '../types';
import { UserPlus, X, Check, RotateCcw, Heart } from 'lucide-react';

interface PassingLinesProps {
    creators: Creator[];
    onToggleFollow: (id: string) => void;
    onRefreshInfo?: () => void;
}

export const PassingLinesView: React.FC<PassingLinesProps> = ({ creators, onToggleFollow, onRefreshInfo }) => {
    const [index, setIndex] = useState(0);
    const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

    // Filter out creators we've already acted on in this session (optional logic)
    // For now, just iterate through the list provided.

    // If we reach the end, what happens? 
    // We can loop, or show a "All caught up" message.
    // Let's loop for now but prioritizing unviewed?
    // Simple logic: Just show creators[index]. If index >= length, reset or show empty.

    useEffect(() => {
        // If creators change (e.g. initial load), text index might be out of bounds, but safe access checks handle it.
    }, [creators]);

    const handlePass = () => {
        setIndex(prev => (prev + 1) % Math.max(creators.length, 1));
    };

    const handleFollow = (id: string) => {
        onToggleFollow(id);
        setIndex(prev => (prev + 1) % Math.max(creators.length, 1));
    };

    const currentCreator = creators[index % (creators.length || 1)];

    if (!creators || creators.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full opacity-60">
                <RotateCcw className="animate-spin mb-4" />
                <p>Syncing writers...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center bg-[var(--primary-bg)] p-6 overflow-hidden">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold font-serif mb-2">Passing Lines</h1>
                <p className="opacity-60">Discover your next favorite writer.</p>
            </header>

            <div className="relative w-full max-w-md perspective-1000">
                <div
                    key={currentCreator.id}
                    className="bg-[var(--card-bg)] rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl border border-[var(--border-color)] transition-all animate-in fade-in zoom-in duration-300"
                >
                    <div className="relative mb-6">
                        <img
                            src={currentCreator.avatar}
                            alt={currentCreator.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary-bg)] shadow-lg"
                        />
                        {currentCreator.isFollowing && (
                            <div className="absolute bottom-0 right-0 bg-[var(--accent-color)] text-white p-2 rounded-full shadow-md">
                                <Check size={16} strokeWidth={3} />
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold mb-1">{currentCreator.name}</h2>
                    <p className="text-sm opacity-60 mb-6">@{currentCreator.handle}</p>

                    <p className="text-lg italic opacity-80 mb-8 min-h-[4.5rem] flex items-center justify-center">
                        "{currentCreator.bio || 'Just dropping a line...'}"
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button
                            onClick={handlePass}
                            className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-[var(--border-color)] text-[var(--text-secondary)] font-bold hover:bg-[var(--hover-bg)] active:scale-95 transition-all"
                        >
                            <X size={20} />
                            <span>Pass</span>
                        </button>

                        <button
                            onClick={() => handleFollow(currentCreator.id)}
                            className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all ${currentCreator.isFollowing
                                    ? 'bg-transparent border-2 border-[var(--accent-color)] text-[var(--text-main)]'
                                    : 'bg-[var(--text-main)] text-[var(--primary-bg)]'
                                }`}
                        >
                            {currentCreator.isFollowing ? (
                                <>
                                    <Check size={20} />
                                    <span>Following</span>
                                </>
                            ) : (
                                <>
                                    <Heart size={20} />
                                    <span>Follow</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <p className="mt-8 opacity-40 text-sm">Reviewing {index + 1} of {creators.length}</p>
        </div>
    );
};
