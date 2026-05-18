import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Search, PenTool, Code, Rocket, TrendingUp } from 'lucide-react';
import { EASE_OUT_EXPO } from '@/lib/animation';
import SectionHeader from '@/components/SectionHeader';

const steps = [
  { num: '01', title: 'Discovery', desc: 'We learn your business, map pain points, and define clear outcomes together.', duration: '1–2 weeks', icon: Search },
  { num: '02', title: 'Design', desc: 'Figma prototypes and a living design system you can interact with before we build.', duration: '1–2 weeks', icon: PenTool },
  { num: '03', title: 'Build', desc: 'Agile sprints with weekly demos. You see progress, not promises.', duration: '4–10 weeks', icon: Code },
  { num: '04', title: 'Launch', desc: 'Testing, deployment, and a smooth handoff — we train your team to own it.', duration: '1 week', icon: Rocket },
  { num: '05', title: 'Grow', desc: 'Ongoing support, monitoring, and iterative improvements as you scale.', duration: 'ongoing', icon: TrendingUp },
];

function IsoBlock({
  num,
  isActive,
  delay,
  isInView,
  size = 40,
}: {
  num: string;
  isActive: boolean;
  delay: number;
  isInView: boolean;
  size?: number;
}) {
  const prefersReduced = useReducedMotion();
  const half = size / 2;

  return (
    <div
      className={`iso-scene ${isActive ? 'iso-glow' : ''}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="iso-block"
        initial={{
          opacity: 0,
          rotateX: prefersReduced ? 60 : 0,
          rotateZ: prefersReduced ? -45 : 0,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                rotateX: 60,
                rotateZ: -45,
              }
            : {}
        }
        transition={{
          delay: 0.3 + delay * 0.12,
          duration: 0.8,
          ease: EASE_OUT_EXPO,
        }}
        style={{ width: size, height: size }}
      >
        <div
          className="iso-face iso-face-top"
          style={{
            width: size,
            height: size,
            transform: `rotateX(-90deg) translateZ(${half}px)`,
          }}
        >
          <span className="font-mono text-[0.65rem] font-bold text-bg-base tracking-tight">
            {num}
          </span>
        </div>
        <div
          className="iso-face iso-face-side1"
          style={{
            width: size,
            height: size,
            transform: `translateZ(${half}px)`,
          }}
        />
        <div
          className="iso-face iso-face-side2"
          style={{
            width: size,
            height: size,
            transform: `rotateY(-90deg) translateZ(${half}px)`,
          }}
        />
      </motion.div>
    </div>
  );
}

export default function Process() {
  const { ref, isInView } = useScrollAnimation('-100px');
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 50%'],
  });
  const [activeIndex, setActiveIndex] = useState(-1);

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const activeStepMotion = useTransform(
    scrollYProgress,
    [0, 1],
    [0, steps.length - 1]
  );

  useEffect(() => {
    const unsubscribe = activeStepMotion.on('change', (latest) => {
      setActiveIndex(Math.round(latest));
    });
    return unsubscribe;
  }, [activeStepMotion]);

  return (
    <section
      id="process"
      className="w-full py-[140px] bg-[#0E0E11] border-t border-border-surface"
      ref={ref}
    >
      <style>{`
        .iso-scene {
          perspective: 600px;
          flex-shrink: 0;
        }
        .iso-block {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
        .iso-face {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 6px;
        }
        .iso-face-top {
          background: #C8F135;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          font-weight: 800;
          color: #0E0E11;
        }
        .iso-face-side1 {
          background: #a8d030;
        }
        .iso-face-side2 {
          background: #7da020;
        }
        .iso-glow {
          filter: drop-shadow(0 0 10px rgba(200, 241, 53, 0.5)) drop-shadow(0 0 20px rgba(200, 241, 53, 0.3));
        }
        .iso-glow .iso-face-top {
          box-shadow: 0 0 15px rgba(200, 241, 53, 0.6);
        }
        .group:hover .iso-scene:not(.iso-glow) {
          filter: drop-shadow(0 0 8px rgba(200, 241, 53, 0.35));
        }
        .group:hover .iso-scene:not(.iso-glow) .iso-face-top {
          box-shadow: 0 0 10px rgba(200, 241, 53, 0.4);
        }
        @media (prefers-reduced-motion: reduce) {
          .iso-block {
            transform: rotateX(60deg) rotateZ(-45deg) !important;
          }
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeader
          label="OUR PROCESS"
          title="The Launch Sequence"
          className="mb-16"
        />

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
                  animate={
                    isInView ? { opacity: 1, y: 0, scale: 1 } : {}
                  }
                  transition={{
                    delay: 0.3 + i * 0.12,
                    duration: 0.6,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="text-center group"
                >
                  <div className="relative mx-auto mb-4 w-16 h-16 rounded-2xl liquid-glass-card flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-accent-lime" />
                    <div className="absolute -top-3 -right-3 z-10">
                      <IsoBlock
                        num={step.num}
                        isActive={i === activeIndex}
                        delay={i}
                        isInView={isInView}
                        size={40}
                      />
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
                transition={{
                  delay: 0.2 + i * 0.1,
                  duration: 0.6,
                  ease: EASE_OUT_EXPO,
                }}
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
                    <IsoBlock
                      num={step.num}
                      isActive={i === activeIndex}
                      delay={i}
                      isInView={isInView}
                      size={28}
                    />
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
