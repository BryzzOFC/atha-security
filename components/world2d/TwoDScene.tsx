"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { SceneCtx } from "./SceneCtx";
import City2D from "./City2D";
import Meadow2D from "./Meadow2D";
import Arrival2D, { ArrivalFlash } from "./Arrival2D";
import { VignettesBack, VignettesFront } from "./Vignettes2D";
import Digital2D from "./Digital2D";
import { HeroRobot2D, Bot2D } from "./Robot2D";
import { BOTS } from "./roster";
import { camAt, damp, impactShake } from "./util";

/**
 * The 2D scene test: a fully vector world driven by the same scroll
 * progress as the 3D one. One rAF loop dampens scroll progress, drives the
 * viewBox camera (pan / zoom / roll + impact shake) and ticks every
 * registered subsystem. SVG attribute mutation only — zero re-renders.
 */
export default function TwoDScene({
  progressRef,
  staticP,
  active,
}: {
  progressRef: MutableRefObject<number>;
  staticP: number | null;
  active: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rotRef = useRef<SVGGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const aspectRef = useRef(16 / 9);
  const updatersRef = useRef<Set<(p: number, t: number) => void>>(new Set());

  const registry = useMemo(
    () => ({
      add: (u: (p: number, t: number) => void) => {
        updatersRef.current.add(u);
        return () => {
          updatersRef.current.delete(u);
        };
      },
    }),
    []
  );

  /** One full frame: camera + every subsystem. */
  const applyFrame = (p: number, t: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const portrait = aspectRef.current < 0.8;
    const cam = camAt(p, portrait);
    const shake = impactShake(p);
    const viewH = (900 / cam.s) * (portrait ? 1.16 : 1);
    const viewW = viewH * aspectRef.current;
    svg.setAttribute(
      "viewBox",
      `${(cam.x - viewW / 2 + shake.x).toFixed(2)} ${(cam.y - viewH / 2 + shake.y).toFixed(2)} ${viewW.toFixed(2)} ${viewH.toFixed(2)}`
    );
    rotRef.current?.setAttribute(
      "transform",
      `rotate(${cam.r.toFixed(3)} ${cam.x} ${cam.y})`
    );
    updatersRef.current.forEach((fn) => fn(p, t));
  };

  // track container aspect for the responsive camera
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.height > 0) aspectRef.current = r.width / r.height;
      if (staticP != null) applyFrame(staticP, 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [staticP]);

  // main loop
  useEffect(() => {
    if (staticP != null) {
      applyFrame(staticP, 0);
      return;
    }
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    let pSmooth = progressRef.current;
    let t = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      pSmooth = damp(pSmooth, progressRef.current, 9, dt);
      applyFrame(pSmooth, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, staticP, progressRef]);

  return (
    <div ref={boxRef} className="absolute inset-0">
      <svg
        ref={svgRef}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        style={{ background: "#04050a" }}
      >
        <defs>
          <radialGradient id="d2-sky" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#0d1424" />
            <stop offset="45%" stopColor="#070a12" />
            <stop offset="100%" stopColor="#04050a" />
          </radialGradient>
          <linearGradient id="d2-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0e17" />
            <stop offset="100%" stopColor="#030409" />
          </linearGradient>
          <radialGradient id="d2-horizon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(90,140,220,0.42)" />
            <stop offset="100%" stopColor="rgba(90,140,220,0)" />
          </radialGradient>
          <radialGradient id="d2-padglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(130,190,255,0.65)" />
            <stop offset="100%" stopColor="rgba(130,190,255,0)" />
          </radialGradient>
          <linearGradient id="d2-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(140,190,255,0)" />
            <stop offset="36%" stopColor="rgba(150,200,255,0.34)" />
            <stop offset="50%" stopColor="rgba(235,248,255,0.85)" />
            <stop offset="64%" stopColor="rgba(150,200,255,0.34)" />
            <stop offset="100%" stopColor="rgba(140,190,255,0)" />
          </linearGradient>
          <linearGradient id="d2-beamcore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(225,242,255,0)" />
            <stop offset="45%" stopColor="rgba(225,242,255,0.72)" />
            <stop offset="100%" stopColor="rgba(244,251,255,0.95)" />
          </linearGradient>
          <radialGradient id="d2-flash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,1)" />
            <stop offset="34%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="d2-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f2f9ff" />
            <stop offset="100%" stopColor="#5ea8ff" />
          </radialGradient>
          <linearGradient id="d2-vignL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(2,3,8,0.85)" />
            <stop offset="100%" stopColor="rgba(2,3,8,0)" />
          </linearGradient>
          <linearGradient id="d2-vignR" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(2,3,8,0.85)" />
            <stop offset="100%" stopColor="rgba(2,3,8,0)" />
          </linearGradient>
          <linearGradient id="d2-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(5,7,12,0)" />
            <stop offset="100%" stopColor="rgba(5,7,12,0.8)" />
          </linearGradient>
        </defs>

        {/* sky */}
        <rect x={-420} y={-260} width={2440} height={1160} fill="url(#d2-sky)" />

        <g ref={rotRef}>
          <SceneCtx.Provider value={registry}>
            <City2D />
            <Meadow2D />
            <Arrival2D />

            {/* vignette props behind the agents */}
            <VignettesBack />

            {/* society */}
            <HeroRobot2D />
            {BOTS.map((b) => (
              <Bot2D key={b.id} spec={b} />
            ))}

            {/* vignette props in front of the agents */}
            <VignettesFront />

            <Digital2D />
          </SceneCtx.Provider>
        </g>

        {/* screen-space overlays (day-soft) */}
        <rect x={-420} y={-260} width={2440} height={1160} fill="url(#d2-haze)" opacity={0.14} />
        <rect x={-420} y={-260} width={560} height={1160} fill="url(#d2-vignL)" opacity={0.28} />
        <rect x={1420} y={-260} width={560} height={1160} fill="url(#d2-vignR)" opacity={0.28} />
        <ArrivalFlash />
      </svg>
    </div>
  );
}
