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
    BarChart,
    Eye,
    X
} from 'lucide-react';
import { Drop, Comment, PrinterState } from '../types';
import { CommentItem } from './CommentItem';
import { DropPreview } from './DropPreview';

interface MyDropsViewProps {
    drops: Drop[];
    printer: PrinterState;
    onPrint: (id: string) => void;
    onReply: (dropId: string, text: string, parentId?: string) => void;
    onLikeComment: (dropId: string, commentId: string) => void;
}


export const MyDropsView: React.FC<MyDropsViewProps> = ({ drops, printer, onPrint, onReply, onLikeComment }) => {
    const [selectedDropId, setSelectedDropId] = useState<string | null>(null);
    const [previewDrop, setPreviewDrop] = useState<Drop | null>(null);
    const [replyText, setReplyText] = useState('');
    const [activeParentId, setActiveParentId] = useState<string | null>(null);

    const selectedDrop = drops.find(d => d.id === selectedDropId);

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDropId || !replyText.trim()) return;
        onReply(selectedDropId, replyText, activeParentId || undefined);
        setReplyText('');
        setActiveParentId(null);
    };

    const handleCommentReply = (handle: string, commentId: string) => {
        setReplyText(`@${handle} `);
        setActiveParentId(commentId);
        setTimeout(() => {
            document.getElementById('thread-input')?.focus();
        }, 0);
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <header className="h-16 flex items-center px-8 border-b border-[#f2f2f2] shrink-0 justify-between">
                <h2 className="text-xl font-bold text-[#1d1d1f]">My Lines</h2>
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
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewDrop(drop);
                                                    }}
                                                    className="p-1.5 rounded-full hover:bg-black/5 text-[#86868b] hover:text-[#0066cc] transition-all"
                                                    title="Preview document"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onPrint(drop.id);
                                                    }}
                                                    className="p-1.5 rounded-full hover:bg-black/5 text-[#86868b] hover:text-black transition-all"
                                                    title="Print document"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                                <ChevronRight size={18} className={`transition-transform ${selectedDropId === drop.id ? 'rotate-90 text-[#0066cc]' : 'text-[#d1d1d6]'}`} />
                                            </div>
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
                    <div className="w-full md:w-[450px] border-l border-[#f2f2f2] flex flex-col bg-white animate-in slide-in-from-right duration-300">
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
                            <div className="flex items-center gap-2 text-[10px] font-bold text-[#86868b] uppercase tracking-wider bg-[#f5f5f7] px-2 py-1 rounded-full">
                                <MessageCircle size={10} />
                                {selectedDrop.commentList?.length || 0} Comments
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafafa]">
                            {/* Comments Section */}
                            <div className="space-y-4">
                                {selectedDrop.commentList && selectedDrop.commentList.length > 0 ? (
                                    selectedDrop.commentList
                                        .filter(comment => !comment.parentId) // Only root level comments
                                        .map((comment) => (
                                            <CommentItem
                                                key={comment.id}
                                                comment={comment}
                                                allComments={selectedDrop.commentList || []}
                                                dropId={selectedDrop.id}
                                                onReply={handleCommentReply}
                                                onLike={onLikeComment}
                                            />
                                        ))
                                ) : (
                                    <div className="text-center py-20 opacity-50">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e5e5e5]">
                                            <MessageCircle size={20} className="text-[#d1d1d6]" />
                                        </div>
                                        <p className="text-xs font-medium text-[#86868b]">No feedback yet on this transmission.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thread Input Area */}
                        <div className="p-4 bg-white border-t border-[#f2f2f2] shrink-0">
                            {activeParentId && (
                                <div className="flex items-center justify-between mb-2 px-2 py-1 bg-[#f0f7ff] rounded-lg border border-[#0066cc]/20">
                                    <span className="text-[10px] font-bold text-[#0066cc] uppercase">Replying to message</span>
                                    <button
                                        onClick={() => {
                                            setActiveParentId(null);
                                            setReplyText('');
                                        }}
                                        className="text-[10px] font-bold text-[#86868b] hover:text-[#1d1d1f]"
                                    >Cancel</button>
                                </div>
                            )}
                            <form onSubmit={handleReply} className="relative">
                                <input
                                    id="thread-input"
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={replyText.startsWith('@') ? `Messaging ${replyText.split(' ')[0]}...` : "Reply to thread..."}
                                    className="w-full bg-[#f5f5f7] border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-[#0066cc]/20 transition-all placeholder:text-[#86868b]"
                                />
                                <button
                                    type="submit"
                                    disabled={!replyText.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#0066cc] disabled:text-[#d1d1d6] transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <p className="text-[10px] text-[#86868b] mt-2 text-center uppercase tracking-widest font-medium opacity-50">
                                End of Thread
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {previewDrop && (
                <DropPreview
                    drop={previewDrop}
                    printer={printer}
                    onPrint={onPrint}
                    onClose={() => setPreviewDrop(null)}
                />
            )}
        </div>
    );
};
