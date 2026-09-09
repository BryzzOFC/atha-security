"use client";

import { useMemo, useRef } from "react";
import { ARRIVAL } from "@/lib/animations/arrival";
import { IMPACT } from "./roster";
import { useSceneUpdater } from "./SceneCtx";
import { mulberry32, seg, smoothstep } from "./util";

const G = IMPACT;
const TOP = -90;

/** Debris specs — deterministic. */
function useDebris(n: number, seed: number) {
  return useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({ length: n }, (_, i) => ({
      i,
      a: rnd() * Math.PI * 2,
      v: 40 + rnd() * 130,
      lift: 50 + rnd() * 150,
      size: 2 + rnd() * 4,
      spin: (rnd() - 0.5) * 900,
      warm: rnd() < 0.3,
    }));
  }, [n, seed]);
}

/** Crack polylines — deterministic jagged rays around the impact point. */
function useCracks(n: number, seed: number) {
  return useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + rnd() * 0.5;
      const segs = 3 + Math.floor(rnd() * 2);
      let x = G.x;
      let y = G.y;
      const pts = [`M ${x.toFixed(1)} ${y.toFixed(1)}`];
      for (let s = 0; s < segs; s++) {
        const len = 14 + rnd() * 22;
        x += Math.cos(a + (rnd() - 0.5) * 0.8) * len;
        y += Math.sin(a + (rnd() - 0.5) * 0.8) * len * 0.32;
        pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      return pts.join(" ");
    });
  }, [n, seed]);
}

/**
 * The First Arrival, re-told in flat vector language:
 * reticle → charge dust → sky beam → touchdown (flash, EMP rings, debris,
 * glowing cracks) → beam collapse → systems-stable pulse.
 * Timings come from the shared arrival.ts, frame-locked with the 3D world.
 */
