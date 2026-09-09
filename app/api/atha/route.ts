import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { promises as fsp, readFileSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { createHmac, createHash, randomBytes } from "crypto";

const execFileAsync = promisify(execFile);

/**
 * ATHA Ops bridge — runs the REAL Python agent system (atha-os-live/) and
 * returns its REAL results. No mocks here: every action spawns
 * `python3 atha_cli.py <action>` against the real protected target.
 *
 * Available only when the site runs on a Node server (dev / standalone).
 * The GitHub Pages deploy strips src/app/api — the static site falls back
 * to the last baked real report at /atha/report.json.
 *
 * Hardening (v0.9.2):
 *   - sliding-window rate limiting per client IP, budgeted by action cost
 *   - global concurrency cap so bursts can't fork unbounded python processes
 *   - request body size guard
 *   - 429/503 responses carry Retry-After; success responses expose the
 *     remaining budget via X-RateLimit-* headers
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CLI = "/home/z/my-project/atha-os-live/atha_cli.py";

const ALLOWED_ACTIONS = new Set([
  "status",
  "full_report",
  "network_scan",
  "secrets_scan",
  "vuln_scan",
  "malware_scan",
  "drift",
  "live_check",
  "baseline",
  "assess",
  // v0.10 active defense
  "defense_status",
  "canary_check",
  "canary_plant",
  "immutable_verify",
  "immutable_bake",
  "quarantine_scan",
  "quarantine_list",
  "watch_start",
  "watch_stop",
  // v0.11 plans (read-only; mint/activate stay CLI/vendor-only)
  "plan_status",
  "plan_features",
]);

// ---------------------------------------------------------------------------
// Honeypot (v0.10) — decoy actions that no legitimate client ever calls.
// Any hit records a strike; 3 strikes block the IP for every /ops action.
// The response mimics unknown_action exactly (stealth): the attacker learns
// nothing, the operator sees everything in defense_status.
// ---------------------------------------------------------------------------

const HONEYPOT_ACTIONS = new Set([
  "admin_login",
  "exec_command",
  "dump_env",
  "backup_download",
  "root_shell",
  "seed_console",
  "reset_password",
]);

const HONEYPOT_BLOCK_THRESHOLD = 3;
const HONEYPOT_BLOCK_MS = 15 * 60_000;

const HONEYPOT_STATE_PATH = path.join(
  process.cwd(), "atha-os-live", "runtime", "state", "honeypot.json"
);

// ---------------------------------------------------------------------------
// Sealed state (v0.10.1) — every honeypot persist writes an HMAC-SHA256
// sidecar over the exact bytes, using the SAME key the Python defense layer
// uses (runtime/state/seal.key, or ATHA_SEAL_KEY from off-host). An attacker
// editing honeypot.json — even with valid JSON — leaves a verifiable broken
// seal that defense_status and the watchdog surface as a critical incident.
// ---------------------------------------------------------------------------

const SEAL_KEY_PATH = path.join(
  process.cwd(), "atha-os-live", "runtime", "state", "seal.key"
);

function sealKey(): Buffer {
  const envKey = process.env.ATHA_SEAL_KEY?.trim();
  if (envKey) {
    if (/^[0-9a-fA-F]+$/.test(envKey) && envKey.length % 2 === 0) {
      const asHex = Buffer.from(envKey, "hex");
      if (asHex.length > 0) return asHex;
    }
    return createHash("sha256").update(envKey).digest();
  }
  try {
    return Buffer.from(readFileSync(SEAL_KEY_PATH, "utf8").trim(), "hex");
  } catch {
    const k = randomBytes(32).toString("hex");
    try {
      mkdirSync(path.dirname(SEAL_KEY_PATH), { recursive: true });
      writeFileSync(SEAL_KEY_PATH, k, { mode: 0o600 });
    } catch {
      // read-only runtime — in-memory key; Python side will regenerate its
      // own and seals diverge honestly (status shows missing seals)
    }
    return Buffer.from(k, "hex");
  }
}

function writeSeal(filePath: string, data: string): void {
  const mac = createHmac("sha256", sealKey())
    .update(Buffer.from(data, "utf8"))
    .digest("hex");
  fsp
    .writeFile(
      filePath + ".seal",
      JSON.stringify({ hmac: mac, at: new Date().toISOString() }),
      { mode: 0o600 }
    )
    .catch(() => {
      // best-effort; a missing seal reads as "missing", not silently trusted
    });
}

type HoneypotState = {
  strikes: Record<string, { count: number; last: number }>;
  blocked: Record<string, number>; // ip -> blockedUntil epoch ms
  total_hits: number;
};

const honeypot: HoneypotState = { strikes: {}, blocked: {}, total_hits: 0 };
let honeypotLoaded = false;

async function honeypotLoad(): Promise<void> {
  if (honeypotLoaded) return;
  honeypotLoaded = true;
  try {
    const raw = await fsp.readFile(HONEYPOT_STATE_PATH, "utf8");
    const parsed = JSON.parse(raw) as HoneypotState;
    if (parsed && typeof parsed === "object") {
      honeypot.strikes = parsed.strikes ?? {};
      honeypot.blocked = parsed.blocked ?? {};
      honeypot.total_hits = parsed.total_hits ?? 0;
    }
  } catch {
    // first run or unreadable state — start clean (best-effort persistence)
  }
}

function honeypotPersist(): void {
  const payload = JSON.stringify(honeypot);
  fsp
    .writeFile(HONEYPOT_STATE_PATH, payload, "utf8")
    .then(() => writeSeal(HONEYPOT_STATE_PATH, payload))
    .catch(() => {
      // read-only runtime (static deploys) — in-memory only, honest degradation
    });
}

function honeypotPrune(now: number): void {
  for (const ip of Object.keys(honeypot.blocked)) {
    if (honeypot.blocked[ip] <= now) delete honeypot.blocked[ip];
  }
}

function honeypotBlocked(ip: string): number | null {
  const now = Date.now();
  honeypotPrune(now);
  const until = honeypot.blocked[ip];
  return until && until > now ? until : null;
}

/** Records a decoy hit; promotes the IP to blocked at the threshold. */
function honeypotStrike(ip: string): void {
  const now = Date.now();
  honeypot.total_hits += 1;
  const cur = honeypot.strikes[ip] ?? { count: 0, last: 0 };
  honeypot.strikes[ip] = { count: cur.count + 1, last: now };
  if (honeypot.strikes[ip].count >= HONEYPOT_BLOCK_THRESHOLD) {
    honeypot.blocked[ip] = now + HONEYPOT_BLOCK_MS;
  }
  honeypotPersist();
}

// Per-action budgets (ms). Assess runs 3 scans and may orchestrate a full
// remediation workflow; the workflows below mirror the Core limits.
const TIMEOUT_MS: Record<string, number> = {
  status: 30_000,
  drift: 60_000,
  live_check: 90_000,
  baseline: 120_000,
  network_scan: 60_000,
  secrets_scan: 120_000,
  malware_scan: 120_000,
  vuln_scan: 120_000,
  assess: 240_000,
  full_report: 240_000,
  defense_status: 30_000,
  canary_check: 30_000,
  canary_plant: 60_000,
  immutable_verify: 120_000,
  immutable_bake: 120_000,
  quarantine_scan: 180_000,
  quarantine_list: 30_000,
  watch_start: 30_000,
  watch_stop: 30_000,
  plan_status: 30_000,
  plan_features: 30_000,
};

// ---------------------------------------------------------------------------
// Rate limiting — in-process sliding window (per IP × cost class)
// ---------------------------------------------------------------------------

type CostClass = "cheap" | "scan" | "heavy";

const COST_CLASS: Record<string, CostClass> = {
  status: "cheap",
  drift: "scan",
  live_check: "scan",
  network_scan: "scan",
  secrets_scan: "heavy",
  malware_scan: "heavy",
  vuln_scan: "heavy",
  baseline: "heavy",
  assess: "heavy",
  full_report: "heavy",
  defense_status: "cheap",
  canary_check: "cheap",
  canary_plant: "heavy",
  immutable_verify: "scan",
  immutable_bake: "heavy",
  quarantine_scan: "heavy",
  quarantine_list: "cheap",
  watch_start: "heavy",
  watch_stop: "cheap",
  plan_status: "cheap",
  plan_features: "cheap",
};

// Requests allowed per sliding window, per cost class, per client IP.
const RATE_LIMITS: Record<CostClass, { limit: number; windowMs: number }> = {
  cheap: { limit: 30, windowMs: 60_000 },
  scan: { limit: 10, windowMs: 60_000 },
  heavy: { limit: 6, windowMs: 60_000 },
};

// Global cap on concurrent CLI runs — a burst of distinct IPs must never
// fork more than this many python processes at once.
const MAX_CONCURRENT_RUNS = 3;

const MAX_BODY_BYTES = 64 * 1024;

const rateBuckets = new Map<string, number[]>();
let activeRuns = 0;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

function pruneWindow(hits: number[], windowMs: number, now: number): number[] {
  const cutoff = now - windowMs;
  let i = 0;
  while (i < hits.length && hits[i] <= cutoff) i++;
  return i > 0 ? hits.slice(i) : hits;
}

/**
 * Consumes one unit of budget when allowed; reports exhaustion otherwise.
 * Also prunes stale buckets lazily so memory stays bounded.
 */
type RateOk = { allowed: true; remaining: number; limit: number };
type RateBlocked = { allowed: false; retryAfterS: number; limit: number };

function checkRateLimit(ip: string, costClass: CostClass): RateOk | RateBlocked {
  const { limit, windowMs } = RATE_LIMITS[costClass];
  const now = Date.now();

  // Lazy global cleanup — drop empty/stale buckets when the map grows.
  if (rateBuckets.size > 512) {
    for (const [key, hits] of rateBuckets) {
      const cls = RATE_LIMITS[key.slice(key.lastIndexOf("|") + 1) as CostClass] ?? RATE_LIMITS.heavy;
      const kept = pruneWindow(hits, cls.windowMs, now);
      if (kept.length === 0) rateBuckets.delete(key);
      else rateBuckets.set(key, kept);
    }
  }

  const key = `${ip}|${costClass}`;
  const hits = pruneWindow(rateBuckets.get(key) ?? [], windowMs, now);
  if (hits.length >= limit) {
    const retryAfterMs = hits[0] + windowMs - now;
    return {
      allowed: false,
      retryAfterS: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      limit,
    };
  }
  hits.push(now);
  rateBuckets.set(key, hits);
  return { allowed: true, remaining: limit - hits.length, limit };
}

function rateLimitHeaders(rl: { remaining: number; limit: number }): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(rl.limit),
    "X-RateLimit-Remaining": String(Math.max(0, rl.remaining)),
  };
}

