"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  createSoftDotTexture,
  createCrackTexture,
} from "@/lib/three/textures";
import { seg, easeOutCubic, easeOutQuart, smoothstep } from "@/lib/animations/easing";
import { ARRIVAL, dropY } from "@/lib/animations/arrival";
import type { Tier } from "@/lib/three/quality";

/** Deterministic PRNG — the arrival looks identical on every visit. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = Math.imul(t ^ (t >>> 7), 61 ^ (t >>> 14));
    return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
  };
}

const PALETTE = {
  blue: { beam: "#7fb8ff", core: "#eaf4ff", burst: "#bfe0ff", accent: "#4d9fff" },
  orange: { beam: "#ffb36b", core: "#fff1e2", burst: "#ffd9b0", accent: "#ff8a2b" },
} as const;

const ARC_COUNT = 4;

/**
 * Cinematic arrival FX for the first agent — a full "sky-strike summon":
 *
 *   1. CHARGE   — rotating target reticles + contracting energy ring,
 *                 dust spiraling up into the dark
 *   2. BEAM     — a column of light slams down from the sky
 *   3. DROP     — the agent itself falls inside the beam (Titanfall-style),
 *                 trailing light, electric arcs whipping around the column
 *   4. IMPACT   — ground flash, EMP shockwaves racing across the plaza,
 *                 debris burst, dust wave, glowing ground cracks
 *   5. IGNITION — beam collapses upward, boot flicker, systems-stable pulse
 *
 * Everything is driven by scroll progress (deterministic), with small
 * time-based flickers layered on top so the moment feels alive even when
 * the user stops scrolling mid-sequence.
 */
