"use client";

import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { damp, lerp } from "@/lib/animations/easing";
import { createSoftDotTexture } from "@/lib/three/textures";
import { useTheme } from "@/lib/theme";

/* Theme-aware scene colors — the canvas itself is transparent so the
 * plain black & white page background shows through; the fog veil and
 * orbit dust are strictly neutral (white sparkle on the night theme,
 * gray shading on the light one). Brand color stays in the core visual. */
const SCENE = {
  dark: { fog: "#05060a", dust: "#dfe5ec", dustOpacity: 0.5, additive: true },
  light: { fog: "#eef0f3", dust: "#6b7280", dustOpacity: 0.35, additive: false },
} as const;

function OrbitDust({ count = 320 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const [theme] = useTheme();
  const dust = SCENE[theme];
  const data = useRef<{
    positions: Float32Array;
    tex: THREE.CanvasTexture | null;
  }>({ positions: new Float32Array(0), tex: null });

  if (data.current.positions.length === 0) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.2;
      arr[i * 3] = Math.cos(theta) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    data.current.positions = arr;
    if (typeof document !== "undefined") {
      data.current.tex = createSoftDotTexture(48);
    }
  }

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.current.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          map={data.current.tex ?? undefined}
          color={dust.dust}
          transparent
          opacity={dust.dustOpacity}
          depthWrite={false}
          blending={dust.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function Core() {
  const core = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const waves = useRef<(THREE.Mesh | null)[]>([]);
  const waveMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (core.current) {
      core.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);
    }
    if (wire.current) {
      wire.current.rotation.y = t * 0.3;
      wire.current.rotation.z = Math.sin(t * 0.4) * 0.2;
    }
    waves.current.forEach((w, i) => {
      const m = waveMats.current[i];
      if (!w || !m) return;
      const phase = (t * 0.34 + i / 3) % 1;
      w.scale.setScalar(0.5 + phase * 4.2);
      m.opacity = (1 - phase) * 0.22;
    });
  });

  return (
    <group position={[0, 0.95, 0]}>
      <mesh ref={core}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#eaf4ff"
          emissive="#7fd0ff"
          emissiveIntensity={2.4}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={wire}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshBasicMaterial color="#4d9fff" wireframe transparent opacity={0.4} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            waves.current[i] = m;
          }}
          rotation={[-Math.PI / 2.2, i * 0.6, 0]}
        >
          <torusGeometry args={[0.85, 0.014, 8, 80]} />
          <meshBasicMaterial
            ref={(m) => {
              waveMats.current[i] = m;
            }}
            color={i === 1 ? "#ff8a2b" : "#7fd0ff"}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({
  progressRef,
  staticP,
}: {
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const p = useRef(staticP ?? 0.85);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useFrame((state, delta) => {
    p.current = damp(p.current, staticP ?? progressRef.current, 3, delta);
    const cp = p.current;
    camera.position.set(
      Math.sin(state.pointer.x * 0.12) * 0.6,
      lerp(2.6, 1.05, cp) + state.pointer.y * 0.15,
      lerp(7.4, 3.5, cp)
    );
    camera.lookAt(0, 0.95, 0);
  });

  return null;
}

/** Small glowing core for the closing CTA experience. */
export default function CoreScene({
  progressRef,
  staticP,
  frameloop = "always",
}: {
  progressRef: MutableRefObject<number>;
  staticP: number | null;
  frameloop?: "always" | "demand" | "never";
}) {
  const [theme] = useTheme();
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, stencil: false, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.1, far: 50, position: [0, 2.6, 7.4] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      {/* no solid background — the plain black & white page canvas
          continues behind the core; fog tints geometry toward the theme */}
      <fog attach="fog" args={[SCENE[theme].fog, 9, 26]} />
      <ambientLight intensity={0.35} color="#8fa3bd" />
      <pointLight position={[0, 1.2, 2.5]} intensity={20} distance={12} decay={2} color="#4d9fff" />
      <pointLight position={[-2.5, 0.5, -2]} intensity={12} distance={12} decay={2} color="#ff8a2b" />
      <CameraRig progressRef={progressRef} staticP={staticP} />
      <Core />
      <OrbitDust count={staticP !== null ? 140 : 320} />
    </Canvas>
  );
}
