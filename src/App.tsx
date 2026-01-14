
import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { Sidebar } from './components/Sidebar';
import { ReaderView } from './components/ReaderView';
import { WriterView } from './components/WriterView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { SettingsView } from './components/SettingsView';
import { AuthView } from './components/AuthView';
import { MyDropsView } from './components/MyDropsView';
import { AppView, Drop, PrinterState, UserProfile, Creator, Comment } from './types';

// Initial Device State (Local Only)
const INITIAL_PRINTER: PrinterState = {
  isConnected: false,
  name: 'Searching for Printers...',
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
  const [dropsLimit, setDropsLimit] = useState(20);
  const [hasMoreDrops, setHasMoreDrops] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Device & Preference State (Synced to DB)
  const [doubleSided, setDoubleSided] = useState<boolean>(false);
  const [printer, setPrinter] = useState<PrinterState>(INITIAL_PRINTER);
  const [availablePrinters, setAvailablePrinters] = useState<any[]>([]);
  const [batching, setBatching] = useState<string>('Instant');
  const [customDate, setCustomDate] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('');

  // --- Auth & Init ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Fetch available hardware printers (if in Electron)
    if ((window as any).electron) {
      (window as any).electron.getPrinters().then((list: any[]) => {
        setAvailablePrinters(list);

        // Try to load persisted printer
        const savedPrinterName = localStorage.getItem('dropaline_printer_name');
        let printerToSet = list.find(p => p.isDefault) || list[0];

        if (savedPrinterName) {
          if (savedPrinterName === 'SAVE_AS_PDF') {
            printerToSet = { name: 'SAVE_AS_PDF' };
          } else {
            const found = list.find(p => p.name === savedPrinterName);
            if (found) printerToSet = found;
          }
        }

        if (printerToSet) {
          setPrinter(prev => ({ ...prev, name: printerToSet.name, isConnected: true }));
        }
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  // --- Data Fetching & Realtime ---
  const fetchData = async () => {
    if (!session?.user) return;

    // 1. Fetch My Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      const p: UserProfile = {
        id: profile.id,
        name: profile.name,
        handle: profile.handle,
        bio: profile.bio || '',
        avatar: profile.avatar_url,
        batchMode: profile.batch_mode,
        batchDate: profile.batch_date,
        batchTime: profile.batch_time,
        doubleSided: profile.paper_saver
      };
      setUserProfile(p);
      setDoubleSided(p.doubleSided || false);
      setBatching(p.batchMode || 'Instant');
      setCustomDate(p.batchDate || '');
      setCustomTime(p.batchTime || '');
    }

    // 2. Fetch Subscriptions & Creators
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('creator_id, auto_print')
      .eq('subscriber_id', session.user.id);

    const subIds = subs?.map(s => s.creator_id) || [];
    const subMap = new Map(subs?.map(s => [s.creator_id, s.auto_print]));

    // Get profiles with real stats
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select(`
        *,
        creator_stats (subscriber_count)
      `)
      .neq('id', session.user.id)
      .limit(50);

    if (allProfiles) {
      const mappedCreators: Creator[] = allProfiles.map((p: any) => ({
        id: p.id,
        name: p.name,
        handle: p.handle,
        bio: p.bio || '',
        avatar: p.avatar_url,
        followerCount: p.creator_stats?.[0]?.subscriber_count || 0,
        isFollowing: subIds.includes(p.id),
        autoPrint: subMap.get(p.id) || false
      }));
      setCreators(mappedCreators);
    }

    // 3. Fetch Transmissions
    const authorsToFetch = [...subIds, session.user.id];

    const { data: dropsData } = await supabase
      .from('drops')
      .select(`
        *,
        profiles:author_id (name, handle, avatar_url),
        likes (user_id),
        comments (id, text, created_at, profiles (handle, name, avatar_url)),
        user_drop_statuses (user_id, status)
      `)
      .in('author_id', authorsToFetch)
      .order('created_at', { ascending: false })
      .limit(dropsLimit);

    if (dropsData) {
      setHasMoreDrops(dropsData.length >= dropsLimit);
      const mappedDrops: Drop[] = dropsData.map((d: any) => {
        const myStatus = d.user_drop_statuses.find((s: any) => s.user_id === session.user.id)?.status || 'received';
        const isLiked = d.likes.some((l: any) => l.user_id === session.user.id);
        const printCount = d.user_drop_statuses.filter((s: any) => s.status === 'printed').length;

        return {
          id: d.id,
          author: d.profiles.name,
          authorHandle: d.profiles.handle,
          authorAvatar: d.profiles.avatar_url,
          title: d.title,
          content: d.content,
          timestamp: new Date(d.created_at).getTime(),
          status: myStatus, // received | printed | queued
          layout: d.layout,
          likes: d.likes.length,
          liked: isLiked,
          printCount,
          comments: d.comments.length,
          commentList: d.comments.map((c: any) => ({
            id: c.id,
            authorHandle: c.profiles.handle,
            avatar: c.profiles.avatar_url,
            text: c.text,
            timestamp: new Date(c.created_at).getTime()
          }))
        };
      });
      setDrops(mappedDrops);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchData();

      // Consolidated Realtime Channel
      const channel = supabase
        .channel('app-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'drops' },
          () => fetchData()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'likes' },
          () => fetchData()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'comments' },
          () => fetchData()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_drop_statuses' },
          () => fetchData()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles' },
          () => fetchData()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  // --- Persistence ---
  // No longer using local storage, using DB sync

  const handleLoadMore = () => {
    setDropsLimit(prev => prev + 20);
  };

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [dropsLimit]);

  // --- Actions ---

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    if (!session?.user || !userProfile) return;

    // Optimistic Update: Update user profile and related states immediately
    const oldHandle = userProfile.handle;
    setUserProfile(updatedProfile);

    if (updatedProfile.doubleSided !== undefined) setDoubleSided(updatedProfile.doubleSided);
    if (updatedProfile.batchMode !== undefined) setBatching(updatedProfile.batchMode);
    if (updatedProfile.batchDate !== undefined) setCustomDate(updatedProfile.batchDate);
    if (updatedProfile.batchTime !== undefined) setCustomTime(updatedProfile.batchTime);

    // Also update current drops list if author info changed (for immediate reflection)
    setDrops(prev => prev.map(d =>
      d.authorHandle === oldHandle
        ? {
          ...d,
          author: updatedProfile.name,
          authorHandle: updatedProfile.handle,
          authorAvatar: updatedProfile.avatar
        }
        : d
    ));

    const { error } = await supabase
      .from('profiles')
      .update({
        name: updatedProfile.name,
        handle: updatedProfile.handle,
        bio: updatedProfile.bio,
        batch_mode: updatedProfile.batchMode,
        batch_date: updatedProfile.batchDate,
        batch_time: updatedProfile.batchTime,
        paper_saver: updatedProfile.doubleSided,
        avatar_url: updatedProfile.avatar
      })
      .eq('id', session.user.id);

    if (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile. Please try again.');
      // Revert on error
      fetchData();
      return;
    }
  };

  const getAvatarUrl = (url?: string, handle?: string) => {
    if (url && url.includes('supabase.co/storage')) {
      // Add a cache buster if it's a supabase URL
      return `${url}?t=${new Date().getTime()}`;
    }
    if (url && url.trim() !== '') return url;
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${handle || 'neutral'}`;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserProfile(null);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!session?.user || !userProfile) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
    const filePath = fileName;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error', uploadError);
      return;
    }

    // 2. Get Public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    // 3. Update Profile
    const updatedProfile = { ...userProfile, avatar: publicUrl };
    await handleProfileUpdate(updatedProfile);
  };

  const handleSearchCreators = async (query: string) => {
    if (!session?.user) return;
    if (!query.trim()) {
      fetchData(); // Reset to default view
      return;
    }

    const { data: results, error } = await supabase
      .from('profiles')
      .select(`
        *,
        creator_stats (subscriber_count)
      `)
      .neq('id', session.user.id)
      .ilike('handle', `%${query.replace('@', '')}%`)
      .limit(50);

    if (error) {
      console.error('Search error', error);
      return;
    }

    if (results) {
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('creator_id, auto_print')
        .eq('subscriber_id', session.user.id);

      const subIds = subs?.map(s => s.creator_id) || [];
      const subMap = new Map(subs?.map(s => [s.creator_id, s.auto_print]));

      const mapped = results.map((p: any) => ({
        id: p.id,
        name: p.name,
        handle: p.handle,
        bio: p.bio || '',
        avatar: p.avatar_url,
        followerCount: p.creator_stats?.[0]?.subscriber_count || 0,
        isFollowing: subIds.includes(p.id),
        autoPrint: subMap.get(p.id) || false
      }));
      setCreators(mapped);
    }
  };

  const handlePrintDrop = async (dropId: string) => {
    const drop = drops.find(d => d.id === dropId);
    if (!drop) return;

    setPrinter(prev => ({ ...prev, isPrinting: true, currentJob: dropId }));

    // Generate HTML for printing (Gateway Aesthetic)
    const printHtml = `
      <html>
        <head>
          <style>
            @page { margin: 0; }
            body { 
              margin: 0; 
              padding: 0; 
              background: white; 
              display: flex; 
              justify-content: center;
              -webkit-print-color-adjust: exact;
            }
            .paper {
              width: 100%;
              max-width: 450px;
              min-height: 100vh;
              padding: 60px 40px;
              font-family: ${drop.layout === 'zine' ? '"Courier New", Courier, monospace' : 'Georgia, serif'};
              background: white;
              box-sizing: border-box;
            }
            .title {
              text-align: center;
              text-transform: uppercase;
              font-size: 28px;
              margin-bottom: 10px;
              letter-spacing: 2px;
              font-weight: bold;
            }
            .divider {
              border-top: 2px solid black;
              margin: 15px 0;
            }
            .author-line {
              font-style: italic;
              margin-bottom: 25px;
              font-size: 14px;
              color: #444;
            }
            .content {
              font-size: 16px;
              line-height: 1.7;
              color: #1a1a1a;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 0.5px solid #eee;
              font-size: 10px;
              text-align: center;
              color: #888;
              text-transform: uppercase;
              letter-spacing: 1px;
              line-height: 1.5;
            }
          </style>
          <title>Drop a Line</title>
        </head>
        <body>
          <div class="paper">
            <div class="title">${drop.title}</div>
            <div class="divider"></div>
            <div class="author-line">Published by @${drop.authorHandle}</div>
            <div class="content">${drop.content}</div>
            <div class="footer">
              Printed via Drop a Line Output Gateway<br/>
              ${new Date().toLocaleDateString()} • ${new Date().toLocaleTimeString()}
            </div>
          </div>
        </body>
      </html>
    `;

    // 1. Send to real Electron Output (PDF or Hardware)
    if ((window as any).electron) {
      if (printer.name === 'SAVE_AS_PDF') {
        const filename = `${drop.authorHandle}-${drop.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        const success = await (window as any).electron.saveToPDF({ html: printHtml, filename });
        if (!success) {
          setPrinter(prev => ({ ...prev, isPrinting: false, currentJob: undefined }));
          return; // User cancelled save dialog
        }
      } else {
        (window as any).electron.print({
          html: printHtml,
          printerName: printer.name,
          duplexMode: doubleSided ? 'longEdge' : 'simplex'
        });
      }
    }

    // 2. Update status in DB
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

    // Update local state
    setDrops(prev => prev.map(d => d.id === dropId ? { ...d, status: 'printed' } : d));
    setPrinter(prev => ({ ...prev, isPrinting: false, currentJob: undefined }));
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

    const willFollow = !creator.isFollowing;

    // Optimistic
    setCreators(prev => prev.map(c =>
      c.id === creatorId ? { ...c, isFollowing: willFollow } : c
    ));

    if (willFollow) {
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

  // Consolidating printer preference effect here to keep it organized
  useEffect(() => {
    if (printer.name && printer.name !== 'Searching for Printers...') {
      localStorage.setItem('dropaline_printer_name', printer.name);
    }
  }, [printer.name]);

  // Consolidating batch release engine here
  useEffect(() => {
    if (!session?.user || batching === 'Instant') return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      let shouldRelease = false;

      if (batching === 'Daily') {
        if (now.getHours() >= 8) shouldRelease = true;
      } else if (batching === 'Weekly') {
        if (now.getDay() === 0) shouldRelease = true;
      } else if (batching === 'Custom' && customDate && customTime) {
        const releasePoint = new Date(`${customDate}T${customTime}`);
        if (now >= releasePoint) shouldRelease = true;
      }

      if (shouldRelease) {
        const hasQueued = drops.some(d => d.status === 'queued');
        if (hasQueued) processBatch();
      }
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [session, batching, customDate, customTime, drops]);

  const processBatch = async () => {
    const queuedDrops = drops.filter(d => d.status === 'queued');
    if (queuedDrops.length === 0) return;

    setPrinter(prev => ({ ...prev, isPrinting: true, currentJob: 'Batch Release' }));

    // 1. Update all queued drops to received/printed in DB
    const { error } = await supabase
      .from('user_drop_statuses')
      .update({ status: 'received' })
      .eq('user_id', session?.user.id)
      .eq('status', 'queued');

    if (error) {
      console.error('Batch process failed', error);
    } else {
      // 2. Refresh UI
      fetchData();
    }

    setPrinter(prev => ({ ...prev, isPrinting: false, currentJob: undefined }));
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f5f5f7]">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-[#1d1d1f] uppercase tracking-widest animate-pulse">Syncing Gateway...</p>
      </div>
    );
  }

  if (!session) {
    return <AuthView />;
  }

  if (!userProfile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f5f5f7]">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-[#1d1d1f] uppercase tracking-widest animate-pulse">Initialising Profile...</p>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case AppView.READER:
        return (
          <ReaderView
            drops={drops.filter(d => d.authorHandle !== userProfile?.handle)}
            printer={printer}
            doubleSided={doubleSided}
            onPrint={handlePrintDrop}
            onLike={handleLikeDrop}
            onAddComment={handleAddComment}
            onLoadMore={handleLoadMore}
            hasMore={hasMoreDrops}
          />
        );
      case AppView.WRITER:
        return (
          <WriterView
            userProfile={userProfile}
            onPublish={handlePublishDrop}
            doubleSided={doubleSided}
          />
        );
      case AppView.FOLLOWING:
        return (
          <SubscriptionsView
            creators={creators}
            onToggleSubscription={toggleSubscription}
            onToggleAutoPrint={toggleAutoPrint}
            onSearch={handleSearchCreators}
          />
        );
      case AppView.MY_DROPS:
        return (
          <MyDropsView
            drops={drops.filter(d => d.authorHandle === userProfile?.handle)}
            onReply={handleAddComment}
          />
        );
      case AppView.SETTINGS:
        return (
          <SettingsView
            availablePrinters={availablePrinters}
            printer={printer}
            setPrinter={setPrinter}
            userProfile={userProfile}
            onProfileUpdate={handleProfileUpdate}
            onAvatarUpload={handleAvatarUpload}
            doubleSided={doubleSided}
            setDoubleSided={(val) => {
              setDoubleSided(val);
              handleProfileUpdate({ ...userProfile, doubleSided: val } as UserProfile);
            }}
            batching={batching}
            setBatching={(val) => {
              setBatching(val);
              handleProfileUpdate({ ...userProfile, batchMode: val as any } as UserProfile);
            }}
            customDate={customDate}
            setCustomDate={(val) => {
              setCustomDate(val);
              handleProfileUpdate({ ...userProfile, batchDate: val } as UserProfile);
            }}
            customTime={customTime}
            setCustomTime={(val) => {
              setCustomTime(val);
              handleProfileUpdate({ ...userProfile, batchTime: val } as UserProfile);
            }}
            onProcessBatch={processBatch}
            onLogout={handleLogout}
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
