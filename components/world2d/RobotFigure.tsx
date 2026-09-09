"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Robot part registry — instead of threading a bundle of ref objects
 * through props (which the React compiler lint forbids mutating), the
 * figure tags its interactive nodes with data-part attributes and the
 * owner collects them once after mount. Updaters then drive plain
 * SVGElements inside the rAF loop.
 */
export type PartName =
  | "shadow"
  | "ring"
  | "body"
  | "legL"
  | "legR"
  | "kneeL"
  | "kneeR"
  | "torso"
  | "armL"
  | "armR"
  | "elbowL"
  | "elbowR"
  | "head"
  | "eyeL"
  | "eyeR"
  | "coreGlow"
  | "coreGlow2"
  | "core"
  | "tipGlow";

export type RobotParts = Partial<Record<PartName, SVGElement>>;

/** Pivot constants (local robot space, feet at 0,0). */
export const HIP_L = { x: -11, y: -58 };
export const HIP_R = { x: 11, y: -58 };
export const KNEE_L = { x: -11, y: -32 };
export const KNEE_R = { x: 11, y: -32 };
export const SHO_L = { x: -30, y: -114 };
export const SHO_R = { x: 30, y: -114 };
export const ELBOW_L = { x: -31, y: -82 };
export const ELBOW_R = { x: 31, y: -82 };
export const NECK = { x: 0, y: -128 };
export const EYE_L = { x: -9.5, y: -156.5 };
export const EYE_R = { x: 9.5, y: -156.5 };

/** Per-agent identity — silhouettes stay brand-consistent, details differ. */
export type RobotVariant = {
  head?: "crest" | "dome" | "block";
  antenna?: "whip" | "twin" | "bud";
  pack?: boolean;
  headset?: boolean;
};

/**
 * Hard-surface armor palette — authored mecha look (angular plates,
 * 3-tone flat shading, panel lines, vents, pistons). No capsules.
 */
const C = {
  suit: "#141a2a",
  plate: "#252f47",
  plateLo: "#1a2338",
  plateHi: "#354263",
  dark: "#0c1120",
  line: "#0a0e1b",
  glass: "#0a1322",
  coreDot: "#eaf6ff",
  tip: "#ff8a2b",
};

/** Thigh plate + bevel (shared by both legs via x mirror flag). */
function Thigh({ m }: { m: number }) {
  return (
    <g>
      <polygon
        points={
          m < 0
            ? "-21,-66 -1,-66 3,-40 -19,-36"
            : "1,-66 21,-66 19,-36 -3,-40"
        }
        fill={C.plate}
      />
      <polygon
        points={
          m < 0 ? "-21,-66 -1,-66 -1,-62 -20,-62" : "1,-66 21,-66 21,-62 2,-62"
        }
        fill={C.plateHi}
      />
      <path
        d={m < 0 ? "M -17 -52 L 0 -50" : "M 17 -52 L 0 -50"}
        stroke={C.line}
        strokeWidth={1.2}
        fill="none"
      />
    </g>
  );
}

/** Shin + ankle + boot, authored centered on the leg axis (toe points +x). */
function Shin() {
  return (
    <g>
      <polygon points="-7,-32 9,-34 12,-12 -3,-8" fill={C.plate} />
      <polygon points="-7,-32 9,-34 9,-30 -6,-28" fill={C.plateHi} opacity={0.8} />
      <path d="M -3 -22 L 9 -23" stroke={C.line} strokeWidth={1.2} fill="none" />
      <rect x={-5} y={-13} width={14} height={5} fill={C.dark} />
      <polygon points="-13,-8 8,-8 14,-2 14,0 -13,0" fill={C.plateLo} />
      <polygon points="9,-8 14,-2 14,0 4,0" fill={C.plateHi} />
      <rect x={-13} y={-1.6} width={27} height={1.6} fill={C.dark} />
    </g>
  );
}

