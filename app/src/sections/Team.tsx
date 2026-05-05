import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  linkedIn: string;
}

interface TeamData {
  sectionLabel: string;
  title: string;
  subtitle: string;
  members: TeamMember[];
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function TeamCard({ member, index, isInView }: { member: TeamMember; index: number; isInView: boolean }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10; // -5 to 5
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10; // -5 to 5 (inverted)
    rotateX.set(y);
    rotateY.set(x);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const bgGradient = `linear-gradient(135deg, hsl(${index * 60},70%,50%), hsl(${index * 60 + 30},70%,40%))`;

  return (
    <motion.div
      style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' } as any}
      className="liquid-glass rounded-3xl p-8 text-center transition-all"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.6, ease }}
    >
      <div
        className="flex items-center justify-center w-16 h-16 mx-auto rounded-full text-white text-xl font-bold mb-4"
        style={{ background: bgGradient }}
      >
        {member.initials}
      </div>
      <h4 className="font-body text-lg font-medium text-text-primary mt-4">{member.name}</h4>
      <p className="font-mono text-xs uppercase text-text-muted mt-1">{member.role}</p>
      <a
        href={member.linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-text-muted hover:text-accent-lime transition-colors"
        aria-label={`${member.name}'s LinkedIn`}
      >
        <Linkedin size={16} />
      </a>
    </motion.div>
  );
}

export default function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [data, setData] = useState<TeamData | null>(null);

  useEffect(() => {
    fetch('/data/our_team.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to load team data:', err));
  }, []);

  if (!data) {
    return null;
  }

  return (
    <section id="team" className="w-full py-[140px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs uppercase text-accent-lime"
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="font-body text-lg text-text-secondary mt-2"
          >
            {data.subtitle}
          </motion.p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.members.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
