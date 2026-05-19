// src/components/UniverseCanvas.tsx
import React, { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars, Float, useTexture } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// RealUniversePlanet — textured Earth with clouds and blue atmosphere
// ---------------------------------------------------------------------------
const RealUniversePlanet: React.FC<{
  position: [number, number, number];
  scale: number;
  rotation?: [number, number, number];
}> = ({ position, scale, rotation = [0.3, 0, 0.1] }) => {
  const planetRef = React.useRef<THREE.Mesh>(null!);
  const cloudsRef = React.useRef<THREE.Mesh>(null!);
  const cloudsRefOuter = React.useRef<THREE.Mesh>(null!);
  
  const [colorMap, normalMap, specularMap, cloudMap] = useTexture([
    '/textures/planet_color.jpg',
    '/textures/planet_normal.jpg',
    '/textures/planet_specular.jpg',
    '/textures/planet_clouds.png',
  ]);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.05; // Subtle continuous rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.055; // Inner clouds
    }
    if (cloudsRefOuter.current) {
      cloudsRefOuter.current.rotation.y += delta * 0.06; // Outer clouds rotate slightly faster
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Planet surface */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[scale, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(1.5, 1.5)}
          roughnessMap={specularMap}
          roughness={0.5}
          metalness={0.1}
          emissive="#0a1a3a" // Very subtle dark blue emissive
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Volumetric Clouds - Base layer (casts shadow) */}
      <mesh ref={cloudsRef} scale={1.008}>
        <sphereGeometry args={[scale, 64, 64]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.8}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.NormalBlending} // Real clouds, not glowing
        />
      </mesh>

      {/* Volumetric Clouds - Outer fluffy layer */}
      <mesh ref={cloudsRefOuter} scale={1.015}>
        <sphereGeometry args={[scale, 64, 64]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.6}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Atmospheric blue shadow/halo */}
      <mesh scale={1.05}>
        <sphereGeometry args={[scale, 64, 64]} />
        <meshBasicMaterial
          color="#1a4db3"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// ParallaxScene — scroll-driven camera + stars + earth + orbiters
// ---------------------------------------------------------------------------
const ParallaxScene: React.FC = () => {
  const { camera } = useThree();

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Smoother scroll interpolation
      }
    });

    // Initial state
    const angle = 0;
    const radius = 14; // Adjusted radius for 3.6 scale
    camera.position.x = Math.sin(angle) * radius;
    camera.position.z = Math.cos(angle) * radius;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    // Proxy for orbit math
    const proxy = {
      progress: 0
    };

    timeline.to(proxy, {
      progress: 1,
      ease: 'none',
      onUpdate: () => {
        const scrollProgress = proxy.progress;
        const currentAngle = scrollProgress * Math.PI * 0.8;
        const currentRadius = 14 - scrollProgress * 4; // Adjusted radius change
        
        camera.position.x = Math.sin(currentAngle) * currentRadius;
        camera.position.z = Math.cos(currentAngle) * currentRadius;
        camera.position.y = Math.sin(scrollProgress * Math.PI * 0.5) * 3;
        camera.lookAt(0, 0, 0);
      }
    });

  }, [camera]);

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
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <RealUniversePlanet position={[0, 0, 0]} scale={3.6} />
      </Float>

    </>
  );
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export default function UniverseCanvas() {
  return (
    <div className="fixed inset-0 z-0 bg-[#020205]">
      <Canvas shadows camera={{ fov: 45 }}>
        <Suspense fallback={null}>
          {/* Super Bright & Atmospheric Lighting Setup */}
          
          {/* Boosted ambient light with a slight blue tint */}
          <ambientLight intensity={2.0} color="#eef3ff" />

          {/* Main Key Light - much brighter */}
          <directionalLight
            position={[15, 10, 15]}
            intensity={4.5}
            color="#ffffff"
          />

          {/* Deep Blue Fill Light - Creates realistic blue shadows on the dark side */}
          <directionalLight
            position={[-15, -5, 10]}
            intensity={3.5}
            color="#2266ff"
          />

          {/* Rim Light / Atmospheric Glow - strong blue backlight */}
          <pointLight
            position={[-10, 10, -15]}
            intensity={4.0}
            color="#4488ff"
          />

          {/* Additional Top-down Light */}
          <pointLight
            position={[0, 20, 0]}
            intensity={1.5}
            color="#ffffff"
          />

          {/* Scene */}
          <ParallaxScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
