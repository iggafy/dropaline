
import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { PrivacyView } from './PrivacyView';
import { TermsView } from './TermsView';

export const LandingView: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const [showCookieBanner, setShowCookieBanner] = useState(false);
    const [currentPage, setCurrentPage] = useState<'landing' | 'privacy' | 'terms'>('landing');
    const latestVersion = "1.2.0";
    const githubRepo = "https://github.com/iggafy/dropaline";

    const downloadLinks = {
        windows: `${githubRepo}/releases/download/v${latestVersion}/Drop-a-Line-Setup-${latestVersion}.exe`,
        mac: `${githubRepo}/releases/download/v${latestVersion}/Drop-a-Line-${latestVersion}-arm64.dmg`,
        linux: `${githubRepo}/releases/download/v${latestVersion}/dropaline_${latestVersion}_amd64.deb`,
        releases: `${githubRepo}/releases`
    };

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });

        const cookieConsent = localStorage.getItem('dropaline_cookie_consent');
        if (!cookieConsent) {
            setShowCookieBanner(true);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('dropaline_cookie_consent', 'accepted');
        setShowCookieBanner(false);
    };

    if (currentPage === 'privacy') {
        return <PrivacyView onBack={() => setCurrentPage('landing')} />;
    }

    if (currentPage === 'terms') {
        return <TermsView onBack={() => setCurrentPage('landing')} />;
    }

    return (
        <div className="w-full min-h-screen bg-white text-[#1d1d1f] font-sans antialiased overflow-x-hidden">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }
                html { scroll-behavior: smooth; }
            `}</style>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-xl border-b border-black/5' : 'bg-transparent'}`}>
                <div className="max-w-6xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Drop a Line" className="w-8 h-8 rounded-lg" />
                        <span className="font-bold text-[16px]">Drop a Line</span>
                    </div>
                    <a
                        href="#download"
                        className="bg-black text-white px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#2d2d2d] transition-all"
                    >
                        Download
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-20">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-[72px] md:text-[96px] lg:text-[112px] font-bold leading-[0.9] tracking-[-0.03em] mb-10 fade-in">
                        Writers' words.<br />
                        Readers' paper.
                    </h1>

                    <p className="text-[22px] md:text-[26px] text-[#6e6e73] leading-[1.5] mb-16 max-w-3xl mx-auto fade-in delay-1">
                        A direct line from a writer's screen to a reader's hands.
                    </p>

                    <a
                        href="#download"
                        className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-[17px] font-semibold hover:bg-[#2d2d2d] transition-all shadow-lg fade-in delay-2"
                    >
                        <Download size={20} />
                        Download for Desktop
                    </a>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-32 px-6 bg-[#fafafa]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-tight mb-8">
                        Words deserve pause.
                    </h2>
                    <p className="text-[20px] md:text-[24px] text-[#6e6e73] leading-[1.6] mb-12">
                        A smell. A texture. Something you can hold.
                    </p>
                    <p className="text-[18px] md:text-[20px] text-[#6e6e73] leading-[1.7] max-w-2xl mx-auto">
                        Drop a Line brings reading back to the analog world. Writers share stories. Readers connect a printer.
                        New stories print right away—so you can read on paper, anytime, anywhere.
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-tight mb-6">
                            Write once.<br />
                            Print everywhere.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16">
                        <div className="text-center">
                            <h3 className="text-[24px] font-bold mb-4">You write</h3>
                            <p className="text-[17px] text-[#6e6e73] leading-[1.7]">
                                Craft your story in layouts designed for paper.
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-[24px] font-bold mb-4">You publish</h3>
                            <p className="text-[17px] text-[#6e6e73] leading-[1.7]">
                                Your words travel to every reader who follows you.
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-[24px] font-bold mb-4">They receive</h3>
                            <p className="text-[17px] text-[#6e6e73] leading-[1.7]">
                                Their printer wakes up. Your story appears.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Writers / Readers */}
            <section className="py-32 px-6 bg-[#fafafa]">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
                    <div>
                        <h3 className="text-[40px] md:text-[48px] font-bold leading-[1.1] mb-6">
                            For writers
                        </h3>
                        <p className="text-[18px] text-[#6e6e73] leading-[1.7] mb-8">
                            Build an audience that holds your words, not just scrolls past them.
                            No algorithm decides who sees your work.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-[40px] md:text-[48px] font-bold leading-[1.1] mb-6">
                            For readers
                        </h3>
                        <p className="text-[18px] text-[#6e6e73] leading-[1.7] mb-8">
                            Your printer becomes your inbox. Stories arrive on your terms.
                            Read without screens, distractions, or blue light.
                        </p>
                    </div>
                </div>
            </section>

            {/* Download */}
            <section id="download" className="py-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-tight mb-16">
                        Download Drop a Line
                    </h2>

                    <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                        {[
                            { name: 'macOS', link: downloadLinks.mac },
                            { name: 'Windows', link: downloadLinks.windows },
                            { name: 'Linux', link: downloadLinks.linux }
                        ].map((platform, i) => (
                            <a
                                key={i}
                                href={platform.link}
                                className="group bg-white p-10 rounded-2xl border border-black/10 hover:border-black/30 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center justify-center w-16 h-16 bg-black text-white rounded-xl mx-auto mb-6 group-hover:scale-105 transition-transform">
                                    <Download size={28} />
                                </div>
                                <h3 className="text-[20px] font-bold">{platform.name}</h3>
                            </a>
                        ))}
                    </div>

                    <p className="text-[16px] text-[#6e6e73] font-medium">
                        Fresh ink, fresh stories, free while it lasts.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-black/5">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Logo" className="w-7 h-7 rounded-lg opacity-40" />
                            <span className="text-[14px] font-semibold text-[#86868b]">Drop a Line</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-[14px] font-medium text-[#6e6e73]">
                            <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">GitHub</a>
                            <button onClick={() => setCurrentPage('privacy')} className="hover:text-black transition-colors">Privacy</button>
                            <button onClick={() => setCurrentPage('terms')} className="hover:text-black transition-colors">Terms</button>
                        </div>
                    </div>
                    <p className="text-center text-[13px] text-[#86868b]">
                        © 2026 Drop a Line
                    </p>
                </div>
            </footer>

            {/* Cookie Banner */}
            {showCookieBanner && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-black/10 p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-[14px] text-[#6e6e73] leading-[1.6]">
                                    This site uses minimal analytics to understand usage. No tracking. No ads.{' '}
                                    <button onClick={() => setCurrentPage('privacy')} className="text-black font-semibold hover:underline">
                                        Learn more
                                    </button>
                                </p>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={acceptCookies}
                                    className="flex-1 md:flex-none bg-black text-white px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#2d2d2d] transition-all"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => setShowCookieBanner(false)}
                                    className="p-2.5 hover:bg-black/5 rounded-full transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
