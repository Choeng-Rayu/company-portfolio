import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote:
      'Universe transformed our legacy payment system into a modern, scalable platform. The team\'s technical depth and communication were exceptional.',
    name: 'Chanrith Sok',
    title: 'CTO at PayFlow',
    avatar: '/images/avatar-chanrith.jpg',
  },
  {
    quote:
      'Their AI integration reduced our logistics costs by 40%. They didn\'t just build software — they understood our business.',
    name: 'Sopheap Chea',
    title: 'CEO at GreenRoute',
    avatar: '/images/avatar-sopheap.jpg',
  },
  {
    quote:
      'The design system they created unified our entire product suite. Every pixel, every interaction, feels intentional.',
    name: 'Dara Oum',
    title: 'Product Lead at MedConnect',
    avatar: '/images/avatar-dara.jpg',
  },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="w-full py-[140px] bg-[#0E0E11]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            TRANSMISSIONS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            Client Signals
          </motion.h2>
        </div>

        {/* Quote carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="relative max-w-[800px] mx-auto"
        >
          {/* Large quotation mark */}
          <span
            className="absolute -top-8 -left-4 font-display text-[6rem] leading-none select-none pointer-events-none"
            style={{ color: 'rgba(200, 241, 53, 0.15)' }}
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease }}
                className="text-center"
              >
                <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.4] text-text-primary">
                  {testimonials[active].quote}
                </p>

                <div className="flex items-center justify-center gap-4 mt-10">
                  <img
                    src={testimonials[active].avatar}
                    alt={testimonials[active].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-base font-medium text-text-primary">
                      {testimonials[active].name}
                    </p>
                    <p className="font-mono text-xs text-text-muted">
                      {testimonials[active].title}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === active ? 'bg-accent-lime' : 'bg-border-surface hover:bg-border-accent'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}