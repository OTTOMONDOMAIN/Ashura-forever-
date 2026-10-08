import React, { useState } from 'react';
import { WebsiteSettings } from '../types';
import { sendContactMessage } from '../lib/api';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';

interface ContactSectionProps {
  settings: WebsiteSettings;
  prefillProjectType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, prefillProjectType }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discord: '',
    projectType: prefillProjectType || 'Minecraft Server Development',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Update prefill if prop changes
  React.useEffect(() => {
    if (prefillProjectType) {
      setFormData((prev) => ({ ...prev, projectType: prefillProjectType }));
    }
  }, [prefillProjectType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await sendContactMessage(formData);
      setSuccessMsg(res.message || 'Transmission received. We will respond promptly.');
      setFormData({
        name: '',
        email: '',
        discord: '',
        projectType: 'Minecraft Server Development',
        message: '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to dispatch inquiry. Please reach out via Discord.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 md:py-36 px-6 md:px-10 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        {/* Strong Final CTA Headline */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-violet-400 mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Project Inquiries & Commissions</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tight text-white uppercase leading-[0.95] mb-6">
            {settings.ctaHeading || "LET'S BUILD SOMETHING."}
          </h2>

          <p className="text-xl sm:text-2xl text-zinc-300 font-display font-light">
            “{settings.ctaSubheading || "Have an idea? Let's turn it into something real."}”
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Studio Channels & Social Links */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-8">
            <div className="space-y-6">
              <p className="text-base text-zinc-400 leading-relaxed">
                Whether you're bootstrapping a brand-new competitive SMP, building a 50,000-member Discord community, or creating custom web portals, our engineers are ready to build.
              </p>

              {/* Direct Communication Channels */}
              <div className="space-y-4 pt-4">
                {/* Email Card */}
                {settings.contactEmail && (
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="p-5 rounded-2xl glass-panel border border-white/[0.08] hover:border-violet-500/40 flex items-center justify-between group transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-violet-400 group-hover:bg-[#7042f8]/20 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                          Direct Studio Email
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-white group-hover:text-violet-300 transition-colors">
                          {settings.contactEmail}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </a>
                )}

                {/* Discord Card */}
                {settings.discordInviteUrl && (
                  <a
                    href={settings.discordInviteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-5 rounded-2xl glass-panel border border-white/[0.08] hover:border-violet-500/40 flex items-center justify-between group transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                          Discord Community
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          discord.gg/asurakinetics
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </a>
                )}
              </div>

              {/* Social Channels Unboxed */}
              <div className="pt-6 border-t border-white/[0.08]">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">
                  Official Channels
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-zinc-300">
                  {settings.twitterUrl && (
                    <a
                      href={settings.twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-violet-400 transition-colors flex items-center gap-1"
                    >
                      <span>X / Twitter</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                    </a>
                  )}
                  {settings.githubUrl && (
                    <a
                      href={settings.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-violet-400 transition-colors flex items-center gap-1"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                    </a>
                  )}
                  {settings.youtubeUrl && (
                    <a
                      href={settings.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-violet-400 transition-colors flex items-center gap-1"
                    >
                      <span>YouTube</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3 text-xs text-zinc-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                NDA-ready architecture. Direct engineer communication with zero sales middlemen.
              </span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl glass-panel border border-white/[0.1] p-8 sm:p-10 shadow-2xl relative">
              <div className="mb-8">
                <h3 className="text-2xl font-bold font-display text-white mb-2">
                  Initiate Project Brief
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Fill out the parameters below and our development lead will review your scope within 24 hours.
                </p>
              </div>

              {/* Status alerts */}
              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-0.5">Inquiry Dispatched Successfully</div>
                    <div>{successMsg}</div>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>{errorMsg}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                      Your Name <span className="text-[#7042f8]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] focus:ring-1 focus:ring-[#7042f8] text-sm transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                      Email Address <span className="text-[#7042f8]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] focus:ring-1 focus:ring-[#7042f8] text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Discord Username */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                      Discord Username
                    </label>
                    <input
                      type="text"
                      value={formData.discord}
                      onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                      placeholder="e.g. alex_mercer#0001"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] focus:ring-1 focus:ring-[#7042f8] text-sm transition-all"
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                      Project Type <span className="text-[#7042f8]">*</span>
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#14141e] border border-white/[0.1] text-white focus:outline-none focus:border-[#7042f8] focus:ring-1 focus:ring-[#7042f8] text-sm transition-all"
                    >
                      <option value="Minecraft Server Development">Minecraft Server Development</option>
                      <option value="Discord Server Development">Discord Server Development</option>
                      <option value="Custom Bot & Systems">Custom Bot & Automation Systems</option>
                      <option value="Custom Web Portal / Store">Custom Web Portal / Store</option>
                      <option value="Full Studio Ecosystem">Full Studio Ecosystem (All Above)</option>
                      <option value="Other / Consulting">Other / Advisory Consulting</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                    Project Vision & Requirements <span className="text-[#7042f8]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your community scale, target timeline, gameplay or bot requirements, and vision..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] focus:ring-1 focus:ring-[#7042f8] text-sm transition-all resize-y"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-white/10 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>DISPATCHING BRIEF...</span>
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <Send className="w-4 h-4 text-zinc-900" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
