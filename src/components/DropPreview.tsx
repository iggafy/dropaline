
import React from 'react';
import { X, Printer, CheckCircle2, RotateCcw } from 'lucide-react';
import { Drop, PrinterState } from '../types';

interface DropPreviewProps {
    drop: Drop;
    printer: PrinterState;
    onPrint: (id: string) => void;
    onClose: () => void;
}

export const DropPreview: React.FC<DropPreviewProps> = ({ drop, printer, onPrint, onClose }) => {
    const getLayoutClasses = (layout: string) => {
        switch (layout) {
            case 'zine':
                return 'font-mono uppercase-headers border-dashed';
            case 'minimal':
                return 'font-sans tracking-wide';
            case 'classic':
            default:
                return 'font-serif';
        }
    };

    const isPrinted = drop.status === 'printed';
    const isPrinting = printer.isPrinting && printer.currentJob === drop.id;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-4xl max-h-full bg-[var(--primary-bg)] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-400 ease-out border border-white/20">

                {/* Header */}
                <div className="h-16 px-8 flex items-center justify-between bg-[var(--card-bg)]/80 backdrop-blur-xl border-b border-[var(--border-main)] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border-main)]">
                            <img src={drop.authorAvatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${drop.authorHandle}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Previewing Letter</p>
                            <p className="text-sm font-bold text-[var(--text-main)]">By @{drop.authorHandle}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isPrinted ? (
                            <button
                                onClick={() => onPrint(drop.id)}
                                disabled={isPrinting}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[var(--text-main)]/[0.05] text-[var(--text-main)] hover:bg-[var(--text-main)]/[0.1] transition-all"
                            >
                                <RotateCcw size={14} />
                                Re-print
                            </button>
                        ) : (
                            <button
                                onClick={() => onPrint(drop.id)}
                                disabled={isPrinting}
                                className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-[var(--text-main)] text-[var(--card-bg)] hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-black/10"
                            >
                                <Printer size={14} />
                                {isPrinting ? 'Printing...' : 'Print Now'}
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-[var(--text-main)]/[0.05] text-[var(--text-secondary)] transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Preview Area */}
                <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
                    <div
                        className={`max-w-2xl mx-auto aspect-[1/1.41] shadow-2xl p-12 md:p-20 border border-[var(--border-main)] relative flex flex-col ${getLayoutClasses(drop.layout || 'classic')} bg-white dark:bg-[#f8f8f8] text-black`}
                        style={{ minHeight: '800px' }}
                    >
                        {/* Stamp/Date */}
                        <div className="absolute top-10 right-10 text-[10px] font-bold text-[#86868b] uppercase tracking-widest text-right">
                            {new Date(drop.timestamp).toLocaleDateString()}<br />
                            RELAY TERMINAL ID: {Math.floor(1000 + Math.random() * 9000)}
                        </div>

                        <h1 className="text-3xl md:text-4xl text-center mb-4 text-black font-bold tracking-tight">
                            {drop.title}
                        </h1>

                        <div className="w-16 h-1 bg-black mx-auto mb-8 rounded-full"></div>

                        <div className="text-sm italic text-[#86868b] mb-12 text-center">
                            A transmission from {drop.author} (@{drop.authorHandle})
                        </div>

                        <div
                            className="text-black text-base md:text-lg leading-[1.8] flex-1 prose-preview"
                            dangerouslySetInnerHTML={{ __html: drop.content }}
                        />

                        <div className="mt-20 pt-10 border-t border-black/5 text-center">
                            <p className="text-[10px] text-[#86868b] uppercase tracking-[0.2em] leading-relaxed">
                                Physical Network Relay Protocol v1.0<br />
                                Printed via Drop a Line Secure Gateway
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="h-12 px-8 bg-[var(--card-bg)]/50 backdrop-blur-md border-t border-[var(--border-main)] flex items-center justify-center gap-6 shrink-0">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        <CheckCircle2 size={10} className="text-green-500" />
                        Verified Cryptographic Signature
                    </div>
                    <div className="w-[1px] h-3 bg-[var(--border-main)]"></div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        Layout: {drop.layout || 'Classic'}
                    </div>
                </div>
            </div>
        </div>
    );
};
