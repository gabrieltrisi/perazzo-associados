'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { playKnock } from '@/lib/knock';

const GOLD = '#C7A96F';
const NAVY = '#0A1E40';

// Estado do golpe do martelo, compartilhado entre os elementos da cena.
type Strike = { requested: boolean; active: boolean; start: number; impacted: boolean; impactT: number; everStruck: boolean };

const STRIKE_DUR = 0.9; // duração total do golpe (s)
const IMPACT_AT = 0.34; // fração do golpe em que o martelo atinge o bloco
const DROP = 0.6; // quanto o martelo desce
const RIPPLE_DUR = 0.7; // duração da onda dourada

// Barra/elo entre dois pontos (travessão, correntes dos pratos).
function Bar({
  from,
  to,
  radius = 0.02,
  segments = 10,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  segments?: number;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const pos = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return { position: pos, quaternion: quat, length: len };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, segments]} />
      <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.34} emissive={GOLD} emissiveIntensity={0.12} />
    </mesh>
  );
}

function GoldMaterial() {
  return <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.34} emissive={GOLD} emissiveIntensity={0.1} />;
}

// Conteúdo de um prato: 4 correntes + bacia facetada (fica sempre nivelado).
function PanContents() {
  const drop = 0.98;
  const r = 0.32;
  return (
    <>
      <Bar from={[0, 0, 0]} to={[r, -drop, 0]} radius={0.014} />
      <Bar from={[0, 0, 0]} to={[-r, -drop, 0]} radius={0.014} />
      <Bar from={[0, 0, 0]} to={[0, -drop, r]} radius={0.014} />
      <Bar from={[0, 0, 0]} to={[0, -drop, -r]} radius={0.014} />
      <group position={[0, -drop - 0.06, 0]}>
        <mesh>
          <cylinderGeometry args={[0.46, 0.3, 0.14, 8]} />
          <meshStandardMaterial color={NAVY} metalness={0.45} roughness={0.35} flatShading />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.46, 0.02, 8, 8]} />
          <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.34} emissive={GOLD} emissiveIntensity={0.12} />
        </mesh>
      </group>
    </>
  );
}

// Poeira dourada em suspensão — profundidade discreta, sem competir com a balança.
function GoldDust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const N = 90;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={GOLD} size={0.045} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

// Martelo (malho) dourado — descansa ao lado da balança e bate no bloco ao clicar.
function Gavel({ strike }: { strike: React.RefObject<Strike> }) {
  const g = useRef<THREE.Group>(null);
  const restY = 0.6;
  const restRot = 0.16;

  useFrame((state) => {
    if (!g.current) return;
    const s = strike.current;
    if (s.active) {
      const p = (state.clock.elapsedTime - s.start) / STRIKE_DUR;
      let d: number;
      if (p < IMPACT_AT) {
        const k = p / IMPACT_AT;
        d = k * k * DROP; // acelera para baixo até o impacto
      } else {
        const k = (p - IMPACT_AT) / (1 - IMPACT_AT);
        d = DROP * (1 - k * (2 - k)); // volta com desaceleração
      }
      g.current.position.y = restY - d;
      g.current.rotation.z = restRot * (1 - d / DROP); // nivela ao descer
    } else if (!s.everStruck) {
      // Dica de interatividade: um leve "respirar" até o usuário clicar a 1ª vez.
      const b = Math.sin(state.clock.elapsedTime * 2) * 0.06;
      g.current.position.y = restY + b;
      g.current.rotation.z = restRot + b * 0.18;
    } else {
      g.current.position.y = restY;
      g.current.rotation.z = restRot;
    }
  });

  return (
    <group ref={g} position={[2.35, restY, 0.2]} rotation={[0, 0, restRot]}>
      {/* cabo */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.78, 14]} />
        <GoldMaterial />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <GoldMaterial />
      </mesh>
      {/* cabeça (malho) na base */}
      <group position={[0, -0.42, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.46, 20]} />
          <GoldMaterial />
        </mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.155, 0.155, 0.05, 20]} />
          <GoldMaterial />
        </mesh>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.155, 0.155, 0.05, 20]} />
          <GoldMaterial />
        </mesh>
      </group>
    </group>
  );
}

