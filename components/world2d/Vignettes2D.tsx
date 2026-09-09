"use client";

import { useRef } from "react";
import { useSceneUpdater } from "./SceneCtx";
import { easeOutBack, flicker, seg } from "./util";

/**
 * Props for the society vignettes: the programmer desk, the lan house and
 * the park benches. Back pieces render behind the agents (monitors, poles,
 * backrests); front pieces render above them (desk tops, seat slats, light
 * spill) so seated poses read correctly.
 */

const WOOD = "#c9a06b";
const WOOD_DK = "#a87f4f";
const METAL = "#5b6470";

/* ============ PROGRAMMER DESK (x≈350–472, ground 648) ============ */

const CODE_BARS = [
  { y: 559, c: "#7cc4ff" },
  { y: 566, c: "#9fe8b8" },
  { y: 573, c: "#ffcf4d" },
  { y: 580, c: "#7cc4ff" },
];

/** Monitor + stool + plant + mug (behind the coder). */
function CoderDeskBack() {
  const groupRef = useRef<SVGGElement>(null);
  const barsRef = useRef<(SVGRectElement | null)[]>([]);
  const cursorRef = useRef<SVGRectElement>(null);
  const steamRef = useRef<SVGPathElement>(null);

  useSceneUpdater((p, t) => {
    const k = easeOutBack(seg(p, 0.562, 0.6));
    if (groupRef.current) {
      groupRef.current.setAttribute("opacity", seg(p, 0.562, 0.6).toFixed(3));
      groupRef.current.setAttribute(
        "transform",
        `translate(0 ${((1 - Math.min(1, k)) * 14).toFixed(1)})`
      );
    }
    const widths = [30, 22, 34, 16];
    barsRef.current.forEach((el, i) => {
      if (!el) return;
      const w = widths[i] + Math.sin(t * (2.2 + i * 0.7) + i * 2) * (5 + i * 2);
      el.setAttribute("width", Math.max(4, w).toFixed(1));
    });
    if (cursorRef.current)
      cursorRef.current.setAttribute("opacity", flicker(t * 2.4, 3, 14) > 0.4 ? "0.9" : "0.1");
    if (steamRef.current)
      steamRef.current.setAttribute("opacity", (0.3 + 0.22 * Math.sin(t * 2.1)).toFixed(3));
  });

  return (
    <g ref={groupRef} opacity={0}>
      {/* stool */}
      <rect x={414} y={620} width={28} height={5} rx={2.5} fill={WOOD_DK} />
      <rect x={425} y={625} width={6} height={23} fill={METAL} />
      {/* monitor stand + shell */}
      <rect x={402} y={597} width={8} height={5} fill={METAL} />
      <rect x={394} y={601} width={24} height={3} rx={1.5} fill={METAL} />
      <rect x={364} y={550} width={58} height={46} rx={5} fill="#101828" stroke="#2a3a55" strokeWidth={2} />
      <rect x={369} y={555} width={48} height={36} rx={3} fill="#0a1322" />
      {/* live code bars + cursor */}
      {CODE_BARS.map((b, i) => (
        <rect
          key={i}
          ref={(el) => { barsRef.current[i] = el; }}
          x={372}
          y={b.y}
          width={20}
          height={3}
          rx={1.5}
          fill={b.c}
          opacity={0.85}
        />
      ))}
      <rect ref={cursorRef} x={372} y={586} width={5} height={3} fill="#dff0ff" />
      <rect x={361} y={547} width={64} height={52} rx={6} fill="none" stroke="#7cc4ff" strokeWidth={1.2} opacity={0.15} />
      {/* mug + steam */}
      <path
        ref={steamRef}
        d="M 447 589 Q 445 583 447 578 Q 449 573 447 568"
        stroke="#dfe8f4"
        strokeWidth={1.6}
        fill="none"
        opacity={0.35}
      />
      {/* potted plant */}
      <rect x={352} y={592} width={12} height={9} rx={2} fill="#b98a5a" />
      <path
        d="M 358 592 Q 352 582 356 576 M 358 592 Q 364 583 361 577 M 358 592 Q 358 582 358 578"
        stroke="#5cb168"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Desk slab + legs + keyboard + mug body (in front of the coder's lap). */
function CoderDeskFront() {
  const ref = useRef<SVGGElement>(null);
  useSceneUpdater((p) => {
    if (ref.current) ref.current.setAttribute("opacity", seg(p, 0.562, 0.6).toFixed(3));
  });
  return (
    <g ref={ref} opacity={0}>
      <rect x={356} y={606} width={7} height={42} fill={METAL} />
      <rect x={459} y={606} width={7} height={42} fill={METAL} />
      <rect x={350} y={600} width={122} height={7} rx={3.5} fill={WOOD} />
      <rect x={350} y={607} width={122} height={2.5} fill={WOOD_DK} opacity={0.8} />
      {/* keyboard */}
      <rect x={410} y={594} width={28} height={5} rx={2} fill="#1c2434" />
      <rect x={413} y={595} width={3} height={3} fill="#3b5b8c" />
      <rect x={418} y={595} width={3} height={3} fill="#3b5b8c" />
      <rect x={423} y={595} width={3} height={3} fill="#3b5b8c" />
      {/* mug body */}
      <rect x={443} y={591} width={9} height={10} rx={2} fill="#dfe8f4" opacity={0.95} />
      <path d="M 452 593 Q 455 594 452 597" stroke="#dfe8f4" strokeWidth={1.6} fill="none" opacity={0.9} />
    </g>
  );
}

/* ============ LAN HOUSE (x≈1140–1432, ground 648) ============ */

const LAN_BOTS = [
  { x: 1180, gy: 652, accent: "#8ea2ff" },
  { x: 1262, gy: 656, accent: "#ff7a5c" },
  { x: 1344, gy: 650, accent: "#4ecdc4" },
];

const FLAGS = ["#8ea2ff", "#ff7a5c", "#4ecdc4", "#ffcf4d", "#4dd8ff", "#ff6f91", "#b7e0ff"];

/** Poles, pennant string, sign, monitors with mini platformers. */
function LanHouseBack() {
  const groupRef = useRef<SVGGElement>(null);
  const playerRefs = useRef<(SVGRectElement | null)[]>([]);
  const obstacleRefs = useRef<(SVGRectElement | null)[]>([]);

  useSceneUpdater((p, t) => {
    const k = easeOutBack(seg(p, 0.688, 0.735));
    if (groupRef.current) {
      groupRef.current.setAttribute("opacity", seg(p, 0.688, 0.735).toFixed(3));
      groupRef.current.setAttribute(
        "transform",
        `translate(0 ${((1 - Math.min(1, k)) * 16).toFixed(1)})`
      );
    }
    LAN_BOTS.forEach((b, i) => {
      const pl = playerRefs.current[i];
      if (pl) pl.setAttribute("y", (585 - Math.abs(Math.sin(t * 3 + i * 1.3)) * 8).toFixed(1));
      const ob = obstacleRefs.current[i];
      if (ob) ob.setAttribute("x", (b.x + 43 - ((t * 26 + i * 17) % 34)).toFixed(1));
    });
  });

  return (
    <g ref={groupRef} opacity={0}>
      {/* stools (one per lan agent, behind them) */}
      {LAN_BOTS.map((b) => (
        <g key={`stool-${b.x}`}>
          <rect x={b.x - 15} y={b.gy - 30} width={30} height={5} rx={2.5} fill={WOOD_DK} />
          <rect x={b.x - 3} y={b.gy - 25} width={6} height={25} fill={METAL} />
          <rect x={b.x - 11} y={b.gy - 2} width={22} height={3.5} rx={1.5} fill={METAL} />
        </g>
      ))}
      <rect x={1138} y={498} width={5} height={150} rx={2.5} fill={METAL} />
      <rect x={1429} y={498} width={5} height={150} rx={2.5} fill={METAL} />
      <circle cx={1140.5} cy={496} r={3} fill="#ff8a2b" />
      <circle cx={1431.5} cy={496} r={3} fill="#ff8a2b" />
      <path d="M 1141 505 Q 1286 530 1431 505" stroke="#8b97a8" strokeWidth={1.6} fill="none" />
      {FLAGS.map((c, i) => {
        const u = (i + 0.5) / FLAGS.length;
        const fx = 1141 + (1431 - 1141) * u;
        const fy = 507 + 20 * Math.sin(Math.PI * u);
        return (
          <polygon key={i} points={`${fx - 7},${fy} ${fx + 7},${fy} ${fx},${fy + 14}`} fill={c} opacity={0.95} />
        );
      })}
      {/* hanging sign (clear of the monitors below) */}
      <line x1={1286} y1={520} x2={1286} y2={530} stroke="#8b97a8" strokeWidth={1.4} />
      <rect x={1244} y={530} width={84} height={24} rx={6} fill="#10182b" stroke="#3b5b8c" strokeWidth={1.6} />
      <text
        x={1286}
        y={546.5}
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={11}
        letterSpacing={2.5}
        fill="#cfe6ff"
      >
        LAN HOUSE
      </text>
      {/* monitors with mini platformer screens */}
      {LAN_BOTS.map((b, i) => (
        <g key={b.x}>
          <rect x={b.x + 30} y={597} width={7} height={5} fill={METAL} />
          <rect x={b.x + 24} y={601} width={19} height={3} rx={1.5} fill={METAL} />
          <rect x={b.x + 14} y={552} width={44} height={50} rx={5} fill="#101828" stroke="#2a3a55" strokeWidth={2} />
          <rect x={b.x + 19} y={557} width={34} height={40} rx={3} fill="#0a1322" />
          <rect x={b.x + 19} y={589} width={34} height={8} fill="#22436b" />
          <rect ref={(el) => { playerRefs.current[i] = el; }} x={b.x + 24} y={585} width={7} height={7} rx={1.5} fill={b.accent} />
          <rect ref={(el) => { obstacleRefs.current[i] = el; }} x={b.x + 43} y={583} width={5} height={6} fill="#dff0ff" opacity={0.85} />
          <circle cx={b.x + 23} cy={562} r={1.4} fill="#dff0ff" opacity={0.8} />
          <circle cx={b.x + 28} cy={560} r={1.1} fill="#dff0ff" opacity={0.6} />
        </g>
      ))}
    </g>
  );
}

/** Desk slab, legs, animated RGB underglow, keyboards, drinks, face spill. */
function LanHouseFront() {
  const groupRef = useRef<SVGGElement>(null);
  const stripARef = useRef<SVGRectElement>(null);
  const stripBRef = useRef<SVGRectElement>(null);
  const spillRefs = useRef<(SVGPolygonElement | null)[]>([]);

  useSceneUpdater((p, t) => {
    const o = seg(p, 0.688, 0.735);
    if (groupRef.current) groupRef.current.setAttribute("opacity", o.toFixed(3));
    if (stripARef.current)
      stripARef.current.setAttribute("opacity", (0.5 + 0.42 * Math.sin(t * 2.4)).toFixed(3));
    if (stripBRef.current)
      stripBRef.current.setAttribute("opacity", (0.5 + 0.42 * Math.sin(t * 2.4 + Math.PI)).toFixed(3));
    spillRefs.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute("opacity", (0.09 + 0.05 * Math.sin(t * 5.3 + i * 2.1)).toFixed(3));
    });
  });

  return (
    <g ref={groupRef} opacity={0}>
      {LAN_BOTS.map((b, i) => (
        <polygon
          key={i}
          ref={(el) => { spillRefs.current[i] = el; }}
          points={`${b.x + 16},556 ${b.x + 16},600 ${b.x - 42},592 ${b.x - 42},566`}
          fill={b.accent}
          opacity={0.09}
        />
      ))}
      {[1160, 1228, 1296, 1364, 1414].map((x) => (
        <rect key={x} x={x} y={607} width={7} height={41} fill={METAL} />
      ))}
      <rect x={1146} y={600} width={280} height={7} rx={3.5} fill={WOOD} />
      <rect x={1146} y={607} width={280} height={2.5} fill={WOOD_DK} opacity={0.8} />
      <rect ref={stripARef} x={1150} y={611} width={272} height={2.4} rx={1.2} fill="#4dd8ff" opacity={0.55} />
      <rect ref={stripBRef} x={1150} y={611} width={272} height={2.4} rx={1.2} fill="#ff6f91" opacity={0.55} />
      {LAN_BOTS.map((b) => (
        <g key={b.x}>
          <rect x={b.x - 4} y={595} width={26} height={4} rx={2} fill="#1c2434" />
          <rect x={b.x + 30} y={592} width={7} height={9} rx={1.5} fill="#8ea2ff" opacity={0.85} />
          <rect x={b.x + 31.5} y={593.5} width={4} height={2.4} fill="#0a1322" />
        </g>
      ))}
    </g>
  );
}

/* ============ PARK BENCHES (x 690 / 872 / 1054, ground 662) ============ */

const BENCH_X = [690, 872, 1054];

function BenchBacks() {
  const groupRef = useRef<SVGGElement>(null);
  useSceneUpdater((p) => {
    const k = easeOutBack(seg(p, 0.74, 0.775));
    if (groupRef.current) {
      groupRef.current.setAttribute("opacity", seg(p, 0.738, 0.775).toFixed(3));
      groupRef.current.setAttribute(
        "transform",
        `translate(0 ${((1 - Math.min(1, k)) * 12).toFixed(1)})`
      );
    }
  });
  return (
    <g ref={groupRef} opacity={0}>
      {BENCH_X.map((bx) => (
        <g key={bx}>
          <ellipse cx={bx} cy={663} rx={72} ry={7} fill="#000" opacity={0.12} />
          <path
            d={`M ${bx - 52} 662 L ${bx - 46} 632 M ${bx + 52} 662 L ${bx + 46} 632`}
            stroke={METAL}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={`M ${bx - 46} 632 L ${bx - 42} 606 M ${bx + 46} 632 L ${bx + 42} 606`}
            stroke={METAL}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <rect x={bx - 62} y={604} width={124} height={6} rx={3} fill={WOOD} />
          <rect x={bx - 62} y={614} width={124} height={6} rx={3} fill={WOOD_DK} />
        </g>
      ))}
    </g>
  );
}

/** Seat slats drawn AFTER the agents so thighs tuck under the seat. */
function BenchSeats() {
  const groupRef = useRef<SVGGElement>(null);
  useSceneUpdater((p) => {
    if (groupRef.current)
      groupRef.current.setAttribute("opacity", seg(p, 0.738, 0.775).toFixed(3));
  });
  return (
    <g ref={groupRef} opacity={0}>
      {BENCH_X.map((bx) => (
        <g key={bx}>
          <rect x={bx - 64} y={630} width={128} height={6} rx={3} fill={WOOD} />
          <rect x={bx - 64} y={638} width={128} height={6} rx={3} fill={WOOD_DK} />
          <rect x={bx - 64} y={630} width={128} height={2} rx={1} fill="#e0bd8b" />
        </g>
      ))}
    </g>
  );
}

/* ============ exports ============ */

export function VignettesBack() {
  return (
    <g>
      <CoderDeskBack />
      <LanHouseBack />
      <BenchBacks />
    </g>
  );
}

export function VignettesFront() {
  return (
    <g>
      <LanHouseFront />
      <BenchSeats />
      <CoderDeskFront />
    </g>
  );
}
