"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { seg, damp } from "@/lib/animations/easing";
import { createSoftDotTexture } from "@/lib/three/textures";

/**
 * Final chapter: the world is revealed to sit inside a technological
 * structure — wireframe shell, orbital rings and a glowing ATHA core.
 */
export default function DigitalShell({
  progressRef,
  staticP,
}: {
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const group = useRef<THREE.Group>(null);
  const icoMat = useRef<THREE.MeshBasicMaterial>(null);
  const ringMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const sprite = useRef<THREE.Sprite>(null);
  const spriteMat = useRef<THREE.SpriteMaterial>(null);
  const p = useRef(0);
  const glowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return createSoftDotTexture(64);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    p.current = damp(p.current, staticP ?? progressRef.current, 3.5, delta);
    const k = seg(p.current, 0.8, 0.965);
    g.visible = k > 0.001;
    if (!g.visible) return;

    g.rotation.y = t * 0.05;

    if (icoMat.current) icoMat.current.opacity = k * 0.14;
    ringMats.current.forEach((m, i) => {
      if (m) m.opacity = k * [0.34, 0.22, 0.16][i % 3] * (0.75 + 0.25 * Math.sin(t * 1.2 + i * 2));
    });
    if (core.current) {
      const pulse = 1 + Math.sin(t * 2.6) * 0.12;
      core.current.scale.setScalar(pulse * k);
      core.current.position.y = 2.1;
    }
    if (coreMat.current) coreMat.current.emissiveIntensity = 2.6 * k + Math.sin(t * 2.6) * 0.5;
    if (sprite.current && spriteMat.current) {
      sprite.current.scale.setScalar(2.6 * k * (1 + Math.sin(t * 2.6) * 0.08));
      spriteMat.current.opacity = k * 0.85;
    }
  });

  return (
    <group ref={group} visible={false}>
      {/* wireframe shell around the world */}
      <mesh>
        <icosahedronGeometry args={[9.5, 1]} />
        <meshBasicMaterial
          ref={icoMat}
          color="#4d9fff"
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* orbital rings */}
      {[
        { r: 9.6, rot: [Math.PI / 2.15, 0.2, 0] as const, c: "#4d9fff" },
        { r: 10.4, rot: [Math.PI / 1.85, -0.35, 0.2] as const, c: "#ff8a2b" },
        { r: 11.2, rot: [Math.PI / 2.4, 0.55, -0.15] as const, c: "#9fb6cc" },
      ].map((ring, i) => (
        <mesh key={i} rotation={[ring.rot[0], ring.rot[1], ring.rot[2]]}>
          <torusGeometry args={[ring.r, 0.02, 8, 96]} />
          <meshBasicMaterial
            ref={(m) => {
              ringMats.current[i] = m;
            }}
            color={ring.c}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* ATHA core above the plaza */}
      <mesh ref={core} position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          ref={coreMat}
          color="#eaf4ff"
          emissive="#7fd0ff"
          emissiveIntensity={0}
        />
      </mesh>
      {glowTex && (
        <sprite ref={sprite} position={[0, 2.1, 0]}>
          <spriteMaterial
            ref={spriteMat}
            map={glowTex}
            color="#7fd0ff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      )}
    </group>
  );
}
