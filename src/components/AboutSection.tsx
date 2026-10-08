import React from 'react';
import { AboutSectionData } from '../types';
import { ArrowUpRight, Compass, Cpu, Layers } from 'lucide-react';

interface AboutSectionProps {
  data: AboutSectionData;
  onExploreServices: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data, onExploreServices }) => {
  return (
    <section id="about" className="relative py-28 md:py-36 px-6 md:px-10 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        {/* Category Header with Animated Category Index */}
        <div className="flex items-baseline justify-between mb-16 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <span className="text-4xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-[#7042f8]">
              {data.sectionNumber || '01'}
            </span>
            <div className="h-4 w-[1px] bg-white/20" />
            <h2 className="text-sm md:text-base font-mono uppercase tracking-[0.25em] text-zinc-400">
              ABOUT
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
            Studio Philosophy & Approach
          </span>
        </div>

        {/* Lead Narrative & Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          <div className="lg:col-span-7">
            {/* Monumental Lead Typography */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-8 text-balance">
              {data.leadText}
            </h3>

            <div className="space-y-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              <p>{data.paragraph1}</p>
              <p className="text-zinc-300">{data.paragraph2}</p>
            </div>

            {/* Philosophy Callout */}
            <div className="mt-10 p-6 rounded-2xl bg-white/[0.03] border-l-2 border-[#7042f8] border-y border-r border-white/[0.06] backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4" />
                <span>The Core Principle</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-200 italic font-display">
                “{data.philosophy}”
              </p>
            </div>
          </div>

          {/* Right Column: Studio Artwork & Architecture Highlights */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-white/[0.1] group">
              <img
                src={data.studioImage || '/src/assets/images/asura_studio_abstract_1791476515128.jpg'}
                alt="Asura Kinetics Studio Aesthetics"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-display font-medium text-zinc-200">Asura Architecture Lab</span>
                <span className="font-mono text-zinc-400 text-[11px]">Bespoke Protocols</span>
              </div>
            </div>

            {/* Core Capability Pillars */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <Cpu className="w-5 h-5 text-violet-400 mb-2" />
                <div className="text-sm font-semibold text-white mb-1">Custom Engine Logic</div>
                <div className="text-xs text-zinc-400">Zero bloated generic plugin packs. Handcrafted mechanics.</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <Layers className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="text-sm font-semibold text-white mb-1">Ecosystem Cohesion</div>
                <div className="text-xs text-zinc-400">Seamless integration across Discord, Minecraft, and Web.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quantified Studio Rigor (Metrics) */}
        {data.stats && data.stats.length > 0 && (
          <div className="pt-10 border-t border-white/[0.08]">
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-8">
              Verified Production Metrics
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight tabular-nums mb-1">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
