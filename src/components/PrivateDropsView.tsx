import React, { useState, useEffect } from 'react';
import {
    Lock,
    Send,
    Shield,
    AtSign,
    Clock,
    AlertCircle,
    User,
    Search,
    Printer,
    CheckCircle
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { UserProfile, PrivateDrop, PrivateContact } from '../types';
import { generateKeyPair, encryptContent, decryptContent } from '../services/encryption';
import { decodeBase64, encodeBase64 } from 'tweetnacl-util';

interface PrivateDropsViewProps {
    userProfile: UserProfile;
    onPrint: (drop: any) => void;
}

export const PrivateDropsView: React.FC<PrivateDropsViewProps> = ({ userProfile, onPrint }) => {
    const [privateDrops, setPrivateDrops] = useState<PrivateDrop[]>([]);
    const [loading, setLoading] = useState(true);
    const [recipientHandle, setRecipientHandle] = useState('');
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [sending, setSending] = useState(false);
    const [keyPair, setKeyPair] = useState<any>(null);
    const [contacts, setContacts] = useState<PrivateContact[]>([]);

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

    const fetchContacts = async () => {
        const { data } = await supabase
            .from('private_contacts')
            .select('*')
            .eq('user_id', userProfile.id);

        if (data) setContacts(data.map(c => ({
            userId: c.user_id,
            contactId: c.contact_id,
            autoPrint: c.auto_print
        })));
    };

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
                const [contentNonce, contentEnc] = d.encrypted_content.split(':');

                const decryptedTitle = decryptContent(
                    titleEnc,
                    titleNonce,
                    counterpart.public_key,
                    keyPair.secretKey
                );

                const decryptedContent = decryptContent(
                    contentEnc,
                    contentNonce,
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
                    encryptedContent: decryptedContent || '[Decryption Error]',
                    timestamp: new Date(d.created_at).getTime(),
                    readAt: d.read_at ? new Date(d.read_at).getTime() : undefined
                };
            });
            setPrivateDrops(mapped);

            // Mark unread from others as read
            const unread = data.filter((d: any) => d.receiver_id === userProfile.id && !d.read_at);
            if (unread.length > 0) {
                await supabase
                    .from('private_drops')
                    .update({ read_at: new Date().toISOString() })
                    .in('id', unread.map((u: any) => u.id));
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        if (keyPair) {
            fetchPrivateDrops();
            fetchContacts();

            const channel = supabase
                .channel('private-drops-realtime')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'private_drops' }, () => fetchPrivateDrops())
                .on('postgres_changes', { event: '*', schema: 'public', table: 'private_contacts' }, () => fetchContacts())
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [keyPair]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipientHandle || !message || !title || !keyPair) return;
        setSending(true);

        try {
            const { data: recipient } = await supabase
                .from('profiles')
                .select('id, public_key')
                .eq('handle', recipientHandle.replace('@', ''))
                .single();

            if (!recipient || !recipient.public_key) {
                alert('Recipient not found or does not have E2EE enabled.');
                setSending(false);
                return;
            }

            const encryptedT = encryptContent(title, recipient.public_key, keyPair.secretKey);
            const encryptedC = encryptContent(message, recipient.public_key, keyPair.secretKey);

            const { error: sendError } = await supabase
                .from('private_drops')
                .insert({
                    sender_id: userProfile.id,
                    receiver_id: recipient.id,
                    encrypted_title: `${encryptedT.nonce}:${encryptedT.content}`,
                    encrypted_content: `${encryptedC.nonce}:${encryptedC.content}`
                });

            if (sendError) throw sendError;

            setTitle('');
            setMessage('');
            setRecipientHandle('');
        } catch (error) {
            console.error('Error sending private drop:', error);
            alert('Relay failed. Check connection.');
        } finally {
            setSending(false);
        }
    };

    const toggleAutoPrint = async (contactId: string) => {
        const contact = contacts.find(c => c.contactId === contactId);
        const newVal = contact ? !contact.autoPrint : true;

        const { error } = await supabase
            .from('private_contacts')
            .upsert({
                user_id: userProfile.id,
                contact_id: contactId,
                auto_print: newVal
            }, { onConflict: 'user_id, contact_id' });

        if (error) console.error('Failed to update contact settings');
        fetchContacts();
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <header className="h-16 flex items-center px-8 border-b border-[#f2f2f2] shrink-0 justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-[#0066cc] rounded-lg">
                        <Lock size={18} />
                    </div>
                    <h2 className="text-xl font-bold text-[#1d1d1f]">Private Drops</h2>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">
                    <Shield size={12} />
                    E2E Encrypted
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Send Area */}
                <div className="w-80 border-r border-[#f2f2f2] p-6 bg-[#fafafa] overflow-y-auto">
                    <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-widest mb-4">New Secure Relay</h3>
                    <form onSubmit={handleSend} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-[#86868b] uppercase mb-1 block">Recipient Handle</label>
                            <div className="relative">
                                <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d1d1d6]" />
                                <input
                                    type="text"
                                    placeholder="handle"
                                    value={recipientHandle}
                                    onChange={(e) => setRecipientHandle(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#d1d1d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0066cc]/20 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#86868b] uppercase mb-1 block">Subject</label>
                            <input
                                type="text"
                                placeholder="Letter Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-[#d1d1d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0066cc]/20 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#86868b] uppercase mb-1 block">Content</label>
                            <textarea
                                placeholder="Write your private transmission..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-[#d1d1d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0066cc]/20 outline-none transition-all h-32 resize-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={sending || !recipientHandle || !message || !title}
                            className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-black/90 disabled:opacity-30 transition-all shadow-lg shadow-black/10"
                        >
                            <Send size={16} />
                            {sending ? 'Encrypting...' : 'Secure Send'}
                        </button>
                    </form>
                </div>

                {/* List Area */}
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
                                    Encrypted dialogues will appear here.
                                </p>
                            </div>
                        ) : (
                            privateDrops.map((drop) => {
                                const isSender = drop.senderId === userProfile.id;
                                const counterpartId = isSender ? drop.receiverId : drop.senderId;
                                const contact = contacts.find(c => c.contactId === counterpartId);

                                return (
                                    <div key={drop.id} className={`bg-white border rounded-2xl p-6 shadow-sm transition-all ${!isSender && !drop.readAt ? 'border-[#0066cc] ring-1 ring-[#0066cc]/10 shadow-lg shadow-blue-500/5' : 'border-[#f2f2f2]'}`}>
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
                                                {!isSender && (
                                                    <button
                                                        onClick={() => toggleAutoPrint(counterpartId)}
                                                        className={`p-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border ${contact?.autoPrint ? 'bg-green-50 text-green-600 border-green-200' : 'bg-[#f5f5f7] text-[#86868b] border-transparent'}`}
                                                    >
                                                        <Printer size={14} />
                                                        {contact?.autoPrint ? 'Auto-Print ON' : 'Auto-Print OFF'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => onPrint({
                                                        id: drop.id,
                                                        title: drop.encryptedTitle,
                                                        content: drop.encryptedContent,
                                                        authorHandle: drop.senderHandle,
                                                        layout: 'classic'
                                                    })}
                                                    className="p-2 rounded-lg bg-[#f5f5f7] text-[#48484a] hover:bg-[#ebebeb] transition-all border border-transparent shadow-sm"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                                {isSender ? (
                                                    <span className="text-[10px] font-bold text-[#0066cc] bg-[#f0f7ff] px-2 py-1 rounded-full uppercase tracking-widest">Sent</span>
                                                ) : drop.readAt ? (
                                                    <span className="text-[10px] font-bold text-[#86868b] bg-[#f5f5f7] px-2 py-1 rounded-full uppercase tracking-widest">Read</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-white bg-[#0066cc] px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">New</span>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="text-base font-bold text-[#1d1d1f] mb-2">{drop.encryptedTitle}</h4>
                                        <div className="text-sm text-[#48484a] leading-relaxed italic border-l-2 border-[#f2f2f2] pl-4 whitespace-pre-wrap">
                                            {drop.encryptedContent}
                                        </div>
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
