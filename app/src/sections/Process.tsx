import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Search, PenTool, Code, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  { num: '01', title: 'Discovery', desc: 'We learn your business, map pain points, and define clear outcomes together.', duration: '1–2 weeks', icon: Search },
  { num: '02', title: 'Design', desc: 'Figma prototypes and a living design system you can interact with before we build.', duration: '1–2 weeks', icon: PenTool },
  { num: '03', title: 'Build', desc: 'Agile sprints with weekly demos. You see progress, not promises.', duration: '4–10 weeks', icon: Code },
  { num: '04', title: 'Launch', desc: 'Testing, deployment, and a smooth handoff — we train your team to own it.', duration: '1 week', icon: Rocket },
  { num: '05', title: 'Grow', desc: 'Ongoing support, monitoring, and iterative improvements as you scale.', duration: 'ongoing', icon: TrendingUp },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Process() {
  const { ref, isInView } = useScrollAnimation('-100px');
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
              d="M 50 100 Q 175 40, 300 100 T 550 100 T 800 100 T 1050 100 T 1150 100"
              fill="none"
              stroke="#C8F135"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            {/* Fallback visible path (background) */}
            <path
              d="M 50 100 Q 175 40, 300 100 T 550 100 T 800 100 T 1050 100 T 1150 100"
              fill="none"
              stroke="#222228"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Steps positioned over the path */}
          <div className="relative mt-8 grid grid-cols-5 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease }}
                  className="text-center group"
                >
                  <div className="relative mx-auto mb-4 w-16 h-16 rounded-2xl liquid-glass-card flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-accent-lime" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent-lime flex items-center justify-center">
                      <span className="font-mono text-[0.6rem] text-bg-base font-bold">{step.num}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-medium text-text-primary mt-3">
                    {step.title}
                  </h4>
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-accent-lime/10 text-accent-lime font-mono text-[0.65rem] uppercase border border-accent-lime/20">
                    {step.duration}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical layout */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease }}
                className="flex gap-4 items-start liquid-glass-card rounded-2xl p-5"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent-lime/10 flex items-center justify-center border border-accent-lime/20">
                    <Icon size={20} className="text-accent-lime" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-8 bg-border-surface mt-2" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-accent-lime">{step.num}</span>
                    <h4 className="text-base font-medium text-text-primary">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-accent-lime/10 text-accent-lime font-mono text-[0.6rem] uppercase border border-accent-lime/20">
                    {step.duration}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}