import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollerProps {
  children: ReactNode;
}

export default function SmoothScroller({ children }: SmoothScrollerProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Initialize Lenis with lerp for "liquid" smoothness
    const lenis = new Lenis({
      lerp: 0.1, // Faster lerp for better responsiveness on mobile
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // 2. Connect ScrollTrigger to Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Integrate with GSAP ticker for synchronized animation frames
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // 4. Initial refresh
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle scroll to top on route change
  useEffect(() => {
    // 1. Reset native scroll immediately
    window.scrollTo(0, 0);
    
    // 2. Reset Lenis if it exists
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    // 3. Force a ScrollTrigger refresh after a short delay to account for page transition / DOM shifts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{children}</>;
}
