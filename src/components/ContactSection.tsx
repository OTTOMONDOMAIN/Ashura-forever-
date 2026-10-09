import React, { useState } from 'react';
import { WebsiteSettings } from '../types';
import { sendContactMessage } from '../lib/api';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import {
  TextEffect,
  TextScramble,
  Tilt3D,
  Magnetic,
  Scroll3DSection,
} from './ui/MotionPrimitives';

interface ContactSectionProps {
  settings: WebsiteSettings;
  prefillProjectType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  prefillProjectType,
}) => {
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
      setSuccessMsg(
        res.message || 'Transmission received. We will respond promptly.'
      );
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
    <Scroll3DSection
      id="contact"
      className="py-28 md:py-36 px-6 md:px-10 border-t border-white/[0.07]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Studio Mirage Editorial Section Header */}
        <div className="flex items-baseline justify-between mb-14 pb-6 border-b border-white/[0.08]">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-mono text-violet-400 tabular-nums">
              04.
            </span>
            <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">
              <TextScramble>Initiate Commission</TextScramble>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            Direct Studio Access · 24h Response
          </span>
        </div>

        <div className="max-w-3xl mb-16">
          <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white uppercase leading-[0.94] mb-6 text-balance">
            <TextEffect per="word">
              {settings.ctaHeading || "LET'S BUILD SOMETHING."}
            </TextEffect>
          </h3>

          <p className="text-xl sm:text-2xl text-zinc-300 font-display font-light text-balance">
            {settings.ctaSubheading ||
              "Have an idea? Let's turn it into something real."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Studio Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <p className="text-base text-zinc-400 leading-relaxed">
              Whether you are launching a flagship Minecraft SMP like Arise SMP, architecting a 50,000-member Discord ecosystem, or commissioning an interactive 3D web experience, our engineers are ready.
            </p>

            <div className="space-y-4">
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="p-5 rounded-2xl bg-[#0b0b10] border border-white/[0.08] hover:border-violet-500/40 flex items-center justify-between group transition-colors duration-200"
                >
                  <div>
                    <div className="text-xs font-mono text-zinc-400 mb-1">
                      01 · Direct Studio Email
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {settings.contactEmail}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                </a>
              )}

              {settings.discordInviteUrl && (
                <a
                  href={settings.discordInviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl bg-[#0b0b10] border border-white/[0.08] hover:border-violet-500/40 flex items-center justify-between group transition-colors duration-200"
                >
                  <div>
                    <div className="text-xs font-mono text-zinc-400 mb-1">
                      02 · Discord Community
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      discord.gg/asurakinetics
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                </a>
              )}
            </div>

            {/* Social Channels Unboxed */}
            <div className="pt-6 border-t border-white/[0.08]">
              <div className="text-xs font-mono text-zinc-400 mb-3">
                Official Channels
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-zinc-300">
                {settings.twitterUrl && (
                  <a
                    href={settings.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-violet-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>X / Twitter</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                  </a>
                )}
                {settings.githubUrl && (
                  <a
                    href={settings.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-violet-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-violet-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>YouTube</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: 3D Spotlight Contact Form */}
          <div className="lg:col-span-7">
            <Tilt3D
              rotationFactor={3}
              spotlightColor="rgba(112, 66, 248, 0.14)"
              className="rounded-2xl bg-[#0b0b10]/90 border border-white/[0.1] p-8 sm:p-10"
            >
              <div className="relative z-20">
                <div className="mb-8">
                  <h4 className="text-2xl font-bold font-display text-white mb-2">
                    Project Brief Parameters
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Share your scope and our lead architect will respond within 24 hours.
                  </p>
                </div>

                {successMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-0.5">
                        Inquiry Dispatched Successfully
                      </div>
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
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Alex Mercer"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="alex@domain.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-2">
                        Discord Username
                      </label>
                      <input
                        type="text"
                        value={formData.discord}
                        onChange={(e) =>
                          setFormData({ ...formData, discord: e.target.value })
                        }
                        placeholder="alex_mercer"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-2">
                        Project Type *
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectType: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#14141e] border border-white/[0.1] text-white focus:outline-none focus:border-[#7042f8] text-sm transition-colors"
                      >
                        <option value="Minecraft Server Development">
                          Minecraft Server Development
                        </option>
                        <option value="Discord Server Development">
                          Discord Server Development
                        </option>
                        <option value="Custom Bot & Systems">
                          Custom Bot & Automation Systems
                        </option>
                        <option value="Custom Web Portal / Store">
                          Custom Web Portal / 3D Experience
                        </option>
                        <option value="Full Studio Ecosystem">
                          Full Studio Ecosystem (All Above)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-2">
                      Project Vision & Requirements *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us about your community scale, timeline, gameplay or bot requirements, and vision..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] text-sm transition-colors resize-y"
                    />
                  </div>

                  <Magnetic intensity={0.15} className="w-full">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Dispatching Brief...</span>
                      ) : (
                        <>
                          <span>Send Project Brief</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </Magnetic>
                </form>
              </div>
            </Tilt3D>
          </div>
        </div>
      </div>
    </Scroll3DSection>
  );
};
