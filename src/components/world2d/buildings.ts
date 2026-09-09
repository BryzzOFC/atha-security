/**
 * Deterministic skyline data for the 2D city — shared by City2D (solid
 * buildings + lit windows) and Digital2D (wireframe overlays), so both
 * layers stay perfectly registered.
 */
import { mulberry32 } from "./util";

export type Win = { x: number; y: number; warm: boolean };
export type Bld = {
  x: number;
  w: number;
  h: number;
  base: number;
  fill: string;
  top: string;
  wins: Win[];
  beacon: boolean;
};

type GenOpts = {
  seed: number;
  count: number;
  base: number;
  hMin: number;
  hMax: number;
  xMin: number;
  xMax: number;
  fillA: string;
  fillB: string;
  winGap: number;
  litProb: number;
};

function gen(o: GenOpts): Bld[] {
  const rnd = mulberry32(o.seed);
  const out: Bld[] = [];
  for (let i = 0; i < o.count; i++) {
    const w = 34 + rnd() * 66;
    const h = o.hMin + rnd() * (o.hMax - o.hMin);
    const x = o.xMin + rnd() * (o.xMax - o.xMin);
    const fill = rnd() > 0.5 ? o.fillA : o.fillB;
    const wins: Win[] = [];
    const cols = Math.max(1, Math.floor((w - 14) / o.winGap));
    const rows = Math.max(2, Math.floor((h - 26) / 26));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (rnd() < o.litProb) {
          wins.push({
            x: 8 + c * o.winGap,
            y: -h + 16 + r * 26,
            warm: rnd() < 0.14,
          });
        }
      }
    }
    out.push({
      x,
      w,
      h,
      base: o.base,
      fill,
      top: fill,
      wins,
      beacon: h > o.hMax * 0.82 && rnd() < 0.7,
    });
  }
  return out;
}

/** Far skyline — small, darker, behind everything. */
export const FAR: Bld[] = gen({
  seed: 11,
  count: 16,
  base: 600,
  hMin: 55,
  hMax: 175,
  xMin: -80,
  xMax: 1680,
  fillA: "#080b13",
  fillB: "#0a0e17",
  winGap: 18,
  litProb: 0.1,
});

/** Mid skyline — the readable layer the camera pushes through. */
export const MID: Bld[] = gen({
  seed: 23,
  count: 22,
  base: 636,
  hMin: 95,
  hMax: 295,
  xMin: -60,
  xMax: 1660,
  fillA: "#0c111d",
  fillB: "#121a2b",
  winGap: 17,
  litProb: 0.42,
});
