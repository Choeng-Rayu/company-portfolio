"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { D, E } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "down" | "left" | "right" | "fade";
  amount?: number;
}

const offset = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  fade: { x: 0, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  amount = 0.22,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const initial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, ...offset[from] };

  return (
    <motion.div
      className={cn(className)}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: prefersReducedMotion ? D.short : D.medium,
        delay,
        ease: E.out,
      }}
    >
      {children}
    </motion.div>
  );
}
