/**
 * Robot roster + stage anchors for the 2D society phase.
 * The squad spreads across vignettes on the meadow: one programmer, four
 * players, three at the lan house — then everyone meets at the benches
 * (3 per bench). Each agent carries a variant so no two look alike.
 */
import type { RobotVariant } from "./RobotFigure";

export const IMPACT = { x: 620, y: 648 };

/** Hero's bench spot (center bench, middle seat). */
export const HERO_BENCH = { x: 872, y: 662 };

export const SIT_P = 0.755; // scroll progress where the squad moves to benches

export type Behavior =
  | "code"
  | "dribble"
  | "run"
  | "kick"
  | "juggle"
  | "lanA"
  | "lanB"
  | "lanC";

export type BotSpec = {
  id: string;
  x: number;
  y: number;
  s: number;
  behavior: Behavior;
  accent: string;
  /** Scroll progress where this agent pops in (staggered formation). */
  spawn: number;
  /** Facing multiplier (-1 flips the figure). */
  face?: number;
  v: RobotVariant;
  /** Bench seat world position (ground point under the bench center). */
  bench: { x: number; y: number };
};

export const BOTS: BotSpec[] = [
  {
    id: "coder", x: 428, y: 648, s: 0.92, behavior: "code",
    accent: "#ffcf4d", spawn: 0.575, face: -1,
    v: { head: "dome", antenna: "twin" },
    bench: { x: 646, y: 662 },
  },
  {
    id: "dribbler", x: 748, y: 672, s: 0.86, behavior: "dribble",
    accent: "#4dd8ff", spawn: 0.636,
    v: { head: "block", antenna: "bud" },
    bench: { x: 690, y: 662 },
  },
  {
    id: "runner", x: 872, y: 652, s: 0.9, behavior: "run",
    accent: "#ff8a2b", spawn: 0.652,
    v: { head: "crest", antenna: "whip", pack: true },
    bench: { x: 1011, y: 662 },
  },
  {
    id: "kicker", x: 1002, y: 670, s: 0.94, behavior: "kick",
    accent: "#ff6f91", spawn: 0.668, face: -1,
    v: { head: "crest", antenna: "twin" },
    bench: { x: 1054, y: 662 },
  },
  {
    id: "juggler", x: 688, y: 626, s: 0.76, behavior: "juggle",
    accent: "#b7e0ff", spawn: 0.684,
    v: { head: "dome", antenna: "bud" },
    bench: { x: 1097, y: 662 },
  },
  {
    id: "lanA", x: 1180, y: 652, s: 0.9, behavior: "lanA",
    accent: "#8ea2ff", spawn: 0.700, face: 1,
    v: { head: "block", antenna: "twin", headset: true },
    bench: { x: 828, y: 662 },
  },
  {
    id: "lanB", x: 1262, y: 656, s: 0.9, behavior: "lanB",
    accent: "#ff7a5c", spawn: 0.714, face: 1,
    v: { head: "dome", antenna: "whip", headset: true },
    bench: { x: 916, y: 662 },
  },
  {
    id: "lanC", x: 1344, y: 650, s: 0.88, behavior: "lanC",
    accent: "#4ecdc4", spawn: 0.728, face: 1,
    v: { head: "crest", antenna: "bud", headset: true, pack: true },
    bench: { x: 734, y: 662 },
  },
];
