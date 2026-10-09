import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useInView,
  useScroll,
  useVelocity,
  useAnimationFrame,
  AnimatePresence,
} from 'motion/react';

// ============================================================================
// 1. STUDIO MIRAGE KINETIC INTRO CURTAIN & PROGRESS BAR
// ============================================================================
export const MiragePreloader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 950; // Fast, high-impact 0.95s kinetic intro

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 180);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[120] bg-[#050507] flex flex-col justify-between p-8 md:p-14 select-none cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>ASURA KINETICS</span>
            <span>3D WEBGL · MOTION ENGINE</span>
          </div>

          <div className="my-auto flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono text-violet-400 uppercase tracking-[0.3em] mb-3"
            >
              Initializing Spatial Experience
            </motion.div>
            <div className="text-6xl sm:text-8xl md:text-9xl font-extrabold font-display text-white tracking-tighter tabular-nums leading-none">
              {progress}%
            </div>
          </div>

          <div className="w-full h-[2px] bg-white/10 overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-[#7042f8] via-[#38bdf8] to-white"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 2. TOP SCROLL PROGRESS BEAM
// ============================================================================
export const ScrollProgressBeam: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7042f8] via-[#38bdf8] to-[#a78bfa] origin-left z-[90] pointer-events-none shadow-[0_0_12px_#7042f8]"
    />
  );
};

// ============================================================================
// 3. SCROLL-LINKED 3D SECTION WRAPPER (Studio Mirage 3D Scroll Transitions)
// ============================================================================
interface Scroll3DSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Scroll3DSection: React.FC<Scroll3DSectionProps> = ({
  children,
  className = '',
  id,
}) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'end 10%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
  });

  const rotateX = useTransform(smoothProgress, [0, 0.22, 0.85, 1], [14, 0, 0, -10]);
  const scale = useTransform(smoothProgress, [0, 0.22, 0.85, 1], [0.94, 1, 1, 0.96]);
  const y = useTransform(smoothProgress, [0, 0.22, 0.85, 1], [60, 0, 0, -40]);
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.88, 1], [0.15, 1, 1, 0.35]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative [perspective:1400px] ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          y,
          opacity,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </section>
  );
};

