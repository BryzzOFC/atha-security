"use client";

import { useRef } from "react";
import { useSceneUpdater } from "./SceneCtx";
import { easeOutBack, easeOutCubic, seg } from "./util";

/** Grid verticals: fan out from the vanishing point. */
const PATHS = [
  "M 800 648 Q 560 700 240 850",
  "M 800 648 Q 1060 700 1400 860",
  "M 800 648 Q 700 760 620 980",
  "M 800 648 Q 920 760 1010 980",
];
const PYLONS = [
  { x: 300, y: 660 },
  { x: 1300, y: 664 },
  { x: 462, y: 712 },
  { x: 1168, y: 716 },
];

/**
 * Day-world ground fixtures: digital trails drawing across the grass, the
 * plaza ring, the landing pad and the charging pylons. Everything ships in
 * the daylight palette — the meadow layer owns the horizon.
 */
export default function City2D() {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const plazaRef = useRef<SVGGElement>(null);
  const padRef = useRef<SVGGElement>(null);
  const pylonRefs = useRef<(SVGGElement | null)[]>([]);
  const pylonBeamRefs = useRef<(SVGRectElement | null)[]>([]);

  useSceneUpdater((p, t) => {
    // digital trails draw on
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      const k = seg(p, 0.27 + i * 0.02, 0.385);
      el.setAttribute("stroke-dashoffset", (100 * (1 - k)).toFixed(1));
      el.setAttribute("opacity", "0.34");
    });
    // plaza + landing pad
    const pk = easeOutCubic(seg(p, 0.3, 0.385));
    plazaRef.current?.setAttribute("opacity", pk.toFixed(3));
    const padk = easeOutBack(seg(p, 0.32, 0.375));
    padRef.current?.setAttribute("opacity", (padk * 0.9).toFixed(3));
    // pylons rise
    PYLONS.forEach((_, i) => {
      const el = pylonRefs.current[i];
      const beam = pylonBeamRefs.current[i];
      const k = easeOutBack(seg(p, 0.25 + i * 0.022, 0.3 + i * 0.022));
      if (el) el.setAttribute("transform", `scale(1 ${Math.max(0.001, k).toFixed(3)})`);
      if (beam)
        beam.setAttribute(
          "opacity",
          (k * (0.26 + 0.12 * Math.sin(t * 2.2 + i * 1.8))).toFixed(3)
        );
    });
  });

  return (
    <g>
      {/* plaza trails + ring */}
      <g ref={plazaRef} opacity={0}>
        {PATHS.map((d, i) => (
          <path
            key={i}
            ref={(el) => { pathRefs.current[i] = el; }}
            d={d}
            fill="none"
            stroke="#4d9fff"
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="3 9"
            strokeDashoffset={100}
            opacity={0.3}
          />
        ))}
        <ellipse cx={800} cy={650} rx={175} ry={30} fill="none" stroke="#9fb9c9" strokeWidth={1.5} />
      </g>

      {/* landing pad (light concrete) */}
      <g ref={padRef} opacity={0}>
        <ellipse cx={620} cy={650} rx={74} ry={15} fill="#d9dfd6" />
        <ellipse cx={620} cy={650} rx={74} ry={15} fill="none" stroke="#90a8bd" strokeWidth={1.6} />
        <ellipse cx={620} cy={650} rx={46} ry={9} fill="none" stroke="#4d9fff" strokeWidth={1} strokeDasharray="4 6" opacity={0.7} />
        <ellipse cx={620} cy={650} rx={90} ry={19} fill="url(#d2-padglow)" opacity={0.35} />
      </g>

      {/* charging pylons */}
      {PYLONS.map((pl, i) => (
        <g key={i} ref={(el) => { pylonRefs.current[i] = el; }} transform={`translate(${pl.x} ${pl.y}) scale(1 0)`}>
          <rect x={-2.5} y={-86} width={5} height={86} rx={2.5} fill="#e8eef4" />
          <rect x={-2.5} y={-86} width={2} height={86} fill="#c6d2dc" />
          <circle cx={0} cy={-90} r={3.5} fill="#ff8a2b" />
          <circle cx={0} cy={-90} r={7} fill="#ff8a2b" opacity={0.25} />
          <rect ref={(el) => { pylonBeamRefs.current[i] = el; }} x={-1.2} y={-138} width={2.4} height={44} fill="#ffd9b0" opacity={0.3} />
        </g>
      ))}
    </g>
  );
}
