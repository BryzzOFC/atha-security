"use client";

import { createContext, useContext, useEffect, useRef } from "react";

/**
 * Single-rAF registry: the 2D scene runs one animation loop and every
 * subsystem (city, arrival FX, robots, digital shell) registers an updater
 * that is called with the damped scroll progress and scene time.
 * No React re-renders happen — updaters mutate SVG attributes directly.
 */
export type Updater = (p: number, t: number) => void;

export const SceneCtx = createContext<{ add: (u: Updater) => () => void } | null>(
  null
);

export function useSceneUpdater(update: Updater) {
  const reg = useContext(SceneCtx);
  const ref = useRef(update);
  useEffect(() => {
    ref.current = update;
  });
  useEffect(() => {
    if (!reg) return;
    return reg.add((p: number, t: number) => ref.current(p, t));
  }, [reg]);
}
