// ─────────────────────────────────────────────────────────────────────────────
// src/types/appAccess.ts
// Strict TypeScript types for the expiry/access system.
// ─────────────────────────────────────────────────────────────────────────────

/** Returned by the backend /api/access-status endpoint. */
export interface AppAccessStatus {
  active: boolean;
  activationTime: string; // ISO 8601 UTC, e.g. "2026-08-15T14:30:00.000Z"
  expiryTime: string;     // ISO 8601 UTC, e.g. "2026-08-17T14:30:00.000Z"
  contactNumber: string;
}

/** All possible states the application can be in. */
export type AppScreenState =
  | "loading"    // Performing the initial expiry check
  | "offline"    // Device has no internet connection
  | "error"      // Backend unreachable / unexpected error
  | "active"     // Access is valid → show WebView
  | "expired";   // Access has expired → show ExpiredScreen

/** Countdown breakdown returned by useCountdown. */
export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
}


