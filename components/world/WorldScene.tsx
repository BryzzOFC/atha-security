"use client";

import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { easeInOutCubic, damp, seg, lerp } from "@/lib/animations/easing";
import SceneRig from "./SceneRig";
import City from "./City";
import Robots from "./Robots";
import Particles from "./Particles";
import DigitalShell from "./DigitalShell";
import { WORLD_QUALITY, type Tier } from "@/lib/three/quality";

function WorldRoot({
  progressRef,
  staticP,
  tier,
  children,
}: {
  progressRef: MutableRefObject<number>;
  staticP: number | null;
  tier: Tier;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const p = useRef(0);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    p.current = damp(p.current, staticP ?? progressRef.current, 3.5, delta);
    const k = easeInOutCubic(seg(p.current, 0.8, 0.97));
    g.scale.setScalar(lerp(1, 0.6, k));
    g.position.y = lerp(0, 0.55, k);
  });

  return (
    <group ref={group}>
      {children}
    </group>
  );
}

/** The full cinematic world scene, driven by scroll progress. */
export default function WorldScene({
  progressRef,
  staticP,
  tier,
  frameloop = "always",
}: {
  progressRef: MutableRefObject<number>;
  staticP: number | null;
  tier: Tier;
  frameloop?: "always" | "demand" | "never";
}) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={typeof staticP === "number" ? 1 : WORLD_QUALITY[tier].dpr}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false, stencil: false }}
      camera={{ fov: 42, near: 0.1, far: 130, position: [0, 2.4, 26] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#05060a", 20, 64]} />
      <SceneRig progressRef={progressRef} staticP={staticP} tier={tier} />
      <WorldRoot progressRef={progressRef} staticP={staticP} tier={tier}>
        <City tier={tier} progressRef={progressRef} staticP={staticP} />
        <Robots tier={tier} progressRef={progressRef} staticP={staticP} />
      </WorldRoot>
      <DigitalShell progressRef={progressRef} staticP={staticP} />
      <Particles
        count={tier === "high" ? 1500 : tier === "medium" ? 800 : 320}
        progressRef={progressRef}
        staticP={staticP}
      />
    </Canvas>
  );
}
