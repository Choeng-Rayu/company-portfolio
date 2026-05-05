import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Fixed HUD component providing a scroll progress bar and static information.
 * - Full‑screen fixed container with pointer-events disabled.
 * - Top progress bar reflects the page scroll using a spring‑animated value.
 * - Bottom corners display placeholder coordinates and speed.
 */
const HUD: React.FC = () => {
  // framer‑motion hook to get scroll progress (0 → 1)
  const { scrollYProgress } = useScroll();
  // Smooth the progress value with a spring for a nicer animation
  const spring = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between">
      {/* Scroll progress bar at the top */}
      <motion.div
        className="h-1 bg-accent-lime origin-left"
        style={{ scaleX: spring }}
      />

      {/* Bottom info bar */}
      <div className="flex justify-between px-4 pb-2 text-text-primary font-mono text-xs">
        <span>Coordinates: UNKNOWN</span>
        <span>Speed: Warp 1</span>
      </div>
    </div>
  );
};

export default HUD;
