"use client";

import { useRef, type RefObject } from "react";
import { ARRIVAL } from "@/lib/animations/arrival";
import {
  EYE_L,
  EYE_R,
  ELBOW_L,
  ELBOW_R,
  HIP_L,
  HIP_R,
  KNEE_L,
  KNEE_R,
  NECK,
  SHO_L,
  SHO_R,
  RobotFigure,
  useRobotParts,
  type RobotParts,
} from "./RobotFigure";
import { IMPACT, SIT_P, HERO_BENCH, type BotSpec } from "./roster";
import { useSceneUpdater } from "./SceneCtx";
import { easeOutCubic, flicker, lerp, seg } from "./util";

const DIGITAL_K = (p: number) => seg(p, 0.8, 0.86);

/** Bench seat top sits 30 units above the bench ground line. */
const SEAT_OFF = -30;

type Pose = {
  bob?: number;
  sqX?: number;
  sqY?: number;
  rot?: number;
  legL?: number;
  legR?: number;
  kneeL?: number;
  kneeR?: number;
  armL?: number;
  armR?: number;
  elbowL?: number;
  elbowR?: number;
  head?: number;
};

const POSE_KEYS: (keyof Pose)[] = [
  "bob", "sqX", "sqY", "rot",
  "legL", "legR", "kneeL", "kneeR",
  "armL", "armR", "elbowL", "elbowR", "head",
];

function blendPose(a: Pose, b: Pose, k: number): Pose {
  const out: Pose = {};
  for (const key of POSE_KEYS) {
    // scale channels are identity-1 (a missing value must not shrink to 0)
    const dz = key === "sqX" || key === "sqY" ? 1 : 0;
    out[key] = lerp(a[key] ?? dz, b[key] ?? dz, k);
  }
  return out;
}

/** Relaxed seated pose (hips forward, shins down, hands resting). */
const SIT: Pose = {
  legL: -84, legR: -77, kneeL: 86, kneeR: 92,
  armL: -10, armR: 10, elbowL: 14, elbowR: 14,
};

/** Seated-at-a-desk pose (hunched to the task). */
function deskSit(seed: number): Pose {
  return {
    legL: -84, legR: -77, kneeL: 88, kneeR: 94,
    armL: -48, armR: -52, elbowL: 58, elbowR: 62,
    head: -3,
    bob: 0.8 * Math.sin(seed),
  };
}

/** Apply a pose to the robot's limbs (rotate around their pivots). */
function setPose(parts: RefObject<RobotParts>, o: Pose) {
  const p = parts.current;
  if (p.body)
    p.body.setAttribute(
      "transform",
      `translate(0 ${(o.bob ?? 0).toFixed(2)}) rotate(${(o.rot ?? 0).toFixed(2)}) scale(${(o.sqX ?? 1).toFixed(3)} ${(o.sqY ?? 1).toFixed(3)})`
    );
  if (p.legL)
    p.legL.setAttribute("transform", `rotate(${(o.legL ?? 0).toFixed(2)} ${HIP_L.x} ${HIP_L.y})`);
  if (p.legR)
    p.legR.setAttribute("transform", `rotate(${(o.legR ?? 0).toFixed(2)} ${HIP_R.x} ${HIP_R.y})`);
  if (p.kneeL)
    p.kneeL.setAttribute("transform", `rotate(${(o.kneeL ?? 0).toFixed(2)} ${KNEE_L.x} ${KNEE_L.y})`);
  if (p.kneeR)
    p.kneeR.setAttribute("transform", `rotate(${(o.kneeR ?? 0).toFixed(2)} ${KNEE_R.x} ${KNEE_R.y})`);
  if (p.armL)
    p.armL.setAttribute("transform", `rotate(${(o.armL ?? 0).toFixed(2)} ${SHO_L.x} ${SHO_L.y})`);
  if (p.armR)
    p.armR.setAttribute("transform", `rotate(${(o.armR ?? 0).toFixed(2)} ${SHO_R.x} ${SHO_R.y})`);
  if (p.elbowL)
    p.elbowL.setAttribute("transform", `rotate(${(o.elbowL ?? 0).toFixed(2)} ${ELBOW_L.x} ${ELBOW_L.y})`);
  if (p.elbowR)
    p.elbowR.setAttribute("transform", `rotate(${(o.elbowR ?? 0).toFixed(2)} ${ELBOW_R.x} ${ELBOW_R.y})`);
  if (p.head)
    p.head.setAttribute("transform", `rotate(${(o.head ?? 0).toFixed(2)} ${NECK.x} ${NECK.y})`);
}

