
import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { Sidebar } from './components/Sidebar';
import { ReaderView } from './components/ReaderView';
import { WriterView } from './components/WriterView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { SettingsView } from './components/SettingsView';
import { AuthView } from './components/AuthView';
import { AppView, Drop, PrinterState, UserProfile, Creator, Comment } from './types';

// Initial Device State (Local Only)
const INITIAL_PRINTER: PrinterState = {
  isConnected: true,
  name: 'HP LaserJet Pro (Office)',
  isPrinting: false
};

// Storage Helper
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) {
    return fallback;
  }
}

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // App State
  const [view, setView] = useState<AppView>(AppView.READER);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Local Settings
  const [paperSaver, setPaperSaver] = useState<boolean>(() => loadFromStorage('dropaline_saver', false));
  const [printer, setPrinter] = useState<PrinterState>(() => loadFromStorage('dropaline_printer', INITIAL_PRINTER));
  const [batching, setBatching] = useState<string>(() => loadFromStorage('dropaline_batch_mode', 'Instant'));
  const [customDate, setCustomDate] = useState<string>(() => loadFromStorage('dropaline_batch_date', ''));
  const [customTime, setCustomTime] = useState<string>(() => loadFromStorage('dropaline_batch_time', ''));

  // --- Auth & Init ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Data Fetching ---
  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    if (!session?.user) return;

    // 1. Fetch My Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      setUserProfile({
        id: profile.id,
        name: profile.name,
        handle: profile.handle,
        bio: profile.bio || '',
        avatar: profile.avatar_url
      });
    }

    // 2. Fetch Subscriptions & Creators
    // First get who I follow
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('creator_id, auto_print')
      .eq('subscriber_id', session.user.id);

    const subIds = subs?.map(s => s.creator_id) || [];
    const subMap = new Map(subs?.map(s => [s.creator_id, s.auto_print]));

    // Get all profiles (for subscription discovery) - limiting to 50 for prototype
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', session.user.id) // Don't show myself
      .limit(50);

    if (allProfiles) {
      const mappedCreators: Creator[] = allProfiles.map(p => ({
        id: p.id,
        name: p.name,
        handle: p.handle,
        bio: p.bio || '',
        avatar: p.avatar_url,
        subscriberCount: Math.floor(Math.random() * 1000) + 10, // Mock count for now as count needs aggregate query
        isSubscribed: subIds.includes(p.id),
        autoPrint: subMap.get(p.id) || false
      }));
      setCreators(mappedCreators);
    }

    // 3. Fetch Drops (from subscriptions + my own)
    // In a real app, we'd paginate this.
    // We also need to fetch likes and comments and user statuses.
    
    // Simplification: Fetch last 20 drops from people I follow OR myself
    const authorsToFetch = [...subIds, session.user.id];
    
    const { data: dropsData } = await supabase
      .from('drops')
      .select(`
        *,
        profiles:author_id (name, handle, avatar_url),
        likes (user_id),
        comments (id, text, created_at, profiles (handle, name)),
        user_drop_statuses (status)
      `)
      .in('author_id', authorsToFetch)
      .order('created_at', { ascending: false })
      .limit(20);

    if (dropsData) {
      const mappedDrops: Drop[] = dropsData.map((d: any) => {
        const myStatus = d.user_drop_statuses.find((s: any) => s.user_id === session.user.id)?.status || 'received';
        const isLiked = d.likes.some((l: any) => l.user_id === session.user.id);
        
        return {
          id: d.id,
          author: d.profiles.name,
          authorHandle: d.profiles.handle,
          title: d.title,
          content: d.content,
          timestamp: new Date(d.created_at).getTime(),
          status: myStatus, // received | printed | queued
          layout: d.layout,
          likes: d.likes.length,
          liked: isLiked,
          comments: d.comments.length,
          commentList: d.comments.map((c: any) => ({
            id: c.id,
            authorHandle: c.profiles.handle,
            text: c.text,
            timestamp: new Date(c.created_at).getTime()
          }))
        };
      });
      setDrops(mappedDrops);
    }
  };

  // --- Actions ---

  const handlePrintDrop = async (dropId: string) => {
    setPrinter(prev => ({ ...prev, isPrinting: true, currentJob: dropId }));
    
    // Simulate print time then update DB
    setTimeout(async () => {
      // Update local state
      setDrops(prev => prev.map(d => d.id === dropId ? { ...d, status: 'printed' } : d));
      setPrinter(prev => ({ ...prev, isPrinting: false, currentJob: undefined }));

      // Update Supabase
      if (session?.user) {
        const { error } = await supabase
          .from('user_drop_statuses')
          .upsert({ 
            user_id: session.user.id, 
            drop_id: dropId, 
            status: 'printed' 
          }, { onConflict: 'user_id, drop_id' });
        
        if (error) console.error('Failed to update print status', error);
      }
    }, 3000);
  };

  const handleLikeDrop = async (dropId: string) => {
    // Optimistic Update
    const drop = drops.find(d => d.id === dropId);
    if (!drop || !session?.user) return;

    const newLikedState = !drop.liked;
    setDrops(prev => prev.map(d => 
      d.id === dropId 
        ? { ...d, liked: newLikedState, likes: newLikedState ? d.likes + 1 : d.likes - 1 } 
        : d
    ));

    // DB Update
    if (newLikedState) {
      await supabase.from('likes').insert({ user_id: session.user.id, drop_id: dropId });
    } else {
      await supabase.from('likes').delete().match({ user_id: session.user.id, drop_id: dropId });
    }
  };

  const handleAddComment = async (dropId: string, text: string) => {
    if (!session?.user || !userProfile) return;

    // DB Insert
    const { data: newComment, error } = await supabase
      .from('comments')
      .insert({
        drop_id: dropId,
        author_id: session.user.id,
        text: text
      })
      .select()
      .single();

    if (error || !newComment) {
      console.error('Failed to post comment', error);
      return;
    }

    // Local Update
    const commentObj: Comment = {
      id: newComment.id,
      authorHandle: userProfile.handle,
      text: newComment.text,
      timestamp: Date.now()
    };

    setDrops(prev => prev.map(d => {
      if (d.id === dropId) {
        return {
          ...d,
          comments: d.comments + 1,
          commentList: [...(d.commentList || []), commentObj]
        };
      }
      return d;
    }));
  };

  const handlePublishDrop = async (newDrop: Drop) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('drops')
      .insert({
        author_id: session.user.id,
        title: newDrop.title,
        content: newDrop.content,
        layout: newDrop.layout
      })
      .select()
      .single();

    if (error) {
      console.error('Publish failed', error);
      return;
    }

    // Refresh drops to see it
    fetchData();
    setView(AppView.READER);
  };

  const toggleSubscription = async (creatorId: string) => {
    if (!session?.user) return;
    const creator = creators.find(c => c.id === creatorId);
    if (!creator) return;

    const willSubscribe = !creator.isSubscribed;

    // Optimistic
    setCreators(prev => prev.map(c => 
      c.id === creatorId ? { ...c, isSubscribed: willSubscribe } : c
    ));

    if (willSubscribe) {
      await supabase.from('subscriptions').insert({ subscriber_id: session.user.id, creator_id: creatorId });
    } else {
      await supabase.from('subscriptions').delete().match({ subscriber_id: session.user.id, creator_id: creatorId });
    }
    
    // Refresh drops
    fetchData();
  };

  const toggleAutoPrint = async (creatorId: string) => {
    if (!session?.user) return;
    const creator = creators.find(c => c.id === creatorId);
    if (!creator) return;
    
    const newVal = !creator.autoPrint;

    setCreators(prev => prev.map(c => 
      c.id === creatorId ? { ...c, autoPrint: newVal } : c
    ));

    await supabase
      .from('subscriptions')
      .update({ auto_print: newVal })
      .match({ subscriber_id: session.user.id, creator_id: creatorId });
  };

  // Simulating drop in real backend means... well, we can't easily "simulate" an incoming event without realtime setup.
  // For the prototype, we will just re-fetch data to check for updates.
  const simulateIncomingDrop = () => {
    fetchData();
  };

  const processBatch = () => {
    // In a real backend scenario, this would likely update statuses in DB from 'queued' to 'received'/'printed'.
    // For now, we simulate locally.
    const queuedDrops = drops.filter(d => d.status === 'queued');
    if (queuedDrops.length === 0) return;

    setPrinter(prev => ({ ...prev, isPrinting: true, currentJob: 'Batch Release' }));

    setTimeout(async () => {
        // Update DB statuses
        const updates = queuedDrops.map(d => {
           // check if auto-print enabled for this author? 
           // Logic is complex to replicate perfectly without more queries, 
           // assumes 'received' for batch release unless specific logic added.
           return supabase
             .from('user_drop_statuses')
             .upsert({ user_id: session.user.id, drop_id: d.id, status: 'received' }, { onConflict: 'user_id, drop_id' });
        });
        
        await Promise.all(updates);
        fetchData(); // Refresh UI
        
        setPrinter(prev => ({ ...prev, isPrinting: false, currentJob: undefined }));
    }, 2000);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-[#f5f5f7]">Loading DropaLine...</div>;
  }

  if (!session) {
    return <AuthView />;
  }

  if (!userProfile) {
    return <div className="h-screen flex items-center justify-center">Setting up profile...</div>;
  }

  const renderView = () => {
    switch (view) {
      case AppView.READER:
        return (
          <ReaderView 
            drops={drops} 
            printer={printer} 
            paperSaver={paperSaver}
            onPrint={handlePrintDrop} 
            onLike={handleLikeDrop}
            onAddComment={handleAddComment}
            onSimulateDrop={simulateIncomingDrop}
          />
        );
      case AppView.WRITER:
        return (
          <WriterView 
            userProfile={userProfile}
            onPublish={handlePublishDrop} 
          />
        );
      case AppView.SUBSCRIPTIONS:
        return (
          <SubscriptionsView 
            creators={creators}
            onToggleSubscription={toggleSubscription}
            onToggleAutoPrint={toggleAutoPrint}
          />
        );
      case AppView.SETTINGS:
        return (
          <SettingsView 
            printer={printer} 
            setPrinter={setPrinter} 
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            paperSaver={paperSaver}
            setPaperSaver={setPaperSaver}
            batching={batching}
            setBatching={setBatching}
            customDate={customDate}
            setCustomDate={setCustomDate}
            customTime={customTime}
            setCustomTime={setCustomTime}
            onProcessBatch={processBatch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f5f5f7]">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        userProfile={userProfile}
      />
      <main className="flex-1 overflow-hidden relative">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
