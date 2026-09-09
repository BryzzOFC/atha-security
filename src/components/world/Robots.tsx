"use client";

import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import Robot, { type RobotSpec } from "./Robot";
import ArrivalFX from "./Arrival";
import { ARRIVAL } from "@/lib/animations/arrival";
import type { Tier } from "@/lib/three/quality";

const SPECS: RobotSpec[] = [
  // walker — THE FIRST AGENT: full cinematic sky-strike arrival
  {
    position: [0, 0, 0],
    rotationY: 0,
    behavior: "walk",
    phase: 0,
    accent: "blue",
    appear: ARRIVAL.from,
    arrival: "cinematic",
    // on the r=3.9 patrol circle at angle 0 — open corridor, framed center-right
    anchor: [3.9, 0, 0],
    anchorAngle: 0,
    faceCam: 0.43,
    walkRadius: 3.9,
    walkSpeed: 0.22,
    walkDir: 1,
  },
  // talker A — society forms while the camera pans away from the arrival
  { position: [-1.7, 0, -1.4], rotationY: 2.13, behavior: "talk", phase: 0.7, accent: "orange", appear: 0.565 },
  // worker at terminal
  { position: [1.85, 0, 1.55], rotationY: 2.36, behavior: "work", phase: 1.3, accent: "blue", appear: 0.578 },
  // supervisor on platform
  { position: [2.85, 0.5, -2.5], rotationY: 0.6, behavior: "watch", phase: 2.1, accent: "blue", appear: 0.59 },
  // talker B
  { position: [-0.25, 0, -2.3], rotationY: -1.02, behavior: "talk", phase: 1.9, accent: "blue", appear: 0.602 },
  // player
  { position: [0.3, 0, -4.4], rotationY: 0.7, behavior: "play", phase: 0.4, accent: "orange", appear: 0.615 },
  // walker — inner loop, opposite direction
  {
    position: [0, 0, 0],
    rotationY: 0,
    behavior: "walk",
    phase: 3.1,
    accent: "orange",
    appear: 0.63,
    walkRadius: 2.7,
    walkSpeed: 0.3,
    walkDir: -1,
    walkPhase: 5.0,
  },
];

/** Bouncing ball for the playing robot. */
function Ball({
  position,
  appear,
  progressRef,
  staticP,
}: {
  position: [number, number, number];
  appear: number;
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const active = (staticP ?? progressRef.current) > appear + 0.06;
    m.visible = active;
    if (!active) return;
    const t = state.clock.elapsedTime;
    m.position.set(position[0], 0.13 + Math.abs(Math.sin(t * 3.2 + 1.3)) * 0.85, position[2]);
  });
  return (
    <mesh ref={mesh} position={position} visible={false}>
      <sphereGeometry args={[0.125, 16, 16]} />
      <meshStandardMaterial
        color="#1c0e02"
        emissive="#ff8a2b"
        emissiveIntensity={0.9}
        roughness={0.4}
      />
    </mesh>
  );
}

/** The robot society — the first agent arrives cinematically, the rest follow. */
export default function Robots({
  tier,
  progressRef,
  staticP,
}: {
  tier: Tier;
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const count = tier === "high" ? 7 : tier === "medium" ? 5 : 3;
  // Keep narrative-critical robots first: walker (cinematic), talker A, worker.
  const order = [0, 1, 2, 4, 5, 3, 6];
  const specs = order.slice(0, count).map((i) => SPECS[i]);
  const hero = SPECS[0];

  return (
    <group>
      <ArrivalFX
        anchor={hero.anchor ?? [0, 0, 0]}
        accent={hero.accent}
        from={ARRIVAL.from}
        span={ARRIVAL.span}
        progressRef={progressRef}
        staticP={staticP}
        tier={tier}
      />
      {specs.map((spec, i) => (
        <Robot key={i} spec={spec} progressRef={progressRef} staticP={staticP} />
      ))}
      {count > 5 && (
        <Ball position={[1.05, 0.13, -4.75]} appear={0.675} progressRef={progressRef} staticP={staticP} />
      )}
    </group>
  );
}
