"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

function checkWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cached = Boolean(gl);
  } catch {
    cached = false;
  }
  return cached;
}

const emptySubscribe = () => () => {};

/** Detects WebGL availability. Hydration-safe via useSyncExternalStore. */
export function useWebGL(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    checkWebGL,
    () => true // assume available on the server; corrected after hydration
  );
}
