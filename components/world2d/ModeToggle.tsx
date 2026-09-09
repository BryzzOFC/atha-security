"use client";

import { Layers } from "lucide-react";
import { setSceneMode, useSceneMode } from "./sceneMode";

/**
 * Floating A/B chip for the scene-style test: switches the hero experience
 * between the SVG vector world (2D) and the WebGL world (3D). Lives inside
 * the hero sticky container, so it disappears with the hero on scroll.
 */
export default function ModeToggle() {
  const mode = useSceneMode();
  return (
    <button
      type="button"
      onClick={() => setSceneMode(mode === "2d" ? "3d" : "2d")}
      title="Scene style A/B test — 2D vector world / 3D WebGL world"
      aria-pressed={mode === "2d"}
      className="glass-panel absolute bottom-5 left-5 z-30 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[9px] font-medium tracking-[0.22em] text-white/55 transition-colors hover:border-white/25 hover:text-white"
    >
      <Layers className="h-3 w-3" aria-hidden="true" />
      <span className="translate-y-px">VIEW: {mode === "2d" ? "2D" : "3D"}</span>
    </button>
  );
}
