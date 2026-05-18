import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/animation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  initials: string;
  color: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Chakrawal Digital built our lab management system from scratch. The team understood our workflow and delivered something that actually makes our daily operations easier. Student scheduling went from a whiteboard mess to a self-service portal.',
    name: 'Chanrith Sok',
    title: 'Operations Director',
    company: 'MR Training & Jobs Center',
    initials: 'CS',
    color: '#C8F135',
    rating: 5,
  },
  {
    quote:
      'We needed a provincial website that citizens could actually use. They delivered a clean, fast site that our elderly residents can navigate without help. Citizen inquiries through the website increased 3x in the first month after launch.',
    name: 'Sopheap Chea',
    title: 'Director of Administration',
    company: 'Oddar Meanchey Provincial Gov',
    initials: 'SC',
    color: '#3CB371',
    rating: 5,
  },
  {
    quote:
      'Our HRM system went from spreadsheet chaos to a proper platform. Payroll processing dropped from 3 days to under 4 hours. Error rate went to zero. Worth every riel.',
    name: 'Dara Oum',
    title: 'HR Manager',
    company: 'MR Training & Jobs Center',
    initials: 'DO',
    color: '#4477DD',
    rating: 5,
  },
];


function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-sm font-bold flex-shrink-0"
      style={{
        background: `${color}18`,
        color,
        border: `1.5px solid ${color}40`,
      }}
    >
      {initials}
    </div>
  );
}

function SonarAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <div className="sonar-ring absolute inset-0 rounded-full" />
      <div className="sonar-ring absolute inset-0 rounded-full" />
      <div className="sonar-ring absolute inset-0 rounded-full" />
      <div className="absolute inset-0 z-10">
        <Avatar initials={initials} color={color} />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-accent-lime fill-accent-lime' : 'text-text-muted'}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const { ref, isInView } = useScrollAnimation('-100px');

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <>
      <style>{`
        @keyframes sonar {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes sonar-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.35);
            opacity: 0;
          }
        }
        .sonar-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(200, 241, 53, 0.1);
          animation: sonar 2.4s ease-out infinite;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .sonar-ring:nth-child(2) {
          animation-delay: 0.8s;
        }
        .sonar-ring:nth-child(3) {
          animation-delay: 1.6s;
        }
        @media (max-width: 767px) {
          .sonar-ring {
            animation: sonar-pulse 2s ease-in-out infinite;
            border-color: rgba(200, 241, 53, 0.12);
          }
          .sonar-ring:nth-child(2),
          .sonar-ring:nth-child(3) {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sonar-ring {
            animation: none !important;
            display: none !important;
          }
        }
      `}</style>
      <section className="w-full py-[140px] bg-[#0E0E11]" ref={ref}>
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
            >
              CLIENT FEEDBACK
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
              className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] text-text-primary mt-4"
            >
              What They Say
            </motion.h2>
          </div>

          {/* Featured quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="relative max-w-[900px] mx-auto"
          >
            <div className="liquid-glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
              {/* Background accent */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-[0.06] pointer-events-none"
                style={{ background: testimonials[active].color }}
              />

              {/* Quote icon */}
              <Quote
                size={40}
                className="text-accent-lime/20 mb-6"
              />

              <div className="relative min-h-[160px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  >
                    <p className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.5] text-text-primary">
                      &ldquo;{testimonials[active].quote}&rdquo;
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4"
                  >
                    <SonarAvatar initials={testimonials[active].initials} color={testimonials[active].color} />
                    <div>
                      <p className="text-base font-medium text-text-primary">
                        {testimonials[active].name}
                      </p>
                      <p className="font-mono text-xs text-text-muted mt-0.5">
                        {testimonials[active].title} · {testimonials[active].company}
                      </p>
                      <div className="mt-1.5">
                        <StarRating rating={testimonials[active].rating} />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-xl liquid-glass-btn flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-xl liquid-glass-btn flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Thumbnail selectors */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border ${
                  i === active
                    ? 'bg-white/5 border-white/15'
                    : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'
                }`}
              >
                <Avatar initials={t.initials} color={t.color} />
                <div className="text-left hidden sm:block">
                  <p className={`text-sm font-medium transition-colors ${i === active ? 'text-text-primary' : 'text-text-muted'}`}>
                    {t.name}
                  </p>
                  <p className="font-mono text-[0.6rem] text-text-muted">
                    {t.company}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
