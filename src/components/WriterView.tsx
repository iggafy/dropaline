import React, { useState, useEffect, useRef } from 'react';
import { Printer, Send, Layout, Eye, Save, Check, Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Image as ImageIcon, Upload, AlignLeft, AlignCenter, AlignRight, Shield } from 'lucide-react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import './Editor.css';
import { Drop, UserProfile, PrinterState, Draft } from '../types';
import { supabase } from '../services/supabase';

interface WriterViewProps {
  onPublish: (drop: Drop, asNetwork?: boolean) => void;
  onPrintDraft: (drop: Drop) => void;
  printer: PrinterState;
  userProfile: UserProfile;
  doubleSided: boolean;
  initialDraft?: Draft | null;
  onDraftSaved?: () => void;
}

type LayoutType = 'classic' | 'zine' | 'minimal';

export const WriterView: React.FC<WriterViewProps> = ({
  onPublish,
  onPrintDraft,
  printer,
  userProfile,
  doubleSided,
  initialDraft,
  onDraftSaved
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('classic');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [dbDraftId, setDbDraftId] = useState<string | null>(null);
  const [asNetwork, setAsNetwork] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Placeholder.configure({
        placeholder: 'Begin your transmission...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Load draft on mount (From prop or local storage)
  useEffect(() => {
    if (initialDraft) {
      setTitle(initialDraft.title);
      setContent(initialDraft.content);
      setCurrentLayout(initialDraft.layout);
      setDbDraftId(initialDraft.id);
      editor?.commands.setContent(initialDraft.content);
    } else {
      const savedTitle = localStorage.getItem('dropaline_draft_title');
      const savedContent = localStorage.getItem('dropaline_draft_content');
      const savedLayout = localStorage.getItem('dropaline_draft_layout') as LayoutType;
      const savedId = localStorage.getItem('dropaline_draft_id');

      if (savedTitle) setTitle(savedTitle);
      if (savedContent) {
        setContent(savedContent);
        editor?.commands.setContent(savedContent);
      }
      if (savedLayout && ['classic', 'zine', 'minimal'].includes(savedLayout)) {
        setCurrentLayout(savedLayout);
      }
      if (savedId) {
        setDbDraftId(savedId);
      }
    }
  }, [initialDraft, editor]);

  // Auto-save draft on changes (Local + DB)
  useEffect(() => {
    const saveToStorage = async () => {
      // Local Backup
      localStorage.setItem('dropaline_draft_title', title);
      localStorage.setItem('dropaline_draft_content', content);
      localStorage.setItem('dropaline_draft_layout', currentLayout);

      // Sync to Supabase
      if (userProfile.id && (title || content)) {
        if (dbDraftId) {
          await supabase
            .from('drafts')
            .update({ title, content, layout: currentLayout, updated_at: new Date().toISOString() })
            .eq('id', dbDraftId);
          localStorage.setItem('dropaline_draft_id', dbDraftId);
        } else {
          const { data } = await supabase
            .from('drafts')
            .insert({ author_id: userProfile.id, title, content, layout: currentLayout })
            .select()
            .single();
          if (data) {
            setDbDraftId(data.id);
            localStorage.setItem('dropaline_draft_id', data.id);
          }
        }
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    };

    if (!title && !content) return;

    setSaveStatus('saving');
    const timeoutId = setTimeout(saveToStorage, 2000); // 2s debounce for DB sanity

    return () => clearTimeout(timeoutId);
  }, [title, content, currentLayout, userProfile.id, dbDraftId]);

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userProfile.id}-${Date.now()}.${fileExt}`;

    setSaveStatus('saving');
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Image upload failed:', uploadError);
      return;
    }

    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    if (data.publicUrl && editor) {
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    }
    setSaveStatus('idle');
  };

  const handlePublish = async () => {
    if (!title || !content) return;
    const newDrop: Drop = {
      id: Math.random().toString(36).substr(2, 9),
      author: asNetwork ? 'Drop a Line Network' : userProfile.name,
      authorHandle: asNetwork ? 'dropaline' : userProfile.handle,
      title,
      content,
      timestamp: Date.now(),
      status: 'received',
      layout: currentLayout,
      likes: 0,
      liked: false,
      comments: 0
    };
    onPublish(newDrop, asNetwork);

    // If it was a draft, delete from DB
    if (dbDraftId) {
      await supabase.from('drafts').delete().eq('id', dbDraftId);
    }

    // Reset and Clear Draft
    setTitle('');
    setContent('');
    setCurrentLayout('classic');
    setDbDraftId(null);
    editor?.commands.clearContent();
    onDraftSaved?.();
    localStorage.removeItem('dropaline_draft_title');
    localStorage.removeItem('dropaline_draft_content');
    localStorage.removeItem('dropaline_draft_layout');
  };

  const handlePrint = () => {
    if (!title || !content) return;
    const tempDrop: Drop = {
      id: 'draft',
      author: userProfile.name,
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
    onPrintDraft(tempDrop);
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
    <div className="h-full flex flex-col bg-[var(--primary-bg)] overflow-hidden">
      <header className="h-16 flex items-center justify-end px-8 border-b border-[var(--border-main)] shrink-0 bg-[var(--primary-bg)]">
        <div className="flex items-center gap-3">
          <div className="mr-2 text-[10px] font-medium text-[var(--text-secondary)] transition-opacity">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Draft saved'}
          </div>
          <button
            onClick={handlePrint}
            disabled={!title || !content || printer.isPrinting}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--text-main)] bg-[var(--text-main)]/[0.05] hover:bg-[var(--text-main)]/[0.1] transition-all disabled:opacity-30"
          >
            <Printer size={14} />
            {printer.isPrinting && printer.currentJob === 'Draft' ? 'Printing...' : 'Print Draft'}
          </button>
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--text-main)] hover:bg-[var(--text-main)]/[0.05] transition-all"
          >
            <Eye size={14} />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>

          {userProfile.isAdmin && (
            <button
              onClick={() => setAsNetwork(!asNetwork)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${asNetwork ? 'bg-[var(--accent-blue)] text-white shadow-lg' : 'text-[var(--text-main)] hover:bg-[var(--text-main)]/[0.05]'}`}
            >
              <Shield size={14} className={asNetwork ? 'animate-pulse' : ''} />
              {asNetwork ? 'Posting as Network' : 'Post as Network'}
            </button>
          )}

          <button
            onClick={handlePublish}
            disabled={!title || !content}
            className="flex items-center gap-2 bg-[var(--text-main)] text-[var(--card-bg)] px-5 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-black/10"
          >
            <Send size={14} />
            Drop a Line
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor or Preview */}
        {/* Preview Container */}
        <div className={`flex-1 overflow-y-auto bg-[var(--primary-bg)] p-8 md:p-12 transition-all ${!isPreviewMode ? 'hidden' : ''}`}>
          <div className={`max-w-2xl mx-auto bg-white dark:bg-[#f8f8f8] aspect-[1/1.41] shadow-2xl p-12 md:p-16 border border-[var(--border-main)] relative flex flex-col ${getLayoutClasses(currentLayout)}`}>
            <h1 className="text-2xl md:text-3xl text-center mb-2 text-black font-bold uppercase tracking-wider">
              {title || 'Untitled'}
            </h1>

            <div className="border-t-2 border-black mb-4"></div>
            <p className="text-sm italic text-gray-500 mb-8 text-center md:text-left">
              Published by {asNetwork ? 'Drop a Line Network' : userProfile.name} | @{asNetwork ? 'dropaline' : userProfile.handle}
            </p>

            <div
              className="text-black text-sm leading-[1.8] flex-1 prose-custom"
              dangerouslySetInnerHTML={{ __html: content || 'Your content will appear here...' }}
            />

            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                Printed via Drop a Line Output Gateway<br />
                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Editor Container */}
        <div className={`flex-1 overflow-y-auto bg-[var(--primary-bg)] p-8 md:p-12 transition-all ${isPreviewMode ? 'hidden' : ''}`}>
          <div className={`max-w-3xl mx-auto h-full flex flex-col ${getLayoutClasses(currentLayout)}`}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-bold text-[var(--text-main)] placeholder-[var(--text-secondary)] opacity-50 focus:opacity-100 transition-opacity w-full border-none focus:outline-none bg-transparent mb-8"
            />
            <div className="flex-1 w-full text-lg text-[var(--text-main)] leading-relaxed relative">
              {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bubble-menu">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active' : ''}
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'is-active' : ''}
                    title="Underline"
                  >
                    <UnderlineIcon size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'is-active' : ''}
                    title="Strikethrough"
                  >
                    <Strikethrough size={16} />
                  </button>

                  <div className="divider" />

                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                    title="Heading 1"
                  >
                    <Heading1 size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                    title="Heading 2"
                  >
                    <Heading2 size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                    title="Heading 3"
                  >
                    <Heading3 size={16} />
                  </button>

                  <div className="divider" />

                  <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                    title="Bullet List"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                    title="Numbered List"
                  >
                    <ListOrdered size={16} />
                  </button>

                  <div className="divider" />

                  <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                    title="Align Left"
                  >
                    <AlignLeft size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                    title="Align Center"
                  >
                    <AlignCenter size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                    title="Align Right"
                  >
                    <AlignRight size={16} />
                  </button>

                  <div className="divider" />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Add Image"
                  >
                    <ImageIcon size={16} />
                  </button>
                </BubbleMenu>
              )}
              <EditorContent editor={editor} className="h-full prose-editor" />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Floating Toolbar */}
        {!isPreviewMode && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[var(--card-bg)]/80 backdrop-blur-xl p-2 rounded-2xl border border-[var(--border-main)] shadow-2xl z-50">
            <button
              onClick={toggleLayout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--text-main)]/[0.05] transition-all min-w-[100px] justify-center"
            >
              <Layout size={16} />
              {getLayoutLabel(currentLayout)}
            </button>
            <div className="w-[1px] h-4 bg-[var(--border-main)] mx-1"></div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-[var(--text-main)] hover:bg-[var(--text-main)]/[0.05] flex items-center justify-center w-8 h-8"
              title="Upload Image"
            >
              <ImageIcon size={18} />
            </button>
            <div className="w-[1px] h-4 bg-[var(--border-main)] mx-1"></div>
            <div
              className="p-2 rounded-xl text-[var(--text-main)] flex items-center justify-center w-8 h-8"
              title="Auto-saved to device"
            >
              {saveStatus === 'saved' ? <Check size={18} className="text-[var(--accent-green)]" /> : <Save size={18} className={saveStatus === 'saving' ? 'animate-pulse text-[var(--accent-blue)]' : ''} />}
            </div>
          </div>
        )}
      </div>
    </div >
  );
};
