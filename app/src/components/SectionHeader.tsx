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
          transition={{ duration: 0.6, delay: delay + 0.1, ease: EASE_OUT_EXPO }}
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
          transition={{ duration: 0.6, delay: delay + 0.2, ease: EASE_OUT_EXPO }}
          className="font-body text-body text-text-secondary mt-4 max-w-[560px] mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
