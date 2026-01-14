
import React, { useEffect, useState } from 'react';
import { Download, ArrowRight, Github } from 'lucide-react';
import logo from '../assets/logo.png';

export const LandingView: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const latestVersion = "1.1.0";
    const githubRepo = "https://github.com/iggafy/dropaline";

    const downloadLinks = {
        windows: `${githubRepo}/releases/download/v${latestVersion}/dropaline-Setup-${latestVersion}.exe`,
        mac: `${githubRepo}/releases/download/v${latestVersion}/dropaline-${latestVersion}-arm64.dmg`,
        linux: `${githubRepo}/releases/download/v${latestVersion}/dropaline-${latestVersion}.AppImage`,
        releases: `${githubRepo}/releases`
    };

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#1d1d1f] font-sans antialiased">
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }

                html {
                    scroll-behavior: smooth;
                }
            `}</style>

            {/* Minimal Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-[#fafafa]/90 backdrop-blur-xl border-b border-black/5' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Drop a Line" className="w-8 h-8 rounded-lg" />
                        <span className="font-bold text-[16px] tracking-tight">Drop a Line</span>
                    </div>
                    <a
                        href="#download"
                        className="bg-black text-white px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#2d2d2d] transition-all"
                    >
                        Get the App
                    </a>
                </div>
            </nav>

            {/* Hero Section - Full Width */}
            <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
                <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-16 items-center py-32">
                    {/* Left: Message */}
                    <div className="opacity-0 fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/[0.04] rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[#6e6e73] mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            v{latestVersion}
                        </div>

                        <h1 className="text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[0.95] mb-8">
                            Writers' words.<br />
                            <span className="text-[#86868b]">Readers' paper.</span>
                        </h1>

                        <p className="text-[20px] lg:text-[24px] text-[#6e6e73] leading-[1.5] mb-10">
                            A personal connection between you and your readers.
                            Your words, delivered to their hands.
                            The way reading was meant to feel.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#download"
                                className="group inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-full text-[16px] font-semibold hover:bg-[#2d2d2d] transition-all shadow-xl shadow-black/10"
                            >
                                <Download size={20} />
                                Download Now
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href={githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 text-[16px] font-semibold text-[#6e6e73] hover:text-black transition-colors px-8 py-4"
                            >
                                <Github size={20} />
                                Open Source
                            </a>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="opacity-0 fade-in-up delay-200 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
                            <img
                                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop"
                                alt="Handwritten letter on paper"
                                className="w-full aspect-[4/5] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-32 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-[48px] lg:text-[56px] font-bold tracking-[-0.02em] leading-[1.1] mb-8">
                                The smell of ink.<br />
                                The feel of paper.
                            </h2>
                            <div className="space-y-6 text-[18px] text-[#6e6e73] leading-[1.7]">
                                <p>
                                    In a world that moves too fast, we're building something you can hold.
                                    Something that smells like morning coffee and feels like a handwritten letter.
                                </p>
                                <p>
                                    When you follow a writer on Drop a Line, their words don't just appear on a screen.
                                    They arrive at your desk. Physical. Permanent. Yours to keep.
                                </p>
                                <p>
                                    This is reading the way you like it. Slow. Intentional. Real.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=1973&auto=format&fit=crop"
                                alt="Stack of papers and letters"
                                className="w-full aspect-square object-cover rounded-3xl shadow-xl shadow-black/10"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 px-6 bg-[#fafafa]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-[48px] lg:text-[56px] font-bold tracking-[-0.02em] leading-[1.1] mb-20 text-center">
                        A direct line to your readers.
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="text-[64px] mb-6">✍️</div>
                            <h3 className="text-[24px] font-bold mb-4">You write</h3>
                            <p className="text-[16px] text-[#6e6e73] leading-[1.6]">
                                Choose your layout. Craft your message.
                                Write like you're sending a letter to a friend.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-[64px] mb-6">📮</div>
                            <h3 className="text-[24px] font-bold mb-4">You publish</h3>
                            <p className="text-[16px] text-[#6e6e73] leading-[1.6]">
                                Hit send. Your words travel through the network,
                                finding their way to every reader who follows you.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-[64px] mb-6">📄</div>
                            <h3 className="text-[24px] font-bold mb-4">They receive</h3>
                            <p className="text-[16px] text-[#6e6e73] leading-[1.6]">
                                Their printer wakes up. Your words appear.
                                A physical connection across any distance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section id="download" className="py-32 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-[48px] lg:text-[56px] font-bold tracking-[-0.02em] leading-[1.1] mb-6">
                        Join the quiet network.
                    </h2>
                    <p className="text-[20px] text-[#6e6e73] mb-16 max-w-2xl mx-auto">
                        Download Drop a Line for your desktop and start building personal connections with your readers.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                        {[
                            { name: 'Windows', link: downloadLinks.windows },
                            { name: 'macOS', link: downloadLinks.mac },
                            { name: 'Linux', link: downloadLinks.linux }
                        ].map((platform, i) => (
                            <a
                                key={i}
                                href={platform.link}
                                className="group bg-[#fafafa] p-10 rounded-3xl border border-black/5 hover:border-black/20 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center w-16 h-16 bg-black/5 group-hover:bg-black group-hover:text-white rounded-2xl mx-auto mb-6 transition-all duration-300">
                                    <Download size={28} />
                                </div>
                                <h3 className="text-[20px] font-bold mb-2">{platform.name}</h3>
                                <p className="text-[14px] text-[#6e6e73] font-medium">Free Download</p>
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-8 border-t border-black/5">
                        <p className="text-[13px] text-[#86868b]">Independent software • Open source</p>
                        <a href={downloadLinks.releases} className="text-[14px] font-semibold text-black hover:opacity-70 transition-opacity">
                            View all releases on GitHub →
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-black/5 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-7 h-7 rounded-lg opacity-40" />
                        <span className="text-[14px] font-semibold text-[#86868b]">Drop a Line</span>
                    </div>
                    <p className="text-[13px] text-[#86868b]">
                        © 2026 Drop a Line. Writers' words. Readers' paper.
                    </p>
                </div>
            </footer>
        </div>
    );
};
