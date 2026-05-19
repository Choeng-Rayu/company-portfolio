import { useRef, useEffect } from "react";
import { pointer, bindPointer } from "../lib/pointer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  baseOpacity: number;
  opacity: number;
  opacityPhase: number;   // 0..2π — phase offset for sine drift
  opacitySpeed: number;   // rad/s — 0.3..0.9
  size: number;
  vx: number;             // px/s
  vy: number;             // px/s
  tier: 0 | 1 | 2;
  isAccent: boolean;      // ~1% chance — uses brand lime
}

// ─── Tier specs (from 01-cinematic-particles.md) ──────────────────────────────

const TIER_CFG = [
  // tier 0: far — small, slow, faint, no cursor attraction
  { sizeMin: 0.6, sizeMax: 1.2, speedMin: 2,  speedMax: 6,  opMin: 0.15, opMax: 0.35, parallax: 0.05, attractR: 0,   attractStr: 0   },
  // tier 1: mid
  { sizeMin: 1.0, sizeMax: 2.0, speedMin: 6,  speedMax: 14, opMin: 0.30, opMax: 0.55, parallax: 0.20, attractR: 120, attractStr: 0.3 },
  // tier 2: near — large, fast, bright, strong cursor pull
  { sizeMin: 1.8, sizeMax: 3.2, speedMin: 12, speedMax: 24, opMin: 0.45, opMax: 0.75, parallax: 0.50, attractR: 200, attractStr: 0.8 },
] as const;

// ─── Count budget by breakpoint ───────────────────────────────────────────────

function getCountBudget(): [number, number, number] {
  const w = window.innerWidth;
  if (w >= 1440) return [300, 150, 40];
  if (w >= 1024) return [200, 100, 30];
  if (w >= 768)  return [100,  40, 15];
  return [40, 15, 0]; // Near-zero near particles for mobile
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function spawnParticle(tier: 0 | 1 | 2, w: number, h: number): Particle {
  const cfg = TIER_CFG[tier];
  const angle = Math.random() * Math.PI * 2;
  const speed = rand(cfg.speedMin, cfg.speedMax);
  const baseOpacity = rand(cfg.opMin, cfg.opMax);
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    baseOpacity,
    opacity: baseOpacity,
    opacityPhase: Math.random() * Math.PI * 2,
    opacitySpeed: rand(0.3, 0.9),
    size: rand(cfg.sizeMin, cfg.sizeMax),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    tier,
    isAccent: Math.random() < 0.01,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AtmosphericParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = rmq.matches;
    const onRMChange = (e: MediaQueryListEvent) => { reducedMotion = e.matches; };
    rmq.addEventListener("change", onRMChange);

    // Pause when tab is hidden
    let tabHidden = document.hidden;
    const onVisibility = () => { tabHidden = document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    // Scroll velocity EMA (α = 0.15) — particles drag behind scroll motion
    let lastScrollY = window.scrollY;
    let scrollVelocityEMA = 0;
    const onScroll = () => {
      if (window.innerWidth < 768) return; // Skip on mobile
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollVelocityEMA = 0.15 * delta + 0.85 * scrollVelocityEMA;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Shared pointer — does not add a second listener; if ProbeCursor already called
    // bindPointer, this just increments the refcount and ensures cleanup symmetry.
    const unbindPointer = bindPointer();

    // Low-hardware downgrade on slower CPUs at desktop size
    const lowHardware =
      (navigator.hardwareConcurrency ?? 8) <= 4 && window.innerWidth >= 1024;

    // Particle pool
    let particles: Particle[] = [];
    let dpr = window.devicePixelRatio || 1;

    const generateParticles = () => {
      const budget = getCountBudget();
      const w = window.innerWidth;
      const h = window.innerHeight;
      particles = [];
      for (let t = 0; t < 3; t++) {
        const tier = t as 0 | 1 | 2;
        const count = lowHardware ? Math.floor(budget[t] * 0.6) : budget[t];
        for (let i = 0; i < count; i++) {
          particles.push(spawnParticle(tier, w, h));
        }
      }
    };

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generateParticles();
    };
    window.addEventListener("resize", resize);
    resize();

    // rAF loop
    let rafId = 0;
    let lastFrameTime = performance.now();
    const MAX_SPEED_MULTIPLIER = 3;

    const draw = (now: number) => {
      if (tabHidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      // dt clamped to [0, 1/30] to absorb tab-regain jumps
      const dt = Math.min((now - lastFrameTime) / 1000, 1 / 30);
      lastFrameTime = now;
      const t = now / 1000;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cfg = TIER_CFG[p.tier];

        if (!reducedMotion) {
          // ── Cursor attraction ─────────────────────────────────────────────
          const canAttract =
            cfg.attractR > 0 &&
            pointer.active &&
            !(lowHardware && p.tier === 2);

          if (canAttract) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < cfg.attractR && dist > 0) {
              const force = (1 - dist / cfg.attractR) * cfg.attractStr;
              p.vx += (dx / dist) * force * dt * 50;
              p.vy += (dy / dist) * force * dt * 50;
              const maxSpd = cfg.speedMax * MAX_SPEED_MULTIPLIER;
              const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
              if (spd > maxSpd) {
                p.vx = (p.vx / spd) * maxSpd;
                p.vy = (p.vy / spd) * maxSpd;
              }
            }
          }

          // ── Drift integration ─────────────────────────────────────────────
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // ── Scroll parallax — particles lag behind scroll ─────────────────
          p.y -= scrollVelocityEMA * cfg.parallax;

          // ── Wrap with fresh direction ─────────────────────────────────────
          if (p.x < -p.size) {
            p.x = w + p.size;
            p.vx = Math.abs(rand(cfg.speedMin, cfg.speedMax));
          } else if (p.x > w + p.size) {
            p.x = -p.size;
            p.vx = -Math.abs(rand(cfg.speedMin, cfg.speedMax));
          }
          if (p.y < -p.size) {
            p.y = h + p.size;
            p.vy = Math.abs(rand(cfg.speedMin, cfg.speedMax));
          } else if (p.y > h + p.size) {
            p.y = -p.size;
            p.vy = -Math.abs(rand(cfg.speedMin, cfg.speedMax));
          }
        }

        // ── Opacity oscillation — slow shimmer, never strobe ─────────────────
        const opSpd = reducedMotion ? 0.2 : p.opacitySpeed;
        p.opacity = Math.max(0, Math.min(0.75,
          p.baseOpacity + 0.15 * Math.sin(t * opSpd + p.opacityPhase)
        ));

        // ── Draw ─────────────────────────────────────────────────────────────
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.isAccent) {
          // Brand lime (#C8F135) — matches --accent in index.css
          ctx.fillStyle = `rgba(200, 241, 53, ${p.opacity * 0.85})`;
        } else {
          // Tier-aware shade: far = dim gray, near = brighter near-white
          const shade = 170 + p.tier * 28;
          ctx.fillStyle = `rgba(${shade}, ${shade}, ${Math.min(255, shade + 8)}, ${p.opacity})`;
        }
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      rmq.removeEventListener("change", onRMChange);
      unbindPointer();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