/** Common life: blink + breathing + subtle core pulse. */
function life(parts: RefObject<RobotParts>, t: number, phase: number, eyesOn = 1) {
  const p = parts.current;
  const k = (t + phase * 1.37) % 3.4;
  const blink = k < 0.13 ? Math.sin((Math.PI * k) / 0.13) : 0;
  const es = (1 - 0.92 * blink).toFixed(3);
  if (p.eyeL)
    p.eyeL.setAttribute(
      "transform",
      `translate(${EYE_L.x} ${EYE_L.y}) scale(1 ${es}) translate(${-EYE_L.x} ${-EYE_L.y})`
    );
  if (p.eyeR)
    p.eyeR.setAttribute(
      "transform",
      `translate(${EYE_R.x} ${EYE_R.y}) scale(1 ${es}) translate(${-EYE_R.x} ${-EYE_R.y})`
    );
  if (p.torso)
    p.torso.setAttribute(
      "transform",
      `scale(1 ${(1 + 0.012 * Math.sin(t * 1.8 + phase)).toFixed(4)})`
    );
  if (p.coreGlow)
    p.coreGlow.setAttribute(
      "opacity",
      (eyesOn * (0.11 + 0.07 * Math.sin(t * 2.4 + phase))).toFixed(3)
    );
  if (p.coreGlow2)
    p.coreGlow2.setAttribute(
      "opacity",
      (eyesOn * (0.24 + 0.1 * Math.sin(t * 2.4 + phase))).toFixed(3)
    );
}

/** Run cycle shared by dribble/run (lean, scissor legs, pumping arms). */
function runCycle(t: number, speed: number, amp: number): Pose {
  const s = Math.sin(t * speed);
  const c = Math.sin(t * speed + Math.PI);
  return {
    bob: -Math.abs(s) * 2.6,
    rot: -amp * 0.22,
    legL: -s * amp,
    legR: s * amp,
    kneeL: Math.max(0, c) * amp * 1.15 + 6,
    kneeR: Math.max(0, s) * amp * 1.15 + 6,
    armL: -s * amp * 0.85,
    armR: s * amp * 0.85,
    elbowL: 16 + Math.max(0, -s) * 14,
    elbowR: 16 + Math.max(0, s) * 14,
    head: 2 * Math.sin(t * speed * 0.5),
  };
}

function Ball({
  ballRef,
  r,
  accent,
}: {
  ballRef: RefObject<SVGGElement | null>;
  r: number;
  accent: string;
}) {
  return (
    <g ref={ballRef} transform="translate(34 -8)" opacity={0}>
      <ellipse cx={0} cy={r + 2.5} rx={r * 0.9} ry={2.2} fill="#000" opacity={0.18} />
      <circle r={r} fill="#f4f7fb" stroke="#c9d4e2" strokeWidth={1} />
      <path d={`M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0`} fill="none" stroke={accent} strokeWidth={1.8} />
      <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.28} fill="#fff" opacity={0.85} />
    </g>
  );
}

