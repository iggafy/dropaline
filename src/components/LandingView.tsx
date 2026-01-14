
import React, { useEffect, useState } from 'react';
import { Download, Github } from 'lucide-react';
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
        <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased">
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
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Drop a Line" className="w-8 h-8 rounded-lg" />
                        <span className="font-bold text-[16px]">Drop a Line</span>
                    </div>
                    <a
                        href="#download"
                        className="bg-black text-white px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#2d2d2d] transition-all"
                    >
                        Get the App
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="min-h-screen flex items-center px-6 pt-20">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center py-20">
                    <div className="fade-in">
                        <div className="inline-block px-3 py-1 bg-black/5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#6e6e73] mb-8">
                            v{latestVersion}
                        </div>
                        <h1 className="text-[64px] lg:text-[80px] font-bold leading-[0.9] tracking-tight mb-8">
                            Indie Stories.<br />
                            Fresh Ink.<br />
                            <span className="text-[#86868b]">Real Paper.</span>
                        </h1>
                        <p className="text-[22px] lg:text-[26px] text-[#6e6e73] leading-[1.4] mb-10 max-w-xl">
                            Drop a Line is where writing becomes alive. Where stories leave the screen and land in your hands, hot off the printer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#download"
                                className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-full text-[16px] font-semibold hover:bg-[#2d2d2d] transition-all shadow-lg"
                            >
                                <Download size={20} />
                                Download Now
                            </a>
                            <a
                                href={githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[16px] font-semibold text-[#6e6e73] hover:text-black transition-colors"
                            >
                                <Github size={20} />
                                Open Source
                            </a>
                        </div>
                    </div>
                    <div className="fade-in delay-2 relative">
                        <img
                            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop"
                            alt="Fountain pen writing on paper"
                            className="w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* Why DropaLine Exists */}
            <section className="py-32 px-6 bg-[#fafafa]">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-[48px] lg:text-[64px] font-bold leading-[1.1] tracking-tight mb-8">
                        We read the way we like it
                    </h2>
                    <p className="text-[24px] lg:text-[28px] text-[#6e6e73] leading-[1.5] mb-12">
                        Personal. Tactile. Intimate.
                    </p>
                    <div className="max-w-3xl mx-auto space-y-8 text-[20px] text-[#6e6e73] leading-[1.7]">
                        <p>
                            Words deserve <strong className="text-black">a pause, a smell, a texture in your hands</strong>.
                        </p>
                        <p>
                            Drop a Line brings writing back into the analog world. Writers publish. Readers subscribe.
                            When a new story drops, it prints automatically—<strong className="text-black">a real connection: a writer's words, a reader's paper</strong>.
                        </p>
                    </div>
                </div>
            </section>

            {/* For Writers & Readers */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
                    {/* For Writers */}
                    <div>
                        <div className="mb-12">
                            <img
                                src="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=1973&auto=format&fit=crop"
                                alt="Stack of written pages"
                                className="w-full aspect-[4/3] object-cover rounded-3xl shadow-xl mb-8"
                            />
                        </div>
                        <h3 className="text-[40px] font-bold mb-6">For Writers</h3>
                        <p className="text-[20px] text-[#6e6e73] leading-[1.6] mb-8">
                            A platform <strong className="text-black">made for your stories</strong>.
                        </p>
                        <ul className="space-y-4 text-[18px] text-[#6e6e73] leading-[1.6]">
                            <li className="flex gap-3">
                                <span className="text-black">•</span>
                                <span>Publish short stories, poems, essays, or serialized works</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-black">•</span>
                                <span>Build a personal audience that experiences your words on paper</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-black">•</span>
                                <span>Your writing reaches your readers <strong className="text-black">intimate, private, human</strong></span>
                            </li>
                        </ul>
                    </div>

                    {/* For Readers */}
                    <div>
                        <div className="mb-12">
                            <img
                                src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop"
                                alt="Reading printed pages"
                                className="w-full aspect-[4/3] object-cover rounded-3xl shadow-xl mb-8"
                            />
                        </div>
                        <h3 className="text-[40px] font-bold mb-6">For Readers</h3>
                        <p className="text-[20px] text-[#6e6e73] leading-[1.6] mb-8">
                            Turn your printer into <strong className="text-black">your most beloved inbox</strong>.
                        </p>
                        <ul className="space-y-4 text-[18px] text-[#6e6e73] leading-[1.6]">
                            <li className="flex gap-3">
                                <span className="text-black">•</span>
                                <span>Subscribe to writers whose voices matter to you</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-black">•</span>
                                <span>Stories arrive automatically, or printed on demand—ready to read, keep, and share</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-black">•</span>
                                <span>Read through <strong className="text-black">the medium the soul finds itself most alive</strong></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Ritual Statement */}
            <section className="py-32 px-6 bg-black text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[36px] lg:text-[48px] font-bold leading-[1.3]">
                        DropaLine isn't a tool.<br />
                        It's a <span className="italic">ritual</span>—a step back that's good.
                    </p>
                </div>
            </section>

            {/* No Screens */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-[48px] lg:text-[64px] font-bold leading-[1.1] mb-8">
                        No Screens.<br />
                        No Distractions.
                    </h2>
                    <p className="text-[24px] text-[#6e6e73] leading-[1.6] mb-8">
                        DropaLine exists <strong className="text-black">between writer and reader</strong>, alive in ink and paper.
                    </p>
                    <p className="text-[20px] text-[#6e6e73] leading-[1.6]">
                        Every drop is an invitation. Every page is a moment.
                    </p>
                </div>
            </section>

            {/* Download */}
            <section id="download" className="py-32 px-6 bg-[#fafafa]">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-[48px] lg:text-[64px] font-bold leading-[1.1] mb-6">
                        Get Drop a Line<br />
                        and Drop a Line
                    </h2>
                    <p className="text-[22px] text-[#6e6e73] mb-16">
                        Start reading powerful voices that are everywhere.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                        {[
                            { name: 'macOS', link: downloadLinks.mac },
                            { name: 'Windows', link: downloadLinks.windows },
                            { name: 'Linux', link: downloadLinks.linux }
                        ].map((platform, i) => (
                            <a
                                key={i}
                                href={platform.link}
                                className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-black/5"
                            >
                                <div className="flex items-center justify-center w-16 h-16 bg-black/5 group-hover:bg-black rounded-2xl mx-auto mb-6 transition-all">
                                    <Download size={28} className="text-black group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-[22px] font-bold mb-2">{platform.name}</h3>
                                <p className="text-[14px] text-[#6e6e73]">Free Download</p>
                            </a>
                        ))}
                    </div>

                    <p className="text-[14px] text-[#86868b] mb-4">Free during early access</p>
                    <a href={downloadLinks.releases} className="text-[15px] font-semibold text-black hover:opacity-70 transition-opacity">
                        View all releases on GitHub →
                    </a>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-[48px] lg:text-[56px] font-bold leading-[1.1] mb-8">
                        Join the First<br />
                        Print-Native Writing Community
                    </h2>
                    <p className="text-[24px] text-[#6e6e73] leading-[1.5] mb-12">
                        Experience writing in its <strong className="text-black">most human form</strong>.<br />
                        Connect with writers, subscribe to stories, hold the words.
                    </p>
                    <p className="text-[28px] font-bold">
                        Indie Stories. Fresh Ink. Real Paper.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-black/5">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[13px] text-[#86868b]">
                        © 2026 Drop a Line. Writers' words. Readers' paper.
                    </p>
                </div>
            </footer>
        </div>
    );
};
