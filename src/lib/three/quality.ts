/** Device capability detection for 3D quality tiers. */

export type Tier = "high" | "medium" | "low";

export type WorldQuality = {
  dpr: [number, number];
  particles: number;
  robots: number;
  buildings: number;
  grid: boolean;
  beams: number;
  parallax: boolean;
};

export const WORLD_QUALITY: Record<Tier, WorldQuality> = {
  high: {
    dpr: [1, 2],
    particles: 1500,
    robots: 7,
    buildings: 14,
    grid: true,
    beams: 2,
    parallax: true,
  },
  medium: {
    dpr: [1, 1.5],
    particles: 800,
    robots: 5,
    buildings: 11,
    grid: true,
    beams: 1,
    parallax: true,
  },
  low: {
    dpr: [1, 1],
    particles: 320,
    robots: 3,
    buildings: 9,
    grid: false,
    beams: 0,
    parallax: false,
  },
};

export function detectTier(): Tier {
  if (typeof window === "undefined") return "high";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const mobile = coarse || window.innerWidth < 768;

  if (mobile) return cores >= 8 && mem >= 6 ? "medium" : "low";
  if (cores >= 8 && mem >= 8) return "high";
  if (cores >= 4) return "medium";
  return "low";
}
