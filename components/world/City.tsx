"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { seg, easeOutCubic, damp } from "@/lib/animations/easing";
import { createWindowTexture, createRadialShadowTexture } from "@/lib/three/textures";
import { WORLD_QUALITY, type Tier } from "@/lib/three/quality";

type BuildingDef = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  variant: "blue" | "orange" | "mixed";
  antenna?: boolean;
};

const BUILDINGS: BuildingDef[] = [
  { x: -8, z: -6, w: 2.2, d: 2.2, h: 5, variant: "blue" },
  { x: -11, z: -2, w: 2.6, d: 2.6, h: 8, variant: "mixed", antenna: true },
  { x: -9, z: 3, w: 2.0, d: 2.0, h: 3.5, variant: "orange" },
  { x: -5, z: 8, w: 2.4, d: 2.4, h: 6, variant: "blue" },
  { x: 0.5, z: 10.5, w: 3.0, d: 2.4, h: 9, variant: "blue", antenna: true },
  { x: 5, z: 8.5, w: 2.2, d: 2.2, h: 4.5, variant: "mixed" },
  { x: 9, z: 5, w: 2.6, d: 2.6, h: 7, variant: "orange" },
  { x: 11, z: 0, w: 2.0, d: 2.0, h: 3, variant: "blue" },
  { x: 9.5, z: -4.5, w: 2.4, d: 2.4, h: 5.5, variant: "blue" },
  { x: 5.5, z: -8.5, w: 2.2, d: 2.2, h: 4, variant: "mixed" },
  { x: 0.5, z: -10, w: 2.8, d: 2.4, h: 6.5, variant: "blue" },
  { x: -4.5, z: -9, w: 2.0, d: 2.0, h: 3, variant: "orange" },
  { x: -13, z: 6, w: 1.8, d: 1.8, h: 2.8, variant: "blue" },
  { x: 13, z: -8, w: 2.0, d: 2.0, h: 3.6, variant: "blue" },
];

function useDampedProgress(progressRef: MutableRefObject<number>, staticP: number | null) {
  const p = useRef(0);
  useFrame((_, dt) => {
    p.current = damp(p.current, staticP ?? progressRef.current, 3.5, dt);
  });
  return p;
}

