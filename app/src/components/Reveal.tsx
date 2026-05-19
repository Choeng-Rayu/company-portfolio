import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { D, E } from '../lib/animation';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

interface RevealProps {
  children: ReactNode;
  delay?: number;       // multiplier of S.section (default 1)
  stagger?: number;     // children-stagger override
  from?: RevealDirection;
  amount?: number;      // intersection threshold, default 0.25
  className?: string;
}

const OFFSET = 24; // px

const dirMap: Record<RevealDirection, { x: number; y: number }> = {
  up:    { x: 0,  y: OFFSET },
  down:  { x: 0,  y: -OFFSET },
  left:  { x: OFFSET, y: 0 },
  right: { x: -OFFSET, y: 0 },
  fade:  { x: 0,  y: 0 },
};

export default function Reveal({
  children,
  delay = 0,
  from = 'up',
  amount = 0.25,
  className = '',
}: RevealProps) {
  const reduced = useReducedMotion();
  const { x, y } = dirMap[from];

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduced ? D.short : D.medium,
        delay: reduced ? 0 : delay,
        ease: E.out.fm,
      }}
    >
      {children}
    </motion.div>
  );
}
