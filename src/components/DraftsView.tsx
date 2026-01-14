
import React, { useState, useEffect } from 'react';
import {
    FileText,
    Trash2,
    Edit3,
    Clock,
    ChevronRight,
    Search
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { Draft, AppView } from '../types';

interface DraftsViewProps {
    onEditDraft: (draft: Draft) => void;
    onCreateDraft: () => void;
}

export const DraftsView: React.FC<DraftsViewProps> = ({ onEditDraft, onCreateDraft }) => {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDrafts = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
            .from('drafts')
            .select('*')
            .eq('author_id', session.user.id)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching drafts:', error);
        } else if (data) {
            setDrafts(data.map(d => ({
                id: d.id,
                title: d.title || 'Untitled Draft',
                content: d.content || '',
                layout: d.layout || 'classic',
                updatedAt: new Date(d.updated_at).getTime()
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDrafts();

        // Realtime subscription
        const channel = supabase
            .channel('drafts-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'drafts' }, () => fetchDrafts())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this draft?')) return;

        const { error } = await supabase
            .from('drafts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting draft:', error);
        } else {
            setDrafts(prev => prev.filter(d => d.id !== id));
        }
    };

    const filteredDrafts = drafts.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-[var(--primary-bg)] overflow-hidden text-[var(--text-main)]">
            <header className="h-16 flex items-center px-8 border-b border-[var(--border-main)] shrink-0 justify-between bg-[var(--primary-bg)]">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Drafts</h2>
                    <span className="px-2 py-0.5 bg-[var(--text-main)]/[0.05] rounded-full text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        {drafts.length} Saved
                    </span>
                </div>
                <div className="flex items-center">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search drafts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-1.5 bg-[var(--text-main)]/[0.05] border-none rounded-full text-xs focus:ring-2 focus:ring-[var(--accent-blue)]/10 w-64 text-[var(--text-main)] placeholder:[var(--text-secondary)]"
                        />
                    </div>
                    <button
                        onClick={onCreateDraft}
                        className="ml-4 flex items-center gap-2 bg-[var(--text-main)] text-[var(--card-bg)] px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                    >
                        <Edit3 size={14} />
                        New Draft
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        </div>
                    ) : filteredDrafts.length === 0 ? (
                        <div className="text-center py-20 bg-[var(--card-bg)] rounded-3xl border border-dashed border-[var(--border-main)] shadow-sm">
                            <FileText size={48} className="mx-auto text-[var(--text-secondary)] mb-4 opacity-50" />
                            <h3 className="text-lg font-bold text-[var(--text-main)]">No drafts found</h3>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                                {searchQuery ? 'Try a different search term.' : 'Your works in progress will appear here.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredDrafts.map((draft) => (
                                <div
                                    key={draft.id}
                                    onClick={() => onEditDraft(draft)}
                                    className="group p-6 bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl hover:border-[var(--text-secondary)] hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--text-main)]/[0.05] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[var(--text-main)] group-hover:text-[var(--card-bg)] transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-bold text-[var(--text-main)] truncate group-hover:text-[var(--accent-blue)] transition-colors">
                                                {draft.title}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider flex items-center gap-1">
                                                    <Clock size={10} />
                                                    Updated {new Date(draft.updatedAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">
                                                    {draft.layout} layout
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleDelete(e, draft.id)}
                                            className="p-2 rounded-full hover:bg-red-50 text-[#86868b] hover:text-red-500 transition-colors"
                                            title="Delete Draft"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="p-2 text-[#d1d1d6]">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};
