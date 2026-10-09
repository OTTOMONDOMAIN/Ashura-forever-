import React, { useState } from 'react';
import { AboutSectionData } from '../types';
import { ArrowUpRight } from 'lucide-react';
import { resolveAssetUrl } from '../lib/assets';
import {
  Tilt3D,
  TextEffect,
  TextScramble,
  Magnetic,
  Scroll3DSection,
  StaggerContainer,
  StaggerItem,
  AnimatedMetric,
} from './ui/MotionPrimitives';

interface AboutSectionProps {
  data: AboutSectionData;
  onExploreServices: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  data,
  onExploreServices,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Scroll3DSection
      id="about"
      className="py-28 md:py-36 px-6 md:px-10 border-t border-white/[0.07]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Studio Mirage Editorial Header */}
        <div className="flex items-baseline justify-between mb-14 pb-6 border-b border-white/[0.08]">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-mono text-violet-400 tabular-nums">
              {data.sectionNumber || '01'}.
            </span>
            <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">
              <TextScramble>Studio Manifesto</TextScramble>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            Asura Kinetics · Creative Tech & Ecosystems
          </span>
        </div>

        {/* Lead Narrative & 3D Interactive Visual Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          <StaggerContainer className="lg:col-span-7">
            <StaggerItem>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white leading-[1.08] mb-8 text-balance">
                <TextEffect per="word">{data.leadText}</TextEffect>
              </h3>
            </StaggerItem>

            <StaggerItem className="space-y-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mb-10">
              <p>{data.paragraph1}</p>
              <p className="text-zinc-300">{data.paragraph2}</p>
            </StaggerItem>

            {/* Clean Hairline Philosophy Callout */}
            <StaggerItem className="pt-8 border-t border-white/[0.08] max-w-2xl">
              <div className="text-xs font-mono text-violet-400 mb-2">
                01.1 · Architectural Philosophy
              </div>
              <p className="text-lg sm:text-xl text-zinc-100 font-display font-medium leading-snug mb-6 text-balance">
                <TextEffect per="word">{`“${data.philosophy}”`}</TextEffect>
              </p>
              <Magnetic intensity={0.3}>
                <button
                  type="button"
                  onClick={onExploreServices}
                  data-cursor="SERVICES"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-xs font-semibold text-white transition-colors whitespace-nowrap"
                >
                  <span>Explore Capabilities</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-violet-400" />
                </button>
              </Magnetic>
            </StaggerItem>
          </StaggerContainer>

          {/* Right Column: 3D Tilt Studio Showcase */}
          <div className="lg:col-span-5">
            <Tilt3D
              rotationFactor={9}
              spotlightColor="rgba(112, 66, 248, 0.25)"
              className="rounded-2xl overflow-hidden bg-[#0b0b10] border border-white/[0.1]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                {!imgError ? (
                  <img
                    src={resolveAssetUrl(data.studioImage)}
                    alt="Asura Kinetics Studio Aesthetics"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/60 to-zinc-950 p-6">
                    <span className="text-xl font-display font-bold text-white">
                      ASURA KINETICS
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs font-mono text-zinc-200">
                  <span>Asura Kinetics Spatial Lab</span>
                  <span className="text-violet-300">Real-Time Worlds</span>
                </div>
              </div>

              <div className="p-6 border-t border-white/[0.08] grid grid-cols-2 gap-6 bg-[#09090e]">
                <div>
                  <div className="text-xs font-mono text-violet-400 mb-1">
                    01 · Custom Logic
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">
                    Bespoke Mechanics
                  </div>
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    Zero generic plugin packs. Handcrafted server & bot runtimes.
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-cyan-400 mb-1">
                    02 · Unified Stack
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">
                    Ecosystem Sync
                  </div>
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    Real-time state across Minecraft SMP, Discord, and 3D Web.
                  </div>
                </div>
              </div>
            </Tilt3D>
          </div>
        </div>

        {/* Quantified Studio Rigor (Live Counting Tabular Numerals) */}
        {data.stats && data.stats.length > 0 && (
          <StaggerContainer className="pt-12 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.stats.map((stat, idx) => (
              <StaggerItem key={idx} className="flex flex-col">
                <span className="text-xs font-mono text-zinc-500 mb-2 tabular-nums">
                  0{idx + 1} · Metric
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight tabular-nums mb-1">
                  <AnimatedMetric value={stat.value} />
                </span>
                <span className="text-xs sm:text-sm text-zinc-400">
                  {stat.label}
                </span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </Scroll3DSection>
  );
};
