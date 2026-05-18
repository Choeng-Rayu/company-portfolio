import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ChevronDown, Telescope } from 'lucide-react';
import { EASE_OUT_EXPO } from '@/lib/animation';
import { dataService } from '../services/dataService';


interface AboutData {
  sectionLabel: string;
  headline: string;
  description: string;
  foundedYear: string;
  location: string;
  country: string;
}

function MagneticButton({ children, href = '#', className = '', onClick }: { children: ReactNode; href?: string; className?: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    x.set(dx * 0.2);
    y.set(dy * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.a>
  );
}

export default function Hero() {
  const [data, setData] = useState<AboutData | null>(null);

  useEffect(() => {
    dataService.getAboutUs().then(setData).catch(() => {});
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const headline = data?.headline ?? 'Born in Cambodia. Built for Cambodia.';
  const description = data?.description ?? 'Chakrawal Digital is a Cambodian technology startup helping local businesses modernize through software, automation, and digital solutions. We empower SMEs to move from manual operations to smarter, more efficient digital systems.';
  const founded = data?.foundedYear ?? '2023';
  const location = data?.location ?? 'Phnom Penh';
  const country = data?.country ?? 'Cambodia';

  // Split headline into lines for staggered animation without breaking words
  const splitHeadline = (text: string) => {
    if (text.includes(' — ')) return text.split(' — ');
    if (text.length <= 50) return [text];
    const mid = Math.floor(text.length / 2);
    const leftSpace = text.lastIndexOf(' ', mid);
    const rightSpace = text.indexOf(' ', mid + 1);
    let splitAt = mid;
    if (leftSpace === -1 && rightSpace === -1) {
      splitAt = mid;
    } else if (leftSpace === -1) {
      splitAt = rightSpace;
    } else if (rightSpace === -1) {
      splitAt = leftSpace;
    } else {
      splitAt = (mid - leftSpace <= rightSpace - mid) ? leftSpace : rightSpace;
    }
    return [text.slice(0, splitAt).trimEnd(), text.slice(splitAt).trimStart()];
  };

  // Split headline into lines for staggered animation
  const headlineLines = splitHeadline(headline);

  return (
    <section className="relative min-h-[100dvh] w-full overflow-x-hidden bg-transparent pt-24">
      {/* Content */}
      <div className="relative z-10 min-h-[100dvh] grid grid-cols-1 md:grid-cols-2 max-w-[1280px] mx-auto px-6">

        {/* Left column — text & CTA buttons */}
        <div className="flex flex-col justify-center py-24 md:py-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted mb-6"
          >
            EST. {founded} · DIGITAL SOLUTIONS STUDIO · {location}, {country}
          </motion.p>

          <div className="space-y-0">
            {headlineLines.map((line, i) => (
              <motion.h1
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.7, ease: EASE_OUT_EXPO }}
                className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[1.0] tracking-[-0.02em] text-text-primary"
              >
                {line}
              </motion.h1>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="mt-8 text-lg leading-relaxed text-text-secondary max-w-[480px] "
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5, ease: EASE_OUT_EXPO }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagneticButton
              href="#contact"
              onClick={(e) => handleScroll(e, '#contact')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full liquid-glass-btn text-text-primary text-sm font-medium transition-all"
            >
              Start a Project
              <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton
              href="#services"
              onClick={(e) => handleScroll(e, '#services')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full liquid-glass-btn text-text-primary text-sm font-medium transition-all"
            >
              View Services
              <ChevronDown size={16} />
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right column — orbiting "Our Work" button */}
        <div className="hidden md:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.8, ease: EASE_OUT_EXPO }}
            className="relative flex items-center justify-center"
            style={{ width: 260, height: 260 }}
          >
            {/* Outer orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{
                border: '1px dashed rgba(200,241,53,0.25)',
              }}
            />

            {/* Inner orbit ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute rounded-full"
              style={{
                width: 180,
                height: 180,
                border: '1px dashed rgba(200,241,53,0.12)',
              }}
            />

            {/* Orbiting dot on outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div
                className="absolute w-2 h-2 rounded-full bg-accent-lime"
                style={{
                  top: '50%',
                  left: '-4px',
                  transform: 'translateY(-50%)',
                  boxShadow: '0 0 8px #C8F135',
                }}
              />
            </motion.div>

            {/* Orbiting dot on inner ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute"
              style={{ width: 180, height: 180 }}
            >
              <div
                className="absolute w-1.5 h-1.5 rounded-full bg-accent-lime opacity-60"
                style={{
                  bottom: '-3px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 6px #C8F135',
                }}
              />
            </motion.div>

            {/* Center "Our Work" button */}
            <MagneticButton
              href="#work"
              onClick={(e) => handleScroll(e, '#work')}
              className="relative z-10 flex flex-col items-center justify-center gap-2 w-28 h-28 rounded-full liquid-glass-btn text-text-primary text-sm font-medium transition-all text-center"
            >
              <Telescope size={20} className="text-accent-lime" />
              <span className="font-mono text-xs tracking-widest uppercase leading-tight">Our<br />Work</span>
            </MagneticButton>
          </motion.div>
        </div>

      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border-surface" />
    </section>
  );
}