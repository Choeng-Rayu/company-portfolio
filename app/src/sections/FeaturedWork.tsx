// Our Journey Timeline Section - Orbit Animation
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import OrbitImages from '../components/OrbitImages';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    fetch('/data/our_journey.json')
      .then(r => r.json())
      .then(setData);
  }, []);

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
    <section id="journey" className="w-full py-20 md:py-[140px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
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
            className="font-display text-[clamp(2rem,6vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            {data.title}
          </motion.h2>
          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease }}
              className="text-lg md:text-xl text-text-secondary mt-4 max-w-[560px] mx-auto"
            >
              {data.subtitle}
            </motion.p>
          )}
        </div>

        {/* Orbit */}
        <OrbitImages
          images={planetImages}
          shape="ellipse"
          baseWidth={900}
          radiusX={400}
          radiusY={100}
          rotation={-8}
          duration={30}
          itemSize={80}
          responsive={true}
          direction="normal"
          showPath={true}
          paused={false}
          fill={true}
          centerContent={centerContent}
          renderItem={(src, index) => (
            <button
              onClick={() => setActiveIndex(index)}
              className="w-full h-full rounded-full overflow-hidden border-2 transition-all duration-300 cursor-pointer"
              style={{
                borderColor: activeIndex === index ? '#C8F135' : 'rgba(255,255,255,0.15)',
                boxShadow: activeIndex === index ? '0 0 20px rgba(200,241,53,0.5)' : 'none',
                transform: activeIndex === index ? 'scale(1.2)' : 'scale(1)',
              }}
              title={data!.milestones[index].year}
            >
              <img
                src={src}
                alt={data!.milestones[index].year}
                className="w-full h-full object-cover"
                style={{ animation: `planet-spin ${10 + index * 2}s linear infinite` }}
              />
            </button>
          )}
        />
      </div>
    </section>
  );
}
