import React from 'react';
import { X, Printer, CheckCircle2, RotateCcw } from 'lucide-react';
import { Drop, PrinterState } from '../types';

interface DropPreviewProps {
    drop: Drop;
    printer: PrinterState;
    onPrint: (id: string) => void;
    onClose: () => void;
}

export const DropPreview: React.FC<DropPreviewProps> = ({
    drop,
    printer,
    onPrint,
    onClose
}) => {
    return (
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
            <div className={`bg-white w-full max-w-2xl h-[85vh] shadow-2xl rounded-sm border border-[#e5e5e5] flex flex-col relative ${drop.layout === 'zine' ? 'font-mono' : drop.layout === 'minimal' ? 'font-sans' : 'font-serif'}`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 text-[#1d1d1f] transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto p-12 md:p-16">
                    <h1 className={`text-2xl md:text-3xl text-center mb-2 text-[#1d1d1f] font-bold uppercase tracking-wider`}>
                        {drop.title}
                    </h1>

                    <div className="border-t-2 border-black mb-4"></div>
                    <p className="text-sm italic text-[#48484a] mb-8 text-center md:text-left">
                        Published by @{drop.authorHandle}
                    </p>

                    <div className="text-[#1d1d1f] text-base md:text-lg leading-[1.8] whitespace-pre-wrap font-serif">
                        {drop.content}
                    </div>

                    <div className="mt-16 pt-8 border-t border-[#f2f2f2] text-center">
                        <p className="text-[10px] text-[#86868b] uppercase tracking-widest leading-relaxed">
                            Printed via Drop a Line Output Gateway<br />
                            {new Date(drop.timestamp).toLocaleDateString()} • {new Date(drop.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t border-[#f2f2f2] bg-[#fafafa] flex justify-center gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                        {drop.status === 'printed' ? (
                            <>
                                <div className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 cursor-default">
                                    <CheckCircle2 size={14} />
                                    Printed
                                </div>
                                <button
                                    onClick={() => onPrint(drop.id)}
                                    disabled={printer.isPrinting}
                                    className="bg-[#f5f5f7] border border-[#d1d1d6] text-[#1d1d1f] px-6 py-2 rounded-full text-xs font-bold hover:bg-[#ebebeb] transition-all flex items-center gap-2"
                                >
                                    <RotateCcw size={14} />
                                    Re-print
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    onPrint(drop.id);
                                    onClose();
                                }}
                                disabled={printer.isPrinting}
                                className="px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 bg-black text-white hover:bg-black/90 shadow-lg shadow-black/10"
                            >
                                <Printer size={14} />
                                {drop.status === 'queued' ? 'Force Print Batch' : 'Print Now'}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white border border-[#d1d1d6] text-[#1d1d1f] px-6 py-2 rounded-full text-xs font-bold hover:bg-[#f5f5f7] transition-all"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
};
