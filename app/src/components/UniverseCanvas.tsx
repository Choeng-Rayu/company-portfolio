// src/components/UniverseCanvas.tsx
import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars, Float, useTexture, useGLTF } from '@react-three/drei';


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface OrbiterProps {
  modelPath: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitInclination?: number;
  modelScale?: number;
  yOffset?: number;
  startAngle?: number;
}

// ---------------------------------------------------------------------------
// RealUniversePlanet — textured Earth with clouds
// ---------------------------------------------------------------------------
const RealUniversePlanet: React.FC<{
  position: [number, number, number];
  scale: number;
}> = ({ position, scale }) => {
  const [colorMap, normalMap, specularMap, cloudMap] = useTexture([
    '/textures/planet_color.jpg',
    '/textures/planet_normal.jpg',
    '/textures/planet_specular.jpg',
    '/textures/planet_clouds.png',
  ]);

  return (
    <group position={position}>
      {/* Planet surface */}
      <mesh>
        <sphereGeometry args={[scale, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(2, 2)}
          roughnessMap={specularMap}
          roughness={0.8}
          metalness={0.4}
        />
      </mesh>
      {/* Clouds layer */}
      <mesh scale={scale * 1.015}>
        <sphereGeometry args={[scale, 64, 64]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.6}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// Orbiter — loads a GLB model and makes it fly around a centre point
// ---------------------------------------------------------------------------
const Orbiter: React.FC<OrbiterProps> = ({
  modelPath,
  orbitRadius,
  orbitSpeed,
  orbitInclination = 0,
  modelScale = 1,
  yOffset = 0,
  startAngle = 0,
}) => {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);

  // Clone the scene so each Orbiter gets its own instance.
  // useGLTF caches by URL, so all components sharing the same path
  // receive the same scene reference — cloning prevents "multiple parent" errors.
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const angle = startAngle + time * orbitSpeed;

    // Elliptical orbit with slight inclination
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = yOffset + Math.sin(angle * 1.3 + orbitInclination) * (orbitRadius * 0.15);

    groupRef.current.position.set(x, y, z);

    // Face direction of travel (look slightly ahead on the orbit)
    const lookAhead = angle + 0.08;
    const lx = Math.cos(lookAhead) * orbitRadius;
    const lz = Math.sin(lookAhead) * orbitRadius;
    const ly = yOffset + Math.sin(lookAhead * 1.3 + orbitInclination) * (orbitRadius * 0.15);
    groupRef.current.lookAt(lx, ly, lz);

    // Gentle self-rotation
    groupRef.current.rotateY(0.002);
  });

  return (
    <group ref={groupRef} scale={modelScale}>
      <primitive object={clonedScene} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// ParallaxScene — scroll-driven camera + stars + earth + orbiters
// ---------------------------------------------------------------------------
const ParallaxScene: React.FC = () => {
  const { camera } = useThree();

  useFrame(() => {
    const scrollY = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;

    // Camera orbits around the earth while slowly descending / zooming
    const angle = scrollProgress * Math.PI * 0.8; // ~144° arc
    const radius = 18 - scrollProgress * 6; // 18 → 12

    camera.position.x = Math.sin(angle) * radius;
    camera.position.z = Math.cos(angle) * radius;
    camera.position.y = Math.sin(scrollProgress * Math.PI * 0.5) * 3;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Layer 0: Star field */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Layer 1: Earth — single planet at centre */}
      <Float speed={2} rotationIntensity={0.5}>
        <RealUniversePlanet position={[0, 0, 0]} scale={3} />
      </Float>

    </>
  );
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export default function UniverseCanvas() {
  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0f]">
      <Canvas>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-8, 4, -5]} intensity={0.5} color="#6688ff" />

          {/* Scene */}
          <ParallaxScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