// ============================================================================
// 4. STAGGER REVEAL CONTAINER & ITEM
// ============================================================================
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}> = ({
  children,
  className = '',
  delayChildren = 0.05,
  staggerChildren = 0.09,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-8% 0px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 36, rotateX: -20, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={`[transform-style:preserve-3d] ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// 5. BORDER TRAIL (ibelick/motion-primitives animated orbiting border light)
// ============================================================================
interface BorderTrailProps {
  className?: string;
  size?: number;
  duration?: number;
  color?: string;
}

export const BorderTrail: React.FC<BorderTrailProps> = ({
  className = '',
  size = 110,
  duration = 6,
  color = '#8b5cf6',
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] overflow-hidden">
      <motion.div
        className={`absolute aspect-square rounded-full blur-md ${className}`}
        style={{
          width: size,
          background: `radial-gradient(circle, ${color} 0%, rgba(56,189,248,0.6) 50%, transparent 80%)`,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          duration,
          ease: 'linear',
        }}
      />
    </div>
  );
};

// ============================================================================
// 6. TEXT SCRAMBLE (Auto-scrambles on viewport entry + hover)
// ============================================================================
interface TextScrambleProps {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  className?: string;
  triggerOnHover?: boolean;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·+';

export const TextScramble: React.FC<TextScrambleProps> = ({
  children,
  duration = 0.7,
  speed = 0.032,
  characterSet = DEFAULT_CHARS,
  className = '',
  triggerOnHover = true,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-5% 0px' });
  const [displayText, setDisplayText] = useState(children);
  const isAnimating = useRef(false);

  const scramble = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const steps = Math.max(1, Math.floor(duration / speed));
    let step = 0;

    const interval = setInterval(() => {
      let scrambled = '';
      const progress = step / steps;

      for (let i = 0; i < children.length; i++) {
        if (children[i] === ' ') {
          scrambled += ' ';
          continue;
        }
        if (progress * children.length > i) {
          scrambled += children[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        clearInterval(interval);
        setDisplayText(children);
        isAnimating.current = false;
      }
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [children, duration, speed, characterSet]);

  useEffect(() => {
    setDisplayText(children);
    if (isInView) {
      const cleanup = scramble();
      return cleanup;
    }
  }, [children, isInView, scramble]);

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      onMouseEnter={triggerOnHover ? scramble : undefined}
    >
      {displayText}
    </span>
  );
};

// ============================================================================
// 7. TEXT EFFECT (3D Staggered Word/Char Reveal + Hover Kinetic Wave)
// ============================================================================
interface TextEffectProps {
  children: string;
  per?: 'word' | 'char';
  className?: string;
  delay?: number;
}

export const TextEffect: React.FC<TextEffectProps> = ({
  children,
  per = 'word',
  className = '',
  delay = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-8% 0px' });
  const units = per === 'word' ? children.split(' ') : children.split('');

  return (
    <span ref={ref} className={`inline-block [perspective:1000px] ${className}`}>
      {units.map((unit, idx) => (
        <span key={idx} className="inline-block overflow-hidden align-bottom">
          <motion.span
            initial={{ y: '115%', rotateX: -75, rotateZ: 6, opacity: 0 }}
            animate={
              isInView
                ? { y: '0%', rotateX: 0, rotateZ: 0, opacity: 1 }
                : { y: '115%', rotateX: -75, rotateZ: 6, opacity: 0 }
            }
            whileHover={{
              y: -4,
              scale: 1.04,
              color: '#c4b5fd',
              transition: { duration: 0.18 },
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + idx * (per === 'word' ? 0.06 : 0.024),
            }}
            className="inline-block origin-bottom [transform-style:preserve-3d]"
          >
            {unit}
            {per === 'word' && idx < units.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// ============================================================================
// 8. ANIMATED NUMBER COUNTER (Counts up when in viewport)
// ============================================================================
export const AnimatedMetric: React.FC<{ value: string; className?: string }> = ({
  value,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-5% 0px' });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
    if (!match || !isInView) {
      setDisplay(value);
      return;
    }

    const prefix = match[1];
    const rawNumStr = match[2];
    const suffix = match[3];
    const hasComma = rawNumStr.includes(',');
    const decimals = rawNumStr.includes('.')
      ? rawNumStr.split('.')[1].length
      : 0;
    const targetNum = parseFloat(rawNumStr.replace(/,/g, ''));

    if (isNaN(targetNum)) {
      setDisplay(value);
      return;
    }

    let frameId: number;
    const duration = 1200;
    const startTime = performance.now();

    const update = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = targetNum * eased;

      let formatted = current.toFixed(decimals);
      if (hasComma) {
        const parts = formatted.split('.');
        parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
        formatted = parts.join('.');
      }

      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      } else {
        setDisplay(value);
      }
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [value, isInView]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
};

// ============================================================================
// 9. MAGNETIC (ibelick/motion-primitives spring magnetic attraction)
// ============================================================================
interface MagneticProps {
  children: React.ReactNode;
  intensity?: number;
  range?: number;
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  intensity = 0.4,
  range = 140,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 190, damping: 14, mass: 0.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.hypot(distX, distY);

    if (distance < range) {
      x.set(distX * intensity);
      y.set(distY * intensity);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// 10. TILT 3D + SPOTLIGHT + BORDER TRAIL CARD
// ============================================================================
interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  rotationFactor?: number;
  spotlightColor?: string;
  showBorderTrail?: boolean;
  onClick?: () => void;
}

export const Tilt3D: React.FC<Tilt3DProps> = ({
  children,
  className = '',
  rotationFactor = 8,
  spotlightColor = 'rgba(139, 92, 246, 0.22)',
  showBorderTrail = true,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 22 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(
    ySpring,
    [0, 1],
    [rotationFactor, -rotationFactor]
  );
  const rotateY = useTransform(
    xSpring,
    [0, 1],
    [-rotationFactor, rotationFactor]
  );

  const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    x.set(relX);
    y.set(relY);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, margin: '-6% 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative [perspective:1200px] ${className}`}
    >
      {showBorderTrail && <BorderTrail size={130} duration={7} />}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"
        style={{ background: spotlightBg }}
      />
      {children}
    </motion.div>
  );
};