export default function ArrivalFX({
  anchor,
  accent,
  from,
  span,
  progressRef,
  staticP,
  tier,
}: {
  anchor: [number, number, number];
  accent: "blue" | "orange";
  from: number;
  span: number;
  progressRef: MutableRefObject<number>;
  staticP: number | null;
  tier: Tier;
}) {
  const c = PALETTE[accent];
  const group = useRef<THREE.Group>(null);

  // beam
  const beam = useRef<THREE.Group>(null);
  const beamOuter = useRef<THREE.MeshBasicMaterial>(null);
  const beamCore = useRef<THREE.MeshBasicMaterial>(null);
  // fall streak (column above the falling agent)
  const streak = useRef<THREE.Mesh>(null);
  const streakMat = useRef<THREE.MeshBasicMaterial>(null);
  // glow sprite riding the falling agent
  const glow = useRef<THREE.Sprite>(null);
  const glowMat = useRef<THREE.SpriteMaterial>(null);
  // reticle + charge
  const retA = useRef<THREE.Mesh>(null);
  const retB = useRef<THREE.Mesh>(null);
  const retMat = useRef<THREE.MeshBasicMaterial>(null);
  const retBMat = useRef<THREE.MeshBasicMaterial>(null);
  const charge = useRef<THREE.Mesh>(null);
  const chargeMat = useRef<THREE.MeshBasicMaterial>(null);
  // impact
  const flashMat = useRef<THREE.MeshBasicMaterial>(null);
  const waves = useRef<(THREE.Mesh | null)[]>([null, null, null]);
  const waveMats = useRef<(THREE.MeshBasicMaterial | null)[]>([null, null, null]);
  const pulseRing = useRef<THREE.Mesh>(null);
  const pulseMat = useRef<THREE.MeshBasicMaterial>(null);
  const cracksMat = useRef<THREE.MeshBasicMaterial>(null);
  // particles
  const burst = useRef<THREE.Points>(null);
  const dust = useRef<THREE.Points>(null);
  const wave = useRef<THREE.Points>(null);
  // arcs (objects created in useMemo, mutated only through refs)
  const lineRefs = useRef<(THREE.Line | null)[]>([]);
  // light
  const light = useRef<THREE.PointLight>(null);

  const p = useRef(staticP ?? 0);

  const dotTex = useMemo(() => createSoftDotTexture(64), []);
  const crackTex = useMemo(() => createCrackTexture(7), []);
  useEffect(() => () => {
    dotTex.dispose();
    crackTex.dispose();
  }, [dotTex, crackTex]);

  const burstCount = tier === "high" ? 90 : tier === "medium" ? 48 : 26;
  const dustCount = tier === "high" ? 46 : tier === "medium" ? 28 : 14;
  const waveCount = tier === "high" ? 40 : tier === "medium" ? 26 : 12;

  const { burstGeo, burstVel, dustGeo, dustSeed, waveGeo, waveSeed } = useMemo(() => {
    const rnd = mulberry32(1337);

    const bPos = new Float32Array(burstCount * 3);
    const bVel = new Float32Array(burstCount * 3);
    for (let i = 0; i < burstCount; i++) {
      const dx = rnd() - 0.5;
      const dy = rnd() * 0.85 + 0.2;
      const dz = rnd() - 0.5;
      const len = Math.hypot(dx, dy, dz) || 1;
      const speed = 1.8 + rnd() * 2.8;
      bVel[i * 3] = (dx / len) * speed;
      bVel[i * 3 + 1] = (dy / len) * speed;
      bVel[i * 3 + 2] = (dz / len) * speed;
    }
    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));

    const dPos = new Float32Array(dustCount * 3);
    const dSeed = new Float32Array(dustCount * 3); // angle0, radius, spin
    for (let i = 0; i < dustCount; i++) {
      dSeed[i * 3] = rnd() * Math.PI * 2;
      dSeed[i * 3 + 1] = 0.7 + rnd() * 1.3;
      dSeed[i * 3 + 2] = 3 + rnd() * 3.5;
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));

    const wPos = new Float32Array(waveCount * 3);
    const wSeed = new Float32Array(waveCount * 2); // angle0, radius jitter
    for (let i = 0; i < waveCount; i++) {
      wSeed[i * 2] = rnd() * Math.PI * 2;
      wSeed[i * 2 + 1] = 0.75 + rnd() * 0.5;
    }
    const wGeo = new THREE.BufferGeometry();
    wGeo.setAttribute("position", new THREE.BufferAttribute(wPos, 3));

    return {
      burstGeo: bGeo,
      burstVel: bVel,
      dustGeo: dGeo,
      dustSeed: dSeed,
      waveGeo: wGeo,
      waveSeed: wSeed,
    };
  }, [burstCount, dustCount, waveCount]);

  useEffect(
    () => () => {
      burstGeo.dispose();
      dustGeo.dispose();
      waveGeo.dispose();
    },
    [burstGeo, dustGeo, waveGeo]
  );

  /** Jagged electric arcs hanging around the beam — deterministic shapes. */
  const arcLines = useMemo(() => {
    const rnd = mulberry32(4242);
    const lines: { line: THREE.Line; mat: THREE.LineBasicMaterial }[] = [];
    for (let i = 0; i < ARC_COUNT; i++) {
      const a0 = (i / ARC_COUNT) * Math.PI * 2 + rnd() * 0.8;
      const topR = 0.5 + rnd() * 0.35;
      const botR = 1.15 + rnd() * 0.85;
      const topY = 2.6 + rnd() * 3.4;
      const pts: THREE.Vector3[] = [];
      const SEGS = 7;
      for (let s = 0; s <= SEGS; s++) {
        const t = s / SEGS;
        const r = topR + (botR - topR) * t;
        const a = a0 + Math.sin(t * 6.2 + i) * 0.22 + (rnd() - 0.5) * 0.16;
        pts.push(
          new THREE.Vector3(
            Math.cos(a) * r + (rnd() - 0.5) * 0.1,
            topY * (1 - t),
            Math.sin(a) * r + (rnd() - 0.5) * 0.1
          )
        );
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: c.core,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      });
      lines.push({ line: new THREE.Line(geo, mat), mat });
    }
    return lines;
  }, [c.core]);

  useEffect(
    () => () => {
      arcLines.forEach(({ line, mat }) => {
        line.geometry.dispose();
        mat.dispose();
      });
    },
    [arcLines]
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // damp toward the real progress for butter-smooth scrubbing
    const target = seg(staticP ?? progressRef.current, from, from + span);
    p.current = p.current + (target - p.current) * (1 - Math.exp(-4.5 * Math.max(delta, 0.0001)));
    const local = p.current;
    const t = state.clock.elapsedTime;

    g.visible = local > 0.001 && local < 0.998;
    if (!g.visible) {
      for (let i = 0; i < lineRefs.current.length; i++) {
        const ln = lineRefs.current[i];
        if (ln) ln.visible = false;
      }
      return;
    }
    for (let i = 0; i < lineRefs.current.length; i++) {
      const ln = lineRefs.current[i];
      if (ln) ln.visible = false;
    }

    const impact = ARRIVAL.impact;

    // ---- reticle: two thin rotating target rings marking the landing zone
    if (retMat.current) {
      const ret = seg(local, 0, 0.06) * (1 - seg(local, ARRIVAL.beamInEnd, ARRIVAL.beamInEnd + 0.12));
      retMat.current.opacity = ret * 0.5;
      if (retBMat.current) retBMat.current.opacity = ret * 0.35;
      if (retA.current) retA.current.rotation.z = t * 0.85;
      if (retB.current) retB.current.rotation.z = -t * 0.55;
    }

    // ---- charge ring: energy contracting inward before the strike
    if (charge.current && chargeMat.current) {
      const kc = easeOutQuart(seg(local, 0.02, ARRIVAL.beamInEnd - 0.02));
      charge.current.scale.setScalar(6 - kc * 5.7);
      chargeMat.current.opacity =
        seg(local, 0.02, 0.1) * (1 - seg(local, ARRIVAL.beamInEnd - 0.02, ARRIVAL.beamInEnd + 0.1)) * 0.75;
    }

    // ---- fall progress (shared by beam / streak / glow / arcs / light)
    const dropK = seg(local, ARRIVAL.dropStart, impact);

    // ---- beam: slams down, holds as the drop column, collapses upward
    if (beam.current) {
      const grow = easeOutQuart(seg(local, ARRIVAL.beamIn, ARRIVAL.beamInEnd));
      const collapse = seg(local, ARRIVAL.beamOut, ARRIVAL.beamOutEnd);
      beam.current.scale.y = Math.max(grow * (1 - collapse), 0.001);
      const dropW = seg(local, ARRIVAL.dropStart, ARRIVAL.dropStart + 0.06) * (1 - seg(local, impact - 0.03, impact + 0.05));
      // dim the hot core mid-fall so the agent reads as a silhouette inside the column
      const dropMid = Math.sin(Math.PI * Math.min(Math.max(dropK, 0), 1));
      const flick = 0.86 + Math.sin(t * 29) * 0.14;
      if (beamOuter.current) beamOuter.current.opacity = (0.3 + 0.22 * dropW) * grow * (1 - collapse) * flick;
      if (beamCore.current)
        beamCore.current.opacity = (0.52 + 0.3 * dropW - 0.34 * dropMid) * grow * (1 - collapse) * flick;
    }

    // ---- fall streak: column of light riding above the falling agent
    if (streak.current && streakMat.current) {
      const inDrop = dropK > 0 && dropK < 1;
      streak.current.visible = inDrop;
      if (inDrop) {
        const y = dropY(local);
        const h = Math.max(9.6 - y, 0.2);
        streak.current.position.y = y + h / 2;
        streak.current.scale.set(1, h, 1);
        const fade = seg(local, ARRIVAL.dropStart, ARRIVAL.dropStart + 0.03) * (1 - seg(local, impact - 0.04, impact));
        streakMat.current.opacity = 0.62 * fade;
      }
    }
    if (glow.current && glowMat.current) {
      const inDrop = dropK > 0 && dropK < 1;
      glow.current.visible = inDrop;
      if (inDrop) {
        const y = dropY(local);
        glow.current.position.y = y + 0.55;
        const s = 0.95 + Math.sin(t * 37) * 0.08;
        glow.current.scale.set(s, s, 1);
        glowMat.current.opacity = 0.55 * seg(local, ARRIVAL.dropStart, ARRIVAL.dropStart + 0.03);
      }
    }

    // ---- electric arcs flickering around the column during the drop
    const arcWin =
      seg(local, ARRIVAL.dropStart + 0.02, ARRIVAL.dropStart + 0.1) * (1 - seg(local, impact + 0.05, impact + 0.14));
    for (let i = 0; i < lineRefs.current.length; i++) {
      const ln = lineRefs.current[i];
      if (!ln) continue;
      ln.visible = arcWin > 0.01;
      if (ln.visible) {
        const m = ln.material as THREE.LineBasicMaterial;
        m.opacity = arcWin * (0.38 + 0.62 * Math.abs(Math.sin(t * 21 + i * 2.13)));
      }
    }

    // ---- impact flash: the touchdown frame
    if (flashMat.current) {
      const rise = smoothstep(seg(local, impact - 0.02, impact));
      const fall = seg(local, impact + 0.03, impact + 0.18);
      flashMat.current.opacity = rise * (1 - fall) * 0.95;
    }

    // ---- EMP shockwaves: three staggered rings racing across the plaza
    for (let i = 0; i < 3; i++) {
      const m = waves.current[i];
      const mat = waveMats.current[i];
      if (!m || !mat) continue;
      const k = easeOutCubic(seg(local, impact + i * 0.04, 0.92 + i * 0.04));
      m.scale.setScalar(0.4 + k * 7.1);
      mat.opacity = (1 - k) * (i === 0 ? 0.85 : 0.5);
    }

    // ---- systems-stable pulse after ignition
    if (pulseRing.current && pulseMat.current) {
      const kw = seg(local, ARRIVAL.pulse, ARRIVAL.pulse + 0.2);
      pulseRing.current.visible = kw > 0.001 && kw < 1;
      if (kw > 0.001 && kw < 1) {
        pulseRing.current.scale.setScalar(0.5 + kw * 2);
        pulseMat.current.opacity = (1 - kw) * 0.55;
      }
    }

    // ---- debris burst: particles thrown outward with gravity
    if (burst.current) {
      const tb = seg(local, impact, 0.95);
      const pos = burst.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      if (tb <= 0 || tb >= 1) {
        burst.current.visible = false;
      } else {
        burst.current.visible = true;
        for (let i = 0; i < burstCount; i++) {
          arr[i * 3] = burstVel[i * 3] * tb * 2.3;
          arr[i * 3 + 1] = 0.18 + burstVel[i * 3 + 1] * tb * 2.3 - 3.4 * tb * tb;
          arr[i * 3 + 2] = burstVel[i * 3 + 2] * tb * 2.3;
        }
        pos.needsUpdate = true;
        (burst.current.material as THREE.PointsMaterial).opacity = (1 - tb) * 0.9;
      }
    }

    // ---- summon dust: spirals upward into the beam during the charge
    if (dust.current) {
      const td = seg(local, ARRIVAL.charge, 0.34);
      const pos = dust.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      if (td <= 0 || td >= 1) {
        dust.current.visible = false;
      } else {
        dust.current.visible = true;
        for (let i = 0; i < dustCount; i++) {
          const a0 = dustSeed[i * 3];
          const r0 = dustSeed[i * 3 + 1] * (1 - td * 0.75);
          const spin = dustSeed[i * 3 + 2] * td;
          arr[i * 3] = Math.cos(a0 + spin) * r0;
          arr[i * 3 + 1] = 0.05 + td * 3.6;
          arr[i * 3 + 2] = Math.sin(a0 + spin) * r0;
        }
        pos.needsUpdate = true;
        (dust.current.material as THREE.PointsMaterial).opacity = (1 - td) * 0.55;
      }
    }

    // ---- impact dust wave: ground fog racing outward at touchdown
    if (wave.current) {
      const tw = easeOutCubic(seg(local, impact, impact + 0.34));
      const pos = wave.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      if (tw <= 0 || tw >= 1) {
        wave.current.visible = false;
      } else {
        wave.current.visible = true;
        for (let i = 0; i < waveCount; i++) {
          const a0 = waveSeed[i * 2];
          const r = 0.5 + tw * 3.4 * waveSeed[i * 2 + 1];
          arr[i * 3] = Math.cos(a0) * r;
          arr[i * 3 + 1] = 0.07 + tw * (0.3 + waveSeed[i * 2 + 1] * 0.3);
          arr[i * 3 + 2] = Math.sin(a0) * r;
        }
        pos.needsUpdate = true;
        (wave.current.material as THREE.PointsMaterial).opacity = (1 - tw) * 0.42;
      }
    }

    // ---- ground cracks: glow at impact, slowly cool down
    if (cracksMat.current) {
      const rise = seg(local, impact, impact + 0.04);
      const fade = 1 - seg(local, 0.8, 0.97);
      cracksMat.current.opacity = rise * fade * (0.72 + 0.12 * Math.sin(t * 3.1));
    }

    // ---- transient light: rides the fall, bursts on impact, ignites on boot
    if (light.current) {
      const descent = dropK > 0 && dropK < 1 ? seg(local, ARRIVAL.dropStart, ARRIVAL.dropStart + 0.08) * 11 : 0;
      const impactBurst = smoothstep(seg(local, impact - 0.02, impact)) * (1 - seg(local, impact, impact + 0.16)) * 30;
      const ignite =
        seg(local, ARRIVAL.ignite, ARRIVAL.ignite + 0.1) * (1 - seg(local, ARRIVAL.pulse, ARRIVAL.pulse + 0.16)) *
        13 * (0.7 + Math.sin(t * 24) * 0.3);
      light.current.intensity = descent + impactBurst + ignite;
      const ly = dropK > 0 && dropK < 1 ? dropY(local) + 0.4 : 0.9;
      light.current.position.y = ly;
    }
  });

  return (
    <group ref={group} position={[anchor[0], 0, anchor[2]]} visible={false}>
      {/* sky beam (top-anchored so it grows downward / collapses upward) */}
      <group ref={beam} position={[0, 9.6, 0]}>
        <mesh position={[0, -4.8, 0]} renderOrder={20}>
          <cylinderGeometry args={[0.55, 0.85, 9.6, 24, 1, true]} />
          <meshBasicMaterial
            ref={beamOuter}
            color={c.beam}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, -4.8, 0]} renderOrder={21}>
          <cylinderGeometry args={[0.16, 0.24, 9.6, 16, 1, true]} />
          <meshBasicMaterial
            ref={beamCore}
            color={c.core}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* fall streak above the agent */}
      <mesh ref={streak} renderOrder={24} visible={false}>
        <cylinderGeometry args={[0.34, 0.5, 1, 16, 1, true]} />
        <meshBasicMaterial
          ref={streakMat}
          color={c.core}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* glow sprite riding the falling agent */}
      <sprite ref={glow} renderOrder={25} visible={false}>
        <spriteMaterial
          ref={glowMat}
          map={dotTex}
          color={c.beam}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {/* rotating target reticles */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <mesh ref={retA} renderOrder={18}>
          <ringGeometry args={[1.42, 1.47, 64, 1, 0, Math.PI * 1.55]} />
          <meshBasicMaterial
            ref={retMat}
            color={c.accent}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={retB} renderOrder={18}>
          <ringGeometry args={[1.08, 1.115, 64, 1, 0, Math.PI * 1.2]} />
          <meshBasicMaterial
            ref={retBMat}
            color={c.core}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* contracting charge ring */}
      <mesh ref={charge} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} renderOrder={19}>
        <ringGeometry args={[0.34, 0.46, 48]} />
        <meshBasicMaterial
          ref={chargeMat}
          color={c.accent}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* impact flash disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} renderOrder={22}>
        <circleGeometry args={[1.7, 40]} />
        <meshBasicMaterial
          ref={flashMat}
          color={c.core}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* EMP shockwave rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            waves.current[i] = el;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.06 + i * 0.012, 0]}
          renderOrder={23 + i}
        >
          <ringGeometry args={[0.96, 1.0, 64]} />
          <meshBasicMaterial
            ref={(el) => {
              waveMats.current[i] = el;
            }}
            color={i === 0 ? c.core : c.accent}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* systems-stable pulse ring */}
      <mesh ref={pulseRing} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]} renderOrder={27} visible={false}>
        <ringGeometry args={[0.82, 0.88, 56]} />
        <meshBasicMaterial
          ref={pulseMat}
          color={c.core}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* glowing ground cracks (impact decal) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]} renderOrder={17}>
        <planeGeometry args={[4.4, 4.4]} />
        <meshBasicMaterial
          ref={cracksMat}
          map={crackTex}
          color={c.beam}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* debris burst */}
      <points ref={burst} geometry={burstGeo} frustumCulled={false} renderOrder={26}>
        <pointsMaterial
          size={0.07}
          map={dotTex}
          color={c.burst}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          sizeAttenuation
        />
      </points>

      {/* spiraling summon dust */}
      <points ref={dust} geometry={dustGeo} frustumCulled={false} renderOrder={25}>
        <pointsMaterial
          size={0.055}
          map={dotTex}
          color={c.beam}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          sizeAttenuation
        />
      </points>

      {/* impact dust wave */}
      <points ref={wave} geometry={waveGeo} frustumCulled={false} renderOrder={26}>
        <pointsMaterial
          size={0.085}
          map={dotTex}
          color="#8a93a5"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          sizeAttenuation
        />
      </points>

      {/* electric arcs around the column */}
      {arcLines.map(({ line }, i) => (
        <primitive
          key={i}
          object={line}
          visible={false}
          ref={(el) => {
            lineRefs.current[i] = el as THREE.Line;
          }}
        />
      ))}

      {/* transient impact / descent / ignition light */}
      {tier !== "low" && (
        <pointLight
          ref={light}
          position={[0, 0.9, 0]}
          intensity={0}
          distance={10}
          decay={2}
          color={accent === "blue" ? "#a8ccff" : "#ffc79a"}
        />
      )}
    </group>
  );
}
