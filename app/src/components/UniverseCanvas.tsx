// src/components/UniverseCanvas.tsx
import React, { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Stars, Float, useTexture } from "@react-three/drei";

// RealUniversePlanet renders a textured planet using normal and specular maps
const RealUniversePlanet: React.FC<{
  position: [number, number, number];
  scale: number;
  color: string;
}> = ({ position, scale, color: _color }) => {
  // Load detailed earth textures: surface color, normal, specular, and clouds
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

// ParallaxScene moves the camera based on page scroll and renders stars and planets
const ParallaxScene: React.FC = () => {
  const { camera } = useThree();

  useFrame(() => {
    const scrollY = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;
    camera.position.z = Math.max(0, 20 - scrollProgress * 40);
  });

  return (
    <>
      {/* Layer 0: Star field */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Layer 2 & 3: Planets */}
      <Float speed={2} rotationIntensity={0.5}>
        <RealUniversePlanet position={[5, 0, 10]} scale={2} color="red" />
      </Float>

      <Float speed={2} rotationIntensity={0.5}>
        <RealUniversePlanet position={[-5, 2, 0]} scale={3} color="cyan" />
      </Float>

      <Float speed={2} rotationIntensity={0.5}>
        <RealUniversePlanet position={[0, -3, -10]} scale={2.5} color="purple" />
      </Float>

      <Float speed={2} rotationIntensity={0.5}>
        <RealUniversePlanet position={[3, 1, -20]} scale={4} color="#ff8800" />
      </Float>
    </>
  );
};

export default function UniverseCanvas() {
  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0f]">
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          {/* Parallax starfield and planets */}
          <ParallaxScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
