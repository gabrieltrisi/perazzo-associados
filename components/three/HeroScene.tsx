'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Cristal central: icosaedro navy facetado + arestas douradas (a marca virando joia).
function Crystal() {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // Parallax pelo mouse via listener global (funciona mesmo com o canvas pointer-events-none).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, delta) => {
    if (spin.current) {
      spin.current.rotation.y += delta * 0.18;
      spin.current.rotation.x += delta * 0.05;
    }
    if (tilt.current) {
      tilt.current.rotation.y = THREE.MathUtils.lerp(tilt.current.rotation.y, pointer.current.x * 0.4, 0.04);
      tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, -pointer.current.y * 0.4, 0.04);
    }
  });

  return (
    <group ref={tilt}>
      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.7}>
        <group ref={spin}>
          <mesh>
            <icosahedronGeometry args={[1.75, 0]} />
            <meshStandardMaterial color="#0A1E40" metalness={0.4} roughness={0.35} flatShading />
          </mesh>
          <mesh scale={1.002}>
            <icosahedronGeometry args={[1.75, 0]} />
            <meshBasicMaterial color="#C7A96F" wireframe transparent opacity={0.65} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// Pequenos fragmentos dourados flutuando, para dar profundidade.
function Shard({ position, scale }: { position: [number, number, number]; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += d * 0.3;
      ref.current.rotation.y += d * 0.2;
    }
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.4}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#C7A96F"
          metalness={0.6}
          roughness={0.3}
          flatShading
          emissive="#C7A96F"
          emissiveIntensity={0.12}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      frameloop="always"
    >
      <fog attach="fog" args={['#071530', 6, 15]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <pointLight position={[-5, -2, 4]} intensity={45} color="#C7A96F" />
      <pointLight position={[4, 4, -3]} intensity={30} color="#40537B" />
      <Crystal />
      <Shard position={[3.2, 1.4, -1]} scale={0.34} />
      <Shard position={[-3.4, -1.3, -0.5]} scale={0.5} />
      <Shard position={[2.7, -1.9, 0.6]} scale={0.26} />
      <Shard position={[-2.7, 1.9, -1.5]} scale={0.4} />
    </Canvas>
  );
}