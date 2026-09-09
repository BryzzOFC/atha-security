"use client";

import { useRef } from "react";
import { useSceneUpdater } from "./SceneCtx";
import { easeOutBack, mulberry32, seg } from "./util";

/** The meadow IS the world from the first frame — no dark phase. */

const CLOUDS = [
  { x: 240, y: 148, s: 1.15, v: 7 },
  { x: 760, y: 210, s: 0.85, v: 10 },
  { x: 1180, y: 132, s: 1.0, v: 8.5 },
  { x: 1560, y: 236, s: 0.7, v: 12 },
];

/** Distant light-city silhouette behind the hills (pure decoration). */
const DAY_CITY = [
  { x: 90, w: 46, h: 88 },
  { x: 168, w: 34, h: 62 },
  { x: 260, w: 52, h: 104 },
  { x: 356, w: 38, h: 70 },
  { x: 520, w: 44, h: 82 },
  { x: 610, w: 30, h: 54 },
  { x: 700, w: 56, h: 96 },
  { x: 920, w: 40, h: 66 },
  { x: 1010, w: 50, h: 92 },
  { x: 1120, w: 34, h: 58 },
  { x: 1240, w: 48, h: 86 },
  { x: 1340, w: 38, h: 64 },
  { x: 1440, w: 54, h: 100 },
  { x: 1540, w: 40, h: 72 },
];

const TREES = [
  { x: 232, y: 610, s: 1.05 },
  { x: 585, y: 598, s: 0.8 },
  { x: 1112, y: 602, s: 0.9 },
  { x: 1478, y: 612, s: 1.1 },
];

function Tree({ x, y, s, swayRef }: { x: number; y: number; s: number; swayRef: (el: SVGGElement | null) => void }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={4} cy={2} rx={40} ry={7} fill="#000" opacity={0.12} />
      <path d="M -5 0 Q -7 -34 -4 -52 L 6 -52 Q 8 -32 6 0 Z" fill="#8a6b4a" />
      <path d="M -3 -20 L -14 -34" stroke="#8a6b4a" strokeWidth={4} strokeLinecap="round" />
      <path d="M 4 -28 L 15 -40" stroke="#8a6b4a" strokeWidth={4} strokeLinecap="round" />
      <g ref={swayRef}>
        <circle cx={-16} cy={-62} r={22} fill="#4da057" />
        <circle cx={17} cy={-58} r={19} fill="#4da057" />
        <circle cx={0} cy={-78} r={26} fill="#5cb168" />
        <circle cx={-8} cy={-82} r={14} fill="#6fc377" />
        <circle cx={14} cy={-70} r={9} fill="#6fc377" opacity={0.9} />
      </g>
    </g>
  );
}

/**
 * The Earth meadow — blue sky, sun, drifting clouds, rolling green hills,
 * grass field with flowers and trees. Fades in as the world comes alive.
 */
