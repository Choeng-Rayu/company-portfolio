import { motion, AnimatePresence } from 'framer-motion'
import { type ReactNode, useRef } from 'react'
import { useLocation } from 'react-router'
import { E } from '../lib/animation'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Page transition — aligned with motion token system.
// Exit: fade + 8px down, Enter: fade + 8px up with slight delay for clean crossfade.

const variants = {
  initial: { opacity: 0, y: 8, scale: 0.99 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transitionEnd: {
      transform: 'none',
    },
  },
  exit: { opacity: 0, y: -8, scale: 0.99 },
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={containerRef}
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: 0.4, // Faster transition
          delay: 0, // No delay for faster feel
          ease: E.out.fm,
        }}
        onAnimationComplete={(definition) => {
          if (definition === 'animate' && containerRef.current) {
            containerRef.current.style.transform = '';
            containerRef.current.style.willChange = '';
            ScrollTrigger.refresh();
          }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
