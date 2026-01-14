
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
        <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased overflow-x-hidden">
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
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }

                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }

                .gradient-text {
                    background: linear-gradient(135deg, #1d1d1f 0%, #6e6e73 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .glass {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }

                html {
                    scroll-behavior: smooth;
                }
            `}</style>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'glass border-b border-black/5 shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Drop a Line" className="w-9 h-9 rounded-xl" />
                        <span className="font-bold text-[17px] tracking-tight">Drop a Line</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-[15px] font-medium text-[#6e6e73] hover:text-black transition-colors">Features</a>
                        <a href="#download" className="text-[15px] font-medium text-[#6e6e73] hover:text-black transition-colors">Download</a>
                        <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="text-[15px] font-medium text-[#6e6e73] hover:text-black transition-colors">GitHub</a>
                    </div>
                    <a
                        href="#download"
                        className="bg-black text-white px-5 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#2d2d2d] transition-all shadow-lg shadow-black/10"
                    >
                        Get the App
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/[0.03] rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[#6e6e73] mb-8 opacity-0 fade-in">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Version {latestVersion} Now Available
                        </div>

                        <h1 className="text-[64px] md:text-[88px] lg:text-[104px] font-bold tracking-[-0.03em] leading-[0.95] mb-8 opacity-0 fade-in-up delay-100">
                            Writers' words.<br />
                            <span className="gradient-text">Readers' paper.</span>
                        </h1>

                        <p className="text-[20px] md:text-[24px] text-[#6e6e73] leading-[1.4] max-w-2xl mx-auto mb-12 opacity-0 fade-in-up delay-200">
                            A quiet space for those who still believe in the magic of ink and paper.
                            A direct line from a writer's screen to a reader's hands.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 fade-in-up delay-300">
                            <a
                                href="#download"
                                className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-[16px] font-semibold hover:bg-[#2d2d2d] transition-all shadow-2xl shadow-black/20"
                            >
                                <Download size={20} />
                                Download for Desktop
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href={githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#6e6e73] hover:text-black transition-colors"
                            >
                                <Github size={20} />
                                View on GitHub
                            </a>
                        </div>

                        <p className="text-[13px] text-[#86868b] mt-6 opacity-0 fade-in delay-400">
                            Available for Windows, macOS, and Linux
                        </p>
                    </div>
                </div>

                {/* Decorative gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-black/[0.02] to-transparent rounded-full blur-3xl -z-10"></div>
            </section>

            {/* Hero Image */}
            <section className="px-6 pb-32">
                <div className="max-w-6xl mx-auto opacity-0 fade-in-up delay-500">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[32px] z-10"></div>
                        <img
                            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                            alt="Drop a Line Interface"
                            className="w-full aspect-[16/10] object-cover rounded-[32px] shadow-2xl shadow-black/10"
                        />
                        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20">
                            <div className="glass px-6 py-4 rounded-2xl border border-white/20 shadow-xl">
                                <p className="text-[13px] font-bold text-black/80">Auto-Print Active</p>
                                <p className="text-[11px] text-black/50 mt-1">Connected: Thermal Relay 01</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-20">
                        <h2 className="text-[48px] md:text-[64px] font-bold tracking-[-0.02em] leading-[1.1] mb-6">
                            Built for permanence.
                        </h2>
                        <p className="text-[20px] text-[#6e6e73] leading-[1.5]">
                            In a world of infinite scrolling and disappearing stories, Drop a Line creates something you can hold.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Physical Inboxes",
                                description: "When someone you follow drops a line, your printer wakes up automatically. No notifications, just paper.",
                                icon: "📬"
                            },
                            {
                                title: "Beautiful Layouts",
                                description: "Choose from Zine, Classic, or Minimal layouts. Every drop is designed to look stunning on a physical page.",
                                icon: "✨"
                            },
                            {
                                title: "Private Lines",
                                description: "Send encrypted, direct letters to specific friends. They print only on their device.",
                                icon: "🔒"
                            },
                            {
                                title: "Desktop Native",
                                description: "Built exclusively for desktop to ensure seamless hardware connection and distraction-free writing.",
                                icon: "💻"
                            },
                            {
                                title: "Auto-Print Queue",
                                description: "Set your preferences: instant, daily batches, or weekly digests. Your printer, your schedule.",
                                icon: "⚙️"
                            },
                            {
                                title: "Open Source",
                                description: "Fully transparent, community-driven, and built for freedom. No corporate certificates required.",
                                icon: "🌐"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5">
                                <div className="text-[40px] mb-4">{feature.icon}</div>
                                <h3 className="text-[20px] font-bold mb-3">{feature.title}</h3>
                                <p className="text-[15px] text-[#6e6e73] leading-[1.6]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section id="download" className="py-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-[48px] md:text-[64px] font-bold tracking-[-0.02em] leading-[1.1] mb-6">
                        Ready to join the quiet network?
                    </h2>
                    <p className="text-[20px] text-[#6e6e73] mb-16 max-w-2xl mx-auto">
                        Download the official Drop a Line desktop application for your platform.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                        {[
                            { name: 'Windows', file: '.exe', link: downloadLinks.windows },
                            { name: 'macOS', file: '.dmg', link: downloadLinks.mac },
                            { name: 'Linux', file: '.AppImage', link: downloadLinks.linux }
                        ].map((platform, i) => (
                            <a
                                key={i}
                                href={platform.link}
                                className="group bg-white p-8 rounded-3xl border border-black/5 hover:border-black/20 shadow-sm hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center w-16 h-16 bg-black/5 group-hover:bg-black group-hover:text-white rounded-2xl mx-auto mb-4 transition-all duration-300">
                                    <Download size={28} />
                                </div>
                                <h3 className="text-[18px] font-bold mb-2">{platform.name}</h3>
                                <p className="text-[13px] text-[#6e6e73] font-medium">Download {platform.file}</p>
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-8 border-t border-black/5">
                        <p className="text-[13px] text-[#86868b]">Indie Developer Signed (Unsigned binaries)</p>
                        <a href={downloadLinks.releases} className="text-[14px] font-semibold text-black hover:opacity-70 transition-opacity">
                            View All Releases →
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-black/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg opacity-40" />
                        <span className="text-[14px] font-semibold text-[#86868b]">Drop a Line</span>
                    </div>
                    <div className="flex gap-8 text-[14px] font-medium text-[#86868b]">
                        <a href="#" className="hover:text-black transition-colors">Privacy</a>
                        <a href="#" className="hover:text-black transition-colors">Terms</a>
                        <a href={githubRepo} className="hover:text-black transition-colors">GitHub</a>
                    </div>
                    <p className="text-[13px] text-[#86868b]">
                        © 2026 Drop a Line. Writers' words. Readers' paper.
                    </p>
                </div>
            </footer>
        </div>
    );
};
