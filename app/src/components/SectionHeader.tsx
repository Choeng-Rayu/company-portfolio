import { motion } from 'framer-motion';
import { EASE_OUT_EXPO, VIEWPORT_ONCE } from '@/lib/animation';

interface SectionHeaderProps {
  label?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
  delay?: number;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  className = '',
  align = 'center',
  delay = 0,
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`${alignClass} ${className}`}>
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
          className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime mb-4"
        >
          {label}
        </motion.p>
      )}
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.6, delay: delay + 0.1, ease: EASE_OUT_EXPO }}
          className="font-display text-[clamp(2rem,6vw,5rem)] leading-[1.05] text-text-primary mt-4"
        >
          {title}
        </motion.h2>
      )}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.6, delay: delay + 0.2, ease: EASE_OUT_EXPO }}
          className="text-lg text-text-secondary mt-4 max-w-[560px] mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