function Buildings({
  count,
  progressRef,
  staticP,
}: {
  count: number;
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const p = useDampedProgress(progressRef, staticP);
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const matRefs = useRef<THREE.MeshStandardMaterial[]>([]);

  const textures = useMemo(
    () => ({
      blue: createWindowTexture("blue", 11),
      orange: createWindowTexture("orange", 23),
      mixed: createWindowTexture("mixed", 37),
    }),
    []
  );

  const list = useMemo(() => BUILDINGS.slice(0, count), [count]);
  const starts = useMemo(
    () => list.map((_, i) => 0.13 + (i / Math.max(list.length - 1, 1)) * 0.26),
    [list]
  );

  useFrame(() => {
    for (let i = 0; i < list.length; i++) {
      const g = groupRefs.current[i];
      if (!g) continue;
      const local = seg(p.current, starts[i], starts[i] + 0.07);
      g.visible = local > 0.001;
      if (!g.visible) continue;
      if (g.userData.done && local >= 1) continue;
      const e = easeOutCubic(local);
      g.scale.y = Math.max(e, 0.001);
      const m = matRefs.current[i];
      if (m) m.emissiveIntensity = 1.45 * e;
      g.userData.done = local >= 1;
    }
  });

  return (
    <group>
      {list.map((b, i) => (
        <group
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={[b.x, 0, b.z]}
        >
          <mesh position={[0, b.h / 2, 0]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) matRefs.current[i] = m;
              }}
              color="#0c1017"
              roughness={0.85}
              metalness={0.15}
              emissive="#ffffff"
              emissiveMap={textures[b.variant]}
              emissiveIntensity={0}
            />
          </mesh>
          <mesh position={[0, b.h + 0.03, 0]}>
            <boxGeometry args={[b.w * 1.05, 0.07, b.d * 1.05]} />
            <meshStandardMaterial color="#04060a" roughness={0.9} />
          </mesh>
          {b.antenna && (
            <group position={[0, b.h + 0.06, 0]}>
              <mesh position={[0, 0.55, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 1.1, 6]} />
                <meshStandardMaterial color="#1a2230" roughness={0.6} />
              </mesh>
              <Blinker />
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

function Blinker() {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    const m = mat.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.emissiveIntensity = Math.sin(t * 2.2) > 0.2 ? 2.4 : 0.25;
  });
  return (
    <mesh position={[0, 1.15, 0]}>
      <sphereGeometry args={[0.045, 10, 10]} />
      <meshStandardMaterial
        ref={mat}
        color="#201005"
        emissive="#ff8a2b"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

function Pylon({
  position,
  accent,
  appearAt,
  progressRef,
  staticP,
}: {
  position: [number, number, number];
  accent: "blue" | "orange";
  appearAt: number;
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const p = useDampedProgress(progressRef, staticP);
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const e = easeOutCubic(seg(p.current, appearAt, appearAt + 0.06));
    g.visible = e > 0.001;
    g.scale.setScalar(Math.max(e, 0.001));
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.09, 1.6, 0.09]} />
        <meshStandardMaterial color="#151b26" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.68, 0]}>
        <sphereGeometry args={[0.085, 12, 12]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive={accent === "blue" ? "#7fd0ff" : "#ff8a2b"}
          emissiveIntensity={2.6}
        />
      </mesh>
    </group>
  );
}

function Beam({
  position,
  color,
  progressRef,
  staticP,
}: {
  position: [number, number, number];
  color: string;
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const p = useDampedProgress(progressRef, staticP);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = mat.current;
    const mesh = ref.current;
    if (!m || !mesh) return;
    const appear = seg(p.current, 0.34, 0.44);
    mesh.visible = appear > 0.01;
    m.opacity = appear * (0.05 + 0.028 * Math.sin(state.clock.elapsedTime * 1.7 + position[0]));
  });
  return (
    <mesh ref={ref} position={[position[0], 12, position[2]]}>
      <cylinderGeometry args={[0.42, 0.55, 24, 12, 1, true]} />
      <meshBasicMaterial
        ref={mat}
        color={color}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** Structures that belong to the "built world" chapter — hidden until then. */
function GatedStructures({
  progressRef,
  staticP,
  children,
}: {
  progressRef: MutableRefObject<number>;
  staticP: number | null;
  children: React.ReactNode;
}) {
  const p = useDampedProgress(progressRef, staticP);
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const e = easeOutCubic(seg(p.current, 0.28, 0.38));
    g.visible = e > 0.001;
  });
  return <group ref={ref}>{children}</group>;
}

function Terminal() {
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    const m = screen.current;
    if (!m) return;
    m.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 13) * 0.35;
  });
  return (
    <group position={[2.25, 0, 1.15]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.5, 0.9, 0.4]} />
        <meshStandardMaterial color="#12161f" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.02, 0.02]} rotation={[-0.42, Math.PI, 0]}>
        <boxGeometry args={[0.44, 0.3, 0.02]} />
        <meshStandardMaterial
          ref={screen}
          color="#05070b"
          emissive="#4d9fff"
          emissiveIntensity={1.6}
        />
      </mesh>
    </group>
  );
}

function Platform({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.85, 0.95, 0.5, 24]} />
        <meshStandardMaterial color="#10151d" roughness={0.7} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.505, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.012, 8, 48]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#4d9fff" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

