import React, { useState } from 'react';
import { ServiceItem } from '../types';
import { Bot, Box, Cpu, Check, ArrowRight, Zap, Terminal } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Map icon names to Lucide icons
  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'bot':
      case 'discord':
        return <Bot className="w-6 h-6 text-violet-400" />;
      case 'box':
      case 'minecraft':
        return <Box className="w-6 h-6 text-cyan-400" />;
      case 'cpu':
      case 'systems':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      default:
        return <Terminal className="w-6 h-6 text-violet-400" />;
    }
  };

  return (
    <section id="services" className="relative py-28 md:py-36 px-6 md:px-10 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        {/* Category Header with Animated Category Index */}
        <div className="flex items-baseline justify-between mb-16 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <span className="text-4xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-[#7042f8]">
              02
            </span>
            <div className="h-4 w-[1px] bg-white/20" />
            <h2 className="text-sm md:text-base font-mono uppercase tracking-[0.25em] text-zinc-400">
              SERVICES
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
            Custom Engineering Capabilities
          </span>
        </div>

        {/* Section Intro */}
        <div className="max-w-2xl mb-16">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight mb-4">
            Architected for retention, performance, and scale.
          </h3>
          <p className="text-base sm:text-lg text-zinc-400">
            We don't do boilerplate templates. We build custom infrastructure tuned to your specific community dynamics and gameplay mechanics.
          </p>
        </div>

        {/* Large Interactive Cards that React to Mouse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              icon={getIcon(service.icon)}
              onSelect={() => onSelectService(service.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ServiceCardProps {
  service: ServiceItem;
  icon: React.ReactNode;
  onSelect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, icon, onSelect }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${coords.y}deg) rotateY(${coords.x}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="group relative rounded-2xl glass-panel p-8 md:p-10 border border-white/[0.08] hover:border-violet-500/40 flex flex-col justify-between transition-colors duration-300 shadow-xl shadow-black/40"
    >
      {/* Background Hover Glow Accent */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7042f8]/05 via-transparent to-[#38bdf8]/05 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Top Header Row with Service Number & Icon */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:border-violet-500/30 transition-colors">
              {icon}
            </div>
            <div>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
                Capability {service.number || '01'}
              </span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Custom Built
              </span>
            </div>
          </div>
          <span className="text-2xl font-mono font-bold text-zinc-700 group-hover:text-violet-400 transition-colors">
            {service.number}
          </span>
        </div>

        {/* Service Title */}
        <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4 group-hover:text-white transition-colors">
          {service.title}
        </h3>

        {/* Short Description */}
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
          {service.shortDescription}
        </p>

        {/* Comprehensive Features List */}
        <div className="mb-8">
          <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span>Core Deliverables & Specifications</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {service.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 py-1"
              >
                <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Button */}
      <div className="pt-6 border-t border-white/[0.07] flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400">
          Tailored to your architecture
        </span>
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-white/[0.06] hover:bg-[#7042f8] border border-white/[0.1] hover:border-transparent rounded-lg transition-all duration-200"
        >
          <span>Commission Service</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
