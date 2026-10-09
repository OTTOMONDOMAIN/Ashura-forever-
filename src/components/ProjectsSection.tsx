import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProjectItem } from '../types';
import { ArrowUpRight } from 'lucide-react';
import {
  Tilt3D,
  TextEffect,
  TextScramble,
  Magnetic,
  Scroll3DSection,
} from './ui/MotionPrimitives';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onOpenProject: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onOpenProject,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    'all',
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter(
          (p) => p.category.toLowerCase() === filter.toLowerCase()
        );

  return (
    <Scroll3DSection
      id="projects"
      className="py-28 md:py-36 px-6 md:px-10 border-t border-white/[0.07]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Studio Mirage Editorial Section Header */}
        <div className="flex items-baseline justify-between mb-14 pb-6 border-b border-white/[0.08]">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-mono text-violet-400 tabular-nums">
              03.
            </span>
            <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">
              <TextScramble>Selected Works</TextScramble>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            Arise SMP · Interactive Worlds · Systems
          </span>
        </div>

        {/* Title & Segmented Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-[0.98] mb-5 text-balance">
              <TextEffect per="word">
                Our Works & Digital Worlds
              </TextEffect>
            </h3>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              From the monumental multiplayer ecosystem of Arise SMP to high-concurrency Discord infrastructures, every project is crafted for spatial immersion and zero-latency performance.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          {categories.length > 1 && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md self-start md:self-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    filter === cat
                      ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Works' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3D Interactive Case Study Showcases */}
        <div className="space-y-14">
          {filteredProjects.map((project, index) => (
            <ProjectShowcaseCard
              key={project.id}
              project={project}
              index={index}
              onOpen={() => onOpenProject(project)}
            />
          ))}
        </div>
      </div>
    </Scroll3DSection>
  );
};

interface ProjectShowcaseCardProps {
  project: ProjectItem;
  index: number;
  onOpen: () => void;
}

const ProjectShowcaseCard: React.FC<ProjectShowcaseCardProps> = ({
  project,
  index,
  onOpen,
}) => {
  const isEven = index % 2 === 0;
  const [imgError, setImgError] = useState(false);

  return (
    <Tilt3D
      rotationFactor={6}
      spotlightColor="rgba(112, 66, 248, 0.24)"
      className="rounded-2xl bg-[#0b0b10]/85 border border-white/[0.08] hover:border-white/[0.2] p-6 sm:p-8 md:p-12 transition-colors duration-300"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-20">
        {/* Visual Media Container with 3D Depth Pop */}
        <motion.div
          whileHover={{ scale: 1.02, rotateZ: isEven ? -0.6 : 0.6 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={onOpen}
          data-cursor="VIEW WORK"
          className={`lg:col-span-7 ${
            isEven ? 'lg:order-1' : 'lg:order-2'
          } relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.08] cursor-pointer group/media`}
        >
          {!imgError && project.image ? (
            <img
              src={project.image}
              alt={project.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/50 via-zinc-900 to-cyan-950/40 p-8 text-center">
              <span className="text-2xl font-display font-bold text-white uppercase tracking-wider">
                {project.name}
              </span>
            </div>
          )}

          {/* Measured Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Bottom Overlay Caption */}
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs font-mono text-zinc-200">
            <span>
              {project.number || `0${index + 1}`}. {project.name}
            </span>
            <span className="inline-flex items-center gap-1 text-white group-hover/media:translate-x-1 transition-transform">
              <span>Inspect Case Study</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* Editorial Case Study Details */}
        <div
          className={`lg:col-span-5 ${
            isEven ? 'lg:order-2' : 'lg:order-1'
          } flex flex-col justify-between`}
        >
          <div>
            {/* Unboxed Metadata Line with typographic separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mb-4 tabular-nums">
              <span className="text-zinc-200 font-semibold">
                {project.number || `0${index + 1}`}.
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-violet-400">{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">{project.status}</span>
            </div>

            {/* Project Title with 3D Character Reveal + Scramble */}
            <h4
              onClick={onOpen}
              data-cursor="VIEW WORK"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight mb-3 hover:text-violet-300 transition-colors cursor-pointer uppercase"
            >
              <TextScramble triggerOnHover duration={0.5}>
                {project.name}
              </TextScramble>
            </h4>

            {/* Tagline */}
            {project.tagline && (
              <p className="text-base font-medium text-zinc-200 mb-4 font-display">
                {project.tagline}
              </p>
            )}

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Unboxed Architecture & Stack Line */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-6 pt-5 border-t border-white/[0.07]">
                <div className="text-xs font-mono text-zinc-400 mb-2">
                  Architecture Stack
                </div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-zinc-200">
                  {project.technologies.map((tech, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && (
                        <span className="text-zinc-600" aria-hidden="true">
                          ·
                        </span>
                      )}
                      <span>{tech}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Unboxed Tags Line */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mb-8">
                <span>Disciplines:</span>
                {project.tags.map((tag, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <span className="text-zinc-600" aria-hidden="true">
                        /
                      </span>
                    )}
                    <span className="text-zinc-300">{tag}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
            <Magnetic intensity={0.3}>
              <button
                type="button"
                onClick={onOpen}
                data-cursor="OPEN"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <span>Explore Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </Magnetic>

            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              Asura Kinetics Production
            </span>
          </div>
        </div>
      </div>
    </Tilt3D>
  );
};