function JusticeScene() {
  const tilt = useRef<THREE.Group>(null);
  const sway = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Group>(null);
  const panL = useRef<THREE.Group>(null);
  const panR = useRef<THREE.Group>(null);
  const ripple = useRef<THREE.Mesh>(null);
  const rippleMat = useRef<THREE.MeshBasicMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const strike = useRef<Strike>({ requested: false, active: false, start: 0, impacted: false, impactT: 0, everStruck: false });
  const mouseLight = useRef<THREE.PointLight>(null);

  const arm = 1.4;
  const pivotY = 1.32;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => {
      scroll.current = window.scrollY;
    };
    // Clique dispara o golpe do martelo (ignora cliques em botões/links).
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && el.closest('a,button,input,textarea,label,[role="checkbox"]')) return;
      // Apenas sinaliza; o useFrame captura o tempo no relógio do R3F (mesma origem).
      if (!strike.current.active) strike.current.requested = true;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = strike.current;

    // Um clique foi pedido: inicia o golpe usando o relógio do R3F.
    if (s.requested && !s.active) {
      s.active = true;
      s.start = t;
      s.impacted = false;
      s.requested = false;
      s.everStruck = true;
    }

    // Luz que segue o mouse — o ouro "acende" conforme o cursor se move.
    if (mouseLight.current) {
      mouseLight.current.position.x = THREE.MathUtils.lerp(mouseLight.current.position.x, pointer.current.x * 4.5, 0.08);
      mouseLight.current.position.y = THREE.MathUtils.lerp(mouseLight.current.position.y, pointer.current.y * 3.2, 0.08);
    }

    // Progresso do golpe + detecção do impacto.
    if (s.active) {
      const p = (t - s.start) / STRIKE_DUR;
      if (!s.impacted && p >= IMPACT_AT) {
        s.impacted = true;
        s.impactT = t;
        playKnock(); // "toc" sincronizado com a batida
      }
      if (p >= 1) s.active = false;
    }

    // Tremor da balança após o impacto (oscilação amortecida).
    let kick = 0;
    if (s.impacted) {
      const dt = t - s.impactT;
      const amp = Math.max(0, 0.3 * (1 - dt / 0.9));
      kick = Math.sin(dt * 26) * amp;
      if (dt > RIPPLE_DUR) s.impacted = false;
    }

    // Equilíbrio do travessão: mouse + onda lenta + tremor do golpe.
    if (beam.current) {
      const target =
        pointer.current.x * 0.14 + Math.sin(t * 0.9) * 0.04 + Math.sin(scroll.current * 0.0016) * 0.05 + kick;
      beam.current.rotation.z = THREE.MathUtils.lerp(beam.current.rotation.z, target, kick ? 0.35 : 0.05);
      if (panL.current) panL.current.rotation.z = -beam.current.rotation.z;
      if (panR.current) panR.current.rotation.z = -beam.current.rotation.z;
    }

    // Onda dourada expandindo a partir do bloco.
    if (ripple.current && rippleMat.current) {
      if (s.impacted) {
        const rp = (t - s.impactT) / RIPPLE_DUR;
        const sc = 0.3 + rp * 2.2;
        ripple.current.scale.set(sc, sc, sc);
        rippleMat.current.opacity = Math.max(0, (1 - rp) * 0.55);
        ripple.current.visible = true;
      } else {
        ripple.current.visible = false;
      }
    }

    // Vaivém suave + leve giro no scroll.
    if (sway.current) {
      sway.current.rotation.y = Math.sin(t * 0.3) * 0.18 + scroll.current * 0.0004;
    }
    // Parallax pelo mouse + deriva ao rolar.
    if (tilt.current) {
      tilt.current.rotation.y = THREE.MathUtils.lerp(tilt.current.rotation.y, pointer.current.x * 0.2, 0.04);
      tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, -pointer.current.y * 0.1, 0.04);
      tilt.current.rotation.z = THREE.MathUtils.lerp(tilt.current.rotation.z, Math.sin(scroll.current * 0.001) * 0.035, 0.05);
      tilt.current.position.y = -scroll.current * 0.0016;
    }
  });

  return (
    <>
      {/* Luz que acompanha o cursor — realça o brilho do ouro ao mover o mouse. */}
      <pointLight ref={mouseLight} position={[0, 0, 4.5]} intensity={22} color={GOLD} distance={16} decay={2} />
      <group ref={tilt} position={[0, -0.1, 0]}>
        <group ref={sway}>
        {/* ----- Coluna e base da balança ----- */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.055, 0.075, 3.05, 16]} />
          <GoldMaterial />
        </mesh>
        <mesh position={[0, -1.42, 0]}>
          <cylinderGeometry args={[0.26, 0.34, 0.5, 20]} />
          <GoldMaterial />
        </mesh>
        <mesh position={[0, -1.7, 0]}>
          <cylinderGeometry args={[0.5, 0.58, 0.14, 28]} />
          <GoldMaterial />
        </mesh>
        <mesh position={[0, -1.82, 0]}>
          <cylinderGeometry args={[0.72, 0.82, 0.16, 32]} />
          <GoldMaterial />
        </mesh>

        {/* ----- Remate em joia no topo ----- */}
        <mesh position={[0, pivotY + 0.34, 0]}>
          <octahedronGeometry args={[0.17, 0]} />
          <GoldMaterial />
        </mesh>
        <mesh position={[0, pivotY + 0.15, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.22, 12]} />
          <GoldMaterial />
        </mesh>

        {/* ----- Travessão que equilibra ----- */}
        <group ref={beam} position={[0, pivotY, 0]}>
          <mesh>
            <sphereGeometry args={[0.11, 20, 20]} />
            <GoldMaterial />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, arm * 2, 14]} />
            <GoldMaterial />
          </mesh>
          <mesh position={[arm, 0, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <GoldMaterial />
          </mesh>
          <mesh position={[-arm, 0, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <GoldMaterial />
          </mesh>
          <group ref={panL} position={[-arm, 0, 0]}>
            <PanContents />
          </group>
          <group ref={panR} position={[arm, 0, 0]}>
            <PanContents />
          </group>
        </group>

        {/* ----- Martelo + bloco de som (bate ao clicar) ----- */}
        <Gavel strike={strike} />
        <mesh position={[2.35, -0.67, 0.2]}>
          <cylinderGeometry args={[0.42, 0.5, 0.18, 28]} />
          <GoldMaterial />
        </mesh>
        <mesh position={[2.35, -0.55, 0.2]}>
          <cylinderGeometry args={[0.34, 0.42, 0.08, 24]} />
          <GoldMaterial />
        </mesh>
        {/* onda dourada do impacto */}
        <mesh ref={ripple} position={[2.35, -0.5, 0.2]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.3, 0.42, 40]} />
          <meshBasicMaterial ref={rippleMat} color={GOLD} transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
    </>
  );
}

export default function HeroScene({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      frameloop={paused ? 'never' : 'always'}
    >
      <fog attach="fog" args={['#071530', 7, 16]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[0, 3, 6]} intensity={0.8} color="#F7F6F2" />
      <pointLight position={[-5, -2, 4]} intensity={45} color={GOLD} />
      <pointLight position={[4, 4, -3]} intensity={30} color="#40537B" />
      {/* Reflexos no ouro — ambiente procedural (sem assets externos, CSP-safe). */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={1.4} color="#F7F6F2" position={[0, 2, 5]} scale={[8, 8, 1]} />
        <Lightformer intensity={1.0} color={GOLD} position={[-5, -1, 3]} scale={[5, 5, 1]} />
        <Lightformer intensity={0.6} color="#40537B" position={[5, 3, -2]} scale={[5, 5, 1]} />
      </Environment>
      <GoldDust />
      <JusticeScene />
    </Canvas>
  );
}