export default function Meadow2D() {
  const skyRef = useRef<SVGGElement>(null);
  const groundRef = useRef<SVGGElement>(null);
  const raysRef = useRef<SVGGElement>(null);
  const cloudRefs = useRef<(SVGGElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const tuftRefs = useRef<(SVGGElement | null)[]>([]);
  const flowerRefs = useRef<(SVGGElement | null)[]>([]);
  const swayRefs = useRef<(SVGGElement | null)[]>([]);

  const rnd = mulberry32(7);
  const tufts = Array.from({ length: 40 }, () => ({
    x: -100 + rnd() * 1800,
    y: 600 + rnd() * 260,
    s: 0.7 + rnd() * 0.9,
    i: 0,
  })).map((t, i) => ({ ...t, i }));
  const flowers = Array.from({ length: 26 }, () => ({
    x: -80 + rnd() * 1760,
    y: 606 + rnd() * 250,
    w: rnd() < 0.5,
    i: 0,
  })).map((f, i) => ({ ...f, i }));

  useSceneUpdater((p, t) => {
    if (skyRef.current) skyRef.current.setAttribute("opacity", "1");
    if (groundRef.current) groundRef.current.setAttribute("opacity", "1");
    if (raysRef.current)
      raysRef.current.setAttribute(
        "transform",
        `rotate(${(t * 1.6).toFixed(2)} 1210 190)`
      );
    CLOUDS.forEach((c, i) => {
      const el = cloudRefs.current[i];
      if (!el) return;
      const x = -260 + ((((c.x + t * c.v) % 2160) + 2160) % 2160);
      el.setAttribute("transform", `translate(${x.toFixed(1)} ${c.y}) scale(${c.s})`);
    });
    const pk = seg(p, 0.02, 0.1);
    if (pathRef.current) {
      pathRef.current.setAttribute("stroke-dashoffset", (100 * (1 - pk)).toFixed(1));
    }
    tufts.forEach((tf, i) => {
      const el = tuftRefs.current[i];
      if (!el) return;
      const g = easeOutBack(seg(p, 0.01 + (i % 10) * 0.008, 0.075 + (i % 10) * 0.008));
      el.setAttribute("transform", `translate(${tf.x} ${tf.y}) scale(${Math.max(0.001, g * tf.s).toFixed(3)})`);
    });
    flowers.forEach((f, i) => {
      const el = flowerRefs.current[i];
      if (!el) return;
      const g = seg(p, 0.02 + (i % 8) * 0.008, 0.085 + (i % 8) * 0.008);
      el.setAttribute("opacity", (g * 0.95).toFixed(3));
    });
    TREES.forEach((_, i) => {
      const el = swayRefs.current[i];
      if (!el) return;
      el.setAttribute("transform", `rotate(${(1.4 * Math.sin(t * 0.7 + i * 1.9)).toFixed(2)} 0 -52)`);
    });
  });

  return (
    <g>
      {/* ============ SKY LAYER ============ */}
      <g ref={skyRef} opacity={0}>
        <defs>
          <linearGradient id="d2-daysky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ecdfb" />
            <stop offset="55%" stopColor="#c8e8fd" />
            <stop offset="100%" stopColor="#eef9ff" />
          </linearGradient>
          <radialGradient id="d2-sunglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,244,200,0.9)" />
            <stop offset="45%" stopColor="rgba(255,238,170,0.35)" />
            <stop offset="100%" stopColor="rgba(255,238,170,0)" />
          </radialGradient>
        </defs>
        <rect x={-420} y={-300} width={2440} height={900} fill="url(#d2-daysky)" />
        {/* sun */}
        <g>
          <circle cx={1210} cy={190} r={130} fill="url(#d2-sunglow)" />
          <g ref={raysRef} opacity={0.5}>
            {Array.from({ length: 12 }, (_, i) => {
              const a = (Math.PI / 6) * i;
              const x1 = 1210 + Math.cos(a) * 58;
              const y1 = 190 + Math.sin(a) * 58;
              const x2 = 1210 + Math.cos(a) * 72;
              const y2 = 190 + Math.sin(a) * 72;
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffe9a8" strokeWidth={4} strokeLinecap="round" />
              );
            })}
          </g>
          <circle cx={1210} cy={190} r={40} fill="#fff6d8" />
          <circle cx={1210} cy={190} r={46} fill="none" stroke="#ffe9a8" strokeWidth={3} opacity={0.7} />
        </g>
        {/* clouds */}
        {CLOUDS.map((c, i) => (
          <g key={i} ref={(el) => { cloudRefs.current[i] = el; }} opacity={0.92}>
            <ellipse cx={0} cy={0} rx={52} ry={18} fill="#ffffff" />
            <ellipse cx={-28} cy={6} rx={30} ry={13} fill="#ffffff" />
            <ellipse cx={30} cy={7} rx={34} ry={14} fill="#ffffff" />
            <ellipse cx={4} cy={-10} rx={30} ry={15} fill="#ffffff" />
            <ellipse cx={-6} cy={10} rx={44} ry={11} fill="#e8f4fd" />
          </g>
        ))}
        {/* distant day city */}
        <g opacity={0.85}>
          {DAY_CITY.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={560 - b.h} width={b.w} height={b.h} rx={3} fill="#c7ddf0" />
              <rect x={b.x} y={560 - b.h} width={b.w} height={6} rx={3} fill="#dbeaf7" />
            </g>
          ))}
        </g>
      </g>

      {/* ============ GROUND LAYER ============ */}
      <g ref={groundRef} opacity={0}>
        <defs>
          <linearGradient id="d2-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ed07f" />
            <stop offset="100%" stopColor="#6dbb66" />
          </linearGradient>
        </defs>
        {/* back hills */}
        <path
          d="M -420 585 Q 60 522 480 566 Q 900 606 1240 552 Q 1500 514 2020 570 L 2020 640 L -420 640 Z"
          fill="#b5e3a6"
        />
        <path
          d="M -420 592 Q 240 556 700 584 Q 1160 610 1560 570 Q 1800 550 2020 580 L 2020 660 L -420 660 Z"
          fill="#9bd88e"
        />
        {/* grass field */}
        <rect x={-420} y={583} width={2440} height={640} fill="url(#d2-grass)" />
        <rect x={-420} y={583} width={2440} height={9} fill="#b9e6ab" opacity={0.85} />
        {/* mow bands */}
        <path d="M -420 700 Q 500 676 1100 702 Q 1600 722 2020 700 L 2020 734 Q 1500 756 1000 736 Q 400 712 -420 738 Z" fill="#66b560" opacity={0.32} />
        <path d="M -420 850 Q 600 822 1200 852 Q 1700 874 2020 852 L 2020 894 Q 1500 918 1000 896 Q 400 868 -420 896 Z" fill="#66b560" opacity={0.26} />
        {/* sandy path linking the vignettes */}
        <path
          ref={pathRef}
          d="M 330 700 Q 470 660 640 686 Q 850 716 1050 690 Q 1260 664 1420 690"
          fill="none"
          stroke="#ecdcae"
          strokeWidth={26}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100}
          opacity={0.8}
        />
        {/* trees */}
        {TREES.map((tr, i) => (
          <Tree key={i} x={tr.x} y={tr.y} s={tr.s} swayRef={(el) => { swayRefs.current[i] = el; }} />
        ))}
        {/* grass tufts */}
        {tufts.map((tf, i) => (
          <g key={i} ref={(el) => { tuftRefs.current[i] = el; }}>
            <path d="M 0 0 Q -2 -8 -6 -12 M 0 0 Q 0 -10 1 -15 M 0 0 Q 3 -8 7 -11" stroke="#4f9e4e" strokeWidth={2} fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* flowers */}
        {flowers.map((f, i) => (
          <g key={i} ref={(el) => { flowerRefs.current[i] = el; }} opacity={0}>
            <circle cx={0} cy={0} r={2.6} fill={f.w ? "#ffffff" : "#ffd23f"} />
            <circle cx={0} cy={0} r={1.1} fill={f.w ? "#ffd23f" : "#ffffff"} />
          </g>
        ))}
      </g>
    </g>
  );
}
