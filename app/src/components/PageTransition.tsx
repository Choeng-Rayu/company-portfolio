import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { D, E } from '../lib/animation'

// Page transition — aligned with motion token system.
// Exit: fade + 8px down, Enter: fade + 8px up with slight delay for clean crossfade.

const variants = {
  initial: { opacity: 0, y: 8, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:  { opacity: 0, y: -8, scale: 0.99 },
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: D.medium,
          delay: D.short, // slight delay so exit completes cleanly
          ease: E.out.fm,
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
