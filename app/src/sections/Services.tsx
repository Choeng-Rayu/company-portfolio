import { useRef, useEffect, useState, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, MousePointerClick } from 'lucide-react';

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
  { from: '#2E8B57', to: '#3CB371', glow: 'rgba(46,139,87,0.55)' },
  { from: '#C1440E', to: '#E05A20', glow: 'rgba(193,68,14,0.55)' },
  { from: '#B0B8C8', to: '#D8E0F0', glow: 'rgba(176,184,200,0.55)' },
  { from: '#2255BB', to: '#4477DD', glow: 'rgba(34,85,187,0.55)' },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Orbit config ─────────────────────────────────────────────────────────────
const ORBIT_RADII  = [3.8, 5.6, 7.2, 9.0];
const ORBIT_SPEEDS = [0.38, 0.28, 0.20, 0.14];
const INITIAL_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
const PLANET_SIZE = 1.3;

// Expanding pulse ring shown on hover
function PulseRing({ color, active }: { color: string; active: boolean }) {
  const meshRef  = useRef<THREE.Mesh>(null!);
  const scaleRef = useRef(1.0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (active) {
      scaleRef.current += delta * 1.2;
      if (scaleRef.current > 2.2) scaleRef.current = 1.0;
      const opacity = Math.max(0, 1 - (scaleRef.current - 1) / 1.2);
      meshRef.current.scale.setScalar(scaleRef.current);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.6;
    } else {
      scaleRef.current = 1.0;
      meshRef.current.scale.setScalar(1.0);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[PLANET_SIZE * 1.3, PLANET_SIZE * 1.38, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

function OrbitingPlanet({
  index, colorHex, glowColor, focused, hovered, orbitAngleRef, onClick, onPointerOver, onPointerOut,
}: {
  index: number; colorHex: string; glowColor: string; focused: boolean; hovered: boolean;
  orbitAngleRef: React.MutableRefObject<number>; onClick: () => void;
  onPointerOver: () => void; onPointerOut: () => void;
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
      groupRef.current.position.x += (0   - groupRef.current.position.x) * delta * 3.5;
      groupRef.current.position.z += (2.5 - groupRef.current.position.z) * delta * 3.5;
      groupRef.current.position.y += (0   - groupRef.current.position.y) * delta * 3.5;
      const ts = 2.2;
      groupRef.current.scale.x += (ts - groupRef.current.scale.x) * delta * 5;
      groupRef.current.scale.y += (ts - groupRef.current.scale.y) * delta * 5;
      groupRef.current.scale.z += (ts - groupRef.current.scale.z) * delta * 5;
    } else {
      const hs = hovered ? 1.18 : 1.0;
      groupRef.current.position.x += (tx - groupRef.current.position.x) * delta * 2.5;
      groupRef.current.position.z += (tz - groupRef.current.position.z) * delta * 2.5;
      groupRef.current.position.y += (0  - groupRef.current.position.y) * delta * 2.5;
      groupRef.current.scale.x += (hs - groupRef.current.scale.x) * delta * 6;
      groupRef.current.scale.y += (hs - groupRef.current.scale.y) * delta * 6;
      groupRef.current.scale.z += (hs - groupRef.current.scale.z) * delta * 6;
    }

    const rotSpeed = hovered || focused ? 0.7 : 0.35;
    if (planetRef.current) planetRef.current.rotation.y += delta * rotSpeed;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * rotSpeed * 1.25;

    if (atmRef.current) {
      const targetOpacity = hovered || focused ? 0.28 : 0.1;
      const mat = atmRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity += (targetOpacity - mat.opacity) * delta * 4;
    }

    groupRef.current.rotation.z = 0.41;
  });

  return (
    <group
      ref={groupRef}
      position={[Math.cos(INITIAL_ANGLES[index]) * radius, 0, Math.sin(INITIAL_ANGLES[index]) * radius]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); }}
      onPointerOut={(e)  => { e.stopPropagation(); onPointerOut(); }}
    >
      <mesh ref={planetRef}>
        <sphereGeometry args={[PLANET_SIZE, 64, 64]} />
        <meshStandardMaterial map={colorMap} normalMap={normalMap}
          normalScale={new THREE.Vector2(1.5, 1.5)} roughnessMap={specularMap}
          roughness={0.75} metalness={0.35} color={colorHex} />
      </mesh>
      <mesh ref={atmRef} scale={1.18}>
        <sphereGeometry args={[PLANET_SIZE, 32, 32]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.1}
          blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
      <mesh ref={cloudsRef} scale={1.018}>
        <sphereGeometry args={[PLANET_SIZE, 64, 64]} />
        <meshStandardMaterial map={cloudMap} transparent opacity={0.45}
          depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[PLANET_SIZE * 1.42, PLANET_SIZE * 1.48, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <PulseRing color={colorHex} active={hovered && !focused} />
      <mesh>
        <sphereGeometry args={[PLANET_SIZE * 1.7, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function OrbitPath({ radius, color }: { radius: number; color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.018, radius + 0.018, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CursorController({ hoveredIndex }: { hoveredIndex: number | null }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.domElement.style.cursor = hoveredIndex !== null ? 'pointer' : 'default';
  }, [hoveredIndex, gl]);
  return null;
}

function OrbitalScene({ services, focusedIndex, hoveredIndex, onPlanetClick, onPlanetHover, isOrbiting }: {
  services: Service[]; focusedIndex: number | null; hoveredIndex: number | null;
  onPlanetClick: (i: number) => void; onPlanetHover: (i: number | null) => void; isOrbiting: boolean;
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
      <ambientLight intensity={0.55} />
      <directionalLight position={[10, 8, 6]} intensity={1.8} />
      <pointLight position={[-8, -4, -4]} intensity={0.7} color="#4488ff" />
      <CursorController hoveredIndex={hoveredIndex} />
      {services.map((_, i) => (
        <OrbitPath key={i} radius={ORBIT_RADII[i]} color={PLANET_COLORS[i % PLANET_COLORS.length].from} />
      ))}
      {services.map((_, i) => (
        <OrbitingPlanet key={i} index={i}
          colorHex={PLANET_COLORS[i % PLANET_COLORS.length].from}
          glowColor={PLANET_COLORS[i % PLANET_COLORS.length].to}
          focused={focusedIndex === i} hovered={hoveredIndex === i}
          orbitAngleRef={angleRefs.current[i]}
          onClick={() => onPlanetClick(i)}
          onPointerOver={() => onPlanetHover(i)}
          onPointerOut={() => onPlanetHover(null)} />
      ))}
    </>
  );
}

function HoverTooltip({ service, index, visible }: { service: Service; index: number; visible: boolean }) {
  const color = PLANET_COLORS[index % PLANET_COLORS.length];
  return (
    <AnimatePresence>
      {visible && (
        <motion.div key={`tooltip-${index}`}
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wide whitespace-nowrap"
            style={{
              background: 'rgba(10,10,20,0.75)', border: `1px solid ${color.from}55`,
              color: color.from, backdropFilter: 'blur(12px)', boxShadow: `0 0 20px ${color.glow}`,
            }}>
            <MousePointerClick size={11} />
            {service.title}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ServiceInfoCard({ service, index, visible }: { service: Service; index: number; visible: boolean }) {
  const color = PLANET_COLORS[index % PLANET_COLORS.length];
  const iconPath = ICON_MAP[service.icon] ?? ICON_MAP['Code'];
  return (
    <AnimatePresence>
      {visible && (
        <motion.div key={`card-${index}`}
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.94 }}
          transition={{ duration: 0.45, ease }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(92vw,380px)] pointer-events-none z-30">
          <div className="liquid-glass-card p-5 sm:p-6 rounded-2xl"
            style={{ boxShadow: `0 0 48px ${color.glow}` }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${color.from}22` }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={color.from}
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d={iconPath} />
                </svg>
              </div>
              <h3 className="font-body text-base sm:text-lg font-semibold text-text-primary leading-snug">
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

function PlanetDots({ services, active, onSelect }: {
  services: Service[]; active: number | null; onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-5">
      {services.map((svc, i) => {
        const color = PLANET_COLORS[i % PLANET_COLORS.length];
        const isActive = active === i;
        return (
          <button key={i} onClick={() => onSelect(i)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[0.65rem] tracking-wide transition-all duration-300 border"
            style={{
              background: isActive ? `${color.from}22` : 'transparent',
              borderColor: isActive ? color.from : `${color.from}55`,
              color: isActive ? color.from : 'var(--color-text-muted, #888)',
              boxShadow: isActive ? `0 0 12px ${color.glow}` : 'none',
            }}
            aria-label={`Select ${svc.title}`}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color.from }} />
            <span className="hidden sm:inline">{svc.title}</span>
            <span className="sm:hidden">{String(i + 1).padStart(2, '0')}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [data, setData]                 = useState<ServicesData | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isOrbiting, setIsOrbiting]     = useState(true);
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
  const tooltipIndex = hoveredIndex !== null && hoveredIndex !== focusedIndex ? hoveredIndex : null;

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
              style={{ width: '100%', height: '100%' }}
              onPointerMissed={resumeOrbit}>
              {services.length > 0 && (
                <OrbitalScene services={services} focusedIndex={focusedIndex}
                  hoveredIndex={hoveredIndex} onPlanetClick={handlePlanetClick}
                  onPlanetHover={setHoveredIndex} isOrbiting={isOrbiting} />
              )}
            </Canvas>
          </Suspense>
          {services.map((svc, i) => (
            <HoverTooltip key={svc.title} service={svc} index={i} visible={tooltipIndex === i} />
          ))}
          {services.map((svc, i) => (
            <ServiceInfoCard key={svc.title} service={svc} index={i} visible={focusedIndex === i} />
          ))}
          <AnimatePresence>
            {focusedIndex !== null && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute top-4 right-4 font-mono text-[0.58rem] tracking-[0.1em] uppercase text-text-muted hidden sm:block">
                orbit resumes in 5 s
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {focusedIndex === null && isInView && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[0.6rem] tracking-widest uppercase text-text-muted pointer-events-none">
                <MousePointerClick size={11} />
                tap a planet to explore
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {services.length > 0 && (
          <PlanetDots services={services} active={focusedIndex} onSelect={handlePlanetClick} />
        )}
      </div>
    </section>
  );
}
