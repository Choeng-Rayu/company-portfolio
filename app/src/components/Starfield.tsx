import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars() {
  const nearStarsRef = useRef<THREE.Points>(null);

  const [distantGeometry, nearGeometry] = useMemo(() => {
    const dGeo = new THREE.BufferGeometry();
    const dPositions = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      dPositions[i * 3] = (Math.random() - 0.5) * 200;
      dPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      dPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPositions, 3));

    const nGeo = new THREE.BufferGeometry();
    const nPositions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      nPositions[i * 3] = (Math.random() - 0.5) * 100;
      nPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      nPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    nGeo.setAttribute('position', new THREE.BufferAttribute(nPositions, 3));

    return [dGeo, nGeo];
  }, []);

  useFrame((_, delta) => {
    if (nearStarsRef.current) {
      nearStarsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      <points geometry={distantGeometry}>
        <pointsMaterial
          size={0.5}
          color="#FFFFFF"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      <points ref={nearStarsRef} geometry={nearGeometry}>
        <pointsMaterial
          size={0.8}
          color="#F0EEE9"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          float dist = length(vUv - vec2(0.5));
          float intensity = 1.0 - smoothstep(0.0, 0.5, dist);
          
          vec3 centerColor = vec3(1.0, 1.0, 1.0);
          vec3 edgeColor = vec3(1.0, 0.88, 0.5);
          vec3 color = mix(edgeColor, centerColor, intensity);
          
          float corona = sin(atan(vPosition.y, vPosition.x) * 8.0 + uTime) * 0.1;
          float alpha = intensity * (1.0 + corona) * 0.9;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      glowRef.current.scale.setScalar(scale);
    }
    sunMaterial.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group position={[2, 0, 0]}>
      <mesh ref={sunRef} material={sunMaterial}>
        <sphereGeometry args={[3, 64, 64]} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color="#FFE082"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Starfield() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Stars />
        <Sun />
      </Canvas>
    </div>
  );
}