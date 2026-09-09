"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { seg, easeInOutCubic, easeOutBack, damp, lerp, lerpAngle } from "@/lib/animations/easing";
import { ARRIVAL, ARRIVAL_END_P, dropY } from "@/lib/animations/arrival";

export type Behavior = "walk" | "talk" | "work" | "play" | "watch";

export type RobotSpec = {
  position: [number, number, number];
  rotationY: number;
  behavior: Behavior;
  phase: number;
  accent: "blue" | "orange";
  appear: number;
  /** "cinematic" = full sky-strike arrival (drop from orbit, hero landing). */
  arrival?: "cinematic" | "quick";
  /** Ground anchor for the cinematic arrival (must lie on the patrol circle). */
  anchor?: [number, number, number];
  /** Circle angle of the anchor + initial facing (radians). */
  anchorAngle?: number;
  faceCam?: number;
  walkRadius?: number;
  walkSpeed?: number;
  walkDir?: 1 | -1;
  walkPhase?: number;
};

let MATS: {
  shell: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
} | null = null;

function getMats() {
  if (!MATS) {
    MATS = {
      shell: new THREE.MeshStandardMaterial({ color: "#dfe5ea", roughness: 0.42, metalness: 0.18 }),
      dark: new THREE.MeshStandardMaterial({ color: "#262d38", roughness: 0.68, metalness: 0.3 }),
    };
  }
  return MATS;
}

const WALK_CYCLE = 7;
/** Scroll-progress length of the "turns and marches off" blend afterwards. */
const BLEND_SPAN = 0.035;

/** Boot flicker for the visor / chest light — u is 0..1 inside the ignite window. */
function flick(u: number) {
  if (u <= 0) return 0;
  if (u < 0.3) return Math.sin(u * 240) > 0.15 ? 1.6 : 0.1;
  if (u < 0.55) return Math.sin(u * 170 + 1.3) > -0.1 ? 0.35 : 1.9;
  return 2.1;
}

