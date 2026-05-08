// Our Journey Timeline Section
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

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
    <section className="w-full py-[140px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
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
            className="font-display italic text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            {data.title}
          </motion.h2>
          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease }}
              className="font-body text-lg text-text-secondary mt-4 max-w-[560px] mx-auto"
            >
              {data.subtitle}
            </motion.p>
          )}
        </div>

        {/* Timeline */}
        <div className="relative space-y-12 md:space-y-20">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 w-px h-full bg-border-surface pointer-events-none" />
          {data.milestones.map((m, idx) => (
            <MilestoneCard key={m.year} milestone={m} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const isLeft = index % 2 === 0;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [isHovered, setIsHovered] = useState(false);

  // Combined animation for in‑view and hover states
  const cardAnimate = {
    ...(inView ? { opacity: 1, y: 0 } : {}),
    ...(isHovered ? { y: -5 } : {}),
  };

  const connectorAnimate = {
    ...(isHovered ? { scale: 1.5, boxShadow: '0 0 15px #C8F135' } : {}),
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col md:flex-row items-center ${isLeft ? 'md:justify-end' : 'md:justify-start'} w-full`}
    >
      {/* Spacer */}
      <div className="md:w-1/2" />
      {/* Card */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={cardAnimate}
        transition={{ duration: 0.6, ease }}
        className="liquid-glass-card rounded-3xl p-6 w-full md:w-5/12"
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
      {/* Connector dot */}
      <motion.span
        animate={connectorAnimate}
        className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-lime rounded-full border border-border-surface"
      />
    </div>
  );
}
