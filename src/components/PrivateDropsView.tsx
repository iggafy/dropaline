import React, { useState, useEffect } from 'react';
import {
    Lock,
    Send,
    Shield,
    AtSign,
    Clock,
    User,
    Printer,
    Plus,
    Layout, Upload, Save, Check, X,
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { supabase } from '../services/supabase';
import { UserProfile, PrivateDrop } from '../types';
import { generateKeyPair, encryptContent, decryptContent } from '../services/encryption';
import { decodeBase64, encodeBase64 } from 'tweetnacl-util';
import './Editor.css';

interface PrivateDropsViewProps {
    userProfile: UserProfile;
    onPrint: (drop: any) => void;
}

export const PrivateDropsView: React.FC<PrivateDropsViewProps> = ({ userProfile, onPrint }) => {
    const [viewMode, setViewMode] = useState<'list' | 'compose'>('list');
    const [privateDrops, setPrivateDrops] = useState<PrivateDrop[]>([]);
    const [loading, setLoading] = useState(true);
    const [recipientHandle, setRecipientHandle] = useState('');
    const [title, setTitle] = useState('');
    const [sending, setSending] = useState(false);
    const [keyPair, setKeyPair] = useState<any>(null);
    const [currentLayout, setCurrentLayout] = useState<'classic' | 'zine' | 'minimal'>('classic');
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAcceptAndPrint = async (drop: PrivateDrop) => {
        if (!keyPair || !drop.rawContent || !drop.counterpartPublicKey) return;

        // 1. Decrypt content just for printing
        const [contentNonce, contentEnc] = drop.rawContent.split(':');
        const decryptedContent = decryptContent(
            contentEnc,
            contentNonce,
            drop.counterpartPublicKey,
            keyPair.secretKey
        );

        if (!decryptedContent) {
            alert('Failed to decrypt transmission.');
            return;
        }

        // 2. Trigger Print
        onPrint({
            id: drop.id,
            title: drop.encryptedTitle,
            content: decryptedContent,
            authorHandle: drop.senderHandle,
            layout: 'classic'
        });

        // 3. Update DB status to 'accepted'
        const { error } = await supabase
            .from('private_drops')
            .update({ status: 'accepted' })
            .eq('id', drop.id);

        if (error) {
            console.error('Error accepting drop:', error);
        } else {
            fetchPrivateDrops();
        }
    };

    const handleDeny = async (id: string) => {
        const { error } = await supabase
            .from('private_drops')
            .update({ status: 'denied' })
            .eq('id', id);

        if (error) {
            console.error('Error denying drop:', error);
            alert('Failed to deny transmission.');
        } else {
            fetchPrivateDrops();
        }
    };

    const toggleLayout = () => {
        const layouts: ('classic' | 'zine' | 'minimal')[] = ['classic', 'zine', 'minimal'];
        const currentIndex = layouts.indexOf(currentLayout);
        const nextIndex = (currentIndex + 1) % layouts.length;
        setCurrentLayout(layouts[nextIndex]);
    };

    const getLayoutClasses = (layout: 'classic' | 'zine' | 'minimal') => {
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

    const getLayoutLabel = (layout: string) => {
        return layout.charAt(0).toUpperCase() + layout.slice(1);
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            Placeholder.configure({
                placeholder: 'Write your private transmission...',
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '',
    });

    // Load or generate keys
    useEffect(() => {
        const loadKeys = async () => {
            const savedSecretKey = localStorage.getItem(`dropaline_sk_${userProfile.id}`);
            const savedPublicKey = localStorage.getItem(`dropaline_pk_${userProfile.id}`);

            if (savedSecretKey && savedPublicKey) {
                setKeyPair({
                    publicKey: decodeBase64(savedPublicKey),
                    secretKey: decodeBase64(savedSecretKey)
                });
            } else {
                const newKeys = generateKeyPair();
                const pkBase64 = encodeBase64(newKeys.publicKey);
                const skBase64 = encodeBase64(newKeys.secretKey);

                localStorage.setItem(`dropaline_pk_${userProfile.id}`, pkBase64);
                localStorage.setItem(`dropaline_sk_${userProfile.id}`, skBase64);

                await supabase
                    .from('profiles')
                    .update({ public_key: pkBase64 })
                    .eq('id', userProfile.id);

                setKeyPair(newKeys);
            }
        };

        if (userProfile.id) loadKeys();
    }, [userProfile.id]);

    const fetchPrivateDrops = async () => {
        if (!keyPair) return;
        setLoading(true);

        const { data, error } = await supabase
            .from('private_drops')
            .select(`
                *,
                sender:sender_id (id, handle, name, avatar_url, public_key),
                receiver:receiver_id (id, handle, name, avatar_url, public_key)
            `)
            .or(`sender_id.eq.${userProfile.id},receiver_id.eq.${userProfile.id}`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching private drops:', error);
        } else if (data) {
            const mapped = data.map((d: any) => {
                const isSender = d.sender_id === userProfile.id;
                const counterpart = isSender ? d.receiver : d.sender;

                const [titleNonce, titleEnc] = d.encrypted_title.split(':');

                // We only decrypt the title for the list display
                const decryptedTitle = decryptContent(
                    titleEnc,
                    titleNonce,
                    counterpart.public_key,
                    keyPair.secretKey
                );

                return {
                    id: d.id,
                    senderId: d.sender_id,
                    senderHandle: d.sender.handle,
                    senderName: d.sender.name,
                    senderAvatar: d.sender.avatar_url,
                    receiverId: d.receiver_id,
                    encryptedTitle: decryptedTitle || '[Decryption Error]',
                    encryptedContent: '', // Digital preview disabled
                    rawTitle: d.encrypted_title,
                    rawContent: d.encrypted_content,
                    counterpartPublicKey: counterpart.public_key,
                    timestamp: new Date(d.created_at).getTime(),
                    readAt: d.read_at ? new Date(d.read_at).getTime() : undefined,
                    status: d.status || 'accepted'
                };
            });
            setPrivateDrops(mapped);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (keyPair) {
            fetchPrivateDrops();
            const channel = supabase
                .channel('private-drops-realtime')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'private_drops' }, () => fetchPrivateDrops())
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [keyPair]);

    const handleSend = async () => {
        const content = editor?.getHTML();
        if (!recipientHandle || !content || !title || !keyPair) return;
        setSending(true);

        try {
            const { data: recipient, error: recipientError } = await supabase
                .from('profiles')
                .select('id, public_key, allow_private_drops, private_line_exceptions')
                .eq('handle', recipientHandle.replace('@', ''))
                .single();

            if (recipientError || !recipient || !recipient.public_key) {
                alert('Recipient not found or does not have E2EE enabled.');
                setSending(false);
                return;
            }

            if (recipient.allow_private_drops === false) {
                // Check if the current user (sender) is in the recipient's exceptions list
                const exceptions = recipient.private_line_exceptions || [];
                const senderHandle = userProfile.handle.replace('@', '');

                if (!exceptions.includes(senderHandle)) {
                    alert('User doesn\'t allow Private Lines.');
                    setSending(false);
                    return;
                }
            }

            const encryptedT = encryptContent(title, recipient.public_key, keyPair.secretKey);
            const encryptedC = encryptContent(editor?.getHTML() || '', recipient.public_key, keyPair.secretKey);

            const { error: sendError } = await supabase
                .from('private_drops')
                .insert({
                    sender_id: userProfile.id,
                    receiver_id: recipient.id,
                    encrypted_title: `${encryptedT.nonce}:${encryptedT.content}`,
                    encrypted_content: `${encryptedC.nonce}:${encryptedC.content}`,
                    status: 'pending'
                });

            if (sendError) throw sendError;

            setTitle('');
            editor?.commands.clearContent();
            setRecipientHandle('');
            setViewMode('list');
        } catch (error) {
            console.error('Error sending private drop:', error);
            alert('Relay failed. Check connection.');
        } finally {
            setSending(false);
        }
    };

    if (viewMode === 'compose') {
        return (
            <div className="h-full flex flex-col bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <header className="h-16 flex items-center px-8 shrink-0 justify-between bg-white z-10 border-b border-[#f2f2f2]">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setViewMode('list')}
                            className="text-sm font-bold text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsPreviewMode(!isPreviewMode)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#48484a] hover:bg-[#f5f5f7] transition-all"
                        >
                            <User size={14} />
                            {isPreviewMode ? 'Edit' : 'Preview'}
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={sending || !recipientHandle || !title}
                            className="flex items-center gap-2 bg-black text-white px-5 py-1.5 rounded-full text-xs font-semibold hover:bg-black/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-black/10"
                        >
                            <Lock size={14} />
                            {sending ? 'Encrypting...' : 'Secure Send'}
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden relative">
                    {/* Preview Container */}
                    <div className={`flex-1 overflow-y-auto bg-white p-8 md:p-12 transition-all ${!isPreviewMode ? 'hidden' : ''}`}>
                        <div className={`max-w-2xl mx-auto bg-white aspect-[1/1.41] shadow-2xl p-12 md:p-16 border border-[#e5e5e5] relative flex flex-col ${getLayoutClasses(currentLayout)}`}>
                            <h1 className={`text-2xl md:text-3xl text-center mb-2 text-[#1d1d1f] font-bold uppercase tracking-wider`}>
                                {title || 'Untitled'}
                            </h1>

                            <div className="border-t-2 border-black mb-4"></div>
                            <p className="text-sm italic text-[#48484a] mb-8 text-center md:text-left">
                                Private Transmission from {userProfile.name} | @{userProfile.handle}
                            </p>

                            <div
                                className="text-[#1d1d1f] text-sm leading-[1.8] flex-1 prose-custom"
                                dangerouslySetInnerHTML={{ __html: editor?.getHTML() || 'Content...' }}
                            />

                            <div className="mt-16 pt-8 border-t border-[#f2f2f2] text-center">
                                <p className="text-[10px] text-[#86868b] uppercase tracking-widest leading-relaxed">
                                    printed via Drop a Line Secure Gateway<br />
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Editor Container */}
                    <div className={`flex-1 overflow-y-auto bg-white p-8 md:p-12 transition-all ${isPreviewMode ? 'hidden' : ''}`}>
                        <div className={`max-w-3xl mx-auto h-full flex flex-col ${getLayoutClasses(currentLayout)}`}>
                            <div className="flex items-center gap-2 mb-6 border-b border-[#f2f2f2] pb-2 font-sans">
                                <span className="text-[#86868b] text-lg font-medium">To: @</span>
                                <input
                                    type="text"
                                    placeholder="handle"
                                    value={recipientHandle}
                                    onChange={(e) => setRecipientHandle(e.target.value)}
                                    className="flex-1 text-lg font-medium text-[#1d1d1f] placeholder-[#d1d1d6] border-none focus:outline-none bg-transparent"
                                    autoFocus
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-4xl font-bold text-[#1d1d1f] placeholder-[#d1d1d6] w-full border-none focus:outline-none bg-transparent mb-8"
                            />
                            <div className="flex-1 w-full text-lg text-[#1d1d1f] leading-relaxed relative">
                                {editor && (
                                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bubble-menu">
                                        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><Bold size={16} /></button>
                                        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><Italic size={16} /></button>
                                        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}><UnderlineIcon size={16} /></button>
                                        <div className="divider" />
                                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}><Heading1 size={16} /></button>
                                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}><Heading2 size={16} /></button>
                                        <div className="divider" />
                                        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><List size={16} /></button>
                                        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><ListOrdered size={16} /></button>
                                        <div className="divider" />
                                        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}><AlignLeft size={16} /></button>
                                        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}><AlignCenter size={16} /></button>
                                        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}><AlignRight size={16} /></button>
                                        <div className="divider" />
                                        <button onClick={() => fileInputRef.current?.click()}><ImageIcon size={16} /></button>
                                    </BubbleMenu>
                                )}
                                <EditorContent editor={editor} className="h-full prose-editor outline-none" />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                            const file = e.target.files[0];
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `${userProfile.id}-${Date.now()}.${fileExt}`;
                                            const { data } = await supabase.storage.from('media').upload(fileName, file);
                                            if (data) {
                                                const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
                                                if (urlData.publicUrl && editor) {
                                                    editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
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
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-xl text-[#48484a] hover:bg-[#f5f5f7] flex items-center justify-center w-8 h-8"
                                title="Upload Image"
                            >
                                <ImageIcon size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <header className="h-16 flex items-center px-8 border-b border-[#f2f2f2] shrink-0 justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-[#0066cc] rounded-lg">
                        <Lock size={18} />
                    </div>
                    <h2 className="text-xl font-bold text-[#1d1d1f]">Private Lines</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">
                        <Shield size={12} />
                        E2E Encrypted
                    </div>
                    <button
                        onClick={() => setViewMode('compose')}
                        className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-black/80 transition-all shadow-sm"
                    >
                        <Plus size={14} />
                        New Private Line
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-white p-8">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-20 text-[#86868b] text-sm animate-pulse">
                                Decrypting Vault...
                            </div>
                        ) : privateDrops.length === 0 ? (
                            <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-dashed border-[#d1d1d6]">
                                <Lock size={48} className="mx-auto text-[#d1d1d6] mb-4" />
                                <h3 className="text-lg font-bold text-[#1d1d1f]">Your Secure Vault</h3>
                                <p className="text-sm text-[#86868b] mt-1">
                                    Physical-only relay environment.
                                </p>
                            </div>
                        ) : (
                            privateDrops.map((drop) => {
                                const isSender = drop.senderId === userProfile.id;
                                const isPending = drop.status === 'pending';
                                const isDenied = drop.status === 'denied';
                                const isAccepted = drop.status === 'accepted';

                                return (
                                    <div key={drop.id} className={`bg-white border rounded-2xl p-6 shadow-sm transition-all ${!isSender && isPending ? 'border-[#0066cc] ring-1 ring-[#0066cc]/10 shadow-lg shadow-blue-500/5' : 'border-[#f2f2f2]'} ${isDenied ? 'opacity-50' : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#f2f2f2] bg-gray-50 flex items-center justify-center">
                                                    {drop.senderAvatar ? (
                                                        <img src={drop.senderAvatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={20} className="text-[#d1d1d6]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-[#1d1d1f]">{drop.senderName}</span>
                                                        <span className="text-xs text-[#86868b]">@{drop.senderHandle}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-[#86868b] uppercase tracking-wider mt-0.5">
                                                        <Clock size={10} />
                                                        {new Date(drop.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!isSender && isPending && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeny(drop.id); }}
                                                            className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                            title="Deny"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleAcceptAndPrint(drop); }}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-colors shadow-sm"
                                                        >
                                                            <Printer size={12} />
                                                            Accept & Print
                                                        </button>
                                                    </div>
                                                )}

                                                {isAccepted && !isSender && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleAcceptAndPrint(drop); }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] text-[#48484a] text-[10px] font-bold uppercase tracking-widest hover:bg-[#ebebeb] transition-colors"
                                                    >
                                                        <Printer size={12} />
                                                        Print Again
                                                    </button>
                                                )}

                                                {isSender && isPending && (
                                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full uppercase tracking-widest">Pending</span>
                                                )}
                                                {isDenied && (
                                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-widest">{isSender ? 'Denied by Recipient' : 'Denied'}</span>
                                                )}
                                                {isAccepted && isSender && (
                                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-widest">Printed by Recipient</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Views */}
                                        {isPending && !isSender ? (
                                            <div className="bg-[#fafafa] rounded-2xl p-8 border border-dashed border-[#d1d1d6] flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#f2f2f2] mb-4">
                                                    <Lock size={20} className="text-[#86868b]" />
                                                </div>
                                                <h4 className="text-sm font-bold text-[#1d1d1f] mb-1">Encrypted Transmission</h4>
                                                <p className="text-xs text-[#86868b] max-w-[240px] leading-relaxed">
                                                    {drop.senderName} is sending you a private line. Accept to print it to paper. Digital preview is disabled for this secure relay.
                                                </p>
                                            </div>
                                        ) : isDenied ? (
                                            <div className="py-4 text-center">
                                                <p className="text-xs text-[#86868b] italic">Transmission {isSender ? 'denied by recipient' : 'denied'}.</p>
                                            </div>
                                        ) : isAccepted ? (
                                            <div className="bg-green-50/30 rounded-2xl p-8 border border-dashed border-green-200/50 flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-green-100 mb-4">
                                                    <Check size={20} className="text-green-500" />
                                                </div>
                                                <h4 className="text-sm font-bold text-green-800 mb-1">Transmission Relayed</h4>
                                                <p className="text-xs text-green-600/80 max-w-[240px] leading-relaxed">
                                                    {isSender ? `Hand-delivered to ${drop.senderName}'s printer.` : 'This transmission has been printed to your hardware terminal. Digital copy destroyed for security.'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="py-4 text-center">
                                                <p className="text-xs text-[#86868b] italic">Initializing secure link...</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
