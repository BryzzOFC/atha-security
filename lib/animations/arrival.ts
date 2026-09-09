/**
 * Single source of truth for the "First Arrival" cinematic — the moment the
 * first agent drops out of the sky. Shared by ArrivalFX, Robot, SceneRig
 * (impact shake) and PhaseCaptions so every system stays frame-locked.
 *
 * All keys are expressed in scroll-progress space (0..1 of the whole page)
 * and in arrival-local time (0..1 inside the window).
 */
export const ARRIVAL = {
  /** Scroll progress where the summon begins (reticle + charge). */
  from: 0.385,
  /** Scroll-progress length of the whole arrival. */
  span: 0.145,
  // ---- arrival-local keys ----
  /** Reticle rings + summon dust start. */
  charge: 0.0,
  /** Sky beam slams down. */
  beamIn: 0.04,
  /** Beam fully touches the ground. */
  beamInEnd: 0.2,
  /** The agent detaches high inside the beam and starts falling. */
  dropStart: 0.14,
  /** Touchdown — impact flash, shockwaves, debris, camera shake. */
  impact: 0.46,
  /** Beam column collapses upward. */
  beamOut: 0.6,
  /** Beam fully gone. */
  beamOutEnd: 0.82,
  /** Visor / core boot flicker + head scan. */
  ignite: 0.58,
  /** "Systems stable" pulse ring. */
  pulse: 0.78,
} as const;

/** Scroll progress where the arrival ends and the walk blend begins. */
export const ARRIVAL_END_P = ARRIVAL.from + ARRIVAL.span;

/** Scroll progress of touchdown (drives the camera shake / FOV punch). */
export const ARRIVAL_IMPACT_P = ARRIVAL.from + ARRIVAL.impact * ARRIVAL.span;

/** Height the first agent falls from (tuned so the fall stays framed). */
export const DROP_HEIGHT = 7.8;

/**
 * Gravity-style descent: returns the agent's height above the ground for an
 * arrival-local time. Ease-in (accelerating fall) — reads as real weight.
 */
export function dropY(local: number): number {
  const t = Math.min(
    Math.max((local - ARRIVAL.dropStart) / (ARRIVAL.impact - ARRIVAL.dropStart), 0),
    1
  );
  return DROP_HEIGHT * (1 - t * t);
}
