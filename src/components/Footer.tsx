import React from 'react';
import { WebsiteSettings } from '../types';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigateToAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-14 px-6 md:px-10 border-t border-white/[0.08] bg-[#050508] text-zinc-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2 text-white font-display font-bold uppercase tracking-wider text-sm">
            <span className="w-2 h-2 rounded-full bg-[#7042f8]" />
            <span>{settings.siteTitle || 'ASURA KINETICS'}</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <span className="text-xs text-zinc-400 font-mono">
            © {new Date().getFullYear()} Asura Kinetics Studio. All rights reserved.
          </span>
        </div>

        {/* Quiet Navigation & Admin Access */}
        <div className="flex items-center gap-6 text-xs font-mono">
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
          <a href="#services" className="hover:text-white transition-colors">
            Services
          </a>
          <a href="#projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="text-zinc-400 hover:text-violet-400 transition-colors"
          >
            Admin CMS
          </button>
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
