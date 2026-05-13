import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const steps = [
  { num: '01', title: 'Discovery', desc: 'Requirements, research, scoping', duration: '1–2 weeks' },
  { num: '02', title: 'Architecture', desc: 'System design, tech decisions', duration: '1 week' },
  { num: '03', title: 'Design Sprint', desc: 'Figma prototypes, design system', duration: '1–2 weeks' },
  { num: '04', title: 'Build', desc: 'Agile sprints, weekly demos', duration: '4–12 weeks' },
  { num: '05', title: 'QA & Launch', desc: 'Testing, CI/CD, deployment', duration: '1 week' },
  { num: '06', title: 'Support & Grow', desc: 'Monitoring, iterations', duration: 'ongoing' },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 50%'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="w-full py-[140px] bg-[#0E0E11] border-t border-border-surface" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            OUR PROCESS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            The Launch Sequence
          </motion.h2>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* SVG path */}
          <svg
            viewBox="0 0 1200 200"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 50 100 Q 150 50, 250 100 T 450 100 T 650 100 T 850 100 T 1050 100 T 1150 100"
              fill="none"
              stroke="#C8F135"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            {/* Fallback visible path (background) */}
            <path
              d="M 50 100 Q 150 50, 250 100 T 450 100 T 650 100 T 850 100 T 1050 100 T 1150 100"
              fill="none"
              stroke="#222228"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Steps positioned over the path */}
          <div className="relative mt-8 grid grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease }}
                className="text-center"
              >
                <p className="font-mono text-5xl text-text-muted">{step.num}</p>
                <h4 className="text-base font-medium text-text-primary mt-3">
                  {step.title}
                </h4>
                <p className="text-base text-text-secondary mt-2">
                  {step.desc}
                </p>
                <span className="inline-block mt-3 px-3 py-1 rounded-full bg-accent-lime text-bg-base font-mono text-[0.65rem] uppercase">
                  {step.duration}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical layout */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease }}
              className="flex gap-4 items-start"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-accent-lime flex items-center justify-center">
                  <span className="font-mono text-xs text-bg-base font-medium">
                    {step.num}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-12 bg-border-surface mt-2" />
                )}
              </div>
              <div className="pb-8">
                <h4 className="text-base font-medium text-text-primary">
                  {step.title}
                </h4>
                <p className="text-base text-text-secondary mt-1">
                  {step.desc}
                </p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-accent-lime text-bg-base font-mono text-[0.65rem] uppercase">
                  {step.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}