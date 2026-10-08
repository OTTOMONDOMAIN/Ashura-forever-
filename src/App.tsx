/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PublicWebsiteData, ProjectItem } from './types';
import { fetchPublicData, checkAdminSession } from './lib/api';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  const [publicData, setPublicData] = useState<PublicWebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected project modal state
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [prefilledService, setPrefilledService] = useState<string | undefined>(undefined);

  // Synchronize route with window location
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin') || window.location.hash === '#admin') {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  // Check auth when admin route is active
  useEffect(() => {
    if (isAdminRoute) {
      setCheckingAuth(true);
      checkAdminSession()
        .then((auth) => {
          setIsAdminAuthenticated(auth);
        })
        .finally(() => {
          setCheckingAuth(false);
        });
    }
  }, [isAdminRoute]);

  // Load public data for public portfolio view
  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await fetchPublicData();
      setPublicData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to Asura Kinetics backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Navigation handlers
  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
  };

  const navigateToSite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    loadContent(); // Refresh public content in case admin made changes
  };

  const scrollToContact = (serviceType?: string) => {
    if (serviceType) {
      setPrefilledService(serviceType);
    }
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const elem = document.getElementById('projects');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const elem = document.getElementById('services');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ==========================================
  // RENDER ADMIN ROUTE
  // ==========================================
  if (isAdminRoute) {
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-white font-mono">
          <RefreshCw className="w-8 h-8 text-[#7042f8] animate-spin mb-4" />
          <div className="text-xs uppercase tracking-widest text-zinc-400">
            Validating Security Credentials...
          </div>
        </div>
      );
    }

    if (isAdminAuthenticated) {
      return (
        <AdminDashboard
          onLogout={() => {
            setIsAdminAuthenticated(false);
          }}
          onViewPublicSite={navigateToSite}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
        }}
        onBackToSite={navigateToSite}
      />
    );
  }

  // ==========================================
  // RENDER PUBLIC PORTFOLIO
  // ==========================================
  if (loading && !publicData) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-white font-mono">
        <div className="relative mb-6">
          <div className="w-12 h-12 rounded-full border-2 border-[#7042f8]/30 border-t-[#7042f8] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
          </div>
        </div>
        <div className="text-xs uppercase tracking-widest text-zinc-400 font-display">
          Initializing Asura Kinetics Environment
        </div>
      </div>
    );
  }

  if (error || !publicData) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-white font-mono p-6 text-center">
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 max-w-md">
          <div className="font-bold text-sm mb-2">System Communication Failure</div>
          <div className="text-xs text-rose-200/80 mb-4">{error}</div>
          <button
            type="button"
            onClick={loadContent}
            className="px-4 py-2 rounded-lg bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-zinc-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070709] text-white selection:bg-[#7042f8]/40 selection:text-white">
      {/* Background Interactive Ambient Canvas & Atmosphere */}
      <BackgroundEffects />

      {/* Main Top Bar Floating Header */}
      <Navbar navItems={publicData.navigation} onNavigateToAdmin={navigateToAdmin} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Cinematic Hero */}
        <Hero
          settings={publicData.settings}
          onExploreProjects={scrollToProjects}
          onStartProject={() => scrollToContact()}
        />

        {/* 01 — ABOUT */}
        <AboutSection
          data={publicData.about}
          onExploreServices={scrollToServices}
        />

        {/* 02 — SERVICES */}
        <ServicesSection
          services={publicData.services}
          onSelectService={(serviceTitle) => scrollToContact(serviceTitle)}
        />

        {/* 03 — PROJECTS */}
        <ProjectsSection
          projects={publicData.projects}
          onOpenProject={(proj) => setActiveProject(proj)}
        />

        {/* CONTACT SECTION */}
        <ContactSection
          settings={publicData.settings}
          prefillProjectType={prefilledService}
        />
      </main>

      {/* Editorial Footer */}
      <Footer settings={publicData.settings} onNavigateToAdmin={navigateToAdmin} />

      {/* Fullscreen Project Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onStartProject={() => {
          setActiveProject(null);
          scrollToContact(activeProject?.category);
        }}
      />
    </div>
  );
}
