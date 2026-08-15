// ─────────────────────────────────────────────────────────────────────────────
// src/constants/config.ts
// Central configuration — edit these values in one place only.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Primary website URL (ACTIVE) ────────────────────────────────────────────
export const WEBSITE_URL =
  "https://damanvipgames.com/#/register?invitationCode=546523888661";

// ─── Alternate URL — intentionally disabled, do NOT activate ─────────────────
// export const ALTERNATE_WEBSITE_URL =
//   "https://damanvipgames.com/#/register?invitationCode=V3Y7F1661445";

// ─── Support contact number ───────────────────────────────────────────────────
// Replace +91XXXXXXXXXX with the real number before production build.
export const CONTACT_NUMBER = "+91XXXXXXXXXX";

// ─── Backend API ──────────────────────────────────────────────────────────────
// Set EXPO_PUBLIC_API_URL in your .env file.
// The backend must return a JSON body matching the AppAccessStatus interface.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

// ─── Development mock mode ───────────────────────────────────────────────────
// Set to true ONLY for local development when no backend is available.
// Must be false for any production/preview build.
export const MOCK_MODE = process.env.EXPO_PUBLIC_MOCK_MODE === "true";

// Mock expiry: 48 hours from the moment the app first loads (dev only).
export const MOCK_ACTIVATION_OFFSET_MS = 0;
export const MOCK_EXPIRY_OFFSET_MS = 48 * 60 * 60 * 1000;

// ─── Polling interval ─────────────────────────────────────────────────────────
/** Re-check the backend every N milliseconds while app is in foreground. */
export const BACKGROUND_CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
