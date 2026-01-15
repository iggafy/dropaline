
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { UserProfile, PrinterState, Creator } from '../types';
import { Printer, Check, ArrowRight, BookOpen, PenTool, Layers, CheckCircle } from 'lucide-react';

interface OnboardingProps {
    profile: UserProfile;
    onComplete: () => void;
    availablePrinters: any[];
    currentPrinter: PrinterState;
    onSetPrinter: (p: PrinterState) => void;
    creators: Creator[];
    onToggleFollow: (creatorId: string) => void;
}

export const OnboardingView: React.FC<OnboardingProps> = ({
    profile,
    onComplete,
    availablePrinters,
    currentPrinter,
    onSetPrinter,
    creators,
    onToggleFollow
}) => {
    const [step, setStep] = useState(1);
    const [intent, setIntent] = useState<'writer' | 'reader' | 'both' | null>(null);
    const [readPrefs, setReadPrefs] = useState<string[]>([]);
    const [writePrefs, setWritePrefs] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial load of profile data if present
    useEffect(() => {
        if (profile.userIntent) setIntent(profile.userIntent);
        if (profile.readingPreferences) setReadPrefs(profile.readingPreferences);
        if (profile.writingPreferences) setWritePrefs(profile.writingPreferences);
    }, [profile]);

    const handleNext = async () => {
        if (step === 1 && !intent) return;

        let nextStep = step + 1;

        // Skip logic based on intent
        if (step === 1) {
            if (intent === 'writer') nextStep = 3; // Skip reading prefs
        }
        if (step === 2) { // Just finished Reading Prefs
            if (intent === 'reader') nextStep = 4; // Skip writing prefs
        }

        // Save progress to DB
        await saveProgress();
        setStep(nextStep);
    };

    const saveProgress = async () => {
        const updates: any = {
            user_intent: intent,
            reading_preferences: readPrefs,
            writing_preferences: writePrefs
        };
        await supabase.from('profiles').update(updates).eq('id', profile.id);
    };

    const finishOnboarding = async () => {
        setIsSubmitting(true);
        await supabase.from('profiles').update({
            onboarding_completed: true,
            // Ensure final state is saved
            user_intent: intent,
            reading_preferences: readPrefs,
            writing_preferences: writePrefs
        }).eq('id', profile.id);
        onComplete();
    };

    const togglePref = (list: string[], setList: (l: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    // Step 1: Welcome & Intent
    if (step === 1) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--primary-bg)] text-[var(--text-main)] p-8 fade-in">
                <div className="max-w-2xl w-full text-center">
                    <h1 className="text-4xl font-bold mb-8 font-serif">Welcome, {profile.name.split(' ')[0]}.</h1>
                    <h2 className="text-2xl mb-12 opacity-80">Are you here to...</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <button
                            onClick={() => setIntent('writer')}
                            className={`p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 hover:scale-[1.02] ${intent === 'writer' ? 'border-[var(--accent-color)] bg-[var(--hover-bg)]' : 'border-[var(--border-color)]'}`}
                        >
                            <PenTool size={32} />
                            <span className="text-lg font-bold">Drop a Line</span>
                            <span className="text-sm opacity-60">Publish stories, essays, poems</span>
                        </button>

                        <button
                            onClick={() => setIntent('reader')}
                            className={`p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 hover:scale-[1.02] ${intent === 'reader' ? 'border-[var(--accent-color)] bg-[var(--hover-bg)]' : 'border-[var(--border-color)]'}`}
                        >
                            <BookOpen size={32} />
                            <span className="text-lg font-bold">Read & Discover</span>
                            <span className="text-sm opacity-60">Follow writers, print drops</span>
                        </button>

                        <button
                            onClick={() => setIntent('both')}
                            className={`p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 hover:scale-[1.02] ${intent === 'both' ? 'border-[var(--accent-color)] bg-[var(--hover-bg)]' : 'border-[var(--border-color)]'}`}
                        >
                            <Layers size={32} />
                            <span className="text-lg font-bold">Both</span>
                            <span className="text-sm opacity-60">Write and read</span>
                        </button>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!intent}
                        className="px-8 py-3 bg-[var(--text-main)] text-[var(--primary-bg)] rounded-full font-bold text-lg disabled:opacity-30 hover:opacity-90 transition-opacity"
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    // Step 2: Reading Preferences
    if (step === 2) {
        const options = [
            "Short stories / Fiction",
            "Poetry / Essays",
            "Serialized stories / Zines",
            "Experimental / Flash fiction",
            "Memoirs / Biographies",
            "Tech / Code",
            "Satire / Humor",
            "Letters / Correspondence",
            "Philosophy / Theory",
            "Art / Design",
            "Screenplays / Scripts",
            "Comics / Graphic Novels",
            "Academic / Research"
        ];
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--primary-bg)] text-[var(--text-main)] p-8 fade-in">
                <div className="max-w-2xl w-full text-center">
                    <h2 className="text-3xl font-bold mb-8 font-serif">What kind of stories do you like to read?</h2>

                    <div className="flex flex-col gap-4 mb-12">
                        {options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => togglePref(readPrefs, setReadPrefs, opt)}
                                className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${readPrefs.includes(opt) ? 'border-[var(--accent-color)] bg-[var(--hover-bg)]' : 'border-[var(--border-color)]'}`}
                            >
                                <span className="text-lg">{opt}</span>
                                {readPrefs.includes(opt) && <Check size={20} className="text-[var(--accent-color)]" />}
                            </button>
                        ))}
                    </div>

                    <button onClick={handleNext} className="px-8 py-3 bg-[var(--text-main)] text-[var(--primary-bg)] rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
                        Next
                    </button>
                </div>
            </div>
        );
    }

    // Step 3: Writing Preferences
    if (step === 3) {
        const options = [
            "Short stories / Fiction",
            "Poetry / Essays",
            "Serialized work / Issues",
            "Experimental formats",
            "Journalism / Reporting",
            "Reviews / Critiques",
            "Recipes / Food",
            "Sci-Fi / Speculative",
            "Historical / Heritage",
            "Diaries / Journals",
            "Lyrics / Songwriting",
            "Manifestos / Polemics",
            "Translations"
        ];
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--primary-bg)] text-[var(--text-main)] p-8 fade-in">
                <div className="max-w-2xl w-full text-center">
                    <h2 className="text-3xl font-bold mb-8 font-serif">What kind of writing do you publish?</h2>

                    <div className="flex flex-col gap-4 mb-12">
                        {options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => togglePref(writePrefs, setWritePrefs, opt)}
                                className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${writePrefs.includes(opt) ? 'border-[var(--accent-color)] bg-[var(--hover-bg)]' : 'border-[var(--border-color)]'}`}
                            >
                                <span className="text-lg">{opt}</span>
                                {writePrefs.includes(opt) && <Check size={20} className="text-[var(--accent-color)]" />}
                            </button>
                        ))}
                    </div>

                    <button onClick={handleNext} className="px-8 py-3 bg-[var(--text-main)] text-[var(--primary-bg)] rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
                        Next
                    </button>
                </div>
            </div>
        );
    }

    // Step 4: Connect Printer
    if (step === 4) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--primary-bg)] text-[var(--text-main)] p-8 fade-in">
                <div className="max-w-2xl w-full text-center">
                    <h2 className="text-3xl font-bold mb-4 font-serif">Almost ready!</h2>
                    <p className="text-xl opacity-70 mb-12">Connect your printer to start receiving drops. Their stories will hit your inbox.</p>

                    <div className="bg-[var(--secondary-bg)] p-8 rounded-2xl mb-12 text-left">
                        <div className="flex items-center gap-4 mb-6">
                            <Printer size={32} />
                            <div>
                                <h3 className="font-bold text-lg">Select Printer</h3>
                                <p className="text-sm opacity-60">Choose where stories should appear</p>
                            </div>
                        </div>

                        <select
                            value={currentPrinter.name}
                            onChange={(e) => {
                                const selected = availablePrinters.find(p => p.name === e.target.value);
                                if (selected) onSetPrinter({ ...currentPrinter, name: selected.name, isConnected: true });
                                else if (e.target.value === 'SAVE_AS_PDF') onSetPrinter({ ...currentPrinter, name: 'SAVE_AS_PDF', isConnected: true });
                            }}
                            className="w-full p-4 rounded-xl bg-[var(--primary-bg)] border border-[var(--border-color)] mb-4"
                        >
                            <option value="">Select a printer...</option>
                            {availablePrinters.map(p => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                            <option value="SAVE_AS_PDF">Save as PDF (Virtual)</option>
                        </select>

                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${currentPrinter.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-medium">
                                {currentPrinter.isConnected ? 'Connected' : 'Not Connected'}
                            </span>
                        </div>
                    </div>

                    <button onClick={handleNext} className="px-8 py-3 bg-[var(--text-main)] text-[var(--primary-bg)] rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
                        Finish Setup
                    </button>
                </div>
            </div>
        );
    }

    // Step 5: Into to Passing Lines
    if (step === 5) {
        const activeWriters = creators.slice(0, 8); // Take first 8

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--primary-bg)] text-[var(--text-main)] p-8 fade-in">
                <div className="max-w-4xl w-full text-center">
                    <h2 className="text-4xl font-bold mb-6 font-serif">Here's Passing Lines</h2>
                    <p className="text-xl opacity-70 mb-16 max-w-2xl mx-auto">
                        A parade of active writers. Follow the ones that call to you, and their stories will hit your inbox.
                    </p>

                    {/* Simple Concept Animation/Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {activeWriters.map((creator, i) => (
                            <div key={creator.id} className="group relative aspect-[3/4] bg-[var(--secondary-bg)] rounded-xl p-4 flex flex-col items-center justify-between border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all">
                                <img src={creator.avatar} alt={creator.name} className="w-16 h-16 rounded-full object-cover mb-2" />
                                <div className="text-center">
                                    <h3 className="font-bold text-sm truncate w-full">{creator.name}</h3>
                                    <p className="text-xs opacity-60 truncate w-full">@{creator.handle}</p>
                                    <p className="text-xs opacity-70 line-clamp-2 w-full mt-1 italic">"{creator.bio || '...'}"</p>
                                </div>
                                <button
                                    onClick={() => onToggleFollow(creator.id)}
                                    className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${creator.isFollowing ? 'bg-transparent border border-[var(--accent-color)] text-[var(--text-main)]' : 'bg-[var(--text-main)] border border-[var(--text-main)] text-[var(--primary-bg)] hover:opacity-90'}`}
                                >
                                    {creator.isFollowing ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        ))}
                        {activeWriters.length === 0 && (
                            <div className="col-span-full text-center py-10 opacity-50">
                                Loading active writers...
                            </div>
                        )}
                    </div>

                    <button
                        onClick={finishOnboarding}
                        disabled={isSubmitting}
                        className="px-10 py-4 bg-[var(--text-main)] text-[var(--primary-bg)] rounded-full font-bold text-xl hover:opacity-90 transition-opacity flex items-center gap-3 mx-auto"
                    >
                        {isSubmitting ? 'Finishing...' : 'Go to Inbox'}
                        <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
