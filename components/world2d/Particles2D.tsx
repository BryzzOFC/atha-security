"use client";

import { useMemo, useRef } from "react";
import { useSceneUpdater } from "./SceneCtx";
import { mulberry32, seg } from "./util";

/**
 * Void dust: drifting motes that carry phase 1, then calm down as the city
 * forms. Mutated per-frame through refs — no re-renders.
 */
export default function Particles2D() {
  const refs = useRef<(SVGCircleElement | null)[]>([]);

  const parts = useMemo(() => {
    const rnd = mulberry32(42);
    return Array.from({ length: 84 }, (_, i) => ({
      x: -120 + rnd() * 1840,
      y: -140 + rnd() * 860,
      r: 0.8 + rnd() * 1.9,
      base: 0.14 + rnd() * 0.5,
      speed: 6 + rnd() * 16,
      tw: 0.5 + rnd() * 1.4,
      ph: rnd() * Math.PI * 2,
      warm: rnd() < 0.1,
      i,
    }));
  }, []);

  useSceneUpdater((p, t) => {
    const calm = seg(p, 0.12, 0.3) * 0.55;
    const digital = seg(p, 0.8, 0.9) * 0.5;
    for (const d of parts) {
      const el = refs.current[d.i];
      if (!el) continue;
      const span = 900;
      const y = -140 + ((((d.y - t * d.speed) % span) + span) % span);
      const x = d.x + Math.sin(t * 0.12 + d.ph) * 14;
      el.setAttribute("cx", x.toFixed(1));
      el.setAttribute("cy", y.toFixed(1));
      const tw = 0.62 + 0.38 * Math.sin(t * d.tw + d.ph);
      el.setAttribute(
        "opacity",
        (d.base * tw * (1 - calm - digital)).toFixed(3)
      );
    }
  });

  return (
    <g>
      {parts.map((d) => (
        <circle
          key={d.i}
          ref={(el) => {
            refs.current[d.i] = el;
          }}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={d.warm ? "#ffb26b" : "#9fc6ff"}
          opacity={0}
        />
      ))}
    </g>
  );
}
