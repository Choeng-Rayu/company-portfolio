"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  phase: number;
  speed: number;
  accent: boolean;
  tier: 0 | 1 | 2;
}

const tierConfig = {
  0: { size: [0.5, 1.1], speed: [3, 8], opacity: [0.12, 0.32], pull: 0, radius: 0 },
  1: { size: [0.9, 1.9], speed: [7, 15], opacity: [0.22, 0.48], pull: 0.22, radius: 130 },
  2: { size: [1.5, 3.0], speed: [12, 24], opacity: [0.34, 0.65], pull: 0.52, radius: 210 },
} as const;

function randomBetween([min, max]: readonly [number, number]) {
  return min + Math.random() * (max - min);
}

function getCounts(width: number) {
  if (width >= 1280) return [170, 90, 30] as const;
  if (width >= 768) return [110, 55, 18] as const;
  return [55, 18, 0] as const;
}

function createParticle(width: number, height: number, tier: 0 | 1 | 2): Particle {
  const config = tierConfig[tier];
  const angle = Math.random() * Math.PI * 2;
  const speed = randomBetween(config.speed);

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: randomBetween(config.size),
    opacity: randomBetween(config.opacity),
    phase: Math.random() * Math.PI * 2,
    speed: randomBetween([0.25, 0.75]),
    accent: Math.random() < 0.025,
    tier,
  };
}

export function AtmosphericParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const pointer = { x: 0, y: 0, active: false };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let particles: Particle[] = [];
    let animationFrame = 0;
    let lastTime = performance.now();
    let scrollMomentum = 0;
    let lastScroll = window.scrollY;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const counts = getCounts(window.innerWidth);
      particles = [
        ...Array.from({ length: counts[0] }, () => createParticle(window.innerWidth, window.innerHeight, 0)),
        ...Array.from({ length: counts[1] }, () => createParticle(window.innerWidth, window.innerHeight, 1)),
        ...Array.from({ length: counts[2] }, () => createParticle(window.innerWidth, window.innerHeight, 2)),
      ];
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      const scrollDelta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      scrollMomentum = scrollMomentum * 0.88 + scrollDelta * 0.12;

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        const config = tierConfig[particle.tier];
        if (!reduceMotion.matches) {
          particle.x += particle.vx * dt;
          particle.y += (particle.vy - scrollMomentum * (0.05 + particle.tier * 0.11)) * dt;

          if (pointer.active && config.radius > 0) {
            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const distance = Math.hypot(dx, dy);
            if (distance < config.radius && distance > 0) {
              const force = (1 - distance / config.radius) * config.pull * 12 * dt;
              particle.vx += (dx / distance) * force;
              particle.vy += (dy / distance) * force;
            }
          }
        }

        if (particle.x < -20) particle.x = window.innerWidth + 20;
        if (particle.x > window.innerWidth + 20) particle.x = -20;
        if (particle.y < -20) particle.y = window.innerHeight + 20;
        if (particle.y > window.innerHeight + 20) particle.y = -20;

        const shimmer = Math.sin(now * 0.001 * particle.speed + particle.phase) * 0.12;
        const opacity = Math.max(0.04, Math.min(0.72, particle.opacity + shimmer));
        context.beginPath();
        context.fillStyle = particle.accent
          ? `rgba(200, 241, 53, ${opacity})`
          : `rgba(236, 255, 218, ${opacity})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "source-over";
      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="particles-canvas" />;
}