/** The FIRST AGENT — sky-drop arrival, boot sequence, patrol, bench finale. */
export function HeroRobot2D() {
  const rootRef = useRef<SVGGElement>(null);
  const parts = useRobotParts(rootRef);
  const phase = 1.7;
  const sitFrom = useRef<{ x: number; y: number } | null>(null);

  useSceneUpdater((p, t) => {
    const root = rootRef.current;
    if (!root) return;
    const local = seg(p, ARRIVAL.from, ARRIVAL.from + ARRIVAL.span);
    const appear = seg(local, ARRIVAL.dropStart - 0.015, ARRIVAL.dropStart + 0.045);
    if (local <= 0 || appear <= 0) {
      root.setAttribute("opacity", "0");
      return;
    }
    root.setAttribute("opacity", appear.toFixed(3));

    // fall (gravity ease-in), same shape as the 3D drop
    const ft = seg(local, ARRIVAL.dropStart, ARRIVAL.impact);
    const h = 560 * (1 - ft * ft);
    const grounded = ft >= 1;
    const py0 = IMPACT.y - h;

    // walk blend into the meadow lane
    const wb = easeOutCubic(seg(p, 0.545, 0.6));
    const calm = DIGITAL_K(p);
    const amp = 24 * (1 - 0.7 * calm);
    const patrolX = 560 - 45 * Math.cos(t * 0.4);
    const dir = Math.sin(t * 0.4) >= 0 ? 1 : -1;
    const walkLeg = Math.sin(t * 5) * amp * wb;
    const px0 = lerp(IMPACT.x, patrolX, wb);

    // bench finale: blend from patrol to the center seat
    const sitK = easeOutCubic(seg(p, 0.757, 0.79));
    if (sitK > 0 && !sitFrom.current) sitFrom.current = { x: px0, y: py0 };
    const sf = sitFrom.current;
    const seatY = HERO_BENCH.y + SEAT_OFF + 58;
    const px = sf ? lerp(sf.x, HERO_BENCH.x, sitK) : px0;
    const py = sf ? lerp(sf.y, seatY, sitK) : py0;
    const face = lerp(1, dir, wb) * lerp(1, 1, sitK);

    root.setAttribute(
      "transform",
      `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${face.toFixed(3)} 1)`
    );

    // impact squash & recover
    const c = seg(local, ARRIVAL.impact, ARRIVAL.impact + 0.1);
    const sq = grounded ? Math.sin(Math.PI * c) : 0;
    const walkPose: Pose = {
      bob: grounded ? -Math.abs(Math.sin(t * 5)) * 3 * wb : 0,
      sqX: 1 + 0.16 * sq,
      sqY: 1 - 0.22 * sq,
      rot: grounded ? 0 : 5 * Math.sin(local * 24) * (1 - ft),
      legL: grounded ? walkLeg : -12,
      legR: grounded ? -walkLeg : 14,
      kneeL: grounded ? Math.max(0, -Math.sin(t * 5)) * amp * 0.9 * wb : 8,
      kneeR: grounded ? Math.max(0, Math.sin(t * 5)) * amp * 0.9 * wb : 10,
      armL: grounded ? lerp(-14, -walkLeg * 0.7, wb) : lerp(-150, -20, seg(ft, 0.82, 1)),
      armR: grounded ? lerp(14, walkLeg * 0.7, wb) : lerp(150, 20, seg(ft, 0.82, 1)),
      elbowL: grounded ? 8 * wb : 0,
      elbowR: grounded ? 8 * wb : 0,
      head: grounded ? 2 * Math.sin(t * 0.9) : -6,
    };
    const sitPose: Pose = {
      ...SIT,
      head: 4 * Math.sin(t * 0.55 + 1),
      armR: 10 + 2 * Math.sin(t * 1.2),
    };
    setPose(parts, blendPose(walkPose, sitPose, sitK));

    // boot flicker → eyes/core online
    const pt = parts.current;
    const ig = seg(local, ARRIVAL.ignite, ARRIVAL.ignite + 0.09);
    const eyesOn = ig >= 1 ? 1 : ig <= 0 ? 0 : flicker(local, 5, 60) * ig;
    const eyeO = Math.max(0.05, eyesOn).toFixed(3);
    if (pt.eyeL) pt.eyeL.setAttribute("fill-opacity", eyeO);
    if (pt.eyeR) pt.eyeR.setAttribute("fill-opacity", eyeO);
    if (pt.core) pt.core.setAttribute("opacity", (0.15 + 0.85 * ig).toFixed(3));
    if (pt.tipGlow)
      pt.tipGlow.setAttribute(
        "opacity",
        (0.2 + 0.6 * ig * (0.5 + 0.5 * Math.sin(t * 3.1))).toFixed(3)
      );

    // head scan right → left → center right after boot
    if (pt.head) {
      const hs = seg(local, ARRIVAL.ignite + 0.02, ARRIVAL.ignite + 0.15);
      const scan =
        hs >= 1
          ? 0
          : hs < 0.4
            ? -14 * easeOutCubic(seg(hs, 0, 0.4))
            : hs < 0.72
              ? lerp(-14, 10, seg(hs, 0.4, 0.72))
              : lerp(10, 0, seg(hs, 0.72, 1));
      if (grounded && hs < 1 && sitK <= 0)
        pt.head.setAttribute(
          "transform",
          `rotate(${(scan + 2 * Math.sin(t * 0.9)).toFixed(2)} ${NECK.x} ${NECK.y})`
        );
    }

    // ground shadow + touchdown ripple ring
    if (pt.shadow) {
      const k = grounded ? 1 : 1 - (h / 560) * 0.55;
      pt.shadow.setAttribute("opacity", (0.4 * k * (1 - sitK)).toFixed(3));
      pt.shadow.setAttribute("rx", (30 * k).toFixed(1));
    }
    if (pt.ring) {
      const ik = seg(local, ARRIVAL.impact, ARRIVAL.impact + 0.14);
      pt.ring.setAttribute("r", (16 + 74 * easeOutCubic(ik)).toFixed(1));
      pt.ring.setAttribute("opacity", ik > 0 && ik < 1 ? (0.85 * (1 - ik)).toFixed(3) : "0");
    }

    life(parts, t, phase, Math.max(0.06, eyesOn));
  });

  return <RobotFigure accent="#5ea8ff" rootRef={rootRef} v={{ head: "crest", antenna: "whip", pack: true }} />;
}

