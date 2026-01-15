
import React from 'react';
import logo from '../assets/logo.png';

export const PrivacyView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased">
            <nav className="border-b border-black/5 bg-white">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Drop a Line" className="w-8 h-8 rounded-lg" />
                        <span className="font-bold text-[16px]">Drop a Line</span>
                    </div>
                    <button
                        onClick={onBack}
                        className="text-[14px] font-semibold text-[#6e6e73] hover:text-black transition-colors"
                    >
                        ← Back
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-[48px] font-bold mb-4">Privacy Policy</h1>
                <p className="text-[14px] text-[#86868b] mb-12">Last updated: January 15, 2026</p>

                <div className="prose prose-lg max-w-none space-y-8 text-[#1d1d1f]">
                    <section>
                        <h2 className="text-[32px] font-bold mb-4">Our Philosophy</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            Drop a Line is built on the principle of minimal data collection. We believe your writing is yours,
                            your reading habits are private, and your data should never be sold or exploited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">What We Collect</h2>
                        <div className="space-y-4 text-[17px] leading-[1.7] text-[#6e6e73]">
                            <div>
                                <h3 className="text-[20px] font-bold text-black mb-2">Account Information</h3>
                                <p>When you create an account, we collect your email address, display name, and username. This is necessary to provide the service.</p>
                            </div>
                            <div>
                                <h3 className="text-[20px] font-bold text-black mb-2">Content You Create</h3>
                                <p>Your drops (stories, poems, essays) are stored in our database. You own this content completely.</p>
                            </div>
                            <div>
                                <h3 className="text-[20px] font-bold text-black mb-2">Usage Data</h3>
                                <p>We collect minimal analytics: which drops you print, who you follow, and basic app usage. This helps us improve the service.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">What We Don't Collect</h2>
                        <ul className="space-y-2 text-[17px] leading-[1.7] text-[#6e6e73] list-disc pl-6">
                            <li>We don't track you across other websites</li>
                            <li>We don't sell your data to advertisers</li>
                            <li>We don't read your private messages</li>
                            <li>We don't use invasive analytics or fingerprinting</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">How We Use Your Data</h2>
                        <ul className="space-y-2 text-[17px] leading-[1.7] text-[#6e6e73] list-disc pl-6">
                            <li>To deliver drops to your printer when writers you follow publish</li>
                            <li>To show you content from writers you've subscribed to</li>
                            <li>To improve the app based on how people use it</li>
                            <li>To send you important service updates (rarely)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">Data Storage & Security</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            Your data is stored securely using Supabase (a trusted, open-source backend).
                            All connections are encrypted. We use industry-standard security practices to protect your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">Your Rights</h2>
                        <ul className="space-y-2 text-[17px] leading-[1.7] text-[#6e6e73] list-disc pl-6">
                            <li><strong className="text-black">Access:</strong> You can export all your data at any time</li>
                            <li><strong className="text-black">Delete:</strong> You can delete your account and all associated data</li>
                            <li><strong className="text-black">Portability:</strong> Your content is yours to take elsewhere</li>
                            <li><strong className="text-black">Opt-out:</strong> You can disable analytics in settings</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">Cookies</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            We use minimal cookies to keep you logged in and remember your preferences.
                            No third-party tracking cookies. No advertising cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">Changes to This Policy</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            If we make significant changes, we'll notify you via email or in-app notification.
                            We'll never reduce your privacy rights without your explicit consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">Contact</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            Questions about privacy? Email us at <a href="mailto:privacy@dropaline.com" className="text-black font-semibold hover:underline">privacy@dropaline.com</a>
                            {' '}or open an issue on <a href="https://github.com/iggafy/dropaline" className="text-black font-semibold hover:underline">GitHub</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