/**
 * Vector mecha — angular silhouettes, layered plating, tactical visor,
 * articulated knees/elbows (no more floating joints), hex core housing.
 */
export function RobotFigure({
  accent,
  rootRef,
  v,
}: {
  accent: string;
  rootRef: RefObject<SVGGElement | null>;
  v?: RobotVariant;
}) {
  const head = v?.head ?? "crest";
  const antenna = v?.antenna ?? "whip";
  const pack = v?.pack ?? false;
  const headset = v?.headset ?? false;
  return (
    <g ref={rootRef} opacity={0}>
      <ellipse data-part="shadow" cx={0} cy={1.5} rx={30} ry={6} fill="#000" opacity={0.4} />
      <circle data-part="ring" r={30} fill="none" stroke={accent} strokeWidth={2} opacity={0} />
      <g data-part="body">
        {/* ============ LEFT LEG (hip -11,-58 / knee -11,-32) ============ */}
        <g data-part="legL">
          <rect x={-24} y={-60} width={3} height={20} fill={C.dark} />
          <circle cx={-22.5} cy={-58} r={2} fill={C.plateHi} />
          <circle cx={-22.5} cy={-42} r={2} fill={C.plateHi} />
          <Thigh m={-1} />
          <g data-part="kneeL">
            <g transform="translate(-11 0)">
              <Shin />
            </g>
          </g>
          {/* knee cap covers the joint */}
          <polygon points="-19,-38 -3,-40 -1,-26 -13,-24" fill={C.plateHi} />
          <polygon points="-19,-38 -3,-40 -3,-36 -18,-34" fill={C.plate} />
          <circle cx={-8} cy={-31} r={1.8} fill={accent} opacity={0.85} />
        </g>
        {/* ============ RIGHT LEG (hip 11,-58 / knee 11,-32) ============ */}
        <g data-part="legR">
          <rect x={21} y={-60} width={3} height={20} fill={C.dark} />
          <circle cx={22.5} cy={-58} r={2} fill={C.plateHi} />
          <circle cx={22.5} cy={-42} r={2} fill={C.plateHi} />
          <Thigh m={1} />
          <g data-part="kneeR">
            <g transform="translate(11 0)">
              <Shin />
            </g>
          </g>
          <polygon points="3,-38 19,-40 13,-24 1,-26" fill={C.plateHi} />
          <polygon points="3,-38 19,-40 18,-34 3,-36" fill={C.plate} />
          <circle cx={8} cy={-31} r={1.8} fill={accent} opacity={0.85} />
        </g>
        {/* ============ TORSO ============ */}
        <g data-part="torso">
          {pack && (
            <g>
              <rect x={-32} y={-120} width={64} height={30} rx={9} fill={C.plateLo} />
              <rect x={-31} y={-116} width={6} height={14} rx={2} fill={C.dark} />
              <rect x={25} y={-116} width={6} height={14} rx={2} fill={C.dark} />
              <rect x={-30} y={-92} width={8} height={9} rx={2.5} fill={C.dark} />
              <rect x={22} y={-92} width={8} height={9} rx={2.5} fill={C.dark} />
            </g>
          )}
          {/* pelvis block */}
          <polygon points="-17,-72 17,-72 13,-54 -13,-54" fill={C.plateLo} />
          <rect x={-15} y={-71} width={30} height={3} fill={C.plateHi} />
          <polygon points="-8,-54 8,-54 5,-46 -5,-46" fill={C.dark} />
          <circle cx={-11} cy={-58} r={5} fill={C.dark} />
          <circle cx={11} cy={-58} r={5} fill={C.dark} />
          {/* waist taper */}
          <polygon points="-14,-62 14,-62 19,-94 -19,-94" fill={C.plate} />
          <polygon points="-4,-94 4,-94 5,-64 -5,-64" fill={C.plateLo} />
          <path d="M 0 -92 L 0 -66" stroke={C.line} strokeWidth={1.2} fill="none" />
          <rect x={-18} y={-89} width={6} height={2.2} fill={C.dark} opacity={0.85} />
          <rect x={-18} y={-84.5} width={6} height={2.2} fill={C.dark} opacity={0.85} />
          <rect x={12} y={-89} width={6} height={2.2} fill={C.dark} opacity={0.85} />
          <rect x={12} y={-84.5} width={6} height={2.2} fill={C.dark} opacity={0.85} />
          {/* chest trapezoid */}
          <polygon points="-19,-94 19,-94 26,-126 -26,-126" fill={C.plate} />
          <polygon points="-26,-126 26,-126 25,-121 -25,-121" fill={C.plateHi} />
          <polygon points="-23,-121 -3,-121 -5,-100 -21,-100" fill={C.plateHi} />
          <polygon points="3,-121 23,-121 21,-100 5,-100" fill={C.plateHi} />
          <path d="M -21 -100 L -5 -100 M 5 -100 L 21 -100" stroke={C.line} strokeWidth={1.2} fill="none" />
          <polygon points="-4,-122 4,-122 5,-98 -5,-98" fill={C.plateLo} />
          {/* hex core housing */}
          <polygon points="0,-108 10.4,-102 10.4,-90 0,-84 -10.4,-90 -10.4,-102" fill={C.dark} />
          <polygon
            points="0,-108 10.4,-102 10.4,-90 0,-84 -10.4,-90 -10.4,-102"
            fill="none"
            stroke={C.line}
            strokeWidth={1.5}
          />
          <circle data-part="coreGlow" cx={0} cy={-96} r={13} fill={accent} opacity={0.14} />
          <circle data-part="coreGlow2" cx={0} cy={-96} r={7.5} fill={accent} opacity={0.3} />
          <circle data-part="core" cx={0} cy={-96} r={4.5} fill={C.coreDot} />
          <rect x={-14} y={-80} width={7} height={2.4} fill={C.dark} opacity={0.75} />
          <rect x={-5} y={-80} width={7} height={2.4} fill={C.dark} opacity={0.75} />
          <rect x={4} y={-80} width={7} height={2.4} fill={C.dark} opacity={0.75} />
          <polygon points="-19,-94 -26,-126 -24.6,-126 -17.8,-94" fill={accent} opacity={0.35} />
          <polygon points="-13,-126 13,-126 10,-133 -10,-133" fill={C.dark} />
          <circle cx={-30} cy={-114} r={5.5} fill={C.dark} />
          <circle cx={30} cy={-114} r={5.5} fill={C.dark} />
        </g>
        {/* ============ LEFT ARM (shoulder -30,-114 / elbow -31,-82) ============ */}
        <g data-part="armL">
          <polygon points="-36,-112 -25,-110 -27,-86 -34,-88" fill={C.plate} />
          <path d="M -33 -104 L -27 -103" stroke={C.line} strokeWidth={1.2} fill="none" />
          <g data-part="elbowL">
            <polygon points="-36.5,-82 -26.5,-84 -24.5,-56 -33,-54" fill={C.plate} />
            <polygon points="-36.5,-82 -26.5,-84 -26.8,-80 -36,-78" fill={C.plateHi} opacity={0.8} />
            <path d="M -34 -62 L -26 -63" stroke={C.line} strokeWidth={1.2} fill="none" />
            <rect x={-33} y={-70} width={4} height={2} fill={accent} opacity={0.7} />
            <rect x={-32.5} y={-57} width={7.5} height={4} fill={C.dark} />
            <polygon points="-34,-54 -25.5,-54 -23.5,-44 -31.5,-42" fill={C.plateHi} />
          </g>
          <circle cx={-31} cy={-82} r={4} fill={C.dark} />
        </g>
        {/* ============ RIGHT ARM (shoulder 30,-114 / elbow 31,-82) ============ */}
        <g data-part="armR">
          <polygon points="25,-110 36,-112 34,-88 27,-86" fill={C.plate} />
          <path d="M 27 -103 L 33 -104" stroke={C.line} strokeWidth={1.2} fill="none" />
          <g data-part="elbowR">
            <polygon points="26.5,-84 36.5,-82 33,-54 24.5,-56" fill={C.plate} />
            <polygon points="26.5,-84 36.5,-82 36,-78 26.8,-80" fill={C.plateHi} opacity={0.8} />
            <path d="M 26 -63 L 34 -62" stroke={C.line} strokeWidth={1.2} fill="none" />
            <rect x={29} y={-70} width={4} height={2} fill={accent} opacity={0.7} />
            <rect x={25} y={-57} width={7.5} height={4} fill={C.dark} />
            <polygon points="25.5,-54 34,-54 31.5,-42 23.5,-44" fill={C.plateHi} />
          </g>
          <circle cx={31} cy={-82} r={4} fill={C.dark} />
        </g>
        {/* ============ PAULDRONS (static armor over shoulder joints) ============ */}
        <g>
          <polygon points="-42,-119 -20,-124 -17,-112 -28,-105 -39,-109" fill={C.plateHi} />
          <polygon points="-39,-109 -28,-105 -26,-103 -37,-106" fill={C.plateLo} />
          <polygon points="-42,-119 -20,-124 -20.3,-122 -41.5,-117" fill={accent} opacity={0.8} />
          <polygon points="20,-124 42,-119 41.5,-117 20.3,-122" fill={accent} opacity={0.8} />
          <polygon points="20,-124 42,-119 39,-109 28,-105 17,-112" fill={C.plateHi} />
          <polygon points="28,-105 39,-109 37,-106 26,-103" fill={C.plateLo} />
        </g>
        {/* ============ HEAD (pivot 0,-128) ============ */}
        <g data-part="head">
          <polygon points="-9,-124 9,-124 7,-134 -7,-134" fill={C.suit} />
          <polygon points="-21,-161 -17,-163 -17,-147 -20,-149" fill={C.plateLo} />
          <polygon points="17,-163 21,-161 20,-149 17,-147" fill={C.plateLo} />
          {head === "crest" && (
            <g>
              <polygon points="-17,-172 17,-172 20,-160 15,-136 -15,-136 -20,-160" fill={C.plate} />
              <polygon points="-17,-172 17,-172 16,-167 -16,-167" fill={C.plateHi} />
              <polygon points="-2,-172 6,-172 3.5,-182 -3,-180" fill={C.plateHi} />
            </g>
          )}
          {head === "dome" && (
            <g>
              <path
                d="M -18 -170 Q -18 -173 -13 -173 L 13 -173 Q 18 -170 19 -160 L 15 -136 L -15 -136 L -19 -160 Z"
                fill={C.plate}
              />
              <path d="M -12 -168 Q 0 -173 12 -168" stroke={C.plateHi} strokeWidth={3} fill="none" />
            </g>
          )}
          {head === "block" && (
            <g>
              <polygon points="-19,-172 19,-172 20,-156 16,-136 -16,-136 -20,-156" fill={C.plate} />
              <polygon points="-19,-172 19,-172 18,-167 -18,-167" fill={C.plateHi} />
              <rect x={-9} y={-181} width={18} height={7} rx={3.5} fill={C.plateHi} />
              <rect x={-6} y={-175} width={4} height={4} fill={C.plateLo} />
              <rect x={2} y={-175} width={4} height={4} fill={C.plateLo} />
            </g>
          )}
          <polygon points="-15,-178 -7,-178 -7,-172 -15,-172" fill={C.plateLo} opacity={head === "dome" ? 0 : 1} />
          <circle cx={-11} cy={-175} r={1.6} fill={accent} opacity={0.9} />
          <path d="M -15 -164 L 15 -164" stroke={C.line} strokeWidth={1.2} fill="none" />
          {/* tactical visor */}
          <polygon points="-16,-162 16,-162 18,-150 -18,-150" fill={C.glass} />
          <polygon points="-16,-162 16,-162 18,-150 -18,-150" fill="none" stroke={C.line} strokeWidth={1.2} />
          <polygon points="-13,-159 4,-159 3,-157 -13,-157" fill={accent} opacity={0.16} />
          <polygon data-part="eyeL" points="-13.5,-160.5 -5.5,-160.5 -6,-152.5 -14,-152.5" fill={accent} />
          <polygon data-part="eyeR" points="5.5,-160.5 13.5,-160.5 14,-152.5 6,-152.5" fill={accent} />
          <polygon points="-10,-150 10,-150 7,-144 -7,-144" fill={C.plateLo} />
          <rect x={-15} y={-147} width={7} height={1.8} fill={C.dark} opacity={0.8} />
          <rect x={-15} y={-143} width={7} height={1.8} fill={C.dark} opacity={0.8} />
          <rect x={8} y={-147} width={7} height={1.8} fill={C.dark} opacity={0.8} />
          <rect x={8} y={-143} width={7} height={1.8} fill={C.dark} opacity={0.8} />
          {/* antennas */}
          {antenna === "whip" && (
            <g>
              <line x1={10} y1={-172} x2={14} y2={-190} stroke={C.dark} strokeWidth={2.5} />
              <circle data-part="tipGlow" cx={14.5} cy={-192.5} r={7.5} fill={C.tip} opacity={0.25} />
              <circle cx={14.5} cy={-192.5} r={3.5} fill={C.tip} />
            </g>
          )}
          {antenna === "twin" && (
            <g>
              <line x1={-10} y1={-172} x2={-15} y2={-183} stroke={C.dark} strokeWidth={2.2} />
              <circle cx={-15.5} cy={-184.5} r={2} fill={accent} />
              <line x1={10} y1={-172} x2={16} y2={-182} stroke={C.dark} strokeWidth={2.2} />
              <circle data-part="tipGlow" cx={16.5} cy={-184} r={6.5} fill={C.tip} opacity={0.25} />
              <circle cx={16.5} cy={-184} r={3} fill={C.tip} />
            </g>
          )}
          {antenna === "bud" && (
            <g>
              <line x1={6} y1={-172} x2={9} y2={-181} stroke={C.dark} strokeWidth={2.4} />
              <circle data-part="tipGlow" cx={9.5} cy={-183} r={7} fill={C.tip} opacity={0.25} />
              <circle cx={9.5} cy={-183} r={3.5} fill={C.tip} />
            </g>
          )}
          {headset && (
            <g>
              <path d="M -20 -157 Q 0 -177 20 -157" stroke={C.plateHi} strokeWidth={4} fill="none" />
              <rect x={-24} y={-160} width={6.5} height={11} rx={3} fill={accent} stroke={C.line} strokeWidth={1} />
              <rect x={17.5} y={-160} width={6.5} height={11} rx={3} fill={accent} stroke={C.line} strokeWidth={1} />
              <line x1={21} y1={-149} x2={13} y2={-144} stroke={accent} strokeWidth={1.6} />
              <circle cx={12.5} cy={-143.5} r={1.8} fill={accent} />
            </g>
          )}
        </g>
      </g>
    </g>
  );
}

/** Collect [data-part] nodes under the robot root once mounted. */
export function useRobotParts(
  rootRef: RefObject<SVGGElement | null>
): RefObject<RobotParts> {
  const parts = useRef<RobotParts>({});
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const map: RobotParts = {};
    root.querySelectorAll<SVGElement>("[data-part]").forEach((el) => {
      const name = el.getAttribute("data-part") as PartName | null;
      if (name) map[name] = el;
    });
    parts.current = map;
  }, [rootRef]);
  return parts;
}
