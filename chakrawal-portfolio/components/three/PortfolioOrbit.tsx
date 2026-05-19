"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import type { Project } from "@/types/content";

interface PortfolioOrbitProps {
  projects: Project[];
}

export function PortfolioOrbit({ projects }: PortfolioOrbitProps) {
  const prefersReducedMotion = useReducedMotion();
  const featured = projects.slice(0, 6);

  return (
    <div className="portfolio-orbit" aria-hidden="true">
      <motion.div
        className="orbit-ring orbit-ring-main"
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="orbit-ring orbit-ring-secondary"
        animate={prefersReducedMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 58, repeat: Infinity, ease: "linear" }}
      />
      {featured.map((project, index) => {
        const angle = (index / featured.length) * Math.PI * 2;
        const x = Math.cos(angle) * 42;
        const y = Math.sin(angle) * 32;
        return (
          <motion.div
            className="orbit-node"
            key={project.id}
            style={{
              "--node-color": project.color,
              left: `${50 + x}%`,
              top: `${50 + y}%`,
            } as CSSProperties}
            animate={
              prefersReducedMotion
                ? { opacity: 0.85 }
                : { y: [0, -10, 0], scale: [1, 1.08, 1] }
            }
            transition={{
              duration: 4 + index * 0.35,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