/** A society agent — staggered spawn, vignette behavior, bench finale. */
export function Bot2D({ spec }: { spec: BotSpec }) {
  const rootRef = useRef<SVGGElement>(null);
  const wrapRef = useRef<SVGGElement>(null);
  const ballRef = useRef<SVGGElement | null>(null);
  const parts = useRobotParts(rootRef);
  const phase = (spec.x * 0.013) % 6.28;
  const sitFrom = useRef<{ x: number; y: number; face: number } | null>(null);

  useSceneUpdater((p, t) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const sk = seg(p, spec.spawn, spec.spawn + 0.045);
    if (sk <= 0) {
      wrap.setAttribute("opacity", "0");
      return;
    }
    wrap.setAttribute("opacity", "1");
    const inner = rootRef.current;
    if (inner) inner.setAttribute("opacity", "1");

    // spawn pop (gentle mechanical overshoot) + ripple
    const back = 1 + 2.2 * Math.pow(sk - 1, 3) + 1.4 * Math.pow(sk - 1, 2);
    const pop = Math.max(0.001, back);
    const calm = DIGITAL_K(p);

    // ---- behavior: position + pose (pre-bench) ----
    let bx = spec.x;
    let by = spec.y;
    let face = spec.face ?? 1;
    let pose: Pose = {};
    let ball: ((g: SVGGElement) => void) | null = null;

    switch (spec.behavior) {
      case "code": {
        by = spec.y - 26 + 58 * spec.s; // seated on the stool
        pose = {
          ...deskSit(phase),
          bob: 1 * Math.sin(t * 1.7 + phase),
          armL: -50 + 2.5 * Math.sin(t * 9),
          armR: -53 + 2.5 * Math.sin(t * 11 + 1.3),
          elbowL: 55,
          elbowR: 58,
          head: -4 + 1.5 * Math.sin(t * 0.6),
        };
        break;
      }
      case "dribble": {
        bx = spec.x + 20 * Math.sin(t * 0.9 + phase);
        pose = runCycle(t + phase, 7, 34 * (1 - 0.6 * calm));
        const bb = Math.abs(Math.sin(t * 7 + phase));
        ball = (g) =>
          g.setAttribute(
            "transform",
            `translate(36 ${(-8 - bb * 15).toFixed(1)}) scale(${(1 + (1 - bb) * 0.18).toFixed(3)} ${(1 - (1 - bb) * 0.22).toFixed(3)})`
          );
        break;
      }
      case "run": {
        const cyc = t * 0.55 + phase;
        bx = spec.x + 70 * Math.sin(cyc);
        face = Math.cos(cyc) >= 0 ? 1 : -1;
        pose = runCycle(t + phase, 8.5, 42 * (1 - 0.6 * calm));
        break;
      }
      case "kick": {
        const T = 2.6;
        const k = ((t + phase) % T) / T;
        const swing = seg(k, 0.3, 0.42);
        const rec = seg(k, 0.42, 0.85);
        pose = {
          bob: 3 * (1 - rec) * (k > 0.25 && k < 0.5 ? 1 : 0.4),
          rot: lerp(-6 * (k > 0.25 && k < 0.42 ? 1 : 0), 4, swing) * (1 - rec),
          legL: lerp(-14 * (1 - rec), 8, swing),
          legR: lerp(30 * (1 - rec), -74, swing) * (1 - rec) + (k >= 0.85 ? 0 : 0),
          kneeL: 18 * (1 - rec),
          kneeR: lerp(30 * (1 - rec), 8, swing),
          armL: lerp(-20, -64, swing) * (1 - rec),
          armR: lerp(20, 46, swing) * (1 - rec),
          elbowL: 14,
          elbowR: 14,
          head: -3 * (1 - rec),
        };
        const u = seg(k, 0.42, 0.86); // flight (a pass toward the dribbler)
        const back = seg(k, 0.88, 1); // cartoon roll-back
        ball = (g) => {
          if (u <= 0) g.setAttribute("transform", "translate(44 -9)");
          else if (u < 1)
            g.setAttribute(
              "transform",
              `translate(${(44 - 170 * u).toFixed(1)} ${(-9 - 110 * Math.sin(Math.PI * u)).toFixed(1)}) rotate(${(u * 360).toFixed(0)})`
            );
          else
            g.setAttribute(
              "transform",
              `translate(${(44 - 170 * (1 - back)).toFixed(1)} ${(-9 - 14 * Math.sin(Math.PI * back)).toFixed(1)})`
            );
        };
        break;
      }
      case "juggle": {
        const bb = Math.abs(Math.sin(t * 3.4 + phase));
        pose = {
          bob: -bb * 4,
          armL: -36 + 4 * Math.sin(t * 2 + phase),
          armR: 36 - 4 * Math.sin(t * 2 + phase),
          elbowL: 10,
          elbowR: 10,
          head: 3 * Math.sin(t * 3.4 + phase),
          kneeL: 6 + bb * 8,
          kneeR: 6 + bb * 8,
        };
        ball = (g) =>
          g.setAttribute("transform", `translate(0 ${(-204 - (1 - bb) * 34).toFixed(1)})`);
        break;
      }
      case "lanA": {
        by = spec.y - 26 + 58 * spec.s;
        pose = {
          ...deskSit(phase),
          rot: -5,
          armL: -55 + 1.5 * Math.sin(t * 13),
          armR: -58 + 1.5 * Math.sin(t * 15 + 1),
          elbowL: 72,
          elbowR: 76,
          head: -3 + Math.sin(t * 17) * 0.8,
        };
        break;
      }
      case "lanB": {
        by = spec.y - 26 + 58 * spec.s;
        const T = 3.8;
        const k = ((t + phase) % T) / T;
        const rage =
          seg(k, 0.04, 0.14) * (1 - seg(k, 0.34, 0.5));
        pose = {
          ...deskSit(phase),
          bob: -2.5 * rage,
          armL: lerp(-48, -138, rage) + 2 * Math.sin(t * 6) * rage,
          armR: lerp(-50, 138, rage) - 2 * Math.sin(t * 6 + 1) * rage,
          elbowL: lerp(60, -16, rage),
          elbowR: lerp(64, -16, rage),
          head: lerp(-2 + 1.5 * Math.sin(t * 1.3), -9, rage),
        };
        break;
      }
      case "lanC": {
        by = spec.y - 26 + 58 * spec.s;
        pose = {
          legL: -84,
          legR: -77,
          kneeL: 88,
          kneeR: 90 + 9 * Math.abs(Math.sin(t * 4.6 + phase)), // foot bop
          armL: -38,
          armR: -146,
          elbowL: 52,
          elbowR: -56, // hands behind head
          head: 6 + 2 * Math.sin(t * 1.1 + phase),
          bob: 1.2 * Math.sin(t * 1.4 + phase),
        };
        break;
      }
    }

    // ---- bench finale blend ----
    const sitK = easeOutCubic(seg(p, SIT_P, SIT_P + 0.035));
    if (sitK > 0 && !sitFrom.current) sitFrom.current = { x: bx, y: by, face };
    const sf = sitFrom.current;
    const sEff = spec.s * (1 - 0.13 * sitK); // tuck in slightly on the seat
    const seatY = spec.bench.y + SEAT_OFF + 58 * sEff;
    const fx = sf ? lerp(sf.x, spec.bench.x, sitK) : bx;
    const fy = sf ? lerp(sf.y, seatY, sitK) : by;
    const fFace = sf ? lerp(sf.face, 1, sitK) : face;

    let finalPose = pose;
    if (sitK > 0) {
      const wave =
        spec.id === "juggler" || spec.id === "lanB"
          ? Math.pow(Math.max(0, Math.sin(t * 1.4 + phase)), 6)
          : 0;
      const sitPose: Pose = {
        ...SIT,
        bob: 1 * Math.sin(t * 1.5 + phase),
        head: 4 * Math.sin(t * 0.55 + phase),
      };
      finalPose = blendPose(pose, sitPose, sitK);
      if (wave > 0) {
        finalPose.armR = lerp(finalPose.armR ?? 0, -118 + 10 * Math.sin(t * 7), wave);
        finalPose.elbowR = lerp(finalPose.elbowR ?? 0, -28, wave);
        finalPose.head = (finalPose.head ?? 0) + 3 * wave;
      }
    }

    const s = Math.max(0.001, sEff * pop);
    wrap.setAttribute(
      "transform",
      `translate(${fx.toFixed(1)} ${fy.toFixed(1)}) scale(${(s * fFace).toFixed(3)} ${s.toFixed(3)})`
    );

    const pt = parts.current;
    if (pt.ring) {
      pt.ring.setAttribute("r", (16 + 52 * easeOutCubic(sk)).toFixed(1));
      pt.ring.setAttribute("opacity", sk < 1 ? (0.8 * (1 - sk)).toFixed(3) : "0");
    }
    if (pt.shadow) {
      const shK = sitK > 0 ? Math.max(0, 1 - sitK * 1.4) : 1;
      pt.shadow.setAttribute("opacity", (0.35 * shK).toFixed(3));
    }
    if (ball && ballRef.current) {
      ballRef.current.setAttribute("opacity", (1 - sitK).toFixed(2));
      ball(ballRef.current);
    } else if (ballRef.current) {
      ballRef.current.setAttribute("opacity", "0");
    }
    setPose(parts, finalPose);
    life(parts, t, phase);
  });

  const ballSpec =
    spec.behavior === "dribble"
      ? { r: 7, accent: spec.accent }
      : spec.behavior === "kick"
        ? { r: 8, accent: spec.accent }
        : spec.behavior === "juggle"
          ? { r: 6, accent: spec.accent }
          : null;

  return (
    <g ref={wrapRef} opacity={0}>
      <RobotFigure accent={spec.accent} rootRef={rootRef} v={spec.v} />
      {ballSpec && <Ball ballRef={ballRef} r={ballSpec.r} accent={ballSpec.accent} />}
    </g>
  );
}
