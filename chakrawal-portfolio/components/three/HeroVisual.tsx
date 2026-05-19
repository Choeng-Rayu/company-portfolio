"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroUniverse = dynamic(() => import("@/components/three/HeroUniverse"), {
  ssr: false,
  loading: () => <div className="hero-visual-fallback" aria-hidden="true" />,
});

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(media.matches && !reduced.matches && canUseWebGL());

    update();
    media.addEventListener("change", update);
    reduced.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return (
    <div className="hero-visual" aria-hidden="true">
      {enabled ? (
        <HeroUniverse />
      ) : (
        <Image
          src="/images/planet-nexus.png"
          alt=""
          fill
          sizes="100vw"
          priority
          className="hero-static-planet"
        />
      )}
    </div>
  );
}
