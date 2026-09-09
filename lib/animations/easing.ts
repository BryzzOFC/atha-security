/** Shared animation math for scroll-driven 3D and DOM motion. */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1,
  clamped = true
): number {
  const t = (v - inMin) / (inMax - inMin);
  const raw = outMin + (outMax - outMin) * t;
  if (!clamped) return raw;
  if (outMin <= outMax) return clamp(raw, outMin, outMax);
  return clamp(raw, outMax, outMin);
}

/** Normalized progress of `p` inside segment [start, end]. */
export const seg = (p: number, start: number, end: number) => mapRange(p, start, end, 0, 1, true);

export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

export const easeOutQuart = (t: number) => 1 - Math.pow(1 - clamp(t), 4);

export const easeInOutCubic = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/** Back-easing with overshoot — used for mechanical "snap into place" pops. */
export const easeOutBack = (t: number, overshoot = 1.7) => {
  const x = clamp(t) - 1;
  return 1 + (overshoot + 1) * x * x * x + overshoot * x * x;
};

/** Shortest-path angle interpolation (radians). */
export const lerpAngle = (a: number, b: number, t: number) => {
  const twoPi = Math.PI * 2;
  let d = (b - a) % twoPi;
  if (d > Math.PI) d -= twoPi;
  if (d < -Math.PI) d += twoPi;
  return a + d * clamp(t);
};

/** Frame-rate independent damping (exponential smoothing). */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * Math.max(dt, 0.0001)));
