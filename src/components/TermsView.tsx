
import React from 'react';
import logo from '../assets/logo.png';

export const TermsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
                <h1 className="text-[48px] font-bold mb-4">Terms of Service</h1>
                <p className="text-[14px] text-[#86868b] mb-12">Last updated: January 15, 2026</p>

                <div className="prose prose-lg max-w-none space-y-8 text-[#1d1d1f]">
                    <section>
                        <h2 className="text-[32px] font-bold mb-4">The Simple Version</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            Drop a Line is free, open-source software. You own your content. Be respectful. Don't break the law.
                            We're not liable if your printer runs out of ink. That's basically it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            By using Drop a Line, you agree to these terms. If you don't agree, please don't use the service.
                            We reserve the right to update these terms, and we'll notify you of significant changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">2. Your Account</h2>
                        <div className="space-y-4 text-[17px] leading-[1.7] text-[#6e6e73]">
                            <p>You're responsible for:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Keeping your password secure</li>
                                <li>All activity that happens under your account</li>
                                <li>Notifying us if you suspect unauthorized access</li>
                            </ul>
                            <p>You must be at least 13 years old to use Drop a Line.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">3. Your Content</h2>
                        <div className="space-y-4 text-[17px] leading-[1.7] text-[#6e6e73]">
                            <p><strong className="text-black">You own your content.</strong> Period.</p>
                            <p>When you publish a drop, you grant us a license to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Store it on our servers</li>
                                <li>Deliver it to your subscribers' printers</li>
                                <li>Display it in the app</li>
                            </ul>
                            <p>This license ends when you delete your content or account.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">4. Acceptable Use</h2>
                        <div className="space-y-4 text-[17px] leading-[1.7] text-[#6e6e73]">
                            <p>Don't use Drop a Line to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Publish illegal content</li>
                                <li>Harass, threaten, or abuse others</li>
                                <li>Spam or send unsolicited content</li>
                                <li>Violate copyright or intellectual property rights</li>
                                <li>Distribute malware or viruses</li>
                                <li>Impersonate others</li>
                            </ul>
                            <p>We reserve the right to remove content or suspend accounts that violate these terms.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">5. The Service</h2>
                        <div className="space-y-4 text-[17px] leading-[1.7] text-[#6e6e73]">
                            <p>Drop a Line is provided "as is" without warranties of any kind. We'll do our best to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Keep the service running smoothly</li>
                                <li>Protect your data</li>
                                <li>Fix bugs and add features</li>
                            </ul>
                            <p>However, we can't guarantee 100% uptime or that the service will always meet your needs.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">6. Printing & Hardware</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            Drop a Line connects to your printer. You're responsible for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-[17px] leading-[1.7] text-[#6e6e73] mt-4">
                            <li>Your printer, ink, and paper costs</li>
                            <li>Configuring your printer settings</li>
                            <li>Managing what gets printed (via auto-print settings)</li>
                        </ul>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73] mt-4">
                            We're not responsible if you accidentally print 100 pages or run out of ink.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">7. Pricing</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            Drop a Line is currently free during early access. If we introduce paid features in the future,
                            we'll notify you in advance and you'll have the choice to opt in.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">8. Termination</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            You can delete your account at any time from the settings page. We may suspend or terminate
                            accounts that violate these terms. If we do, we'll try to give you notice and an explanation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">9. Limitation of Liability</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            Drop a Line is provided for free. We're not liable for any damages, lost profits, or data loss
                            arising from your use of the service. Use at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">10. Open Source</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            Drop a Line is open-source software. The code is available on{' '}
                            <a href="https://github.com/iggafy/dropaline" className="text-black font-semibold hover:underline">GitHub</a>.
                            {' '}You're free to inspect, modify, and contribute to the code.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">11. Governing Law</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            These terms are governed by the laws of your jurisdiction. Any disputes will be resolved
                            through good-faith negotiation first.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[32px] font-bold mb-4">Contact</h2>
                        <p className="text-[17px] leading-[1.7] text-[#6e6e73]">
                            Questions about these terms? Email us at <a href="mailto:legal@dropaline.com" className="text-black font-semibold hover:underline">legal@dropaline.com</a>
                            {' '}or open an issue on <a href="https://github.com/iggafy/dropaline" className="text-black font-semibold hover:underline">GitHub</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
