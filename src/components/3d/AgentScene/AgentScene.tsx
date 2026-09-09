"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Grid } from "@react-three/drei";

/** Fallback EN node labels (the section passes the active-language list). */
const DEFAULT_NODES = [
  "DETECTION",
  "ANALYSIS",
  "RESPONSE",
  "VALIDATION",
  "INTEGRITY",
  "AUDIT",
  "RECOVERY",
  "PROTECTION",
];

const R = 3.1;

function AgentNode({
  index,
  total,
  label,
  color,
}: {
  index: number;
  total: number;
  label: string;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const angle = (index / total) * Math.PI * 2;
  const x = Math.cos(angle) * R;
  const z = Math.sin(angle) * R;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = 0.62 + Math.sin(t * 1.1 + index * 1.7) * 0.09;
      ref.current.rotation.y = t * 0.55 + index * 0.8;
    }
  });

  return (
    <group ref={ref} position={[x, 0.62, z]}>
      <mesh>
        <octahedronGeometry args={[0.21, 0]} />
        <meshStandardMaterial
          color="#0a0d12"
          emissive={color}
          emissiveIntensity={1.7}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <Html
        center
        zIndexRange={[20, 0]}
        className="pointer-events-none select-none"
        style={{ transform: "translateY(-30px)" }}
      >
        <div className="whitespace-nowrap rounded border border-white/12 bg-black/60 px-2 py-1 font-mono text-[9px] tracking-[0.24em] text-white/85 backdrop-blur-sm">
          {label}
        </div>
      </Html>
    </group>
  );
}

function Scene({ nodes }: { nodes: string[] }) {
  const ring = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Mesh>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const pulseMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (ring.current) ring.current.rotation.y += delta * 0.07;
    if (wire.current) {
      wire.current.rotation.y = t * 0.22;
      wire.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (pulse.current && pulseMat.current) {
      const phase = (t * 0.5) % 1;
      pulse.current.scale.setScalar(0.7 + phase * 4.4);
      pulseMat.current.opacity = (1 - phase) * 0.2;
    }
  });

  return (
    <>
      <color attach="background" args={["#06070c"]} />
      <fog attach="fog" args={["#06070c", 12, 30]} />

      <ambientLight intensity={0.4} color="#8fa3bd" />
      <directionalLight position={[4, 8, 6]} intensity={0.9} color="#cfe0ff" />
      <pointLight position={[0, 2.2, 0]} intensity={26} distance={14} decay={2} color="#4d9fff" />
      <pointLight position={[-4, 1.5, 4]} intensity={10} distance={12} decay={2} color="#ff8a2b" />

      {/* core */}
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#eaf4ff" emissive="#7fd0ff" emissiveIntensity={2.2} roughness={0.2} />
      </mesh>
      <mesh ref={wire} position={[0, 0.62, 0]}>
        <icosahedronGeometry args={[0.82, 1]} />
        <meshBasicMaterial color="#4d9fff" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={pulse} position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.015, 8, 64]} />
        <meshBasicMaterial ref={pulseMat} color="#7fd0ff" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <Html
        center
        zIndexRange={[20, 0]}
        className="pointer-events-none select-none"
        style={{ transform: "translateY(58px)" }}
      >
        <div className="whitespace-nowrap rounded border border-brand-blue/50 bg-black/65 px-2.5 py-1 font-mono text-[10px] tracking-[0.3em] text-brand-blue backdrop-blur-sm">
          ATHA
        </div>
      </Html>

      {/* orbiting nodes + links */}
      <group ref={ring}>
        {nodes.map((label, i) => {
          const angle = (i / nodes.length) * Math.PI * 2;
          const x = Math.cos(angle) * R;
          const z = Math.sin(angle) * R;
          const color = i % 2 === 0 ? "#4d9fff" : "#ff8a2b";
          return (
            <group key={label}>
              <lineSegments>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array([0, 0.62, 0, x, 0.62, z]), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={color} transparent opacity={0.28} depthWrite={false} />
              </lineSegments>
            </group>
          );
        })}
      </group>
      {nodes.map((label, i) => (
        <AgentNode
          key={`${i}-${label}`}
          index={i}
          total={nodes.length}
          label={label}
          color={i % 2 === 0 ? "#4d9fff" : "#ff8a2b"}
        />
      ))}

      <Grid
        infiniteGrid
        cellSize={0.7}
        sectionSize={3.5}
        cellColor="#121927"
        sectionColor="#1d2b40"
        cellThickness={0.55}
        sectionThickness={0.9}
        fadeDistance={22}
        fadeStrength={1.6}
        position={[0, 0, 0]}
      />
    </>
  );
}

/** Architecture visualization: ATHA core with eight coordinated agent roles. */
export default function AgentScene({
  frameloop = "always",
  nodes = DEFAULT_NODES,
}: {
  frameloop?: "always" | "demand" | "never";
  nodes?: string[];
}) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, stencil: false, powerPreference: "high-performance" }}
      camera={{ fov: 40, near: 0.1, far: 60, position: [0, 3.6, 10.6] }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.5, 0)}
      aria-hidden
    >
      <Scene nodes={nodes} />
    </Canvas>
  );
}
