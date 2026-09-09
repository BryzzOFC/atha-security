"use client";

import { useSyncExternalStore } from "react";

/**
 * Scene style A/B test store: "3d" (WebGL world) vs "2d" (SVG vector world).
 * - Deep-linkable via ?view=2d / ?view=3d
 * - Persisted to localStorage
 * - Default is always "3d" so nothing changes for existing visitors
 */
export type SceneMode = "3d" | "2d";

const KEY = "atha-scene-mode";

let mode: SceneMode = "3d";
let inited = false;
const subs = new Set<() => void>();

function init() {
  if (inited || typeof window === "undefined") return;
  inited = true;
  try {
    const q = new URLSearchParams(window.location.search).get("view");
    if (q === "2d" || q === "3d") {
      mode = q;
      return;
    }
    if (localStorage.getItem(KEY) === "2d") mode = "2d";
  } catch {
    /* private mode etc — keep default */
  }
}

export function useSceneMode(): SceneMode {
  return useSyncExternalStore(
    (cb) => {
      init();
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => {
      init();
      return mode;
    },
    () => "3d" as SceneMode
  );
}

export function setSceneMode(next: SceneMode) {
  init();
  mode = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    const url =
      next === "2d"
        ? "/?view=2d"
        : window.location.pathname + window.location.hash;
    window.history.replaceState(null, "", url);
  }
  subs.forEach((fn) => fn());
}
