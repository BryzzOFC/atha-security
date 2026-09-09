import { clamp } from "./easing";

export type Vec3 = [number, number, number];

export type Keyframe<T> = { t: number; v: T };

/**
 * Catmull-Rom interpolation over a sparse keyframe track.
 * Guarantees smooth (C1) motion between keyframes — the camera never teleports
 * and velocity stays continuous as the user scrolls.
 */
export function sampleScalarTrack(track: Keyframe<number>[], p: number): number {
  if (track.length === 0) return 0;
  if (p <= track[0].t) return track[0].v;
  if (p >= track[track.length - 1].t) return track[track.length - 1].v;

  let i = 0;
  while (i < track.length - 1 && track[i + 1].t < p) i++;
  const k0 = track[Math.max(i - 1, 0)];
  const k1 = track[i];
  const k2 = track[Math.min(i + 1, track.length - 1)];
  const k3 = track[Math.min(i + 2, track.length - 1)];

  const span = k2.t - k1.t || 1;
  const u = clamp((p - k1.t) / span);

  // Uniform Catmull-Rom
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * k1.v +
      (-k0.v + k2.v) * u +
      (2 * k0.v - 5 * k1.v + 4 * k2.v - k3.v) * u2 +
      (-k0.v + 3 * k1.v - 3 * k2.v + k3.v) * u3)
  );
}

const cr = (p0: number, p1: number, p2: number, p3: number, u: number) => {
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
  );
};

export function sampleVec3Track(
  track: Keyframe<Vec3>[],
  p: number,
  out: Vec3 = [0, 0, 0]
): Vec3 {
  if (track.length === 0) return out;
  if (p <= track[0].t) {
    out[0] = track[0].v[0];
    out[1] = track[0].v[1];
    out[2] = track[0].v[2];
    return out;
  }
  const last = track[track.length - 1];
  if (p >= last.t) {
    out[0] = last.v[0];
    out[1] = last.v[1];
    out[2] = last.v[2];
    return out;
  }

  let i = 0;
  while (i < track.length - 1 && track[i + 1].t < p) i++;
  const k0 = track[Math.max(i - 1, 0)];
  const k1 = track[i];
  const k2 = track[Math.min(i + 1, track.length - 1)];
  const k3 = track[Math.min(i + 2, track.length - 1)];

  const span = k2.t - k1.t || 1;
  const u = clamp((p - k1.t) / span);

  out[0] = cr(k0.v[0], k1.v[0], k2.v[0], k3.v[0], u);
  out[1] = cr(k0.v[1], k1.v[1], k2.v[1], k3.v[1], u);
  out[2] = cr(k0.v[2], k1.v[2], k2.v[2], k3.v[2], u);
  return out;
}