export default function Robot({
  spec,
  progressRef,
  staticP,
}: {
  spec: RobotSpec;
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const mats = getMats();
  const cinematic = spec.arrival === "cinematic";
  const root = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const visor = useRef<THREE.MeshStandardMaterial>(null);
  const chest = useRef<THREE.MeshStandardMaterial>(null);
  const tip = useRef<THREE.MeshStandardMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const ring2Mat = useRef<THREE.MeshBasicMaterial>(null);
  const flashMat = useRef<THREE.MeshBasicMaterial>(null);
  const p = useRef(0);
  const landed = useRef(false);
  const walkT0 = useRef(-1);

  const accentColor = useMemo(
    () => new THREE.Color(spec.accent === "blue" ? "#4d9fff" : "#ff8a2b"),
    [spec.accent]
  );

  const arriveEnd = spec.appear + (cinematic ? ARRIVAL.span : 0.05);

  /** Reset everything the arrival deformed — called once when it completes. */
  const restPose = () => {
    if (rig.current) {
      rig.current.position.y = 0;
      rig.current.rotation.set(0, 0, 0);
      rig.current.scale.set(1, 1, 1);
    }
    if (head.current) head.current.rotation.set(0, 0, 0);
    if (armL.current) armL.current.rotation.set(0, 0, 0);
    if (armR.current) armR.current.rotation.set(0, 0, 0);
    if (legL.current) legL.current.rotation.set(0, 0, 0);
    if (legR.current) legR.current.rotation.set(0, 0, 0);
    if (visor.current) visor.current.emissiveIntensity = 2.1;
    if (chest.current) chest.current.emissiveIntensity = 1.8;
    if (tip.current) tip.current.emissiveIntensity = 2.4;
  };

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    p.current = damp(p.current, staticP ?? progressRef.current, 3.5, delta);
    const cp = p.current;

    if (cinematic) {
      const local = seg(cp, spec.appear, arriveEnd);
      const blend = easeInOutCubic(seg(cp, arriveEnd, arriveEnd + BLEND_SPAN));

      g.visible = local > 0.001 || blend > 0;
      if (!g.visible) {
        landed.current = false;
        return;
      }

      const ax = spec.anchor?.[0] ?? 0;
      const az = spec.anchor?.[2] ?? 0;
      const face = spec.faceCam ?? 0;

      // ---- THE SKY-DROP: charge → fall → hero landing → ignition
      if (local < 1) {
        landed.current = false;
        g.position.set(ax, 0, az);
        g.scale.setScalar(1);
        g.rotation.y = face;
        const dropK = seg(local, ARRIVAL.dropStart, ARRIVAL.impact);

        if (dropK <= 0) {
          // still charging — nothing in the beam yet
          g.visible = false;
          return;
        }

        g.visible = true;

        if (dropK < 1) {
          // ---- falling: stabilizers out, slight drift, head down
          g.position.y = dropY(local);
          g.rotation.y = face + Math.sin(local * 5.5) * 0.14;
          if (rig.current) {
            rig.current.rotation.x = -0.1;
            rig.current.position.y = 0;
            rig.current.scale.set(1, 1, 1);
          }
          if (head.current) head.current.rotation.x = -0.18;
          if (armL.current) {
            armL.current.rotation.z = 0.95;
            armL.current.rotation.x = -0.35;
          }
          if (armR.current) {
            armR.current.rotation.z = -0.95;
            armR.current.rotation.x = -0.35;
          }
          if (legL.current) legL.current.rotation.x = 0.12;
          if (legR.current) legR.current.rotation.x = -0.1;
          if (visor.current) visor.current.emissiveIntensity = 0;
          if (chest.current) chest.current.emissiveIntensity = 0;
          if (tip.current) tip.current.emissiveIntensity = 0;
          return;
        }

        // ---- landed: damped-oscillation crouch → elastic recover
        g.position.y = 0;
        const landT = seg(local, ARRIVAL.impact, ARRIVAL.impact + 0.22);
        const env = Math.exp(-5.2 * landT) * Math.cos(landT * 9.2); // 1 → wobble → 0
        const crouch = Math.max(env, -0.25);

        if (rig.current) {
          rig.current.scale.set(1 + 0.16 * crouch, 1 - 0.28 * crouch, 1 + 0.16 * crouch);
          rig.current.position.y = -0.13 * crouch;
          rig.current.rotation.x = 0.2 * Math.max(crouch, 0);
        }
        // arms snap from stabilizer pose down to the sides on touchdown
        const armDown = 1 - seg(local, ARRIVAL.impact, ARRIVAL.impact + 0.09);
        if (armL.current) {
          armL.current.rotation.z = 0.95 * armDown;
          armL.current.rotation.x = -0.35 * armDown;
        }
        if (armR.current) {
          armR.current.rotation.z = -0.95 * armDown;
          armR.current.rotation.x = -0.35 * armDown;
        }
        if (legL.current) legL.current.rotation.x = 0.12 * armDown;
        if (legR.current) legR.current.rotation.x = -0.1 * armDown;

        // ---- ignition: visor/core boot flicker + head scan sweep
        const ig = seg(local, ARRIVAL.ignite, ARRIVAL.ignite + 0.22);
        const boot = flick(ig);
        if (visor.current) visor.current.emissiveIntensity = boot;
        if (chest.current) chest.current.emissiveIntensity = boot * 1.5;
        if (tip.current) tip.current.emissiveIntensity = boot * 1.1;

        if (head.current) {
          const settle = seg(local, ARRIVAL.ignite + 0.05, ARRIVAL.ignite + 0.12);
          head.current.rotation.x = -0.18 * (1 - settle);
          const scan = seg(local, ARRIVAL.ignite, ARRIVAL.ignite + 0.34);
          head.current.rotation.y = Math.sin(scan * Math.PI * 2) * 0.5 * (1 - scan);
        }

        // subtle idle breathing once recovered
        if (rig.current && landT > 0.8) {
          rig.current.position.y = Math.sin(t * 2.1) * 0.008;
        }
        return;
      }

      // ---- just finished the arrival: make sure the pose is exactly rest
      if (!landed.current) {
        landed.current = true;
        restPose();
      }

      if (ring.current) ring.current.visible = false;
      if (ring2.current) ring2.current.visible = false;

      if (spec.behavior === "walk" && spec.anchor && spec.anchorAngle != null) {
        // start the patrol clock the moment the blend begins → perfect continuity
        if (blend > 0 && walkT0.current < 0) walkT0.current = t;
        const wT0 = walkT0.current < 0 ? t : walkT0.current;
        const r = spec.walkRadius ?? 3.8;
        const speed = spec.walkSpeed ?? 0.25;
        const dir = spec.walkDir ?? 1;
        const angle = spec.anchorAngle + (t - wT0) * speed * dir;

        const cx = Math.cos(angle) * r;
        const cz = Math.sin(angle) * r;
        g.position.set(lerp(spec.anchor[0], cx, blend), 0, lerp(spec.anchor[2], cz, blend));
        const tangent = Math.atan2(-Math.sin(angle) * dir, Math.cos(angle) * dir);
        g.rotation.y = lerpAngle(spec.faceCam ?? 0, tangent, blend);

        const swing = Math.sin(t * WALK_CYCLE + spec.phase) * blend;
        if (legL.current) legL.current.rotation.x = swing * 0.55;
        if (legR.current) legR.current.rotation.x = -swing * 0.55;
        if (armL.current) armL.current.rotation.x = -swing * 0.4;
        if (armR.current) armR.current.rotation.x = swing * 0.4;
        if (rig.current) {
          rig.current.position.y = Math.abs(Math.sin(t * WALK_CYCLE + spec.phase)) * 0.03 * blend;
          rig.current.rotation.x = 0.05 * blend;
        }
        if (head.current) {
          head.current.rotation.x = 0.04;
          head.current.rotation.y = Math.sin(t * 0.5 + spec.phase) * 0.14 * blend;
        }
        if (visor.current) {
          visor.current.emissiveIntensity = 2 + Math.sin(t * 2 + spec.phase) * 0.25;
        }
        return;
      }

      // cinematic non-walker: hand over to the shared behavior code below
    } else {
      // ---- quick arrival: pop in with a double ring + micro flash
      const local = seg(cp, spec.appear, arriveEnd);
      g.visible = local > 0.001;
      if (!g.visible) return;
      const pop = easeOutBack(local, 1.6);
      g.scale.setScalar(0.88 * Math.max(pop, 0.0001));

      if (ring.current && ringMat.current) {
        ring.current.visible = local < 1;
        ringMat.current.opacity = (1 - local) * 0.55;
        ring.current.scale.setScalar(0.5 + local * 2.1);
      }
      if (ring2.current && ring2Mat.current) {
        const k2 = seg(local, 0.18, 1);
        ring2.current.visible = k2 > 0.001 && k2 < 1;
        ring2Mat.current.opacity = (1 - k2) * 0.4;
        ring2.current.scale.setScalar(0.4 + k2 * 2.7);
      }
      if (flashMat.current) {
        flashMat.current.opacity = smoothFlash(local);
      }
    }

    const body = rig.current;
    const hd = head.current;
    const al = armL.current;
    const ar = armR.current;
    const ll = legL.current;
    const lr = legR.current;
    if (!body || !hd || !al || !ar || !ll || !lr) return;

    const ph = spec.phase;

    if (spec.behavior === "walk") {
      const angle = (spec.walkPhase ?? 0) + t * (spec.walkSpeed ?? 0.25) * (spec.walkDir ?? 1);
      const r = spec.walkRadius ?? 3.8;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      g.position.set(x, 0, z);
      g.rotation.y = Math.atan2(
        -Math.sin(angle) * (spec.walkDir ?? 1),
        Math.cos(angle) * (spec.walkDir ?? 1)
      );
      const swing = Math.sin(t * WALK_CYCLE + ph);
      ll.rotation.x = swing * 0.55;
      lr.rotation.x = -swing * 0.55;
      al.rotation.x = -swing * 0.4;
      ar.rotation.x = swing * 0.4;
      body.position.y = Math.abs(Math.sin(t * WALK_CYCLE + ph)) * 0.028;
      body.rotation.x = 0.05;
      hd.rotation.x = 0.04;
    } else if (spec.behavior === "talk") {
      g.position.set(spec.position[0], 0, spec.position[2]);
      g.rotation.y = spec.rotationY;
      const nod = Math.max(0, Math.sin(t * 1.25 + ph));
      hd.rotation.x = nod * 0.2 - 0.03;
      hd.rotation.y = Math.sin(t * 0.45 + ph) * 0.12;
      ar.rotation.z = 0.12 + Math.max(0, Math.sin(t * 0.85 + ph * 2.3)) * 0.55;
      ar.rotation.x = -0.25;
      al.rotation.x = Math.sin(t * 1.7 + ph) * 0.08;
      al.rotation.z = 0.06;
      ll.rotation.x = 0;
      lr.rotation.x = 0;
      body.position.y = Math.sin(t * 2 + ph) * 0.014;
      body.rotation.x = 0;
      if (visor.current) visor.current.emissiveIntensity = 2 + Math.max(0, Math.sin(t * 4.5 + ph)) * 0.7;
    } else if (spec.behavior === "work") {
      g.position.set(spec.position[0], 0, spec.position[2]);
      g.rotation.y = spec.rotationY;
      const tap = Math.sin(t * 9 + ph) * 0.09;
      al.rotation.x = -1.05 + tap;
      ar.rotation.x = -1.05 - tap;
      al.rotation.z = 0.1;
      ar.rotation.z = -0.1;
      hd.rotation.x = 0.38;
      hd.rotation.y = 0;
      ll.rotation.x = 0;
      lr.rotation.x = 0;
      body.position.y = Math.sin(t * 4 + ph) * 0.008;
      body.rotation.x = 0.04;
    } else if (spec.behavior === "play") {
      g.position.set(spec.position[0], 0, spec.position[2]);
      g.rotation.y = spec.rotationY + Math.sin(t * 1.5 + ph) * 0.1;
      const hop = Math.abs(Math.sin(t * 3.2 + ph));
      body.position.y = hop * 0.1;
      al.rotation.z = 0.95;
      ar.rotation.z = -0.95;
      al.rotation.x = 0;
      ar.rotation.x = 0;
      hd.rotation.x = 0.22 + Math.sin(t * 3.2 + ph) * 0.1;
      ll.rotation.x = 0;
      lr.rotation.x = 0;
    } else {
      // watch — scanning supervisor
      g.position.set(spec.position[0], spec.position[1], spec.position[2]);
      g.rotation.y = spec.rotationY + Math.sin(t * 0.32 + ph) * 0.85;
      hd.rotation.y = Math.sin(t * 0.64 + ph) * 0.55;
      hd.rotation.x = 0.06;
      al.rotation.x = Math.sin(t * 1.2 + ph) * 0.06;
      ar.rotation.x = -Math.sin(t * 1.2 + ph) * 0.06;
      ll.rotation.x = 0;
      lr.rotation.x = 0;
      body.position.y = Math.sin(t * 1.8 + ph) * 0.012;
      body.rotation.x = 0;
    }
    if (visor.current && spec.behavior !== "talk") {
      visor.current.emissiveIntensity = 2 + Math.sin(t * 2 + ph) * 0.25;
    }
  });

  const visorEmissive = spec.accent === "blue" ? "#7fd0ff" : "#ffb36b";

  return (
    <group ref={root} position={spec.behavior === "walk" && !cinematic ? [0, 0, 0] : spec.position} visible={false}>
      {/* quick-arrival rings + flash */}
      {!cinematic && (
        <>
          <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} visible={false}>
            <ringGeometry args={[0.42, 0.5, 40]} />
            <meshBasicMaterial
              ref={ringMat}
              color={accentColor}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
          <mesh ref={ring2} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} visible={false}>
            <ringGeometry args={[0.36, 0.42, 40]} />
            <meshBasicMaterial
              ref={ring2Mat}
              color="#eaf2ff"
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} visible={false}>
            <circleGeometry args={[0.85, 32]} />
            <meshBasicMaterial
              ref={flashMat}
              color="#ffffff"
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        </>
      )}

      <group ref={rig}>
        {/* legs */}
        <group ref={legL} position={[-0.11, 0.36, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.055, 0.2, 4, 10]} />
            <primitive object={mats.dark} attach="material" />
          </mesh>
          <mesh position={[0, -0.31, 0.03]}>
            <boxGeometry args={[0.11, 0.06, 0.16]} />
            <primitive object={mats.dark} attach="material" />
          </mesh>
        </group>
        <group ref={legR} position={[0.11, 0.36, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.055, 0.2, 4, 10]} />
            <primitive object={mats.dark} attach="material" />
          </mesh>
          <mesh position={[0, -0.31, 0.03]}>
            <boxGeometry args={[0.11, 0.06, 0.16]} />
            <primitive object={mats.dark} attach="material" />
          </mesh>
        </group>

        {/* torso */}
        <group ref={torso} position={[0, 0, 0]}>
          <RoundedBox args={[0.4, 0.5, 0.28]} radius={0.09} smoothness={4} position={[0, 0.62, 0]}>
            <primitive object={mats.shell} attach="material" />
          </RoundedBox>
          <mesh position={[0, 0.66, 0.145]}>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
            <meshStandardMaterial
              ref={chest}
              color="#0a0a0a"
              emissive={spec.accent === "blue" ? "#4d9fff" : "#ff8a2b"}
              emissiveIntensity={1.8}
            />
          </mesh>
          {/* waist */}
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.09, 0.11, 0.1, 12]} />
            <primitive object={mats.dark} attach="material" />
          </mesh>
        </group>

        {/* arms */}
        <group ref={armL} position={[-0.255, 0.8, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.05, 0.24, 4, 10]} />
            <primitive object={mats.shell} attach="material" />
          </mesh>
          <mesh position={[0, -0.33, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <primitive object={mats.dark} attach="material" />
          </mesh>
        </group>
        <group ref={armR} position={[0.255, 0.8, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.05, 0.24, 4, 10]} />
            <primitive object={mats.shell} attach="material" />
          </mesh>
          <mesh position={[0, -0.33, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <primitive object={mats.dark} attach="material" />
          </mesh>
        </group>

        {/* head */}
        <group ref={head} position={[0, 1.04, 0]}>
          <RoundedBox args={[0.3, 0.24, 0.26]} radius={0.08} smoothness={4}>
            <primitive object={mats.shell} attach="material" />
          </RoundedBox>
          <mesh position={[0, 0.01, 0.128]}>
            <boxGeometry args={[0.2, 0.07, 0.015]} />
            <meshStandardMaterial ref={visor} color="#0a0f16" emissive={visorEmissive} emissiveIntensity={2.1} />
          </mesh>
          {/* antenna */}
          <mesh position={[0.1, 0.17, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 6]} />
            <primitive object={mats.dark} attach="material" />
          </mesh>
          <mesh position={[0.12, 0.26, 0]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial
              ref={tip}
              color="#0a0a0a"
              emissive={spec.accent === "blue" ? "#4d9fff" : "#ff8a2b"}
              emissiveIntensity={2.4}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Tiny helper — micro ground flash for quick arrivals. */
function smoothFlash(local: number) {
  const rise = seg(local, 0, 0.14);
  const fall = seg(local, 0.14, 0.5);
  return rise * (1 - fall) * 0.55;
}
