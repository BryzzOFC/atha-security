"use client";

import { useSyncExternalStore } from "react";
import { detectTier, type Tier } from "@/lib/three/quality";

let cached: Tier | null = null;

function getTier(): Tier {
  if (cached === null) cached = detectTier();
  return cached;
}

const emptySubscribe = () => () => {};

/** Hydration-safe device capability tier. */
export function useTier(): Tier {
  return useSyncExternalStore(
    emptySubscribe,
    getTier,
    () => "high" as Tier // server default; corrected after hydration
  );
}
