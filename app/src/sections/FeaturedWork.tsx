// Our Journey Timeline Section
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PLANET_IMAGES = [
  '/images/planet-aether.png',
  '/images/planet-forge.png',
  '/images/planet-neural.png',
  '/images/planet-nexus.png',
  '/images/planet-oracle.png',
];

type Milestone = {
  year: string;
  title: string;
  description: string;
};

type JourneyData = {
  sectionLabel: string;
  title: string;
  subtitle?: string;
  milestones: Milestone[];
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function OurJourney() {
  const [data, setData] = useState<JourneyData | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/data/our_journey.json');
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, []);

  if (!data) return null;

  return (
    <section id="work" className="w-full py-20 md:py-[140px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            {data.sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display italic text-[clamp(2rem,6vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            {data.title}
          </motion.h2>
          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease }}
              className="font-body text-base md:text-lg text-text-secondary mt-4 max-w-[560px] mx-auto"
            >
              {data.subtitle}
            </motion.p>
          )}
        </div>

        {/* ── Mobile timeline (single column, line on left) ── */}
        <div className="block md:hidden relative">
          {/* Left-side vertical line */}
          <div className="absolute left-6 top-0 w-px h-full bg-border-surface pointer-events-none" />
          <div className="space-y-10 pl-16">
            {data.milestones.map((m, idx) => (
              <MobileCard key={m.year} milestone={m} index={idx} planet={PLANET_IMAGES[idx % PLANET_IMAGES.length]} />
            ))}
          </div>
        </div>

        {/* ── Desktop timeline (alternating left/right) ── */}
        <div className="hidden md:block relative">
          <div className="absolute left-1/2 top-0 w-px h-full bg-border-surface pointer-events-none" />
          <div className="space-y-32">
            {data.milestones.map((m, idx) => (
              <DesktopCard key={m.year} milestone={m} index={idx} planet={PLANET_IMAGES[idx % PLANET_IMAGES.length]} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─── Mobile card: planet on the left line, card fills the right ─── */
function MobileCard({ milestone, index, planet }: { milestone: Milestone; index: number; planet: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div className="relative">
      {/* Planet sits on the left line */}
      <div
        className="absolute -left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full overflow-hidden border border-border-surface z-10"
        style={{ filter: 'drop-shadow(0 0 6px rgba(200,241,53,0.35))' }}
      >
        <img
          src={planet}
          alt="planet milestone"
          className="w-full h-full object-cover"
          style={{ animation: `planet-spin ${10 + index * 2}s linear infinite` }}
        />
      </div>

      {/* Card */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease, delay: index * 0.08 }}
        className="liquid-glass-card rounded-2xl p-4 sm:p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-mono bg-accent-lime text-bg-base rounded-full flex-shrink-0">
            {milestone.year}
          </span>
          <h4 className="font-display italic text-text-primary text-base leading-snug">
            {milestone.title}
          </h4>
        </div>
        <p className="font-body text-sm text-text-secondary leading-relaxed">
          {milestone.description}
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Desktop card: alternating left / right ─── */
function DesktopCard({ milestone, index, planet }: { milestone: Milestone; index: number; planet: string }) {
  const isLeft = index % 2 === 0;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [isHovered, setIsHovered] = useState(false);

  const cardAnimate = {
    ...(inView ? { opacity: 1, y: 0 } : {}),
    ...(isHovered ? { y: -5 } : {}),
  };

  const connectorAnimate = {
    ...(isHovered ? { scale: 1.4, filter: 'drop-shadow(0 0 14px #C8F135)' } : {}),
  };

  const CardContent = () => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={cardAnimate}
      transition={{ duration: 0.6, ease }}
      className="liquid-glass-card rounded-3xl p-6 w-full max-w-[420px]"
    >
      <div className="flex items-center mb-3">
        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-mono bg-accent-lime text-bg-base rounded-full mr-2">
          {milestone.year}
        </span>
        <h4 className="font-display italic text-text-primary text-lg">
          {milestone.title}
        </h4>
      </div>
      <p className="font-body text-text-secondary">{milestone.description}</p>
    </motion.div>
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center w-full"
    >
      {/* Left half */}
      <div className="w-1/2 flex justify-end pr-16">
        {isLeft && <CardContent />}
      </div>

      {/* Center planet */}
      <motion.div
        animate={connectorAnimate}
        className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden border border-border-surface flex-shrink-0 z-10"
        style={{ filter: 'drop-shadow(0 0 8px rgba(200,241,53,0.35))' }}
      >
        <img
          src={planet}
          alt="planet milestone"
          className="w-full h-full object-cover"
          style={{ animation: `planet-spin ${10 + index * 2}s linear infinite` }}
        />
      </motion.div>

      {/* Right half */}
      <div className="w-1/2 flex justify-start pl-16">
        {!isLeft && <CardContent />}
      </div>
    </div>
  );
}
