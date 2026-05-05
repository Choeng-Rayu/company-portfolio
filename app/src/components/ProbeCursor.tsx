import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function ProbeCursor() {
  const [isVisible, setIsVisible] = useState(false);

  // Main targeting dot
  const springConfig = { stiffness: 300, damping: 20, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  // Trailing particles setup
  const numParticles = 5;
  const particles = Array.from({ length: numParticles }).map((_, i) => ({
    x: useSpring(0, { stiffness: 200 - i * 20, damping: 20 + i * 5, mass: 0.5 + i * 0.1 }),
    y: useSpring(0, { stiffness: 200 - i * 20, damping: 20 + i * 5, mass: 0.5 + i * 0.1 }),
  }));

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth < 1024) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      particles.forEach((p) => {
        p.x.set(e.clientX);
        p.y.set(e.clientY);
      });

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, particles, isVisible]);

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice || (typeof window !== 'undefined' && window.innerWidth < 1024)) return null;

  return (
    <>
      {/* Trailing particles */}
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen"
          style={{
            x: p.x,
            y: p.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          <motion.div
            className="w-1 h-1 rounded-full bg-accent-lime/50"
            animate={{ opacity: isVisible ? 1 - i * 0.15 : 0 }}
            transition={{ duration: 0.15 }}
          />
        </motion.div>
      ))}

      {/* Main targeting dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </>
  );
}
