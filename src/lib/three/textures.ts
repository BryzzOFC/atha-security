import * as THREE from "three";

/** Deterministic PRNG so the city looks identical on every visit. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function windowColor(variant: "blue" | "orange" | "mixed", rnd: () => number): string {
  if (variant === "orange") return `hsl(27, 95%, ${52 + rnd() * 12}%)`;
  if (variant === "mixed" && rnd() < 0.24) return `hsl(27, 95%, ${52 + rnd() * 12}%)`;
  return `hsl(212, 92%, ${54 + rnd() * 16}%)`;
}

/** Procedural building facade: grid of lit / unlit windows on dark concrete. */
export function createWindowTexture(
  variant: "blue" | "orange" | "mixed",
  seed = 1
): THREE.CanvasTexture {
  const w = 96;
  const h = 192;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#04060a";
  ctx.fillRect(0, 0, w, h);

  const rnd = mulberry32(seed);
  const cols = 6;
  const rows = 16;
  const cw = w / cols;
  const ch = h / rows;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const lit = rnd() < 0.42;
      ctx.fillStyle = lit
        ? windowColor(variant, rnd)
        : "rgba(148, 163, 184, 0.055)";
      ctx.fillRect(x * cw + cw * 0.24, y * ch + ch * 0.26, cw * 0.52, ch * 0.48);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 2;
  return tex;
}

/** Soft radial dot used for particles and glow sprites. */
export function createSoftDotTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Glowing radial ground cracks for the arrival impact (additive decal). */
export function createCrackTexture(seed = 7, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const rnd = mulberry32(seed);
  const cx = size / 2;
  const cy = size / 2;

  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(190, 224, 255, 0.9)";
  ctx.shadowBlur = 14;

  const spokes = 7;
  for (let s = 0; s < spokes; s++) {
    const base = (s / spokes) * Math.PI * 2 + rnd() * 0.5;
    const len = size * (0.18 + rnd() * 0.24);
    const segs = 6;
    let x = cx;
    let y = cy;
    let w = 4.6;
    for (let i = 0; i < segs; i++) {
      const t = i / segs;
      const ang = base + (rnd() - 0.5) * 0.55;
      const nx = cx + Math.cos(ang) * len * ((i + 1) / segs);
      const ny = cy + Math.sin(ang) * len * ((i + 1) / segs);
      ctx.strokeStyle = `rgba(235, 246, 255, ${0.95 - t * 0.55})`;
      ctx.lineWidth = Math.max(w, 0.6);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      // small side branch
      if (rnd() < 0.75 && i > 0) {
        const bAng = ang + (rnd() < 0.5 ? 1 : -1) * (0.5 + rnd() * 0.7);
        const bLen = len * 0.22 * rnd();
        ctx.lineWidth = Math.max(w * 0.45, 0.5);
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(nx + Math.cos(bAng) * bLen, ny + Math.sin(bAng) * bLen);
        ctx.stroke();
      }
      x = nx;
      y = ny;
      w *= 0.72;
    }
  }

  // hot core
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.09);
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.5, "rgba(190,224,255,0.4)");
  g.addColorStop(1, "rgba(190,224,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.09, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Radial dark patch used as fake contact shadow under the city. */
export function createRadialShadowTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(0,0,0,0.62)");
  g.addColorStop(0.6, "rgba(0,0,0,0.32)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
