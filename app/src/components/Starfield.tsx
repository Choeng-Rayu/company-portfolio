import { useRef, useEffect } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  layer: number;
  shade: number;
  isLime: boolean;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    const getConfig = () => {
      const width = window.innerWidth;
      if (width >= 1024) return { count: 800, layers: 3 };
      if (width >= 768) return { count: 400, layers: 2 };
      return { count: 150, layers: 1 };
    };

    const stars: Star[] = [];
    const scrollPos = { y: 0 };
    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const speeds = [0.1, 0.3, 0.6];

    const generateStars = () => {
      const { count, layers } = getConfig();
      stars.length = 0;

      for (let i = 0; i < count; i++) {
        const layer = Math.floor(Math.random() * layers);
        const isLime = Math.random() < 0.01;

        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: 1 + Math.random() * 2,
          opacity: 0.2 + Math.random() * 0.6,
          layer,
          shade: Math.floor(200 + Math.random() * 55),
          isLime,
        });
      }
    };

    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generateStars();
    };

    const handleScroll = () => {
      scrollPos.y = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    let rafId = 0;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const scroll = reducedMotion ? 0 : scrollPos.y;
      const mouseX = reducedMotion ? w / 2 : mousePos.x;
      const mouseY = reducedMotion ? h / 2 : mousePos.y;

      const centerX = w / 2;
      const centerY = h / 2;

      const offsetX = ((mouseX - centerX) / centerX) * -5;
      const offsetY = ((mouseY - centerY) / centerY) * -5;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        let x = star.x;
        let y = star.y;

        if (!reducedMotion) {
          const speed = speeds[star.layer] ?? 0.1;
          y -= scroll * speed;
        }

        x += offsetX;
        y += offsetY;

        x = ((x % w) + w) % w;
        y = ((y % h) + h) % h;

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);

        if (star.isLime) {
          ctx.fillStyle = "rgba(200, 241, 53, 0.3)";
        } else {
          ctx.fillStyle = `rgba(${star.shade}, ${star.shade}, ${star.shade}, ${star.opacity})`;
        }

        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