/** The built world: ground, grid, plaza, buildings, paths, props. */
export default function City({
  tier,
  progressRef,
  staticP,
}: {
  tier: Tier;
  progressRef: MutableRefObject<number>;
  staticP: number | null;
}) {
  const q = WORLD_QUALITY[tier];
  const shadowTex = useMemo(() => createRadialShadowTexture(), []);
  const ringMat = useRef<THREE.MeshStandardMaterial>(null);
  const stripMat = useRef<THREE.MeshStandardMaterial>(null);
  const shadowMat = useRef<THREE.MeshBasicMaterial>(null);
  const gridRef = useRef<THREE.Group>(null);
  const plazaRef = useRef<THREE.Group>(null);
  const p = useDampedProgress(progressRef, staticP);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const prog = p.current;
    const plazaE = easeOutCubic(seg(prog, 0.1, 0.2));
    if (plazaRef.current) plazaRef.current.visible = plazaE > 0.001;
    if (ringMat.current) {
      const digital = seg(prog, 0.85, 1);
      ringMat.current.emissiveIntensity =
        1.1 * plazaE + digital * (1.4 + Math.sin(t * 2.4) * 0.8);
    }
    if (stripMat.current) stripMat.current.emissiveIntensity = 1.1 * easeOutCubic(seg(prog, 0.16, 0.3));
    if (shadowMat.current) shadowMat.current.opacity = seg(prog, 0.13, 0.3) * 0.62;
    if (gridRef.current) gridRef.current.visible = q.grid && prog > 0.05;
  });

  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[70, 48]} />
        <meshStandardMaterial color="#06080d" roughness={1} metalness={0} />
      </mesh>

      {/* fake contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <circleGeometry args={[16, 32]} />
        <meshBasicMaterial
          ref={shadowMat}
          map={shadowTex}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* tech grid */}
      <group ref={gridRef}>
        {q.grid && (
          <Grid
            infiniteGrid
            cellSize={0.9}
            sectionSize={4.5}
            cellColor="#141c28"
            sectionColor="#24344c"
            cellThickness={0.6}
            sectionThickness={1}
            fadeDistance={52}
            fadeStrength={1.5}
            position={[0, 0.012, 0]}
          />
        )}
      </group>

      {/* central plaza + paths */}
      <group ref={plazaRef}>
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[5.5, 5.5, 0.05, 48]} />
          <meshStandardMaterial color="#0a0e15" roughness={0.85} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.5, 0.02, 8, 96]} />
          <meshStandardMaterial
            ref={ringMat}
            color="#0a0a0a"
            emissive="#4d9fff"
            emissiveIntensity={0}
          />
        </mesh>
        {/* crossing paths */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.1, 0.04, 23]} />
          <meshStandardMaterial color="#0a0e15" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[23, 0.04, 1.1]} />
          <meshStandardMaterial color="#0a0e15" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.1, 0.05, 21]} />
          <meshStandardMaterial
            ref={stripMat}
            color="#0a0a0a"
            emissive="#4d9fff"
            emissiveIntensity={0}
          />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[21, 0.05, 0.1]} />
          <meshStandardMaterial color="#0a0a0a" emissive="#4d9fff" emissiveIntensity={0.9} />
        </mesh>
      </group>

      <Buildings count={q.buildings} progressRef={progressRef} staticP={staticP} />

      <GatedStructures progressRef={progressRef} staticP={staticP}>
        <Platform position={[2.85, 0, -2.5]} />
        <Terminal />
      </GatedStructures>

      <Pylon position={[5.2, 0, 5.2]} accent="blue" appearAt={0.3} progressRef={progressRef} staticP={staticP} />
      <Pylon position={[-5.2, 0, 5.2]} accent="orange" appearAt={0.32} progressRef={progressRef} staticP={staticP} />
      <Pylon position={[5.2, 0, -5.2]} accent="orange" appearAt={0.34} progressRef={progressRef} staticP={staticP} />
      <Pylon position={[-5.2, 0, -5.2]} accent="blue" appearAt={0.36} progressRef={progressRef} staticP={staticP} />

      {q.beams > 0 && <Beam position={[-5.2, 0, 5.2]} color="#4d9fff" progressRef={progressRef} staticP={staticP} />}
      {q.beams > 1 && <Beam position={[5.6, 0, -5.6]} color="#ff8a2b" progressRef={progressRef} staticP={staticP} />}
    </group>
  );
}
