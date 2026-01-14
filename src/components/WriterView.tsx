
import React, { useState, useEffect } from 'react';
import { Send, Layout, Eye, Save, Check } from 'lucide-react';
import { Drop, UserProfile } from '../types';

interface WriterViewProps {
  onPublish: (drop: Drop) => void;
  userProfile: UserProfile;
  doubleSided: boolean;
}

type LayoutType = 'classic' | 'zine' | 'minimal';

export const WriterView: React.FC<WriterViewProps> = ({ onPublish, userProfile, doubleSided }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('classic');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load draft on mount
  useEffect(() => {
    const savedTitle = localStorage.getItem('dropaline_draft_title');
    const savedContent = localStorage.getItem('dropaline_draft_content');
    const savedLayout = localStorage.getItem('dropaline_draft_layout') as LayoutType;

    if (savedTitle) setTitle(savedTitle);
    if (savedContent) setContent(savedContent);
    if (savedLayout && ['classic', 'zine', 'minimal'].includes(savedLayout)) {
      setCurrentLayout(savedLayout);
    }
  }, []);

  // Auto-save draft on changes
  useEffect(() => {
    const saveToStorage = () => {
      localStorage.setItem('dropaline_draft_title', title);
      localStorage.setItem('dropaline_draft_content', content);
      localStorage.setItem('dropaline_draft_layout', currentLayout);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    };

    // If empty, just clear storage to keep it clean
    if (!title && !content) {
      localStorage.removeItem('dropaline_draft_title');
      localStorage.removeItem('dropaline_draft_content');
      return;
    }

    setSaveStatus('saving');
    const timeoutId = setTimeout(saveToStorage, 800); // Debounce 800ms

    return () => clearTimeout(timeoutId);
  }, [title, content, currentLayout]);

  const handlePublish = () => {
    if (!title || !content) return;
    const newDrop: Drop = {
      id: Math.random().toString(36).substr(2, 9),
      author: userProfile.name, // Use real name
      authorHandle: userProfile.handle,
      title,
      content,
      timestamp: Date.now(),
      status: 'received',
      layout: currentLayout,
      likes: 0,
      liked: false,
      comments: 0
    };
    onPublish(newDrop);

    // Reset and Clear Draft
    setTitle('');
    setContent('');
    setCurrentLayout('classic');
    localStorage.removeItem('dropaline_draft_title');
    localStorage.removeItem('dropaline_draft_content');
    localStorage.removeItem('dropaline_draft_layout');
  };

  const toggleLayout = () => {
    const layouts: LayoutType[] = ['classic', 'zine', 'minimal'];
    const currentIndex = layouts.indexOf(currentLayout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setCurrentLayout(layouts[nextIndex]);
  };

  const getLayoutClasses = (layout: LayoutType) => {
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

  const getLayoutLabel = (layout: LayoutType) => {
    return layout.charAt(0).toUpperCase() + layout.slice(1);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <header className="h-16 flex items-center justify-end px-8 border-b border-[#f2f2f2] shrink-0">
        <div className="flex items-center gap-3">
          <div className="mr-2 text-[10px] font-medium text-[#86868b] transition-opacity">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Draft saved'}
          </div>
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#48484a] hover:bg-[#f5f5f7] transition-all"
          >
            <Eye size={14} />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handlePublish}
            disabled={!title || !content}
            className="flex items-center gap-2 bg-black text-white px-5 py-1.5 rounded-full text-xs font-semibold hover:bg-black/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-black/10"
          >
            <Send size={14} />
            Publish Drop
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor or Preview */}
        <div className="flex-1 overflow-y-auto bg-white p-8 md:p-12 transition-all">
          {isPreviewMode ? (
            <div className={`max-w-2xl mx-auto bg-white aspect-[1/1.41] shadow-2xl p-12 md:p-16 border border-[#e5e5e5] relative flex flex-col ${getLayoutClasses(currentLayout)}`}>
              <h1 className={`text-2xl md:text-3xl text-center mb-2 text-[#1d1d1f] font-bold uppercase tracking-wider`}>
                {title || 'Untitled'}
              </h1>

              <div className="border-t-2 border-black mb-4"></div>
              <p className="text-sm italic text-[#48484a] mb-8 text-center md:text-left">
                Published by @{userProfile.handle}
              </p>

              <div className="text-[#1d1d1f] text-sm leading-[1.8] whitespace-pre-wrap flex-1">
                {content || 'Your content will appear here...'}
              </div>

              <div className="mt-16 pt-8 border-t border-[#f2f2f2] text-center">
                <p className="text-[10px] text-[#86868b] uppercase tracking-widest leading-relaxed">
                  Printed via Drop a Line Output Gateway<br />
                  {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ) : (
            <div className={`max-w-3xl mx-auto h-full flex flex-col ${getLayoutClasses(currentLayout)}`}>
              <input
                type="text"
                placeholder="Title your drop..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-4xl font-bold text-[#1d1d1f] placeholder-[#d1d1d6] w-full border-none focus:outline-none bg-transparent mb-8"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin your transmission..."
                className="flex-1 w-full text-lg text-[#1d1d1f] leading-relaxed resize-none focus:outline-none bg-transparent placeholder-[#d1d1d6]/50"
              />
            </div>
          )}
        </div>

        {/* Floating Toolbar */}
        {!isPreviewMode && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-[#d1d1d6] shadow-2xl z-50">
            <button
              onClick={toggleLayout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#48484a] hover:bg-[#f5f5f7] transition-all min-w-[100px] justify-center"
            >
              <Layout size={16} />
              {getLayoutLabel(currentLayout)}
            </button>
            <div className="w-[1px] h-4 bg-[#d1d1d6] mx-1"></div>
            <div
              className="p-2 rounded-xl text-[#48484a] flex items-center justify-center w-8 h-8"
              title="Auto-saved to device"
            >
              {saveStatus === 'saved' ? <Check size={18} className="text-green-600" /> : <Save size={18} className={saveStatus === 'saving' ? 'animate-pulse text-[#0066cc]' : ''} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
