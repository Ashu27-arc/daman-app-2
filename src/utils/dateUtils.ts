// ─────────────────────────────────────────────────────────────────────────────
// src/utils/dateUtils.ts
// Pure date/time utility functions — no side effects.
// ─────────────────────────────────────────────────────────────────────────────

import type { CountdownParts } from "@/types/appAccess";

/**
 * Format an ISO 8601 UTC timestamp into a human-readable local string.
 * Example output: "17 August 2026, 08:00 PM"
 */
export function formatExpiryDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Unknown";

    const day = date.getDate();
    const month = date.toLocaleString("en-IN", { month: "long" });
    const year = date.getFullYear();
    const time = date.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    // Uppercase AM/PM for consistency
    const formattedTime = time.toUpperCase();
    return `${day} ${month} ${year}, ${formattedTime}`;
  } catch {
    return "Unknown";
  }
}

/**
 * Break down remaining milliseconds into a CountdownParts object.
 * Never returns negative values.
 */
export function msToCountdownParts(ms: number): CountdownParts {
  const totalMs = Math.max(0, ms);
  const isExpired = totalMs <= 0;

  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, totalMs, isExpired };
}

/**
 * Return true if the given ISO expiry timestamp is in the past.
 * Uses Date.now() for comparison (server time is the authority; this is
 * only used for local gating after the server-verified expiry is known).
 */
export function isExpired(expiryTime: string): boolean {
  try {
    return Date.now() >= new Date(expiryTime).getTime();
  } catch {
    return false;
  }
}

/**
 * Pad a number to 2 digits: 5 → "05"
 */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
