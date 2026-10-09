import React, { useState, useEffect } from 'react';
import { NavItem } from '../types';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Magnetic, TextScramble } from './ui/MotionPrimitives';

interface NavbarProps {
  navItems: NavItem[];
  onNavigateToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ navItems, onNavigateToAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href === '/admin') {
      e.preventDefault();
      setMobileMenuOpen(false);
      if (onNavigateToAdmin) {
        onNavigateToAdmin();
      } else {
        window.location.href = '/admin';
      }
      return;
    }

    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-[#050507]/85 backdrop-blur-xl border-b border-white/[0.07]'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Zone 1: Single Text Element Brand Wordmark */}
          <a
            href="#"
            className="text-lg md:text-xl font-extrabold tracking-tight text-white font-display uppercase whitespace-nowrap shrink-0"
          >
            ASURA KINETICS
          </a>

          {/* Zone 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            {navItems.slice(0, 6).map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleLinkClick(item.href, e)}
                className="relative py-1 text-zinc-300 hover:text-white transition-colors duration-200 whitespace-nowrap shrink-0 group"
              >
                <TextScramble triggerOnHover duration={0.4}>
                  {item.label}
                </TextScramble>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#7042f8] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-3">
            <Magnetic intensity={0.25}>
              <a
                href="#contact"
                onClick={(e) => handleLinkClick('#contact', e)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 rounded-lg transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                <span>Start Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="fixed inset-0 z-40 bg-[#050507]/95 backdrop-blur-2xl md:hidden flex flex-col justify-between pt-24 pb-10 px-8"
        >
          <div className="flex flex-col gap-6">
            <span className="text-xs text-zinc-400 font-mono">Navigation</span>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleLinkClick(item.href, e)}
                  className="text-2xl font-bold font-display text-zinc-200 hover:text-[#7042f8] transition-colors py-1 flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-5 h-5 text-zinc-500" />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-4">
            <a
              href="#contact"
              onClick={(e) => handleLinkClick('#contact', e)}
              className="w-full py-3.5 text-center text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl transition-colors"
            >
              Start a Project
            </a>
          </div>
        </div>
      )}
    </>
  );
};