// ============================================================================
// 11. SCROLL-VELOCITY REACTIVE INFINITE SLIDER MARQUEE
// ============================================================================
interface InfiniteSliderProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export const InfiniteSlider: React.FC<InfiniteSliderProps> = ({
  items,
  speed = 0.035,
  reverse = false,
  className = '',
}) => {
  const repeated = [...items, ...items, ...items, ...items];
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 45,
    stiffness: 350,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  const directionFactor = useRef<number>(reverse ? -1 : 1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * speed * (delta * 0.6);

    if (velocityFactor.get() < 0) {
      directionFactor.current = reverse ? 1 : -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = reverse ? -1 : 1;
    }

    moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get());

    let next = baseX.get() - moveBy;
    if (next <= -50) next = 0;
    if (next > 0) next = -50;
    baseX.set(next);
  });

  const xPercent = useTransform(baseX, (v) => `${v}%`);

  return (
    <div
      className={`relative flex overflow-hidden select-none border-y border-white/[0.08] bg-[#060609]/85 backdrop-blur-md py-4 ${className}`}
    >
      <motion.div
        style={{ x: xPercent }}
        className="flex shrink-0 items-center gap-10 whitespace-nowrap will-change-transform"
      >
        {repeated.map((item, idx) => (
          <div key={idx} className="flex items-center gap-10">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.28em] text-zinc-300 hover:text-white transition-colors">
              {item}
            </span>
            <span
              className="text-violet-400 font-mono text-xs"
              aria-hidden="true"
            >
              ·
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ============================================================================
// 12. CUSTOM MIRAGE SPATIAL CURSOR FOLLOWER + RING TRAIL
// ============================================================================
export const MirageCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const springX = useSpring(cursorX, { stiffness: 460, damping: 32 });
  const springY = useSpring(cursorY, { stiffness: 460, damping: 32 });

  const outerX = useSpring(cursorX, { stiffness: 160, damping: 24 });
  const outerY = useSpring(cursorY, { stiffness: 160, damping: 24 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const cursorAttr = target
        ?.closest('[data-cursor]')
        ?.getAttribute('data-cursor');
      setCursorLabel(cursorAttr || '');
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Trailing Outer Kinetic Halo */}
      <motion.div
        style={{
          x: outerX,
          y: outerY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorLabel ? 110 : 44,
          height: cursorLabel ? 46 : 44,
          opacity: cursorLabel ? 0.35 : 0.5,
        }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none fixed top-0 left-0 z-[99] hidden lg:block rounded-full border border-violet-400/40"
      />

      {/* Primary Interactive Cursor Core */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed top-0 left-0 z-[100] hidden lg:flex items-center justify-center"
      >
        <motion.div
          animate={{
            width: cursorLabel ? 92 : 18,
            height: cursorLabel ? 34 : 18,
            backgroundColor: cursorLabel
              ? 'rgba(255, 255, 255, 0.96)'
              : 'rgba(255, 255, 255, 0.12)',
          }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_28px_rgba(112,66,248,0.45)]"
        >
          {cursorLabel ? (
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-950 whitespace-nowrap px-2">
              {cursorLabel}
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </motion.div>
      </motion.div>
    </>
  );
};
