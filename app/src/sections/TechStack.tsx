import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const categories = [
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    label: 'Infrastructure',
    items: ['AWS', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
  },
  {
    label: 'AI / Data',
    items: ['OpenAI', 'TensorFlow', 'PyTorch', 'Pandas', 'Kafka', 'Elasticsearch'],
  },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="w-full py-[100px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            OUR TOOLKIT
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="text-[2rem] font-medium text-text-primary mt-4"
          >
            Technologies We Master
          </motion.h2>
        </div>

        {/* Category clusters */}
        <div className="space-y-12">
          {categories.map((cat, catIndex) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + catIndex * 0.1, duration: 0.6, ease }}
            >
              <p className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted mb-4">
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-3">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="liquid-glass-btn px-5 py-3 font-mono text-sm text-text-secondary hover:text-text-primary transition-all cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}