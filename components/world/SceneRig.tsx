"use client";

import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { sampleScalarTrack, sampleVec3Track, type Keyframe, type Vec3 } from "@/lib/animations/track";
import { damp, seg } from "@/lib/animations/easing";
import { ARRIVAL_IMPACT_P } from "@/lib/animations/arrival";
import { WORLD_QUALITY, type Tier } from "@/lib/three/quality";

/**
 * Cinematic camera path:
 * void → construction → summon frame → hero push-in (follows the fall) →
 * touchdown → settle → pan across the society → pull-back → digital.
 */
const POS_TRACK: Keyframe<Vec3>[] = [
  { t: 0.0, v: [0, 2.4, 26] },
  { t: 0.08, v: [0, 2.8, 22] },
  { t: 0.18, v: [-9, 4.6, 16.5] },
  { t: 0.3, v: [10, 7, 14] },
  { t: 0.36, v: [8.9, 4.2, 10.8] },
  // summon frame — wide, looking up at the sky point
  { t: 0.4, v: [8.2, 2.2, 8.6] },
  // push-in rides the falling agent, arrives at touchdown
  { t: 0.455, v: [6.15, 1.05, 5.3] },
  { t: 0.5, v: [6.3, 1.15, 5.5] },
  // settle / pull back south, clearing the corner of the [5, 8.5] building
  { t: 0.545, v: [7.5, 2.1, 9.9] },
  { t: 0.58, v: [-4.2, 2.7, 12.4] },
  { t: 0.66, v: [1.2, 2.1, 6.6] },
  { t: 0.76, v: [-3.6, 3.6, 13.5] },
  { t: 0.86, v: [0, 9, 22] },
  { t: 0.94, v: [0, 14, 30] },
  { t: 1.0, v: [0, 18, 38] },
];

const LOOK_TRACK: Keyframe<Vec3>[] = [
  { t: 0.0, v: [0, 5.5, 0] },
  { t: 0.08, v: [0, 4.5, 0] },
  { t: 0.18, v: [0, 3.2, 0] },
  { t: 0.3, v: [0, 2.8, 0] },
  { t: 0.36, v: [2.4, 2.85, 0.1] },
  // tilt UP to the drop origin…
  { t: 0.4, v: [3.9, 3.6, 0] },
  // …track the agent through the fall…
  { t: 0.428, v: [3.9, 4.3, 0] },
  // …then whip down to the landing point, arriving at touchdown
  { t: 0.455, v: [3.9, 1.15, 0] },
  { t: 0.5, v: [3.9, 1.25, 0] },
  { t: 0.545, v: [3.4, 1.5, -0.2] },
  { t: 0.58, v: [-1, 1.4, -0.5] },
  { t: 0.66, v: [2.5, 1.2, -2.5] },
  { t: 0.76, v: [0, 2, 0] },
  { t: 0.86, v: [0, 2.5, 0] },
  { t: 0.94, v: [0, 2, 0] },
  { t: 1.0, v: [0, 1.5, 0] },
];

const FOV_TRACK: Keyframe<number>[] = [
  { t: 0.0, v: 42 },
  { t: 0.4, v: 44 },
  { t: 0.6, v: 47 },
  { t: 0.76, v: 44 },
  { t: 0.86, v: 40 },
  { t: 1.0, v: 36 },
];

const FOG_BASE = new THREE.Color("#05060a");
const FOG_DIGITAL = new THREE.Color("#070c16");

export default function SceneRig({
  progressRef,
  staticP,
  tier,
}: {
  progressRef: MutableRefObject<number>;
  staticP: number | null;
  tier: Tier;
}) {
  const parallax = WORLD_QUALITY[tier].parallax;
  const p = useRef(staticP ?? 0);
  const px = useRef(0);
  const py = useRef(0);
  const pos = useRef<Vec3>([0, 2.4, 26]);
  const look = useRef<Vec3>([0, 5.5, 0]);
  const lookSmooth = useRef(new THREE.Vector3(0, 5.5, 0));
  const fogColor = useRef(new THREE.Color().copy(FOG_BASE));
  const lastFov = useRef(42);

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const scene = state.scene;
    const target = staticP ?? progressRef.current;
    p.current = damp(p.current, target, 3.4, delta);
    const cp = p.current;

    sampleVec3Track(POS_TRACK, cp, pos.current);
    sampleVec3Track(LOOK_TRACK, cp, look.current);

    if (parallax) {
      px.current = damp(px.current, state.pointer.x, 3.2, delta);
      py.current = damp(py.current, state.pointer.y, 3.2, delta);
    }

    // Narrow viewports: widen FOV and dolly out so the choreography stays framed
    const aspect = state.size.width / Math.max(state.size.height, 1);
    const zoomOut = aspect < 0.75 ? 1.3 : aspect < 1.1 ? 1.12 : 1;

    // touchdown kick: quick FOV widen + damped camera shake (scroll-locked)
    const hit =
      seg(cp, ARRIVAL_IMPACT_P, ARRIVAL_IMPACT_P + 0.008) *
      (1 - seg(cp, ARRIVAL_IMPACT_P + 0.008, ARRIVAL_IMPACT_P + 0.05));

    let camX = pos.current[0] + px.current * 0.45;
    let camY = pos.current[1] + py.current * 0.28;
    let camZ = pos.current[2];

    if (hit > 0.001) {
      const sh = hit * hit * 0.12;
      const tt = state.clock.elapsedTime;
      camX += Math.sin(tt * 61.7) * sh;
      camY += Math.sin(tt * 47.3 + 1.7) * sh * 0.7;
      camZ += Math.cos(tt * 53.1 + 0.6) * sh * 0.5;
    }

    camera.position.set(
      look.current[0] + (camX - look.current[0]) * zoomOut,
      look.current[1] + (camY - look.current[1]) * zoomOut,
      look.current[2] + (camZ - look.current[2]) * zoomOut
    );

    lookSmooth.current.set(
      look.current[0] + px.current * 0.22,
      look.current[1] - py.current * 0.16,
      look.current[2]
    );
    camera.lookAt(lookSmooth.current);

    const fov = sampleScalarTrack(FOV_TRACK, cp);
    // Narrow viewports need a wider vertical FOV to keep the choreography framed
    const fovBoost = aspect < 0.75 ? 20 : aspect < 1.1 ? 10 : 0;
    const targetFov = fov + fovBoost + hit * 2.4;

    if (Math.abs(targetFov - lastFov.current) > 0.01) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
      lastFov.current = targetFov;
    }

    // fog + background shift toward "digital blue" during the pull-back
    const k = seg(cp, 0.8, 0.97);
    fogColor.current.lerpColors(FOG_BASE, FOG_DIGITAL, k);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(fogColor.current);
    if (scene.background instanceof THREE.Color) scene.background.copy(fogColor.current);
  });

  return (
    <>
      <ambientLight intensity={0.32} color="#8fa3bd" />
      <hemisphereLight args={["#223044", "#05070a", 0.55]} />
      <directionalLight position={[7, 13, 5]} intensity={1.15} color="#cfe0ff" />
      <directionalLight position={[-9, 6, -6]} intensity={0.3} color="#4d9fff" />
      <pointLight position={[-8, 4.2, -6]} intensity={42} distance={26} decay={2} color="#4d9fff" />
      <pointLight position={[9, 3.6, 4.5]} intensity={36} distance={24} decay={2} color="#ff8a2b" />
      <pointLight position={[0, 5, 8]} intensity={14} distance={18} decay={2} color="#cfe0ff" />
    </>
  );
}
