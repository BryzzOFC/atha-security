"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { seg, damp } from "@/lib/animations/easing";
import type { MutableRefObject } from "react";

const VERT = /* glsl */ `
attribute float aSeed;
attribute float aSpeed;
uniform float uTime;
varying float vSeed;
varying float vNear;
void main() {
  vSeed = aSeed;
  vec3 p = position;
  float range = 15.0;
  p.y = mod(p.y + uTime * aSpeed, range) - 2.5;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = max(0.35, -mv.z);
  gl_PointSize = min((2.2 + aSeed * 3.4) * (120.0 / dist), 72.0);
  vNear = smoothstep(0.5, 3.0, dist);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vSeed;
varying float vNear;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.06, d);
  vec3 color = mix(uColorA, uColorB, step(0.78, fract(vSeed * 7.13)));
  gl_FragColor = vec4(color, alpha * uOpacity * vNear);
}
`;

/** Ambient dust that fills the void before the world is built. */
export default function Particles({
  count,
  progressRef,
  staticP,
}: {
  count: number;
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const p = useRef(0);

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * 26;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random();
      speeds[i] = 0.16 + Math.random() * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    return {
      geometry: geo,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uColorA: { value: new THREE.Color("#7fa8d8") },
        uColorB: { value: new THREE.Color("#ff9a4d") },
      },
    };
  }, [count]);

  useFrame((state, dt) => {
    const mat = matRef.current;
    const pts = pointsRef.current;
    if (!mat || !pts) return;
    p.current = damp(p.current, staticP ?? progressRef.current, 3.5, dt);
    const opacity = seg(p.current, 0.02, 0.12) * 0.75;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uOpacity.value = opacity;
    pts.visible = opacity > 0.004;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
