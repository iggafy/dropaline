
import React, { useEffect, useState } from 'react';
import { Download, ArrowRight, Github, Check } from 'lucide-react';
import logo from '../assets/logo.png';

export const LandingView: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const latestVersion = "1.1.0";
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
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#1d1d1f] font-sans antialiased">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
                .animate-scaleIn { animation: scaleIn 0.6s ease-out forwards; opacity: 0; }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .gradient-text {
                    background: linear-gradient(135deg, #1d1d1f 0%, #6e6e73 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }
                html { scroll-behavior: smooth; }
            `}</style>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/80 backdrop-blur-2xl shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Drop a Line" className="w-9 h-9 rounded-xl shadow-sm" />
                        <span className="font-bold text-[17px] tracking-tight">Drop a Line</span>
                    </div>
                    <a
                        href="#download"
                        className="bg-black text-white px-7 py-3 rounded-full text-[15px] font-semibold hover:bg-[#2d2d2d] hover:scale-105 transition-all duration-300 shadow-lg shadow-black/10"
                    >
                        Download Free
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-blue-50/30 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="text-center max-w-5xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-black/5 text-[12px] font-bold uppercase tracking-wider text-[#6e6e73] mb-10 animate-fadeInUp">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Free Early Access • v{latestVersion}
                        </div>

                        <h1 className="text-[72px] lg:text-[96px] xl:text-[112px] font-bold leading-[0.9] tracking-[-0.03em] mb-10 animate-fadeInUp delay-100">
                            Your words.<br />
                            Their hands.
                        </h1>

                        <p className="text-[24px] lg:text-[28px] text-[#6e6e73] leading-[1.5] mb-12 max-w-3xl mx-auto animate-fadeInUp delay-200">
                            The first platform where stories don't just get read—<br className="hidden md:block" />
                            <strong className="text-black">they get held</strong>.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12 animate-fadeInUp delay-300">
                            <a
                                href="#download"
                                className="group inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-[18px] font-semibold hover:bg-[#2d2d2d] hover:scale-105 transition-all duration-300 shadow-2xl shadow-black/20"
                            >
                                <Download size={22} />
                                Start Writing on Paper
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href={githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-10 py-5 text-[18px] font-semibold text-[#6e6e73] hover:text-black transition-colors"
                            >
                                <Github size={22} />
                                View Source
                            </a>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-8 text-[14px] text-[#86868b] animate-fadeInUp delay-400">
                            <div className="flex items-center gap-2">
                                <Check size={16} className="text-emerald-500" />
                                <span>Free forever</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check size={16} className="text-emerald-500" />
                                <span>Open source</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check size={16} className="text-emerald-500" />
                                <span>No subscription</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="max-w-5xl mx-auto animate-scaleIn delay-400">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 animate-float">
                            <img
                                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop"
                                alt="Fountain pen on paper"
                                className="w-full aspect-[16/9] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="glass-card px-8 py-6 rounded-2xl shadow-xl max-w-md">
                                    <p className="text-white text-[15px] font-semibold mb-2">A short story just arrived.</p>
                                    <p className="text-white/80 text-[13px]">You can smell the ink.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Trust Bar */}
            <section className="py-16 px-6 bg-white border-y border-black/5">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-[14px] font-semibold text-[#86868b] uppercase tracking-wider mb-8">
                        Trusted by indie writers worldwide
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
                        <div className="text-[24px] font-bold">📚 Writers</div>
                        <div className="text-[24px] font-bold">📮 Readers</div>
                        <div className="text-[24px] font-bold">🖨️ Printers</div>
                        <div className="text-[24px] font-bold">❤️ Stories</div>
                    </div>
                </div>
            </section>

            {/* The Problem (Emotional Hook) */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-[56px] lg:text-[72px] font-bold leading-[1.1] tracking-tight mb-8">
                        Screens stole<br />
                        something from us.
                    </h2>
                    <p className="text-[22px] lg:text-[26px] text-[#6e6e73] leading-[1.6] mb-12">
                        The pause. The smell. The texture.<br />
                        The simple joy of <strong className="text-black">holding words in your hands</strong>.
                    </p>
                    <p className="text-[20px] text-[#6e6e73] leading-[1.7]">
                        Drop a Line brings it back.
                    </p>
                </div>
            </section>

            {/* The Solution (How It Works) */}
            <section className="py-32 px-6 bg-gradient-to-b from-white to-orange-50/20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-[56px] lg:text-[72px] font-bold leading-[1.1] tracking-tight mb-6">
                            Write once.<br />
                            Print everywhere.
                        </h2>
                        <p className="text-[22px] text-[#6e6e73] max-w-2xl mx-auto">
                            Your readers don't get notifications. They get <strong className="text-black">paper</strong>.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                emoji: "✍️",
                                title: "You write",
                                description: "Craft your story in beautiful layouts designed for paper. Zine-style, classic, or minimal—your choice."
                            },
                            {
                                emoji: "📡",
                                title: "You publish",
                                description: "Hit send. Your words travel through the network to every reader who follows you."
                            },
                            {
                                emoji: "🖨️",
                                title: "They receive",
                                description: "Their printer wakes up. Your story appears. A physical connection across any distance."
                            }
                        ].map((step, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-[80px] mb-6 group-hover:scale-110 transition-transform duration-300">{step.emoji}</div>
                                <h3 className="text-[28px] font-bold mb-4">{step.title}</h3>
                                <p className="text-[17px] text-[#6e6e73] leading-[1.7]">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features (Benefits-Focused) */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                        <div>
                            <h3 className="text-[48px] lg:text-[56px] font-bold leading-[1.1] mb-8">
                                For writers who want to be <em className="italic not-italic text-[#6e6e73]">felt</em>, not just read.
                            </h3>
                            <div className="space-y-6 text-[18px] text-[#6e6e73] leading-[1.7]">
                                <div className="flex gap-4">
                                    <Check size={24} className="text-emerald-500 shrink-0 mt-1" />
                                    <p><strong className="text-black">Build a real audience</strong> that holds your words, not just scrolls past them</p>
                                </div>
                                <div className="flex gap-4">
                                    <Check size={24} className="text-emerald-500 shrink-0 mt-1" />
                                    <p><strong className="text-black">Own your distribution</strong>—no algorithm decides who sees your work</p>
                                </div>
                                <div className="flex gap-4">
                                    <Check size={24} className="text-emerald-500 shrink-0 mt-1" />
                                    <p><strong className="text-black">Create something permanent</strong> that readers can keep, share, and revisit</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=1973&auto=format&fit=crop"
                                alt="Stack of written pages"
                                className="w-full aspect-square object-cover rounded-3xl shadow-2xl"
                            />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <img
                                src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop"
                                alt="Reading printed pages"
                                className="w-full aspect-square object-cover rounded-3xl shadow-2xl"
                            />
                        </div>
                        <div className="order-1 lg:order-2">
                            <h3 className="text-[48px] lg:text-[56px] font-bold leading-[1.1] mb-8">
                                For readers who miss the <em className="italic not-italic text-[#6e6e73]">ritual</em>.
                            </h3>
                            <div className="space-y-6 text-[18px] text-[#6e6e73] leading-[1.7]">
                                <div className="flex gap-4">
                                    <Check size={24} className="text-emerald-500 shrink-0 mt-1" />
                                    <p><strong className="text-black">Your printer becomes your inbox</strong>—stories arrive on your terms</p>
                                </div>
                                <div className="flex gap-4">
                                    <Check size={24} className="text-emerald-500 shrink-0 mt-1" />
                                    <p><strong className="text-black">Read without screens</strong>—no blue light, no distractions, just words</p>
                                </div>
                                <div className="flex gap-4">
                                    <Check size={24} className="text-emerald-500 shrink-0 mt-1" />
                                    <p><strong className="text-black">Support writers directly</strong> by experiencing their work the way it was meant to be felt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial / Quote */}
            <section className="py-32 px-6 bg-black text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[32px] lg:text-[42px] font-bold leading-[1.4] mb-8 italic">
                        "This isn't just software.<br />
                        It's a love letter to the written word."
                    </p>
                    <p className="text-[16px] text-white/60">— Early Access Writer</p>
                </div>
            </section>

            {/* Download CTA */}
            <section id="download" className="py-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-[56px] lg:text-[72px] font-bold leading-[1.1] tracking-tight mb-6">
                        Start your first drop.
                    </h2>
                    <p className="text-[24px] text-[#6e6e73] mb-16 max-w-2xl mx-auto">
                        Download Drop a Line for free. No credit card. No subscription.<br />
                        Just you, your words, and your readers.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                        {[
                            { name: 'macOS', link: downloadLinks.mac, subtitle: 'Apple Silicon & Intel' },
                            { name: 'Windows', link: downloadLinks.windows, subtitle: 'Windows 10+' },
                            { name: 'Linux', link: downloadLinks.linux, subtitle: 'Debian/Ubuntu' }
                        ].map((platform, i) => (
                            <a
                                key={i}
                                href={platform.link}
                                className="group bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-black/5 hover:border-black/20 hover:scale-105"
                            >
                                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-black to-[#2d2d2d] text-white rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    <Download size={32} />
                                </div>
                                <h3 className="text-[24px] font-bold mb-2">{platform.name}</h3>
                                <p className="text-[14px] text-[#6e6e73] font-medium">{platform.subtitle}</p>
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-8 border-t border-black/5">
                        <p className="text-[14px] text-[#86868b]">Open source • Independent • No tracking</p>
                        <a href={downloadLinks.releases} className="text-[15px] font-semibold text-black hover:opacity-70 transition-opacity">
                            View all releases on GitHub →
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-black/5 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg" />
                            <span className="text-[15px] font-bold">Drop a Line</span>
                        </div>
                        <div className="flex gap-8 text-[14px] font-medium text-[#6e6e73]">
                            <a href={githubRepo} className="hover:text-black transition-colors">GitHub</a>
                            <a href="#" className="hover:text-black transition-colors">Privacy</a>
                            <a href="#" className="hover:text-black transition-colors">Terms</a>
                        </div>
                    </div>
                    <p className="text-center text-[13px] text-[#86868b]">
                        © 2026 Drop a Line. Indie stories. Fresh ink. Real paper.
                    </p>
                </div>
            </footer>
        </div>
    );
};
