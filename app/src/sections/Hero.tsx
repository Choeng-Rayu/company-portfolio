import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';



const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
    fetch('/data/about_us.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const headline = data?.headline ?? 'We Turn Your Challenges Into Digital Solutions.';
  const description = data?.description ?? "Cambodia's startup tech team helping SMEs go digital — affordably.";
  const founded = data?.foundedYear ?? '2026';
  const location = data?.location ?? 'Phnom Penh';

  // Split headline into lines for staggered animation
  const headlineLines = headline.split(' — ').length > 1
    ? headline.split(' — ')
    : headline.length > 40
      ? [headline.slice(0, Math.ceil(headline.length / 2)).trimEnd(), headline.slice(Math.ceil(headline.length / 2)).trimStart()]
      : [headline];

  return (
    <section className="relative min-h-[100dvh] w-full overflow-x-hidden bg-transparent pt-24">
      {/* Content */}
      <div className="relative z-10 min-h-[100dvh] grid grid-cols-1 md:grid-cols-2 max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col justify-center py-24 md:py-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted mb-6"
          >
            EST. {founded} · DIGITAL SOLUTIONS STUDIO · {location}
          </motion.p>

          <div className="space-y-0">
            {headlineLines.map((line, i) => (
              <motion.h1
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.7, ease }}
                className="font-display italic text-[clamp(2.5rem,7vw,6rem)] leading-[1.0] tracking-[-0.02em] text-text-primary"
              >
                {line}
              </motion.h1>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6, ease }}
            className="mt-8 text-lg leading-relaxed text-text-secondary max-w-[480px] font-body"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5, ease }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagneticButton
              href="#contact"
              onClick={(e) => handleScroll(e, '#contact')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full liquid-glass-btn text-text-primary font-body text-sm font-medium transition-all"
            >
              Start a Project
              <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton
              href="#services"
              onClick={(e) => handleScroll(e, '#services')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full liquid-glass-btn text-text-primary font-body text-sm font-medium transition-all"
            >
              View Services
              <ChevronDown size={16} />
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border-surface" />
    </section>
  );
}