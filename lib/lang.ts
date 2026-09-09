"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "@/components/phone/script";

/**
 * Shared UI-language store (EN / PT-BR) — one source of truth for the
 * nav header toggle and the phone chat, so both stay perfectly in sync
 * anywhere on the page. Tiny external store + useSyncExternalStore:
 * no provider, no context, updates notify only the mounted consumers.
 */

let current: Lang = "en";
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot(): Lang {
  return current;
}

function getServerSnapshot(): Lang {
  return "en";
}

export function setLang(lang: Lang) {
  if (lang === current) return;
  current = lang;
  listeners.forEach((fn) => fn());
}

/** [lang, setLang] — reactive, shared across components. */
export function useLang(): [Lang, (lang: Lang) => void] {
  return [useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot), setLang];
}
