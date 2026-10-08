import React, { useState } from 'react';
import { WebsiteSettings } from '../types';
import { ArrowDown, Sparkles, Terminal, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  settings: WebsiteSettings;
  onExploreProjects: () => void;
  onStartProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onExploreProjects, onStartProject }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-28 pb-20 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Bold Typography & Narrative */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          {/* Eyebrow Label with Clean Indicator */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="tracking-wider uppercase">{settings.heroEyebrow}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">{settings.statusText}</span>
          </div>

          {/* Monumental Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black font-display tracking-tight text-white uppercase leading-[0.92] mb-6 text-balance">
            {settings.siteTitle}
          </h1>

          {/* Studio Tagline */}
          <div className="text-xl sm:text-2xl md:text-3xl font-light text-zinc-300 font-display mb-6 tracking-tight flex items-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#7042f8]">
              “{settings.studioTagline}”
            </span>
          </div>

          {/* Small Supporting Description */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-10 font-normal">
            {settings.heroDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onExploreProjects}
              className="group relative px-7 py-3.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-4 h-4 text-zinc-800 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={onStartProject}
              className="px-7 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.12] hover:border-[#7042f8]/60 font-semibold text-sm tracking-wide transition-all duration-300 backdrop-blur-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#7042f8]" />
              <span>Start a Project</span>
            </button>
          </div>

          {/* Micro Trust Markers */}
          <div className="mt-12 pt-8 border-t border-white/[0.07] w-full max-w-lg flex items-center gap-6 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Dedicated SMP Infrastructure</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Custom Bot Protocols</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Kinetic Prism Object */}
        <div
          className="lg:col-span-5 relative flex items-center justify-center perspective-1000 z-10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="w-full max-w-md rounded-2xl glass-panel p-6 border border-white/[0.1] relative transition-transform duration-200 ease-out shadow-2xl shadow-black/80"
            style={{
              transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Ambient Corner Flare */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#7042f8]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#38bdf8]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Header bar of interactive card */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
                <span className="text-xs font-mono font-medium tracking-wider text-zinc-300 uppercase">
                  Studio Runtime
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">v2026.04</span>
            </div>

            {/* Visual Showcase Render with Frame */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-white/[0.08] bg-zinc-900 group">
              <img
                src="/src/assets/images/asura_studio_abstract_1791476515128.jpg"
                alt="Asura Kinetics Digital Monolith"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="font-display font-semibold tracking-wide">Autonomous Nodes</span>
                <span className="font-mono text-[11px] text-zinc-400">99.98% TPS</span>
              </div>
            </div>

            {/* Real-time telemetry feed indicators */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] text-zinc-400 font-mono mb-1">Architecture</div>
                <div className="text-sm font-semibold text-white">Zero-Lag SMP</div>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] text-zinc-400 font-mono mb-1">Discord Ecosystem</div>
                <div className="text-sm font-semibold text-white">Automated Sync</div>
              </div>
            </div>

            {/* Quick terminal footer */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span>asura.init()</span>
              </div>
              <span className="text-emerald-400 text-[11px]">Ready for Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
