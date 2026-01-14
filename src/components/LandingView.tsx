
import React from 'react';
import { Download, Monitor, Mail, Printer, Heart, ArrowRight, Github, Globe, Smartphone, Feather } from 'lucide-react';
import logo from '../assets/logo.png';

interface LandingViewProps {
    onEnterApp: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp }) => {
    const latestVersion = "1.0.6";
    const githubRepo = "https://github.com/iggafy/dropaline";

    const downloadLinks = {
        windows: `${githubRepo}/releases/download/v${latestVersion}/dropaline-Setup-${latestVersion}.exe`,
        mac: `${githubRepo}/releases/download/v${latestVersion}/dropaline-${latestVersion}-arm64.dmg`,
        linux: `${githubRepo}/releases/download/v${latestVersion}/dropaline-${latestVersion}.AppImage`,
        releases: `${githubRepo}/releases/latest`
    };

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#1d1d1f] selection:bg-black selection:text-white font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#fafafa]/80 backdrop-blur-md border-b border-black/[0.05] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg border border-black/10 shadow-sm" />
                    <span className="font-bold tracking-tight text-lg">Drop a Line</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#features" className="text-sm font-medium text-[#86868b] hover:text-black transition-colors">Features</a>
                    <a href="#download" className="text-sm font-medium text-[#86868b] hover:text-black transition-colors">Download</a>
                    <button
                        onClick={onEnterApp}
                        className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 group shadow-lg shadow-black/10"
                    >
                        Launch Web <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 container mx-auto max-w-6xl text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.03] border border-black/[0.05] rounded-full text-[11px] font-bold uppercase tracking-widest text-[#86868b] mb-8 animate-in fade-in slide-in-from-bottom-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    Now Live: Edition v{latestVersion}
                </div>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Writers’ words.<br />
                    <span className="text-[#86868b]">Readers’ paper.</span>
                </h1>
                <p className="text-lg md:text-xl text-[#86868b] max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    Drop a Line is a quiet space for those who still believe in the magic of ink and paper.
                    A direct line from a writer’s screen to a reader’s hands.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <a
                        href="#download"
                        className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-2xl text-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/20"
                    >
                        <Download size={20} /> Get Desktop App
                    </a>
                    <button
                        onClick={onEnterApp}
                        className="w-full sm:w-auto bg-white text-black border border-black/10 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-[#f5f5f7] transition-all"
                    >
                        Open Web Version
                    </button>
                </div>

                {/* Hero Image / Mockup */}
                <div className="mt-20 relative animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent z-10 h-full w-full"></div>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-black/5 overflow-hidden mx-auto max-w-5xl aspect-video relative group">
                        <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors duration-500"></div>
                        <img
                            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                            alt="App Interface"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay indicators */}
                        <div className="absolute top-8 left-8 p-6 bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/20 max-w-[240px] text-left">
                            <Printer className="text-black mb-3" size={24} />
                            <p className="text-sm font-bold border-b border-black/5 pb-2 mb-2">Auto-Print Active</p>
                            <p className="text-xs text-[#86868b]">Connected: Thermal Relay 01</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section id="features" className="py-32 bg-white px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                                <Feather size={24} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The tactile soul of digital writing.</h2>
                            <p className="text-lg text-[#86868b] leading-relaxed mb-8">
                                In a world of infinite scrolling and disappearing stories, we're building for permanence.
                                Drop a Line turns your thoughts into a physical newspaper delivered directly to your readers' desks.
                            </p>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-black/5 flex items-center justify-center mt-1">
                                        <Heart size={14} className="text-black" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base mb-1">Write with Intention</h4>
                                        <p className="text-sm text-[#86868b]">Beautiful layouts designed to look stunning on a physical page.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-black/5 flex items-center justify-center mt-1">
                                        <Printer size={14} className="text-black" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base mb-1">Physical Inboxes</h4>
                                        <p className="text-sm text-[#86868b]">When someone you follow drops a line, your printer wakes up automatically.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-6 pt-12">
                                <div className="bg-[#f5f5f7] p-8 rounded-[2rem] aspect-square flex flex-col justify-end">
                                    <Monitor size={32} className="mb-4 text-black" />
                                    <h3 className="font-bold">Desktop App</h3>
                                    <p className="text-xs text-[#86868b]">Native & Offline</p>
                                </div>
                                <div className="bg-[#fafafa] border border-black/5 p-8 rounded-[2rem] aspect-square flex flex-col justify-end">
                                    <Mail size={32} className="mb-4 text-[#86868b]" />
                                    <h3 className="font-bold">Private Lines</h3>
                                    <p className="text-xs text-[#86868b]">Direct letters</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-[#fafafa] border border-black/5 p-8 rounded-[2rem] aspect-square flex flex-col justify-end">
                                    <Globe size={32} className="mb-4 text-[#86868b]" />
                                    <h3 className="font-bold">The Network</h3>
                                    <p className="text-xs text-[#86868b]">Global relay</p>
                                </div>
                                <div className="bg-black text-white p-8 rounded-[2rem] aspect-square flex flex-col justify-end shadow-2xl">
                                    <Smartphone size={32} className="mb-4 text-white" />
                                    <h3 className="font-bold">Web Version</h3>
                                    <p className="text-xs text-white/60">Accessible anywhere</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section id="download" className="py-32 px-6">
                <div className="container mx-auto max-w-4xl bg-black text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to receive your first drop?</h2>
                        <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto font-medium">
                            Join the quiet network. Select your platform below to download the latest edition of Drop a Line.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-6 mb-12">
                            <a href={downloadLinks.windows} className="p-6 bg-white/10 hover:bg-white/20 rounded-[2rem] border border-white/10 transition-all flex flex-col items-center gap-4 group">
                                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Monitor size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold">Windows</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">v{latestVersion}</p>
                                </div>
                            </a>
                            <a href={downloadLinks.mac} className="p-6 bg-white/10 hover:bg-white/20 rounded-[2rem] border border-white/10 transition-all flex flex-col items-center gap-4 group">
                                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Github size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold">macOS</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">v{latestVersion}</p>
                                </div>
                            </a>
                            <a href={downloadLinks.linux} className="p-6 bg-white/10 hover:bg-white/20 rounded-[2rem] border border-white/10 transition-all flex flex-col items-center gap-4 group">
                                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Globe size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold">Linux</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">v{latestVersion}</p>
                                </div>
                            </a>
                        </div>

                        <div className="text-sm text-white/40 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <p>Indie Developer Signed (Unsigned binaries)</p>
                            <a href={downloadLinks.releases} className="text-white hover:underline">View Source & Build History</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-black/5 bg-white">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-6 h-6 grayscale opacity-30" />
                        <span className="font-bold text-[#86868b]">Drop a Line</span>
                    </div>
                    <div className="flex gap-8 text-[#86868b] text-sm font-medium">
                        <a href="#" className="hover:text-black">Privacy</a>
                        <a href="#" className="hover:text-black">Terms</a>
                        <a href={githubRepo} className="hover:text-black">GitHub</a>
                    </div>
                    <div className="text-[#86868b] text-sm">
                        © 2026 Drop a Line. Writers’ words. Readers’ paper.
                    </div>
                </div>
            </footer>
        </div>
    );
};
