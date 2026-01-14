
import React, { useState } from 'react';
import { Printer, CheckCircle2, Clock, MoreHorizontal, Layout, Inbox, Heart, MessageCircle, Eye, X, Send, Hourglass } from 'lucide-react';
import { Drop, PrinterState } from '../types';

interface ReaderViewProps {
  drops: Drop[];
  printer: PrinterState;
  paperSaver: boolean;
  onPrint: (id: string) => void;
  onLike: (id: string) => void;
  onAddComment: (id: string, text: string) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  drops,
  printer,
  paperSaver,
  onPrint,
  onLike,
  onAddComment
}) => {
  const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

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
    } else {
      setExpandedCommentsId(id);
      setReplyText('');
    }
  };

  const handleSendComment = (id: string) => {
    if (replyText.trim()) {
      onAddComment(id, replyText);
      setReplyText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSendComment(id);
    }
  };

  return (
    <div className={`h-full flex flex-col bg-white overflow-hidden relative ${paperSaver ? 'bg-[#fcfcfc]' : 'bg-white'}`}>
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
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {drops.map((drop) => (
          <div
            key={drop.id}
            className={`group relative border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 max-w-2xl mx-auto ${paperSaver
              ? 'bg-white border-[#f0f0f0] grayscale-[0.5]'
              : 'bg-white border-[#e5e5e5]'
              }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-xs font-semibold uppercase tracking-wide ${paperSaver ? 'text-gray-500' : 'text-[#0066cc]'}`}>
                  @{drop.authorHandle}
                </span>
                <h3 className={`text-lg mt-1 ${paperSaver ? 'font-medium text-gray-700' : 'font-bold text-[#1d1d1f]'}`}>
                  {drop.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#86868b]">
                {drop.status === 'printed' ? (
                  <span className={`flex items-center gap-1 font-medium ${paperSaver ? 'text-gray-500' : 'text-green-600'}`}>
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

            <p className={`text-sm leading-relaxed mb-6 line-clamp-3 italic ${paperSaver ? 'text-gray-600 font-light' : 'text-[#48484a]'}`}>
              "{drop.content}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[#f2f2f2]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPrint(drop.id)}
                  disabled={drop.status === 'printed' || drop.status === 'queued' || printer.isPrinting}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${drop.status === 'printed'
                    ? 'bg-[#f5f5f7] text-[#86868b] cursor-not-allowed'
                    : drop.status === 'queued'
                      ? 'bg-[#f5f5f7] text-orange-600/70 cursor-not-allowed'
                      : paperSaver
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-black text-white hover:bg-black/90 active:scale-95 shadow-lg shadow-black/10'
                    }`}
                >
                  <Printer size={14} />
                  {drop.status === 'printed' ? 'Printed' : drop.status === 'queued' ? 'In Queue' : 'Push to Print'}
                </button>
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
                    drop.commentList.map((comment) => (
                      <div key={comment.id} className="flex gap-2 items-start">
                        <div className={`w-6 h-6 rounded-full shrink-0 overflow-hidden border border-[#d1d1d6] ${paperSaver ? 'grayscale' : ''}`}>
                          <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${comment.authorHandle}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className={`p-2.5 rounded-r-xl rounded-bl-xl text-xs text-[#1d1d1f] ${paperSaver ? 'bg-white border border-gray-100' : 'bg-[#f5f5f7]'}`}>
                          <span className="font-bold mr-1 block sm:inline">@{comment.authorHandle}</span>
                          <span className={paperSaver ? 'text-gray-600' : ''}>{comment.text}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-[#86868b] italic">
                      No comments yet. Be the first to drop a line.
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, drop.id)}
                    placeholder="Write a reply..."
                    className={`w-full border rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none transition-colors ${paperSaver
                      ? 'bg-white border-gray-200 text-gray-700'
                      : 'bg-white border-[#e5e5e5] focus:border-[#d1d1d6]'
                      }`}
                  />
                  <button
                    onClick={() => handleSendComment(drop.id)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 hover:text-[#004499] disabled:opacity-30 ${paperSaver ? 'text-gray-500' : 'text-[#0066cc]'}`}
                    disabled={!replyText.trim()}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {drops.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center pt-20">
            <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center text-[#86868b] mb-4">
              <Inbox size={32} />
            </div>
            <h3 className="text-lg font-medium text-[#1d1d1f]">Your inbox is quiet</h3>
            <p className="text-[#86868b] text-sm mt-1">New drops from writers you follow will appear here.</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedDrop && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
          <div className={`bg-white w-full max-w-2xl h-[85vh] shadow-2xl rounded-sm border border-[#e5e5e5] flex flex-col relative ${selectedDrop.layout === 'zine' ? 'font-mono' : selectedDrop.layout === 'minimal' ? 'font-sans' : 'font-serif'} ${paperSaver ? 'grayscale' : ''}`}>
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 text-[#1d1d1f] transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto p-12 md:p-16">
              <div className={`text-[10px] text-[#86868b] uppercase tracking-tighter border-b border-[#d1d1d6] pb-1 mb-12 flex justify-between ${selectedDrop.layout === 'zine' ? 'border-dashed' : ''}`}>
                <span>DropaLine Network</span>
                <span>{new Date(selectedDrop.timestamp).toLocaleDateString()}</span>
              </div>

              <h1 className={`text-3xl md:text-4xl text-center mb-10 text-[#1d1d1f] ${selectedDrop.layout === 'zine' ? 'font-black uppercase tracking-tighter' : 'font-bold'}`}>
                {selectedDrop.title}
              </h1>

              <div className="text-[#1d1d1f] text-base md:text-lg leading-[1.8] whitespace-pre-wrap font-serif">
                {selectedDrop.content}
              </div>

              <div className="mt-16 pt-8 border-t border-[#f2f2f2] text-center">
                <p className="text-xs font-bold text-[#1d1d1f] uppercase tracking-widest">
                  Written by @{selectedDrop.authorHandle}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-[#f2f2f2] bg-[#fafafa] flex justify-center gap-4 shrink-0">
              {selectedDrop.status !== 'printed' && (
                <button
                  onClick={() => {
                    onPrint(selectedDrop.id);
                    closePreview();
                  }}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${selectedDrop.status === 'queued'
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-black text-white hover:bg-black/90'
                    }`}
                >
                  <Printer size={14} />
                  {selectedDrop.status === 'queued' ? 'Force Print Batch' : 'Print Now'}
                </button>
              )}
              <button
                onClick={closePreview}
                className="bg-white border border-[#d1d1d6] text-[#1d1d1f] px-6 py-2 rounded-full text-xs font-bold hover:bg-[#f5f5f7] transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
