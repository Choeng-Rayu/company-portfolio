import { useRef, useEffect, useState, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Service {
  icon: string;
  title: string;
  description: string;
  href: string;
}

interface ServicesData {
  sectionLabel: string;
  title: string;
  subtitle: string;
  services: Service[];
}

const ICON_MAP: Record<string, string> = {
  Code: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  TrendingUp: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  Building2:
    'M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18zM6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4',
  Zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

const PLANET_COLORS = [
  { from: '#2E8B57', to: '#3CB371', glow: 'rgba(46,139,87,0.45)' },
  { from: '#B7410E', to: '#C1440E', glow: 'rgba(183,65,14,0.45)' },
  { from: '#A9A9A9', to: '#D3D3D3', glow: 'rgba(169,169,169,0.45)' },
  { from: '#1B3F8B', to: '#355C8D', glow: 'rgba(27,63,139,0.45)' },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Orbit config ─────────────────────────────────────────────────────────────
const ORBIT_RADII  = [3.8, 5.6, 7.2, 9.0];
const ORBIT_SPEEDS = [0.38, 0.28, 0.20, 0.14];
const INITIAL_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

function OrbitingPlanet({
  index, colorHex, glowColor, focused, orbitAngleRef, onClick,
}: {
  index: number; colorHex: string; glowColor: string; focused: boolean;
  orbitAngleRef: React.MutableRefObject<number>; onClick: () => void;
}) {
  const groupRef  = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const atmRef    = useRef<THREE.Mesh>(null!);

  const [colorMap, normalMap, specularMap, cloudMap] = useTexture([
    '/textures/planet_color.jpg', '/textures/planet_normal.jpg',
    '/textures/planet_specular.jpg', '/textures/planet_clouds.png',
  ]);

  const radius = ORBIT_RADII[index];

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const angle = orbitAngleRef.current;
    const tx = Math.cos(angle) * radius;
    const tz = Math.sin(angle) * radius;

    if (focused) {
      groupRef.current.position.x += (0   - groupRef.current.position.x) * delta * 3;
      groupRef.current.position.z += (3   - groupRef.current.position.z) * delta * 3;
      groupRef.current.position.y += (0   - groupRef.current.position.y) * delta * 3;
      const ts = 1.8;
      groupRef.current.scale.x += (ts - groupRef.current.scale.x) * delta * 4;
      groupRef.current.scale.y += (ts - groupRef.current.scale.y) * delta * 4;
      groupRef.current.scale.z += (ts - groupRef.current.scale.z) * delta * 4;
    } else {
      groupRef.current.position.x += (tx - groupRef.current.position.x) * delta * 2;
      groupRef.current.position.z += (tz - groupRef.current.position.z) * delta * 2;
      groupRef.current.position.y += (0  - groupRef.current.position.y) * delta * 2;
      groupRef.current.scale.x += (1 - groupRef.current.scale.x) * delta * 4;
      groupRef.current.scale.y += (1 - groupRef.current.scale.y) * delta * 4;
      groupRef.current.scale.z += (1 - groupRef.current.scale.z) * delta * 4;
    }

    if (planetRef.current) planetRef.current.rotation.y += delta * 0.4;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.5;
    groupRef.current.rotation.z = 0.41;
  });

  const planetSize = 1.0;

  return (
    <group
      ref={groupRef}
      position={[Math.cos(INITIAL_ANGLES[index]) * radius, 0, Math.sin(INITIAL_ANGLES[index]) * radius]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <mesh ref={planetRef}>
        <sphereGeometry args={[planetSize, 64, 64]} />
        <meshStandardMaterial map={colorMap} normalMap={normalMap}
          normalScale={new THREE.Vector2(1.5, 1.5)} roughnessMap={specularMap}
          roughness={0.8} metalness={0.4} color={colorHex} />
      </mesh>
      <mesh ref={atmRef} scale={1.15}>
        <sphereGeometry args={[planetSize, 32, 32]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.12}
          blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
      <mesh ref={cloudsRef} scale={1.015}>
        <sphereGeometry args={[planetSize, 64, 64]} />
        <meshStandardMaterial map={cloudMap} transparent opacity={0.45}
          depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[planetSize * 1.45, planetSize * 1.5, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[planetSize * 1.6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function OrbitPath({ radius, color }: { radius: number; color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.015, radius + 0.015, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} />
    </mesh>
  );
}

function OrbitalScene({ services, focusedIndex, onPlanetClick, isOrbiting }: {
  services: Service[]; focusedIndex: number | null;
  onPlanetClick: (i: number) => void; isOrbiting: boolean;
}) {
  const angleRefs = useRef<React.MutableRefObject<number>[]>(
    INITIAL_ANGLES.map((a) => ({ current: a }))
  );

  useFrame((_, delta) => {
    if (!isOrbiting) return;
    angleRefs.current.forEach((ref, i) => { ref.current += ORBIT_SPEEDS[i] * delta; });
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 8, 6]} intensity={1.6} />
      <pointLight position={[-8, -4, -4]} intensity={0.6} color="#4488ff" />
      {services.map((_, i) => (
        <OrbitPath key={i} radius={ORBIT_RADII[i]} color={PLANET_COLORS[i % PLANET_COLORS.length].from} />
      ))}
      {services.map((_, i) => (
        <OrbitingPlanet key={i} index={i}
          colorHex={PLANET_COLORS[i % PLANET_COLORS.length].from}
          glowColor={PLANET_COLORS[i % PLANET_COLORS.length].to}
          focused={focusedIndex === i}
          orbitAngleRef={angleRefs.current[i]}
          onClick={() => onPlanetClick(i)} />
      ))}
    </>
  );
}

function ServiceInfoCard({ service, index, visible }: {
  service: Service; index: number; visible: boolean;
}) {
  const color = PLANET_COLORS[index % PLANET_COLORS.length];
  const iconPath = ICON_MAP[service.icon] ?? ICON_MAP['Code'];
  return (
    <AnimatePresence>
      {visible && (
        <motion.div key={index}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[340px] pointer-events-none z-30"
        >
          <div className="liquid-glass-card p-6 rounded-2xl"
            style={{ boxShadow: `0 0 40px ${color.glow}` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color.from}22` }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={color.from}
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d={iconPath} />
                </svg>
              </div>
              <h3 className="font-body text-lg font-semibold text-text-primary leading-tight">
                {service.title}
              </h3>
            </div>
            <p className="font-body text-sm text-text-secondary leading-relaxed">{service.description}</p>
            <a href={service.href}
              className="inline-flex items-center gap-1 font-mono text-xs mt-4 hover:underline transition-colors pointer-events-auto"
              style={{ color: color.from }}
              onClick={(e) => { e.preventDefault(); document.querySelector(service.href)?.scrollIntoView({ behavior: 'smooth' }); }}>
              Explore Service <ArrowRight size={12} />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PlanetDots({ count, active, onSelect }: {
  count: number; active: number | null; onSelect: (i: number) => void;
}) {
  return (
    <div className="flex gap-3 justify-center mt-6">
      {Array.from({ length: count }).map((_, i) => {
        const color = PLANET_COLORS[i % PLANET_COLORS.length];
        return (
          <button key={i} onClick={() => onSelect(i)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300 border"
            style={{
              background: active === i ? color.from : 'transparent',
              borderColor: color.from,
              transform: active === i ? 'scale(1.4)' : 'scale(1)',
              boxShadow: active === i ? `0 0 8px ${color.glow}` : 'none',
            }}
            aria-label={`Select planet ${i + 1}`} />
        );
      })}
    </div>
  );
}

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [data, setData] = useState<ServicesData | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isOrbiting, setIsOrbiting] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/data/services.json').then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  const resumeOrbit = useCallback(() => { setFocusedIndex(null); setIsOrbiting(true); }, []);

  const handlePlanetClick = useCallback((i: number) => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setFocusedIndex(i);
    setIsOrbiting(false);
    idleTimerRef.current = setTimeout(resumeOrbit, 5000);
  }, [resumeOrbit]);

  useEffect(() => () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); }, []);

  const services     = data?.services     ?? [];
  const title        = data?.title        ?? 'What We Offer';
  const subtitle     = data?.subtitle     ?? 'Tailored digital solutions for your business needs';
  const sectionLabel = data?.sectionLabel ?? 'SERVICES';

  return (
    <section id="services" className="w-full py-[120px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16 relative z-20">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime">{sectionLabel}</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display italic text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] text-text-primary mt-4">{title}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="font-body text-lg text-text-secondary mt-6 max-w-[560px] mx-auto">{subtitle}</motion.p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease }}
          className="relative w-full" style={{ height: 560 }}>
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 18, 8], fov: 50 }}
              style={{ width: '100%', height: '100%', cursor: 'pointer' }}
              onPointerMissed={resumeOrbit}>
              {services.length > 0 && (
                <OrbitalScene services={services} focusedIndex={focusedIndex}
                  onPlanetClick={handlePlanetClick} isOrbiting={isOrbiting} />
              )}
            </Canvas>
          </Suspense>
          {services.map((service, i) => (
            <ServiceInfoCard key={service.title} service={service} index={i} visible={focusedIndex === i} />
          ))}
          <AnimatePresence>
            {focusedIndex !== null && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] tracking-[0.12em] uppercase text-text-muted">
                orbiting resumes in 5 s · click elsewhere to resume now
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {services.length > 0 && (
          <PlanetDots count={services.length} active={focusedIndex} onSelect={handlePlanetClick} />
        )}
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center font-mono text-[0.65rem] tracking-[0.1em] uppercase text-text-muted mt-6">
          click a planet to explore · idle 5 s to resume orbit
        </motion.p>
      </div>
    </section>
  );
}
