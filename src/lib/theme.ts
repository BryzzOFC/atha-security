"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared color-theme store (light / dark) — mirrors the lang.ts pattern:
 * a tiny external store + useSyncExternalStore, no provider, no context.
 * The initial value is applied by the before-paint script in layout.tsx
 * (reads localStorage("atha-theme"), defaults to the clean light canvas),
 * so this store simply adopts whatever class the <html> already carries.
 */

export type Theme = "light" | "dark";

let current: Theme = "light";
let hydrated = false;

const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot(): Theme {
  if (!hydrated && typeof document !== "undefined") {
    current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    hydrated = true;
  }
  return current;
}

function getServerSnapshot(): Theme {
  return "light";
}

/** Applies the class + persists the choice; notifies subscribers. */
export function setTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  if (theme === current && hydrated) return;

  // one-shot smooth crossfade of colors while the class flips
  const root = document.documentElement;
  root.classList.add("theme-anim");
  window.clearTimeout((setTheme as unknown as { _t?: number })._t);
  (setTheme as unknown as { _t?: number })._t = window.setTimeout(() => {
    root.classList.remove("theme-anim");
  }, 550);

  root.classList.toggle("dark", theme === "dark");
  current = theme;
  hydrated = true;
  try {
    localStorage.setItem("atha-theme", theme);
  } catch {
    /* private mode — theme just won't persist */
  }
  listeners.forEach((fn) => fn());
}

/** [theme, setTheme] — reactive, shared across components. */
export function useTheme(): [Theme, (theme: Theme) => void] {
  return [useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot), setTheme];
}
