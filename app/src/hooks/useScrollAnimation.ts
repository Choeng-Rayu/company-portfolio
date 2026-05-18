import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export function useScrollAnimation(margin = '-100px') {
  const ref = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Check initial scroll position in case page was loaded already scrolled down
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isInView = useInView(ref, {
    once: false,
    margin: margin as `${number}px`,
  });

  useEffect(() => {
    if (hasScrolled && isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [hasScrolled, isInView, hasAnimated]);

  return { ref, isInView: hasAnimated };
}
