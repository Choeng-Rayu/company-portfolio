import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollAnimation(margin = '-100px') {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: margin as `${number}px` });
  
  return { ref, isInView };
}
