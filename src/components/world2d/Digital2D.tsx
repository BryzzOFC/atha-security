"use client";

import { useRef } from "react";
import { BOTS, HERO_BENCH } from "./roster";
import { useSceneUpdater } from "./SceneCtx";
import { easeOutBack, seg } from "./util";

const CORE = { x: 800, y: 398 };

/** Wireframe hexagon path (flat-top). */
function hexPath(r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${(CORE.x + Math.cos(a) * r).toFixed(1)},${(CORE.y + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

/**
 * Digital pull-back: buildings turn wireframe, connection lines draw from
 * every agent to a glowing core, and the world exhales into structure —
 * the same narrative beat as the 3D DigitalShell.
 */
export default function Digital2D() {
  const coreRef = useRef<SVGGElement>(null);
  const hexARef = useRef<SVGPathElement>(null);
  const hexBRef = useRef<SVGPathElement>(null);
  const linkRefs = useRef<(SVGPathElement | null)[]>([]);

  const LINKS = [
    ...BOTS.map((b) => ({ x: b.x, y: b.y - 90 })),
    { x: HERO_BENCH.x, y: HERO_BENCH.y - 110 },
  ];

  useSceneUpdater((p, t) => {
    // core blooms in
    const ck = easeOutBack(seg(p, 0.8, 0.9));
    if (coreRef.current) {
      coreRef.current.setAttribute("opacity", (seg(p, 0.79, 0.83)).toFixed(3));
      coreRef.current.setAttribute(
        "transform",
        `translate(${CORE.x} ${CORE.y}) scale(${Math.max(0.001, ck).toFixed(3)}) translate(${-CORE.x} ${-CORE.y})`
      );
    }
    if (hexARef.current)
      hexARef.current.setAttribute("transform", `rotate(${(t * 9).toFixed(2)} ${CORE.x} ${CORE.y})`);
    if (hexBRef.current)
      hexBRef.current.setAttribute("transform", `rotate(${(-t * 14).toFixed(2)} ${CORE.x} ${CORE.y})`);
    // agent links draw in, then breathe
    linkRefs.current.forEach((el, i) => {
      if (!el) return;
      const lk = seg(p, 0.82 + i * 0.012, 0.9 + i * 0.012);
      el.setAttribute("stroke-dashoffset", (100 * (1 - lk)).toFixed(1));
      el.setAttribute("opacity", (lk * (0.5 + 0.15 * Math.sin(t * 2 + i))).toFixed(3));
    });
  });

  return (
    <g>
      {/* agent links */}
      {LINKS.map((l, i) => (
        <path
          key={i}
          ref={(el) => { linkRefs.current[i] = el; }}
          d={`M ${l.x} ${l.y} Q ${(l.x + CORE.x) / 2} ${Math.min(l.y, CORE.y) - 46} ${CORE.x} ${CORE.y}`}
          fill="none"
          stroke="#7cc4ff"
          strokeWidth={1.8}
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100}
          opacity={0}
        />
      ))}

      {/* ATHA core */}
      <g ref={coreRef} opacity={0}>
        <circle cx={CORE.x} cy={CORE.y} r={54} fill="#5ea8ff" opacity={0.07} />
        <circle cx={CORE.x} cy={CORE.y} r={34} fill="#5ea8ff" opacity={0.14} />
        <circle cx={CORE.x} cy={CORE.y} r={17} fill="url(#d2-core)" />
        <path ref={hexARef} d={hexPath(46)} fill="none" stroke="#7cc4ff" strokeWidth={1.4} opacity={0.75} />
        <path ref={hexBRef} d={hexPath(29)} fill="none" stroke="#bfe0ff" strokeWidth={1.1} opacity={0.8} />
      </g>
    </g>
  );
}
