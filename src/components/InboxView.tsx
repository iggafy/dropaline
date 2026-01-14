import React, { useState, useEffect, useRef } from 'react';
import { Printer, CheckCircle2, Clock, Eye, X, Send, Hourglass, RotateCcw, Heart, MessageCircle, Inbox } from 'lucide-react';
import { Drop, PrinterState } from '../types';
import { DropPreview } from './DropPreview';
import { CommentItem } from './CommentItem';

interface InboxViewProps {
  drops: Drop[];
  printer: PrinterState;
  doubleSided: boolean;
  onPrint: (id: string) => void;
  onLike: (id: string) => void;
  onAddComment: (id: string, text: string, parentId?: string) => void;
  onLikeComment: (dropId: string, commentId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const InboxView: React.FC<InboxViewProps> = ({
  drops,
  printer,
  doubleSided,
  onPrint,
  onLike,
  onAddComment,
  onLikeComment,
  onLoadMore,
  hasMore
}) => {
  const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1.0, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  const handlePreview = (drop: Drop) => {
    setSelectedDrop(drop);
  };

  const closePreview = () => {
    setSelectedDrop(null);
  };

  const toggleComments = (id: string) => {
    if (expandedCommentsId === id) {
      setExpandedCommentsId(null);
      setReplyText('');
      setActiveParentId(null);
    } else {
      setExpandedCommentsId(id);
      setReplyText('');
      setActiveParentId(null);
    }
  };

  const handleCommentReply = (handle: string, commentId: string) => {
    setReplyText(`@${handle} `);
    setActiveParentId(commentId);
  };

  const handleSendComment = (id: string) => {
    if (replyText.trim()) {
      onAddComment(id, replyText, activeParentId || undefined);
      setReplyText('');
      setActiveParentId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSendComment(id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#f2f2f2] shrink-0">
        <h2 className="text-xl font-bold text-[#1d1d1f]">Inbox</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#f5f5f7] px-3 py-1.5 rounded-full text-xs font-bold text-[#48484a] uppercase tracking-tighter shadow-sm border border-black/5">
            <span className="text-[10px] text-[#86868b]">Output:</span>
            <div className={`w-1.5 h-1.5 rounded-full ${printer.isConnected ? 'bg-green-500 shadow-[0_0_5px_green]' : 'bg-red-500 pulse'}`}></div>
            {printer.name === 'SAVE_AS_PDF' ? 'Digital PDF' : printer.name}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto p-8 ${drops.length > 0 ? 'space-y-6' : 'flex flex-col'}`}>
        {drops.map((drop) => (
          <div
            key={drop.id}
            className="group relative border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 max-w-2xl mx-auto bg-white border-[#e5e5e5]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d1d1d6]">
                  <img
                    src={drop.authorAvatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${drop.authorHandle}`}
                    alt="Author"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#0066cc]">
                    @{drop.authorHandle}
                  </span>
                  <h3 className="text-lg mt-0.5 font-bold text-[#1d1d1f]">
                    {drop.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#86868b]">
                {drop.status === 'printed' ? (
                  <span className="flex items-center gap-1 font-medium text-green-600">
                    <CheckCircle2 size={12} /> Printed
                  </span>
                ) : drop.status === 'queued' ? (
                  <span className="flex items-center gap-1 text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
                    <Hourglass size={12} /> Queued for Batch
                  </span>
                ) : (printer.isPrinting && printer.currentJob === drop.id) ? (
                  <span className="flex items-center gap-1 text-[#0066cc] font-medium animate-pulse">
                    <Clock size={12} /> Printing...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {new Date(drop.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-6 line-clamp-3 italic text-[#48484a]">
              "{drop.content.replace(/<[^>]*>?/gm, '')}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[#f2f2f2]">
              <div className="flex items-center gap-2">
                {drop.status === 'printed' ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 cursor-default">
                      <CheckCircle2 size={14} />
                      Printed
                    </div>
                    <button
                      onClick={() => onPrint(drop.id)}
                      disabled={printer.isPrinting}
                      className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ebebeb] transition-all"
                    >
                      <RotateCcw size={14} />
                      Re-print
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onPrint(drop.id)}
                    disabled={printer.isPrinting}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all bg-black text-white hover:bg-black/90 active:scale-95 shadow-lg shadow-black/10"
                  >
                    <Printer size={14} />
                    {drop.status === 'queued' ? 'Print Now' : 'Print'}
                  </button>
                )}
                <button
                  onClick={() => handlePreview(drop)}
                  className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#48484a] transition-colors"
                  title="Preview"
                >
                  <Eye size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onLike(drop.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-xs font-medium ${drop.liked ? 'text-red-500 bg-red-50' : 'text-[#86868b] hover:bg-[#f5f5f7]'
                    }`}
                >
                  <Heart size={16} className={drop.liked ? 'fill-current' : ''} />
                  <span>{drop.likes}</span>
                </button>
                <button
                  onClick={() => toggleComments(drop.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-xs font-medium ${expandedCommentsId === drop.id ? 'bg-[#f5f5f7] text-[#1d1d1f]' : 'text-[#86868b] hover:bg-[#f5f5f7]'
                    }`}
                >
                  <MessageCircle size={16} />
                  <span>{drop.comments}</span>
                </button>
              </div>
            </div>

            {/* Expanded Comments Section */}
            {expandedCommentsId === drop.id && (
              <div className="mt-4 pt-4 border-t border-[#f2f2f2] animate-in fade-in slide-in-from-top-2">
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {drop.commentList && drop.commentList.length > 0 ? (
                    drop.commentList
                      .filter(comment => !comment.parentId) // Only root level comments
                      .map((comment) => (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          allComments={drop.commentList || []}
                          dropId={drop.id}
                          onReply={handleCommentReply}
                          onLike={onLikeComment}
                        />
                      ))
                  ) : (
                    <div className="text-center py-4 text-xs text-[#86868b] italic">
                      No comments yet. Be the first to drop a line.
                    </div>
                  )}
                </div>

                <div className="relative">
                  {activeParentId && (
                    <div className="flex items-center justify-between mb-2 px-3 py-1.5 bg-[#f0f7ff] rounded-lg border border-[#0066cc]/20">
                      <span className="text-[10px] font-bold text-[#0066cc] uppercase tracking-wider">Replying to message</span>
                      <button
                        onClick={() => {
                          setActiveParentId(null);
                          setReplyText('');
                        }}
                        className="text-[10px] font-bold text-[#86868b] hover:text-[#1d1d1f]"
                      >Cancel</button>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, drop.id)}
                      placeholder="Write a reply..."
                      className="w-full border rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none transition-colors bg-white border-[#e5e5e5] focus:border-[#d1d1d6]"
                    />
                    <button
                      onClick={() => handleSendComment(drop.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-[#004499] disabled:opacity-30 text-[#0066cc]"
                      disabled={!replyText.trim()}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {drops.length > 0 && (
          <div ref={loadMoreRef} className="h-24 flex items-center justify-center">
            {hasMore ? (
              <div className="h-1.5 w-1.5 rounded-full bg-[#d1d1d6] opacity-50"></div>
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-30">
                <div className="w-16 h-[1px] bg-[#d1d1d6]"></div>
                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">End of Relay</span>
                <div className="w-16 h-[1px] bg-[#d1d1d6]"></div>
              </div>
            )}
          </div>
        )}

        {drops.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-[#f5f5f7] rounded-3xl flex items-center justify-center text-[#d1d1d6] mb-6 border border-[#f2f2f2] shadow-sm">
              <Inbox size={40} />
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f]">Your inbox is quiet</h3>
            <p className="text-[#86868b] text-sm mt-2 max-w-[280px]">New transmissions from writers you follow will appear here as they are relayed.</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedDrop && (
        <DropPreview
          drop={selectedDrop}
          printer={printer}
          onPrint={onPrint}
          onClose={closePreview}
        />
      )}
    </div>
  );
};
