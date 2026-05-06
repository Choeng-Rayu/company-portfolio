import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
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

// Icon component map (lucide icons as SVG paths)
const ICON_MAP: Record<string, string> = {
  Code: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  TrendingUp: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  Building2: 'M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18zM6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4',
  Zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

// Planet color palette (one per service card)
const PLANET_COLORS = [
  { from: '#2E8B57', to: '#3CB371', glow: 'rgba(46,139,87,0.35)' }, // Earth blues/greens
  { from: '#B7410E', to: '#C1440E', glow: 'rgba(183,65,14,0.35)' }, // Martian rust
  { from: '#A9A9A9', to: '#D3D3D3', glow: 'rgba(169,169,169,0.35)' }, // Lunar silvers
  { from: '#1B3F8B', to: '#355C8D', glow: 'rgba(27,63,139,0.35)' }, // Neptunian ice blues
  { from: '#C2A37F', to: '#D2B48C', glow: 'rgba(194,163,127,0.35)' }, // Jovian sandy beiges
  { from: '#E5C07B', to: '#F5DEB3', glow: 'rgba(229,192,123,0.35)' }, // Saturnian golds
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function RealPlanet3D({ colorHex, glowColor, hovered, index }: { colorHex: string; glowColor: string; hovered: boolean; index: number }) {
  const meshRef = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Rotation speeds
      const rotationSpeed = hovered ? 0.012 : 0.005;
      
      // Apply rotation to planet and clouds independently
      if (planetRef.current) planetRef.current.rotation.y += rotationSpeed;
      if (cloudsRef.current) cloudsRef.current.rotation.y += rotationSpeed * 1.2;
      
      // Axial tilt (Earth's tilt is ~23.5 degrees = 0.41 radians)
      meshRef.current.rotation.z = 0.41;
      
      // Subtle axial wobble
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.02;
      
      // Smoothly float up on hover with a more dramatic offset
      const targetY = hovered ? 0.8 : 0;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
      
      // Subtle scale pulse on hover
      const targetScale = hovered ? 1.12 : 1.0;
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.05;
      meshRef.current.scale.setScalar(newScale);
    }
  });

  // Load terrain textures for planet surface
  const [normalMap, specularMap, colorMap, cloudMap] = useTexture([
    '/textures/planet_normal.jpg',
    '/textures/planet_specular.jpg',
    '/textures/planet_color.jpg',
    '/textures/planet_clouds.png',
  ]);

  return (
    <group ref={meshRef}>
      {/* Core Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          color={index === 0 ? '#ffffff' : colorHex} 
          roughness={0.8} 
          metalness={0.4}
          map={colorMap}
          normalMap={normalMap} 
          normalScale={new THREE.Vector2(1.5, 1.5)}
          roughnessMap={specularMap}
        />
      </mesh>
      
      {/* Atmosphere Glow */}
      <mesh ref={atmosphereRef} scale={1.12}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial 
          color={colorHex} 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide} 
        />
      </mesh>
      
      {/* Clouds */}
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={cloudMap} 
          transparent 
          opacity={0.5} 
          depthWrite={false} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Ring (Only if it's not the first one which is Earth-like) */}
      {index !== 0 && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[2.8, 2.85, 64]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function PlanetCard({ service, index, isInView }: { service: Service; index: number; isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const color = PLANET_COLORS[index % PLANET_COLORS.length];
  const [hovered, setHovered] = useState(false);

  // Mouse-tracking 3D tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 100, damping: 25 });
  const springY = useSpring(rotateY, { stiffness: 100, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateY.set(dx * 10);
    rotateX.set(-dy * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  };

  const iconPath = ICON_MAP[service.icon] ?? ICON_MAP['Code'];

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.25 + index * 0.09, duration: 0.65, ease }}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        zIndex: hovered ? 50 : 1,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group cursor-pointer pt-20"
    >
      {/* 3D Planet Visual - Moved outside blurred container to prevent clipping */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[340px] h-[400px] pointer-events-none z-[60]">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 3, 5]} intensity={1.5} />
            <pointLight position={[-5, -3, -5]} intensity={0.8} color={color.from} />
            <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
              <RealPlanet3D colorHex={color.from} glowColor={color.to} hovered={hovered} index={index} />
            </Float>
          </Canvas>
        </Suspense>
      </div>

      <div
        className="relative h-full flex-shrink-0 w-[320px] md:w-[360px] p-8 snap-start transition-all duration-300 liquid-glass opacity-80 group-hover:opacity-100"
      >
        {/* Spacer to prevent overlap with service content */}
        <div className="h-[100px]" />

        {/* Service number */}
        <p className="font-mono text-xs text-text-muted">
          {String(index + 1).padStart(2, '0')}
        </p>

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mt-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${color.from}22` }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={color.from}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d={iconPath} />
            </svg>
          </div>
          <h3 className="font-body text-lg font-medium text-text-primary leading-tight">
            {service.title}
          </h3>
        </div>

        <p className="font-body text-sm text-text-secondary mt-3 leading-relaxed">
          {service.description}
        </p>

        <a
          href={service.href}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(service.href)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1 font-mono text-xs mt-5 hover:underline transition-colors"
          style={{ color: color.from }}
        >
          Explore Service
          <ArrowRight size={12} />
        </a>

        {/* Card edge glow on hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 30px ${color.glow}`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [data, setData] = useState<ServicesData | null>(null);

  // Scroll-based horizontal parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const xParallax = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  useEffect(() => {
    fetch('/data/services.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const services = data?.services ?? [];
  const title = data?.title ?? 'What We Offer';
  const subtitle = data?.subtitle ?? 'Tailored digital solutions for your business needs';
  const sectionLabel = data?.sectionLabel ?? 'SERVICES';

  return (
    <section id="services" className="w-full py-[160px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20 relative z-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            {sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display italic text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="font-body text-lg text-text-secondary mt-6 max-w-[560px] mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Scroll-parallax planet carousel */}
        <div className="overflow-visible">
          <motion.div
            style={{ x: xParallax }}
            className="flex gap-8 pb-12 -mx-6 px-6 overflow-visible"
          >
            {services.map((service, i) => (
              <PlanetCard
                key={service.title}
                service={service}
                index={i}
                isInView={isInView}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center font-mono text-[0.65rem] tracking-[0.1em] uppercase text-text-muted mt-6"
        >
          ← scroll to explore →
        </motion.p>
      </div>
    </section>
  );
}