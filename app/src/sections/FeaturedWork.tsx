import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OrbitImages from '../components/OrbitImages';

const PLANET_IMAGES = [
  '/images/planet-aether.png',
  '/images/planet-forge.png',
  '/images/planet-neural.png',
  '/images/planet-nexus.png',
  '/images/planet-oracle.png',
];

type Milestone = { year: string; title: string; description: string };
type JourneyData = { sectionLabel: string; title: string; subtitle?: string; milestones: Milestone[] };

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const AUTO_INTERVAL = 3000;

// OrbitImages config
const BASE_WIDTH = 900;
const RADIUS_Y = 100;
const ITEM_SIZE = 80;

export default function OurJourney() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    fetch('/data/our_journey.json').then(r => r.json()).then(setData);
  }, []);

  // Auto-advance through milestones, pause when hovered
  useEffect(() => {
    if (!data || hovered) return;
    const id = setInterval(() => {
      setActiveIndex(i => (i + 1) % data.milestones.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [data, hovered]);

  if (!data) return null;

  const planetImages = data.milestones.map((_, idx) => PLANET_IMAGES[idx % PLANET_IMAGES.length]);

  const centerContent = (
    <motion.div
      key={activeIndex}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="liquid-glass-card rounded-3xl p-6 md:p-8 text-center max-w-[320px]"
    >
      <span className="inline-flex items-center justify-center px-4 py-1.5 text-base font-mono bg-accent-lime text-bg-base rounded-full mb-3">
        {data.milestones[activeIndex].year}
      </span>
      <h3 className="font-display text-xl md:text-2xl text-text-primary mb-2 leading-tight">
        {data.milestones[activeIndex].title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed">
        {data.milestones[activeIndex].description}
      </p>
    </motion.div>
  );

  return (
    <section id="journey" className="w-full py-20 md:py-[140px] bg-transparent">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            {data.sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display text-[clamp(2rem,6vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            {data.title}
          </motion.h2>
          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.2, duration: 0.6, ease }}
              className="text-lg md:text-xl text-text-secondary mt-4 max-w-[560px] mx-auto"
            >
              {data.subtitle}
            </motion.p>
          )}
          {/* Milestone count caption */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.35, duration: 0.6, ease }}
            className="inline-flex items-center gap-3 mt-6 px-5 py-3 rounded-2xl liquid-glass-card mx-auto"
          >
            <span className="font-display text-2xl text-accent-lime">{data.milestones.length}</span>
            <span className="text-sm text-text-secondary leading-snug text-left">
              key milestones shaping<br />our path to the future
            </span>
          </motion.div>
          {/* Interaction hint */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="font-mono text-[0.65rem] tracking-wide text-text-muted/50 mt-3"
          >
            Hover to pause · Click a milestone to explore
          </motion.p>
        </div>

        {/* Orbit — collapse empty space above/below the ellipse band */}
        <div style={{ marginTop: -260, marginBottom: -260 }}>
            <OrbitImages
              images={planetImages}
              shape="ellipse"
              baseWidth={BASE_WIDTH}
              radiusX={400}
              radiusY={RADIUS_Y}
              rotation={-8}
              duration={30}
              itemSize={ITEM_SIZE}
              responsive={true}
              direction="normal"
              showPath={true}
              paused={hovered}
              fill={true}
              centerContent={centerContent}
              renderItem={(src, index) => (
                <button
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="relative w-full h-full rounded-full overflow-visible border-2 transition-all duration-300 cursor-pointer"
                  style={{
                    borderColor: activeIndex === index ? '#C8F135' : 'rgba(255,255,255,0.15)',
                    boxShadow: activeIndex === index ? '0 0 20px rgba(200,241,53,0.5)' : 'none',
                    transform: activeIndex === index ? 'scale(1.2)' : 'scale(1)',
                  }}
                  title={data!.milestones[index].year}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={src}
                      alt={data!.milestones[index].year}
                      className="w-full h-full object-cover"
                      style={{ animation: `planet-spin ${10 + index * 2}s linear infinite` }}
                    />
                  </div>
                  <span
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] tracking-wide whitespace-nowrap transition-colors duration-300"
                    style={{ color: activeIndex === index ? '#C8F135' : 'rgba(255,255,255,0.4)' }}
                  >
                    {data!.milestones[index].year}
                  </span>
                </button>
              )}
            />
        </div>
      </div>
    </section>
  );
}
