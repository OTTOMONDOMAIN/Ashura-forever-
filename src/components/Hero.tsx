import React from 'react';
import { motion } from 'motion/react';
import { WebsiteSettings } from '../types';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import {
  TextEffect,
  TextScramble,
  Magnetic,
  InfiniteSlider,
  StaggerContainer,
  StaggerItem,
  AnimatedMetric,
  BorderTrail,
} from './ui/MotionPrimitives';
import { Mirage3DShowcase } from './Mirage3DShowcase';

interface HeroProps {
  settings: WebsiteSettings;
  onExploreProjects: () => void;
  onStartProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreProjects,
  onStartProject,
}) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center flex-1">
        {/* Left Column: Studio Mirage Monumental Editorial Typography */}
        <StaggerContainer
          staggerChildren={0.1}
          className="lg:col-span-7 flex flex-col items-start z-10"
        >
          {/* Clean Unboxed Metadata Line */}
          <StaggerItem className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-zinc-400 mb-6">
            <span className="text-violet-400">
              <TextScramble duration={0.75}>
                {settings.heroEyebrow}
              </TextScramble>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-200">
              <TextScramble duration={0.85}>
                {settings.statusText}
              </TextScramble>
            </span>
            <span aria-hidden="true">·</span>
            <span>Interactive 3D & Systems</span>
          </StaggerItem>

          {/* Monumental 3D Character-by-Character / Word Reveal Headline */}
          <StaggerItem className="w-full">
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-[5.5rem] font-extrabold font-display tracking-tight text-white uppercase leading-[0.92] mb-6 text-balance">
              <TextEffect per="char" delay={0.1}>
                {settings.siteTitle || 'ASURA KINETICS'}
              </TextEffect>
            </h1>
          </StaggerItem>

          {/* Studio Tagline */}
          <StaggerItem>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-zinc-200 font-display mb-6 tracking-tight max-w-2xl text-balance">
              <TextEffect per="word" delay={0.25}>
                {settings.studioTagline}
              </TextEffect>
            </p>
          </StaggerItem>

          {/* Supporting Narrative */}
          <StaggerItem>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-10">
              {settings.heroDescription}
            </p>
          </StaggerItem>

          {/* Magnetic Studio Mirage CTAs */}
          <StaggerItem className="flex flex-wrap items-center gap-4">
            <Magnetic intensity={0.38}>
              <button
                type="button"
                onClick={onExploreProjects}
                data-cursor="WORKS"
                className="group relative px-7 py-3.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm tracking-wide transition-colors duration-200 hover:bg-zinc-200 flex items-center gap-2.5 whitespace-nowrap overflow-hidden"
              >
                <span>Explore Selected Works</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              </button>
            </Magnetic>

            <Magnetic intensity={0.32}>
              <button
                type="button"
                onClick={onStartProject}
                data-cursor="BRIEF"
                className="relative px-7 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.12] hover:border-violet-500/50 font-semibold text-sm tracking-wide transition-colors duration-200 backdrop-blur-md flex items-center gap-2 whitespace-nowrap overflow-hidden"
              >
                <BorderTrail size={70} duration={4} />
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4 text-violet-400" />
              </button>
            </Magnetic>
          </StaggerItem>

          {/* Unboxed Proof Metrics Strip with Animated Counters */}
          <StaggerItem className="mt-12 pt-8 border-t border-white/[0.08] w-full max-w-xl grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums">
                <AnimatedMetric value="45,000+" />
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Active Players Immersed
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums">
                <TextScramble triggerOnHover>ARISE SMP</TextScramble>
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Flagship World Architecture
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums">
                <AnimatedMetric value="99.98%" />
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Runtime Reliability
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Right Column: Interactive Three.js 3D Mirage Viewport with Floating Levitation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -18, y: 40 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="lg:col-span-5 relative z-10 w-full [perspective:1200px]"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative rounded-2xl"
          >
            <BorderTrail size={160} duration={5.5} />
            <Mirage3DShowcase />
          </motion.div>
        </motion.div>
      </div>

      {/* Studio Mirage Scroll-Velocity Reactive Marquee Ribbon */}
      <InfiniteSlider
        items={[
          'Selected Works',
          'Arise SMP Ecosystem',
          'Asura Kinetics Studio',
          'Real-Time 3D & Motion',
          'Discord Community Architecture',
          'Bespoke Multiplayer Worlds',
        ]}
      />
    </section>
  );
};
