/**
 * serverWakeup.ts
 *
 * Singleton that owns the single health-check request to the Render backend.
 * Rules:
 *  - One fetch, ever. Re-using the same Promise if called again while in-flight.
 *  - Status transitions: idle → waking → ready | failed
 *  - Subscribers (React components) are notified on every status change.
 */

export type WakeupStatus = "idle" | "waking" | "ready" | "failed";

type StatusListener = (status: WakeupStatus) => void;

const HEALTH_URL = `${import.meta.env.VITE_API_BASE_URL}/health`;
const TIMEOUT_MS = 30_000; // 30 s — Render cold-start can be slow

let status: WakeupStatus = "idle";
let wakePromise: Promise<void> | null = null;
const listeners = new Set<StatusListener>();

function notify() {
  listeners.forEach((fn) => fn(status));
}

/** Subscribe to status changes. Returns an unsubscribe function. */
export function subscribeWakeup(fn: StatusListener): () => void {
  listeners.add(fn);
  // Immediately call with current status so the subscriber is in sync.
  fn(status);
  return () => listeners.delete(fn);
}

/** Current status snapshot (for non-reactive reads). */
export function getWakeupStatus(): WakeupStatus {
  return status;
}

/**
 * Kick off the health request (no-op if already waking/ready/failed).
 * Returns a Promise that resolves when the server is ready, or rejects on failure.
 */
export function ensureServerReady(): Promise<void> {
  if (status === "ready") return Promise.resolve();
  if (status === "failed") return Promise.reject(new Error("Server failed to wake"));
  if (wakePromise) return wakePromise; // reuse in-flight request

  status = "waking";
  notify();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  wakePromise = fetch(HEALTH_URL, { signal: controller.signal })
    .then((res) => {
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`Health check returned ${res.status}`);
      status = "ready";
      notify();
    })
    .catch((err) => {
      clearTimeout(timeoutId);
      // If the tab is unloading, ignore
      if (err?.name === "AbortError" && status === "waking") {
        status = "failed";
        notify();
      } else if (err?.name !== "AbortError") {
        status = "failed";
        notify();
      }
      wakePromise = null;
      throw err;
    });

  return wakePromise;
}

/** Allow the user to retry after a failure. */
export function retryWakeup(): Promise<void> {
  if (status === "failed") {
    status = "idle";
    wakePromise = null;
    notify();
  }
  return ensureServerReady();
}
