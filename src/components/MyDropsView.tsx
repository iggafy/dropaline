
import React, { useState } from 'react';
import {
    BarChart3,
    MessageSquare,
    Heart,
    Printer,
    ChevronRight,
    Send,
    MessageCircle,
    MoreVertical,
    BarChart
} from 'lucide-react';
import { Drop, Comment } from '../types';

interface MyDropsViewProps {
    drops: Drop[];
    onReply: (dropId: string, text: string) => void;
}

export const MyDropsView: React.FC<MyDropsViewProps> = ({ drops, onReply }) => {
    const [selectedDropId, setSelectedDropId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    const selectedDrop = drops.find(d => d.id === selectedDropId);

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDropId || !replyText.trim()) return;
        onReply(selectedDropId, replyText);
        setReplyText('');
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <header className="h-16 flex items-center px-8 border-b border-[#f2f2f2] shrink-0 justify-between">
                <h2 className="text-xl font-bold text-[#1d1d1f]">My Transmissions</h2>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Drops List */}
                <div className={`flex-1 overflow-y-auto ${selectedDropId ? 'hidden md:block' : 'block'}`}>
                    <div className="p-8 max-w-4xl mx-auto space-y-4">
                        {drops.length === 0 ? (
                            <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-dashed border-[#d1d1d6]">
                                <BarChart size={48} className="mx-auto text-[#d1d1d6]" />
                            </div>
                        ) : (
                            drops.map((drop) => {
                                // Determine printed count (this will be passed correctly from App.tsx)
                                const printedCount = drop.status === 'printed' ? 1 : 0; // Temporary logic, we'll refine stats in App.tsx

                                return (
                                    <div
                                        key={drop.id}
                                        onClick={() => setSelectedDropId(drop.id)}
                                        className={`group p-6 rounded-2xl border transition-all cursor-pointer ${selectedDropId === drop.id
                                            ? 'bg-[#f0f7ff] border-[#0066cc] shadow-md'
                                            : 'bg-white border-[#f2f2f2] hover:border-[#d1d1d6] hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-base font-bold text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors">
                                                    {drop.title}
                                                </h4>
                                                <p className="text-xs text-[#86868b] mt-1">
                                                    Relayed {new Date(drop.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <ChevronRight size={18} className={`transition-transform ${selectedDropId === drop.id ? 'rotate-90 text-[#0066cc]' : 'text-[#d1d1d6]'}`} />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Prints</span>
                                                <div className="flex items-center gap-2">
                                                    <Printer size={14} className="text-[#48484a]" />
                                                    <span className="text-sm font-bold text-[#1d1d1f]">{drop.printCount || 0}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Likes</span>
                                                <div className="flex items-center gap-2">
                                                    <Heart size={14} className="text-[#48484a]" />
                                                    <span className="text-sm font-bold text-[#1d1d1f]">{drop.likes}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Comments</span>
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare size={14} className="text-[#48484a]" />
                                                    <span className="text-sm font-bold text-[#1d1d1f]">{drop.comments}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Engagement Panel (Details) */}
                {selectedDropId && selectedDrop && (
                    <div className="w-full md:w-[450px] border-l border-[#f2f2f2] flex flex-col bg-[#fafafa] animate-in slide-in-from-right duration-300">
                        <header className="h-16 flex items-center justify-between px-6 border-b border-[#f2f2f2] bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedDropId(null)}
                                    className="md:hidden p-1 hover:bg-[#f5f5f7] rounded-full"
                                >
                                    <ChevronRight size={20} className="rotate-180" />
                                </button>
                                <h3 className="text-sm font-bold text-[#1d1d1f] truncate max-w-[200px]">{selectedDrop.title}</h3>
                            </div>
                            <button className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] rounded-lg">
                                <MoreVertical size={16} />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Analytics Summary */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-4 rounded-xl border border-[#e5e5e5] shadow-sm">
                                    <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Impact Radius</p>
                                    <p className="text-lg font-bold text-[#1d1d1f]">{(selectedDrop.likes + selectedDrop.comments) * 12}%</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-[#e5e5e5] shadow-sm">
                                    <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Local Reach</p>
                                    <p className="text-lg font-bold text-[#1d1d1f]">{selectedDrop.likes + 1} devices</p>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-[#86868b] uppercase tracking-wider border-b border-[#e5e5e5] pb-2">
                                    <MessageCircle size={12} />
                                    Network Feedback ({selectedDrop.commentList?.length || 0})
                                </div>

                                <div className="space-y-4">
                                    {selectedDrop.commentList && selectedDrop.commentList.length > 0 ? (
                                        selectedDrop.commentList.map((comment) => (
                                            <div key={comment.id} className="bg-white p-4 rounded-xl border border-[#e5e5e5] shadow-sm space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-[#0066cc]">@{comment.authorHandle}</span>
                                                    <span className="text-[10px] text-[#86868b]">{new Date(comment.timestamp).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-[#48484a] leading-relaxed">{comment.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 opacity-50">
                                            <p className="text-xs font-medium text-[#86868b]">No comments yet on this drop.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reply Input */}
                        <div className="p-6 bg-white border-t border-[#f2f2f2]">
                            <form onSubmit={handleReply} className="relative">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Send a direct transmission back..."
                                    className="w-full bg-[#f5f5f7] rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc] min-h-[100px] resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!replyText.trim()}
                                    className="absolute right-3 bottom-3 p-2 bg-black text-white rounded-full hover:bg-black/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
