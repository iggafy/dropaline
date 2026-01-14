
import React from 'react';
import { Download, Monitor, Mail, Printer, Github, Globe, Smartphone, Heart, ArrowDown } from 'lucide-react';
import logo from '../assets/logo.png';

export const LandingView: React.FC = () => {
    const latestVersion = "1.0.9";
    const githubRepo = "https://github.com/iggafy/dropaline";

    const downloadLinks = {
        windows: `${githubRepo}/releases/download/v${latestVersion}/dropaline-Setup-${latestVersion}.exe`,
        mac: `${githubRepo}/releases/download/v${latestVersion}/dropaline-${latestVersion}-arm64.dmg`,
        linux: `${githubRepo}/releases/download/v${latestVersion}/dropaline-${latestVersion}.AppImage`,
        releases: `${githubRepo}/releases`
    };

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#1d1d1f] selection:bg-black selection:text-white font-sans antialiased">
            {/* Minimal Header */}
            <header className="fixed top-0 w-full z-50 bg-[#fafafa]/80 backdrop-blur-md px-6 py-4">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                        <span className="font-bold tracking-tight text-[15px]">Drop a Line</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-[13px] font-medium text-[#86868b] hover:text-black transition-colors">Philosophy</a>
                        <a
                            href="#download"
                            className="bg-black text-white px-4 py-1.5 rounded-full text-[13px] font-bold hover:opacity-90 transition-all shadow-md shadow-black/5"
                        >
                            Get the App
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content Centered Column */}
            <main className="max-w-[700px] mx-auto px-6 pt-40 pb-20">

                {/* Hero */}
                <div className="text-center mb-24 fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.03] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-8">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        v{latestVersion} Available
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                        Writers’ words.<br />
                        <span className="text-[#86868b]">Readers’ paper.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#6e6e73] leading-relaxed max-w-lg mx-auto mb-12">
                        A quiet space for those who believe in the magic of ink.
                        A direct line from a writer’s screen to a reader’s hands.
                    </p>

                    <a
                        href="#download"
                        className="inline-flex items-center gap-2 text-[15px] font-bold text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
                    >
                        Download for Desktop <ArrowDown size={14} />
                    </a>
                </div>

                {/* Hero Image */}
                <div className="mb-32 relative group cursor-default">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl z-10 pointer-events-none"></div>
                    <img
                        src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                        alt="Workspace"
                        className="w-full aspect-[4/3] object-cover rounded-3xl shadow-xl shadow-black/5"
                    />
                    <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                            <Printer size={14} />
                        </div>
                        <span className="text-xs font-bold text-white shadow-black drop-shadow-md">Connected: Thermal Relay 01</span>
                    </div>
                </div>

                {/* Philosophy / Features - Text Focused */}
                <div id="about" className="space-y-32 mb-32">
                    <section>
                        <h2 className="text-2xl font-bold mb-6">The tactile soul of digital writing.</h2>
                        <p className="text-lg text-[#6e6e73] leading-relaxed">
                            In a world of infinite scrolling and disappearing stories, we're building for permanence.
                            Drop a Line turns your thoughts into a physical newspaper delivered directly to your readers' desks.
                        </p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-[15px] font-bold text-black mb-2 flex items-center gap-2">
                                <Heart size={14} /> Intention
                            </h3>
                            <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                                Beautiful layouts designed to look stunning on a physical page. Zine-style, minimal, or classic.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-black mb-2 flex items-center gap-2">
                                <Printer size={14} /> Physical Inboxes
                            </h3>
                            <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                                When someone you follow drops a line, your printer wakes up automatically. It's magic.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-black mb-2 flex items-center gap-2">
                                <Monitor size={14} /> Desktop Only
                            </h3>
                            <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                                Built exclusively for your desktop to ensure a seamless, distraction-free connection to your hardware.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-black mb-2 flex items-center gap-2">
                                <Mail size={14} /> Private Lines
                            </h3>
                            <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                                Send direct, encrypted letters to specific friends that print only on their device.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Download Section */}
                <div id="download" className="bg-[#f5f5f7] rounded-[2rem] p-10 md:p-14 text-center">
                    <h2 className="text-2xl font-bold mb-4">Join the quiet network.</h2>
                    <p className="text-[#6e6e73] text-[15px] mb-10 max-w-sm mx-auto">
                        Select your platform to download the latest signed edition.
                    </p>

                    <div className="flex flex-col gap-3 max-w-[280px] mx-auto">
                        <a href={downloadLinks.windows} className="flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow-sm hover:scale-[1.02] transition-transform border border-black/5 group">
                            <div className="flex items-center gap-3">
                                <Monitor size={18} className="text-[#86868b] group-hover:text-black transition-colors" />
                                <span className="font-bold text-[14px]">Windows</span>
                            </div>
                            <Download size={16} className="text-[#86868b]" />
                        </a>
                        <a href={downloadLinks.mac} className="flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow-sm hover:scale-[1.02] transition-transform border border-black/5 group">
                            <div className="flex items-center gap-3">
                                <Github size={18} className="text-[#86868b] group-hover:text-black transition-colors" />
                                <span className="font-bold text-[14px]">macOS</span>
                            </div>
                            <Download size={16} className="text-[#86868b]" />
                        </a>
                        <a href={downloadLinks.linux} className="flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow-sm hover:scale-[1.02] transition-transform border border-black/5 group">
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-[#86868b] group-hover:text-black transition-colors" />
                                <span className="font-bold text-[14px]">Linux</span>
                            </div>
                            <Download size={16} className="text-[#86868b]" />
                        </a>
                    </div>

                    <div className="mt-8 pt-8 border-t border-black/5">
                        <a href={downloadLinks.releases} className="text-[11px] font-bold text-[#86868b] hover:text-black uppercase tracking-widest">
                            View Source & Releases on GitHub
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-20 text-center border-t border-black/[0.05] pt-10">
                    <p className="text-[13px] text-[#86868b] font-medium">
                        © 2026 Drop a Line
                    </p>
                </footer>

            </main>
        </div>
    );
};
