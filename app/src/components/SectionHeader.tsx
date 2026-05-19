import { motion, useReducedMotion } from 'framer-motion';
import { D, E, VIEWPORT_ONCE } from '@/lib/animation';

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
  const reduced = useReducedMotion();

  const t = {
    duration: reduced ? D.short : D.medium,
    ease: E.out.fm,
  };

  return (
    <div className={`${alignClass} ${className}`}>
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ ...t, delay: reduced ? 0 : delay }}
          className="font-small text-small text-accent-lime mb-4"
        >
          {label}
        </motion.p>
      )}
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ ...t, delay: reduced ? 0 : delay + 0.1 }}
          className="font-header text-header text-text-primary mt-4"
        >
          {title}
        </motion.h2>
      )}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ ...t, delay: reduced ? 0 : delay + 0.2 }}
          className="font-body text-body text-text-secondary mt-4 max-w-[560px] mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
