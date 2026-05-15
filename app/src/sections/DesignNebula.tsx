// Vision, Mission, Goals Section
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type CardData = {
  sectionLabel: string;
  title: string;
  number: string;
  bullets: string[];
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// VisionCard component with 3D tilt and spotlight effect
function VisionCard({
  card,
  tintColor,
}: {
  card: CardData;
  tintColor: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  // Background gradient that follows the mouse
  const spotlight = useMotionTemplate`
    radial-gradient(
      circle at ${mouseX}px ${mouseY}px,
      ${tintColor.replace('0.15', '0.2')},
      transparent 100%
    )`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    // Map cursor position to rotation angles (max ±15deg)
    const rotY = ((x - rect.width / 2) / rect.width) * 30; // Y axis rotation
    const rotX = ((y - rect.height / 2) / rect.height) * -30; // X axis rotation (inverted)
    rotateX.set(rotX);
    rotateY.set(rotY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative liquid-glass-card rounded-3xl p-8 text-center transition-all duration-300 bg-white/5`}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', borderColor: tintColor.replace('0.15', '0.3') }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ background: spotlight, mixBlendMode: 'screen' }}
      />

      {/* Number badge */}
      <div className="flex justify-center mb-4">
        <span className="inline-block px-3 py-1 text-sm font-mono bg-[rgba(255,255,255,0.1)] rounded-full text-text-primary">
          {card.number}
        </span>
      </div>

      <h3 className="text-xl font-medium text-text-primary mb-4">
        {card.title}
      </h3>

      <ul className="text-left space-y-2 text-text-secondary text-base">
        {card.bullets.map((b, idx) => (
          <li key={idx}>• {b}</li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function VisionMissionGoals() {
  const [cards, setCards] = useState<CardData[]>([]);
  const { ref, isInView } = useScrollAnimation('-100px');

  useEffect(() => {
    const fetchData = async () => {
      const [visionRes, missionRes, goalsRes] = await Promise.all([
        fetch('/data/visions.json'),
        fetch('/data/missions.json'),
        fetch('/data/goals.json'),
      ]);
      const [vision, mission, goals] = await Promise.all([
        visionRes.json(),
        missionRes.json(),
        goalsRes.json(),
      ]);
      setCards([vision, mission, goals]);
    };
    fetchData();
  }, []);

  const tintColors = [
    'rgba(139, 92, 246, 0.15)', // Vision
    'rgba(200, 241, 53, 0.15)', // Mission
    'rgba(245, 158, 11, 0.15)', // Goals
  ];

  return (
    <section className="w-full py-[140px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            02 — VISION · MISSION · GOALS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            Where We Stand &amp; Where We Go
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{cards.map((card, i) => (
<VisionCard
  key={card.title}
  card={card}
  tintColor={tintColors[i]}
/>
))}
        </div>
      </div>
    </section>
  );
}
