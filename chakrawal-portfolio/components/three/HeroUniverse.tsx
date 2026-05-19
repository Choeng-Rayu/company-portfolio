"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function seeded(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function Planet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [color, normal, specular, clouds] = useLoader(THREE.TextureLoader, [
    "/textures/planet_color.jpg",
    "/textures/planet_normal.jpg",
    "/textures/planet_specular.jpg",
    "/textures/planet_clouds.png",
  ]);

  useFrame((state) => {
    const scroll = typeof window === "undefined" ? 0 : window.scrollY / Math.max(window.innerHeight, 1);
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.075 + scroll * 0.18;
      meshRef.current.rotation.x = -0.18 + Math.sin(state.clock.elapsedTime * 0.2) * 0.025;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.11 + scroll * 0.25;
    }
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.4 - scroll * 0.28, 0.035);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(scroll * 0.8) * 0.35, 0.035);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group position={[2.3, -0.2, -0.9]} rotation={[0, 0, -0.14]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.85, 96, 96]} />
        <meshStandardMaterial
          map={color}
          normalMap={normal}
          roughnessMap={specular}
          roughness={0.72}
          metalness={0.04}
        />
      </mesh>
      <mesh ref={cloudsRef} scale={1.018}>
        <sphereGeometry args={[1.85, 96, 96]} />
        <meshStandardMaterial
          alphaMap={clouds}
          transparent
          opacity={0.38}
          depthWrite={false}
          color="#ffffff"
        />
      </mesh>
      <mesh rotation={[1.25, 0.1, -0.32]}>
        <torusGeometry args={[2.24, 0.008, 8, 180]} />
        <meshBasicMaterial color="#c8f135" transparent opacity={0.32} />
      </mesh>
      <mesh rotation={[1.19, 0.1, -0.32]}>
        <torusGeometry args={[2.58, 0.004, 8, 180]} />
        <meshBasicMaterial color="#65e4ff" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function StarField() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 900;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (seeded(i * 3) - 0.5) * 22;
      values[i * 3 + 1] = (seeded(i * 3 + 1) - 0.5) * 12;
      values[i * 3 + 2] = -seeded(i * 3 + 2) * 18 - 1;
    }
    return values;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.012;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.026} color="#f6ffe5" transparent opacity={0.68} sizeAttenuation />
    </points>
  );
}

function ShowcaseObject() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.18 - 0.35;
    ref.current.position.y = -1.45 + Math.sin(state.clock.elapsedTime * 0.65) * 0.08;
  });

  return (
    <group ref={ref} position={[-2.15, -1.45, -0.8]} rotation={[0.1, -0.35, 0]}>
      <mesh>
        <boxGeometry args={[1.4, 0.82, 0.08]} />
        <meshStandardMaterial color="#101923" emissive="#122b2d" metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.052]}>
        <planeGeometry args={[1.2, 0.62]} />
        <meshBasicMaterial color="#c8f135" transparent opacity={0.23} />
      </mesh>
      <mesh position={[0, -0.58, -0.02]}>
        <boxGeometry args={[0.28, 0.35, 0.08]} />
        <meshStandardMaterial color="#1d2a35" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.8, -0.02]}>
        <boxGeometry args={[0.95, 0.08, 0.34]} />
        <meshStandardMaterial color="#121922" metalness={0.45} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#020403"]} />
      <fog attach="fog" args={["#020403", 6, 16]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 2]} intensity={1.6} color="#f5ffd6" />
      <pointLight position={[-3, 0.5, 2]} intensity={4.5} color="#c8f135" distance={7} />
      <pointLight position={[3, -2, 1]} intensity={2.4} color="#58e6ff" distance={8} />
      <StarField />
      <Planet />
      <ShowcaseObject />
    </>
  );
}

export default function HeroUniverse() {
  return (
    <Canvas
      aria-hidden="true"
      className="universe-canvas"
      camera={{ position: [0, 0.2, 6.4], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
