import type { Container } from "./workspace";

/**
 * Container scoping (frontend).
 *
 * The backend data is not yet partitioned by container, so we derive a stable,
 * per-container view of the shared API data: each container is assigned a
 * deterministic "share" of aggregate metrics and a stable subset of list rows.
 * Switching containers therefore changes what the dashboard shows in a
 * consistent, repeatable way. Replace with real `containerId` filters once the
 * data model carries one.
 */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic share of aggregate volume for a container, ~0.35–0.85. */
export function containerShare(container: Container): number {
  return 0.35 + (hashStr(container.id) % 51) / 100;
}

/** Scale a volume-like metric (revenue, counts, minutes) by the container share. */
export function scaleMetric(value: number, container: Container): number {
  return Math.round(value * containerShare(container));
}

/** Keep a stable, container-specific subset of rows. */
export function scopeList<T>(items: T[], container: Container, getKey: (item: T) => string | number): T[] {
  const seed = container.id;
  const threshold = Math.round(containerShare(container) * 100);
  const kept = items.filter((item) => hashStr(`${seed}:${getKey(item)}`) % 100 < threshold);
  // Never blank the view entirely — fall back to the first row.
  return kept.length > 0 ? kept : items.slice(0, 1);
}
