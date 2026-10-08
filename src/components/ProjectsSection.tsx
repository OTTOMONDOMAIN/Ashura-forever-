import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { ArrowUpRight, Sparkles, Terminal } from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onOpenProject: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onOpenProject }) => {
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <section id="projects" className="relative py-28 md:py-36 px-6 md:px-10 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        {/* Category Header with Animated Category Index */}
        <div className="flex items-baseline justify-between mb-16 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <span className="text-4xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-[#7042f8]">
              03
            </span>
            <div className="h-4 w-[1px] bg-white/20" />
            <h2 className="text-sm md:text-base font-mono uppercase tracking-[0.25em] text-zinc-400">
              PROJECTS
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
            Production Showcases & Architectures
          </span>
        </div>

        {/* Header Intro and Interactive Category Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight mb-4">
              Featured Systems & Worlds
            </h3>
            <p className="text-base sm:text-lg text-zinc-400">
              Explore bespoke digital spaces engineered by Asura Kinetics. Every release is a benchmark in community immersion and gameplay stability.
            </p>
          </div>

          {/* Interactive filter tabs (clean segmented controls) */}
          {categories.length > 2 && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md self-start md:self-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all duration-200 whitespace-nowrap ${
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

        {/* Projects Grid */}
        <div className="space-y-12">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={() => onOpenProject(project)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  onOpen: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onOpen }) => {
  const isEven = index % 2 === 0;

  return (
    <div className="group rounded-3xl glass-panel border border-white/[0.08] hover:border-violet-500/40 p-6 sm:p-8 md:p-10 transition-all duration-500 shadow-2xl shadow-black/50 overflow-hidden relative">
      {/* Background Subtle Gradient Flare */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7042f8]/05 rounded-full blur-3xl group-hover:bg-[#7042f8]/10 transition-colors pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Project Visual / Media Presentation */}
        <div
          className={`lg:col-span-7 ${
            isEven ? 'lg:order-1' : 'lg:order-2'
          } relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.08] cursor-pointer`}
          onClick={onOpen}
        >
          <img
            src={project.image}
            alt={project.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Quick Corner Tag */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
            <span>{project.category}</span>
          </div>

          <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300 group-hover:text-white transition-colors">
            <span>View Architecture</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Project Details & Narrative */}
        <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col justify-between`}>
          <div>
            {/* Unboxed Metadata Line with typographic separators */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">
              <span className="text-zinc-300 font-semibold">#{project.number || '01'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-violet-400">{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">{project.status}</span>
            </div>

            {/* Project Name */}
            <h4
              onClick={onOpen}
              className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight mb-4 hover:text-violet-300 transition-colors cursor-pointer"
            >
              {project.name}
            </h4>

            {/* Project Tagline if available */}
            {project.tagline && (
              <p className="text-sm font-medium text-zinc-300 mb-4 font-display">
                {project.tagline}
              </p>
            )}

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-6 font-normal">
              {project.description}
            </p>

            {/* Key Stack & Features Preview */}
            <div className="space-y-2 mb-8">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-violet-400" />
                <span>Technologies & Engine</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-300 font-mono">
                {project.technologies.slice(0, 4).map((tech, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-zinc-600">·</span>}
                    <span>{tech}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Project Tags (Unboxed text with typographic separators) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono mb-8">
              <span className="text-zinc-400">Tags:</span>
              {project.tags.map((tag, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-zinc-700">/</span>}
                  <span className="text-zinc-300">{tag}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95"
            >
              <span>View Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              Exclusive Asura Build
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
