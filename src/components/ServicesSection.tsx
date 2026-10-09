import React from 'react';
import { motion } from 'motion/react';
import { ServiceItem } from '../types';
import { ArrowRight } from 'lucide-react';
import {
  Tilt3D,
  TextEffect,
  TextScramble,
  Magnetic,
  Scroll3DSection,
  InfiniteSlider,
} from './ui/MotionPrimitives';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
}) => {
  return (
    <>
      <Scroll3DSection
        id="services"
        className="py-28 md:py-36 px-6 md:px-10 border-t border-white/[0.07]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Studio Mirage Editorial Section Header */}
          <div className="flex items-baseline justify-between mb-14 pb-6 border-b border-white/[0.08]">
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-mono text-violet-400 tabular-nums">
                02.
              </span>
              <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">
                <TextScramble>Expertise & Capabilities</TextScramble>
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              Discord · Minecraft SMP · Interactive Web
            </span>
          </div>

          {/* Section Intro */}
          <div className="max-w-3xl mb-16">
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-[0.98] mb-5 text-balance">
              <TextEffect per="word">
                Engineered for retention, motion, and scale.
              </TextEffect>
            </h3>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              We build custom digital architectures tuned to your specific community dynamics, visual identity, and multiplayer gameplay loops.
            </p>
          </div>

          {/* Interactive 3D Tilt & Spotlight Capability Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {services.map((service, idx) => (
              <Tilt3D
                key={service.id}
                rotationFactor={8}
                spotlightColor="rgba(56, 189, 248, 0.2)"
                className="rounded-2xl bg-[#0b0b10]/85 border border-white/[0.08] hover:border-white/[0.2] p-8 flex flex-col justify-between transition-colors duration-300"
              >
                <div className="relative z-20">
                  {/* Editorial Chapter Index & Unboxed Status */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.07] text-xs font-mono">
                    <span className="text-violet-400 font-semibold tabular-nums">
                      {service.number || `0${idx + 1}`}. Capability
                    </span>
                    <span className="text-zinc-400">Bespoke Architecture</span>
                  </div>

                  {/* Service Title */}
                  <h4 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4 tracking-tight text-balance">
                    <TextScramble triggerOnHover duration={0.45}>
                      {service.title}
                    </TextScramble>
                  </h4>

                  {/* Short Description */}
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
                    {service.shortDescription}
                  </p>

                  {/* Clean Editorial Deliverables List with Animated Hover Shift */}
                  <div className="mb-8 pt-6 border-t border-white/[0.06]">
                    <div className="text-xs font-mono text-zinc-400 mb-4">
                      Core Deliverables
                    </div>
                    <ul className="space-y-2.5">
                      {service.features.map((feature, fIdx) => (
                        <motion.li
                          key={fIdx}
                          whileHover={{ x: 6, color: '#ffffff' }}
                          transition={{ duration: 0.16 }}
                          className="flex items-baseline justify-between gap-4 text-xs sm:text-sm text-zinc-300 border-b border-white/[0.04] pb-2 last:border-none cursor-default"
                        >
                          <span>{feature}</span>
                          <span className="text-[11px] font-mono text-zinc-500 tabular-nums shrink-0">
                            0{fIdx + 1}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="relative z-20 pt-6 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    Custom Commission
                  </span>
                  <Magnetic intensity={0.3}>
                    <button
                      type="button"
                      onClick={() => onSelectService(service.title)}
                      data-cursor="SELECT"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-white/[0.06] hover:bg-[#7042f8] border border-white/[0.1] hover:border-transparent rounded-lg transition-colors duration-200 whitespace-nowrap"
                    >
                      <span>Commission</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Magnetic>
                </div>
              </Tilt3D>
            ))}
          </div>
        </div>
      </Scroll3DSection>

      {/* Reverse Scroll-Velocity Reactive Marquee */}
      <InfiniteSlider
        reverse
        items={[
          'Our Works',
          'Arise SMP Multiplayer World',
          'Kinetic Community Hub',
          'Zero-Lag PaperMC Architecture',
          'Custom Discord Automation',
          '3D WebGL Experiences',
        ]}
      />
    </>
  );
};