export async function POST(req: Request) {
  const ip = clientIp(req);

  // Body size guard — oversized payloads never reach JSON parsing.
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: "payload_too_large" },
      { status: 413 }
    );
  }

  // Honeypot: blocked IPs get nothing but 429.
  await honeypotLoad();
  const blockedUntil = honeypotBlocked(ip);
  if (blockedUntil !== null) {
    const retryAfterS = Math.max(1, Math.ceil((blockedUntil - Date.now()) / 1000));
    return NextResponse.json(
      { success: false, error: "rate_limited", retry_after_s: retryAfterS },
      { status: 429, headers: { "Retry-After": String(retryAfterS) } }
    );
  }

  let body: { action?: string; workflow?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json" }, { status: 400 });
  }

  const action = body.action ?? "status";

  // Honeypot tripwire: decoy actions look like unknown_action to the caller
  // (identical 400, stealth) while the strike is recorded and persisted.
  if (HONEYPOT_ACTIONS.has(action)) {
    honeypotStrike(ip);
    return NextResponse.json(
      { success: false, error: `unknown_action: ${action}` },
      { status: 400 }
    );
  }

  const isWorkflow = action === "workflow";
  if (!ALLOWED_ACTIONS.has(action) && !isWorkflow) {
    return NextResponse.json(
      { success: false, error: `unknown_action: ${action}` },
      { status: 400 }
    );
  }

  // Rate limit BEFORE doing any work. Workflow runs use the heavy budget.
  const costClass: CostClass = isWorkflow ? "heavy" : COST_CLASS[action] ?? "heavy";
  const rl = checkRateLimit(ip, costClass);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "rate_limited",
        cost_class: costClass,
        retry_after_s: rl.retryAfterS,
      },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterS) } }
    );
  }

  // Global concurrency cap — reject instead of queueing (fail fast, honest).
  if (activeRuns >= MAX_CONCURRENT_RUNS) {
    return NextResponse.json(
      { success: false, error: "busy", active_runs: activeRuns },
      { status: 503, headers: { "Retry-After": "5" } }
    );
  }

  const args = isWorkflow
    ? ["workflow", String(body.workflow ?? "self_test")]
    : [action];

  const timeout = TIMEOUT_MS[action] ?? 120_000;

  activeRuns++;
  try {
    const { stdout } = await execFileAsync("python3", [CLI, ...args], {
      timeout,
      maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, ATHA_REAL_MODE: "1" },
    });
    const trimmed = stdout.trim();
    if (!trimmed) {
      return NextResponse.json(
        { success: false, error: "empty_cli_output" },
        { status: 502, headers: rateLimitHeaders(rl) }
      );
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return NextResponse.json(
        { success: false, error: "cli_output_not_json", raw: trimmed.slice(0, 800) },
        { status: 502, headers: rateLimitHeaders(rl) }
      );
    }
    return NextResponse.json(parsed, { headers: rateLimitHeaders(rl) });
  } catch (err: unknown) {
    const e = err as { code?: string | number; killed?: boolean; message?: string };
    return NextResponse.json(
      {
        success: false,
        error: e.killed ? "cli_timeout" : `cli_failed: ${e.message ?? String(e)}`,
      },
      { status: 502, headers: rateLimitHeaders(rl) }
    );
  } finally {
    activeRuns--;
  }
}

export async function GET() {
  return POST(
    new Request("http://local/api/atha", {
      method: "POST",
      body: JSON.stringify({ action: "status" }),
    })
  );
}