export default function Arrival2D() {
  const reticleRef = useRef<SVGGElement>(null);
  const reticleInnerRef = useRef<SVGGElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const beamRef = useRef<SVGGElement>(null);
  const beamOuterRef = useRef<SVGRectElement>(null);
  const beamCoreRef = useRef<SVGRectElement>(null);
  const beamGlowRef = useRef<SVGEllipseElement>(null);
  const streakRef = useRef<SVGGElement>(null);
  const shockRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const crackRefs = useRef<(SVGPathElement | null)[]>([]);
  const dustRef = useRef<SVGEllipseElement>(null);
  const debrisRefs = useRef<(SVGRectElement | null)[]>([]);
  const debrisGRefs = useRef<(SVGGElement | null)[]>([]);
  const pulseRef = useRef<SVGEllipseElement>(null);

  const debris = useDebris(22, 1234);
  const cracks = useCracks(9, 77);

  useSceneUpdater((p, t) => {
    const local = seg(p, ARRIVAL.from, ARRIVAL.from + ARRIVAL.span);
    if (local <= 0) {
      beamRef.current?.setAttribute("opacity", "0");
      reticleRef.current?.setAttribute("opacity", "0");
      return;
    }

    // reticle: contract + rotate, fades as the agent lands
    const rin = seg(local, 0, 0.05);
    const rout = 1 - seg(local, 0.42, 0.52);
    const rs = 1.5 - 0.5 * smoothstep(seg(local, 0, 0.25));
    if (reticleRef.current) {
      reticleRef.current.setAttribute("opacity", (rin * rout).toFixed(3));
      reticleRef.current.setAttribute(
        "transform",
        `translate(${G.x} ${G.y}) scale(${rs.toFixed(3)}) rotate(${(t * 18 + local * 90).toFixed(1)})`
      );
    }
    if (reticleInnerRef.current)
      reticleInnerRef.current.setAttribute(
        "transform",
        `rotate(${(-t * 26 - local * 70).toFixed(1)})`
      );

    // charge dust converging
    const cd = seg(local, 0, 0.22);
    dotRefs.current.forEach((el, i) => {
      if (!el) return;
      const th = i * 2.399 + t * 0.7;
      const R = 195 * (1 - smoothstep(cd));
      el.setAttribute("cx", (G.x + Math.cos(th) * R).toFixed(1));
      el.setAttribute("cy", (G.y - 6 + Math.sin(th) * R * 0.3).toFixed(1));
      el.setAttribute("opacity", (cd * (1 - cd) * 4 * 0.85).toFixed(3));
    });

    // sky beam: slam down, hold as a column, collapse upward
    const bk = seg(local, ARRIVAL.beamIn, ARRIVAL.beamInEnd);
    const out = seg(local, ARRIVAL.beamOut, ARRIVAL.beamOutEnd);
    const beamH = (G.y - TOP + 26) * bk;
    const collapse = out * (G.y - TOP + 26) * 1.04;
    const bBottom = G.y + 26 - collapse;
    const flick = 0.9 + 0.08 * Math.sin(t * 43) + 0.05 * Math.sin(t * 97);
    if (beamRef.current) {
      const vis = bk > 0 && out < 1;
      beamRef.current.setAttribute("opacity", vis ? flick.toFixed(3) : "0");
    }
    const fallBoost = seg(local, ARRIVAL.dropStart, ARRIVAL.impact) * 0.3;
    if (beamOuterRef.current) {
      beamOuterRef.current.setAttribute("y", TOP.toFixed(1));
      beamOuterRef.current.setAttribute("height", Math.max(0, bBottom - TOP).toFixed(1));
    }
    if (beamCoreRef.current) {
      beamCoreRef.current.setAttribute("y", TOP.toFixed(1));
      beamCoreRef.current.setAttribute("height", Math.max(0, bBottom - TOP).toFixed(1));
      beamCoreRef.current.setAttribute("opacity", (0.75 + fallBoost).toFixed(3));
    }
    if (beamGlowRef.current)
      beamGlowRef.current.setAttribute("opacity", (bk * (1 - out) * 0.75).toFixed(3));

    // drop streak tracks the falling agent
    const ft = seg(local, ARRIVAL.dropStart, ARRIVAL.impact);
    if (streakRef.current) {
      const falling = ft > 0 && ft < 1;
      if (falling) {
        const ry = G.y - 560 * (1 - ft * ft);
        streakRef.current.setAttribute("opacity", "0.85");
        streakRef.current.setAttribute(
          "transform",
          `translate(${G.x} ${ry})`
        );
      } else streakRef.current.setAttribute("opacity", "0");
    }

    // impact family
    const ik = seg(local, ARRIVAL.impact, 1);
    // shock rings
    shockRefs.current.forEach((el, i) => {
      if (!el) return;
      const k = seg(local, ARRIVAL.impact + i * 0.014, ARRIVAL.impact + i * 0.014 + 0.12);
      const rx = 18 + (300 + i * 42) * (1 - Math.pow(1 - k, 3));
      el.setAttribute("rx", rx.toFixed(1));
      el.setAttribute("ry", (rx * 0.26).toFixed(1));
      el.setAttribute("opacity", k > 0 && k < 1 ? (0.8 * (1 - k)).toFixed(3) : "0");
    });
    // cracks draw on, stay as glowing scars
    crackRefs.current.forEach((el, i) => {
      if (!el) return;
      const k = seg(local, ARRIVAL.impact, ARRIVAL.impact + 0.1);
      el.setAttribute("stroke-dashoffset", (100 * (1 - k)).toFixed(1));
      const pulse = 0.55 + 0.3 * Math.sin(t * 2.6 + i);
      el.setAttribute("opacity", (k * pulse * (1 - 0.25 * seg(local, 0.8, 1))).toFixed(3));
    });
    // dust ring
    if (dustRef.current) {
      const dk = seg(local, ARRIVAL.impact, ARRIVAL.impact + 0.16);
      const rx = 30 + 250 * (1 - Math.pow(1 - dk, 3));
      dustRef.current.setAttribute("rx", rx.toFixed(1));
      dustRef.current.setAttribute("ry", (rx * 0.3).toFixed(1));
      dustRef.current.setAttribute("opacity", dk > 0 && dk < 1 ? (0.32 * (1 - dk)).toFixed(3) : "0");
    }
    // debris ballistics
    debris.forEach((d, i) => {
      const el = debrisRefs.current[i];
      const g = debrisGRefs.current[i];
      if (!el || !g) return;
      const k = seg(local, ARRIVAL.impact, ARRIVAL.impact + 0.24);
      if (k <= 0 || k >= 1) {
        el.setAttribute("opacity", "0");
        return;
      }
      const x = G.x + Math.cos(d.a) * d.v * k * 2.6;
      const y = G.y - d.lift * k * 2.2 + 240 * k * k;
      g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(d.spin * k).toFixed(1)})`);
      el.setAttribute("opacity", (1 - k).toFixed(3));
    });
    // systems-stable pulse
    if (pulseRef.current) {
      const pk = seg(local, ARRIVAL.pulse, 1);
      const rx = 26 + 96 * (1 - Math.pow(1 - pk, 3));
      pulseRef.current.setAttribute("rx", rx.toFixed(1));
      pulseRef.current.setAttribute("ry", (rx * 0.3).toFixed(1));
      pulseRef.current.setAttribute("opacity", pk > 0 && pk < 1 ? (0.9 * (1 - pk)).toFixed(3) : "0");
    }
  });

  return (
    <g>
      {/* charge dust */}
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} ref={(el) => { dotRefs.current[i] = el; }} r={2} fill="#bfe0ff" opacity={0} />
      ))}

      {/* reticle */}
      <g ref={reticleRef} opacity={0}>
        <circle r={64} fill="none" stroke="#7cc4ff" strokeWidth={1.5} strokeDasharray="4 10" opacity={0.8} />
        <g ref={reticleInnerRef}>
          <circle r={88} fill="none" stroke="#4d9fff" strokeWidth={1} strokeDasharray="2 14" opacity={0.55} />
          {[0, 90, 180, 270].map((a) => (
            <line
              key={a}
              x1={96}
              y1={0}
              x2={106}
              y2={0}
              stroke="#7cc4ff"
              strokeWidth={2}
              transform={`rotate(${a})`}
              opacity={0.8}
            />
          ))}
        </g>
      </g>

      {/* sky beam */}
      <g ref={beamRef} opacity={0}>
        <rect ref={beamOuterRef} x={G.x - 76} y={TOP} width={152} height={0} fill="url(#d2-beam)" />
        <rect ref={beamCoreRef} x={G.x - 22} y={TOP} width={44} height={0} fill="url(#d2-beamcore)" />
        <ellipse ref={beamGlowRef} cx={G.x} cy={G.y} rx={95} ry={18} fill="url(#d2-padglow)" opacity={0} />
      </g>

      {/* drop streak */}
      <g ref={streakRef} opacity={0}>
        <rect x={-2} y={-108} width={4} height={104} fill="url(#d2-beamcore)" opacity={0.8} />
        <circle cy={4} r={13} fill="url(#d2-flash)" opacity={0.9} />
      </g>

      {/* impact: cracks, dust, EMP rings, debris */}
      {cracks.map((d, i) => (
        <path
          key={i}
          ref={(el) => { crackRefs.current[i] = el; }}
          d={d}
          fill="none"
          stroke={i % 3 === 0 ? "#ffb26b" : "#8fc3ff"}
          strokeWidth={2}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100}
          opacity={0}
        />
      ))}
      <ellipse ref={dustRef} cx={G.x} cy={G.y} rx={30} ry={9} fill="#9fb6d8" opacity={0} />
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          ref={(el) => { shockRefs.current[i] = el; }}
          cx={G.x}
          cy={G.y}
          rx={0}
          ry={0}
          fill="none"
          stroke="#cfe6ff"
          strokeWidth={2.5}
          opacity={0}
        />
      ))}
      {debris.map((d, i) => (
        <g key={i} ref={(el) => { debrisGRefs.current[i] = el; }}>
          <rect
            ref={(el) => { debrisRefs.current[i] = el; }}
            x={-d.size / 2}
            y={-d.size / 2}
            width={d.size}
            height={d.size}
            rx={1}
            fill={d.warm ? "#ffb26b" : "#8fb4e8"}
            opacity={0}
          />
        </g>
      ))}
      <ellipse ref={pulseRef} cx={G.x} cy={G.y} rx={26} ry={8} fill="none" stroke="#7cc4ff" strokeWidth={1.6} opacity={0} />
    </g>
  );
}

/** Screen-space white flash + impact bloom — rendered above everything. */
export function ArrivalFlash() {
  const flashRef = useRef<SVGRectElement>(null);
  const bloomRef = useRef<SVGCircleElement>(null);

  useSceneUpdater((p, t) => {
    const local = seg(p, ARRIVAL.from, ARRIVAL.from + ARRIVAL.span);
    const d = seg(local, ARRIVAL.impact, 1);
    const e = d < 1 ? Math.exp(-26 * d) : 0;
    if (flashRef.current)
      flashRef.current.setAttribute("opacity", Math.min(0.85, e * 1.15).toFixed(3));
    if (bloomRef.current) {
      bloomRef.current.setAttribute("opacity", (e * 0.7).toFixed(3));
      bloomRef.current.setAttribute("r", (40 + 320 * (1 - Math.exp(-9 * d))).toFixed(1));
    }
    void t;
  });

  return (
    <g>
      <circle ref={bloomRef} cx={G.x} cy={G.y - 10} r={40} fill="url(#d2-flash)" opacity={0} />
      <rect ref={flashRef} x={-420} y={-220} width={2440} height={1400} fill="#eaf3ff" opacity={0} />
    </g>
  );
}
