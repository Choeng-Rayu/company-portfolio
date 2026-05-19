import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export function useScrollAnimation(margin = '-100px') {
  const ref = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const isInView = useInView(ref, {
    once: true, // Only animate once
    margin: margin as `${number}px`,
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return { ref, isInView: hasAnimated };
}
