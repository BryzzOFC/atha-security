/**
 * Shared helpers for the 2D SVG scene test.
 * Camera is a viewBox rig: keyframed pan/zoom/roll in scroll-progress space,
 * plus a scroll-locked impact shake borrowed from the 3D SceneRig feel.
 * Portrait keys (px/py/ps) let narrow viewports reframe each vignette.
 */
import { ARRIVAL_IMPACT_P } from "@/lib/animations/arrival";
import {
  clamp,
  damp,
  easeOutBack,
  easeOutCubic,
  easeInOutCubic,
  easeOutQuart,
  lerp,
  seg,
  smoothstep,
} from "@/lib/animations/easing";

export {
  clamp,
  damp,
  easeOutBack,
  easeOutCubic,
  easeInOutCubic,
  easeOutQuart,
  lerp,
  seg,
  smoothstep,
};

/** Deterministic PRNG (mulberry32). */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hex color lerp (#rrggbb, t in 0..1) -> rgb() string. */
export function lerpColor(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(lerp((pa >> 16) & 255, (pb >> 16) & 255, t));
  const g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, t));
  const bl = Math.round(lerp(pa & 255, pb & 255, t));
  return `rgb(${r},${g},${bl})`;
}

export type CamKey = {
  p: number;
  x: number;
  y: number;
  s: number;
  r?: number;
  /** portrait-only overrides */
  px?: number;
  py?: number;
  ps?: number;
};

/** Camera choreography in world coordinates (viewBox 1600x900 design space). */
export const CAM: CamKey[] = [
  { p: 0.0, x: 800, y: 470, s: 1.04, r: 0 },
  { p: 0.12, x: 800, y: 495, s: 1.0, r: 0 },
  { p: 0.26, x: 872, y: 518, s: 1.06, r: 0.4 },
  { p: 0.385, x: 706, y: 552, s: 1.1, r: 0.05 },
  { p: 0.452, x: 622, y: 552, s: 1.32, r: 0 },
  { p: 0.505, x: 620, y: 548, s: 1.5, r: 0 },
  { p: 0.55, x: 640, y: 556, s: 1.3, r: 0 },
  // vignette 1 — programmer at the desk
  { p: 0.605, x: 420, y: 560, s: 1.42, r: 0, px: 420, py: 545, ps: 1.22 },
  // vignette 2 — four agents playing on the field
  { p: 0.665, x: 845, y: 592, s: 1.1, r: 0, px: 850, py: 580, ps: 0.85 },
  // vignette 3 — the lan house
  { p: 0.725, x: 1252, y: 585, s: 1.26, r: 0, px: 1252, py: 570, ps: 0.95 },
  // vignette 4 — benches, the whole squad
  { p: 0.79, x: 872, y: 588, s: 0.98, r: 0, px: 872, py: 566, ps: 0.7 },
  { p: 0.86, x: 810, y: 540, s: 1.0, r: 0 },
  { p: 0.9, x: 800, y: 502, s: 0.92, r: 0 },
  { p: 1.0, x: 800, y: 452, s: 0.98, r: 0 },
];

export function camAt(
  p: number,
  portrait = false
): { x: number; y: number; s: number; r: number } {
  const pick = (k: CamKey) => ({
    x: (portrait && k.px != null ? k.px : k.x),
    y: (portrait && k.py != null ? k.py : k.y),
    s: (portrait && k.ps != null ? k.ps : k.s),
    r: k.r ?? 0,
  });
  const k = CAM;
  if (p <= k[0].p) return pick(k[0]);
  for (let i = 0; i < k.length - 1; i++) {
    if (p >= k[i].p && p <= k[i + 1].p) {
      const t = smoothstep(seg(p, k[i].p, k[i + 1].p));
      const a = pick(k[i]);
      const b = pick(k[i + 1]);
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        s: lerp(a.s, b.s, t),
        r: lerp(a.r, b.r, t),
      };
    }
  }
  return pick(k[k.length - 1]);
}

/** Scroll-locked impact shake, decaying — pure function of p. */
export function impactShake(p: number): { x: number; y: number } {
  const d = p - ARRIVAL_IMPACT_P;
  if (d < 0 || d > 0.06) return { x: 0, y: 0 };
  const amp = 11 * Math.exp(-55 * d);
  return { x: amp * Math.sin(d * 890), y: amp * 0.65 * Math.cos(d * 820) };
}

/** Cheap deterministic flicker 0.15..1 (boot/bootup noise). */
export function flicker(t: number, seed: number, speed = 31): number {
  const v =
    Math.sin(t * speed + seed * 12.9898) *
    Math.sin(t * speed * 1.7 + seed * 78.233);
  return v > 0.2 ? 1 : v > -0.4 ? 0.55 : 0.15;
}

/** Triangle wave in [-1, 1] with period 1. */
export function tri(t: number): number {
  const x = t - Math.floor(t);
  return 1 - 4 * Math.abs(x - 0.5);
}
