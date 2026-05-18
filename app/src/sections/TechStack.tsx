import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/animation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import {
  Palette, Server, Cloud, BrainCircuit,
  type LucideIcon
} from 'lucide-react';

interface TechItem {
  name: string;
  icon: LucideIcon;
}

interface TechCategory {
  label: string;
  icon: LucideIcon;
  items: TechItem[];
}

const categories: TechCategory[] = [
  {
    label: 'Frontend',
    icon: Palette,
    items: [
      { name: 'React', icon: Palette },
      { name: 'Next.js', icon: Palette },
      { name: 'TypeScript', icon: Palette },
      { name: 'Tailwind CSS', icon: Palette },
      { name: 'Framer Motion', icon: Palette },
      { name: 'Three.js', icon: Palette },
    ],
  },
  {
    label: 'Backend',
    icon: Server,
    items: [
      { name: 'Node.js', icon: Server },
      { name: 'Python', icon: Server },
      { name: 'Go', icon: Server },
      { name: 'PostgreSQL', icon: Server },
      { name: 'MongoDB', icon: Server },
      { name: 'Redis', icon: Server },
    ],
  },
  {
    label: 'Infrastructure',
    icon: Cloud,
    items: [
      { name: 'AWS', icon: Cloud },
      { name: 'Google Cloud', icon: Cloud },
      { name: 'Kubernetes', icon: Cloud },
      { name: 'Docker', icon: Cloud },
      { name: 'Terraform', icon: Cloud },
      { name: 'CI/CD', icon: Cloud },
    ],
  },
  {
    label: 'AI / Data',
    icon: BrainCircuit,
    items: [
      { name: 'OpenAI', icon: BrainCircuit },
      { name: 'TensorFlow', icon: BrainCircuit },
      { name: 'PyTorch', icon: BrainCircuit },
      { name: 'Pandas', icon: BrainCircuit },
      { name: 'Kafka', icon: BrainCircuit },
      { name: 'Elasticsearch', icon: BrainCircuit },
    ],
  },
];


export default function TechStack() {
  const { ref, isInView } = useScrollAnimation('-100px');

  return (
    <section className="w-full py-[100px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            OUR TOOLKIT
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="text-[2rem] font-medium text-text-primary mt-4"
          >
            Technologies We Master
          </motion.h2>
        </div>

        {/* Category clusters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, catIndex) => {
            const CatIcon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + catIndex * 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
                className="liquid-glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-accent-lime/10 flex items-center justify-center border border-accent-lime/20">
                    <CatIcon size={20} className="text-accent-lime" />
                  </div>
                  <p className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted">
                    {cat.label}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span
                      key={item.name}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-glass-btn font-mono text-sm text-text-secondary hover:text-text-primary hover:border-accent-lime/30 transition-all cursor-default group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-lime/60 group-hover:bg-accent-lime transition-colors" />
                      {item.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
