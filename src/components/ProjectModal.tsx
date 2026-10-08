import React from 'react';
import { ProjectItem } from '../types';
import { X, ExternalLink, ShieldCheck, Sparkles, Layers, Cpu } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onStartProject: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onStartProject }) => {
  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} Details`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel border border-white/[0.12] bg-[#0c0c12] p-6 sm:p-10 text-white shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-zinc-400 hover:text-white transition-colors"
          aria-label="Close project modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Unboxed Metadata Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
          <span>Project {project.number || '01'}</span>
          <span aria-hidden="true">·</span>
          <span className="text-violet-400">{project.category}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400">{project.status}</span>
        </div>

        {/* Project Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white mb-4">
          {project.name}
        </h2>

        {/* Tagline */}
        {project.tagline && (
          <p className="text-lg text-zinc-300 font-display mb-6 font-light">
            “{project.tagline}”
          </p>
        )}

        {/* Main Showcase Image */}
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-8 border border-white/[0.08] bg-zinc-900">
          <img
            src={project.image}
            alt={project.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Deep Dive Description */}
        <div className="space-y-4 text-base text-zinc-300 leading-relaxed mb-8">
          <p>{project.description}</p>
          {project.longDescription && <p className="text-zinc-400">{project.longDescription}</p>}
        </div>

        {/* Technologies Grid (Clean unboxed tags) */}
        <div className="mb-8 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>Technologies & Engine Stack</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300 font-mono">
            {project.technologies.map((tech, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-zinc-600">·</span>}
                <span className="text-zinc-200">{tech}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Custom Systems & Key Features */}
        {project.features && project.features.length > 0 && (
          <div className="mb-8">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Key Features & Mechanics</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-300">
              {project.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags metadata unboxed */}
        <div className="mb-8 pt-6 border-t border-white/[0.08] flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span className="text-zinc-400">Classifiers:</span>
          {project.tags.map((tag, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              <span className="text-zinc-300">{tag}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Modal Actions */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-zinc-400">
            Engineered exclusively by Asura Kinetics
          </div>

          <div className="flex items-center gap-3">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-colors"
              >
                <span>Live Discord</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onStartProject();
              }}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-[#7042f8] hover:bg-[#6032e8] transition-colors shadow-lg shadow-[#7042f8]/30"
            >
              Build Similar System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
