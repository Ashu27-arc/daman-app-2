// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useCountdown.ts
// Reusable countdown hook — updates every second until expiry.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { msToCountdownParts } from "@/utils/dateUtils";
import type { CountdownParts } from "@/types/appAccess";

const TICK_INTERVAL_MS = 1_000;

/**
 * useCountdown
 *
 * @param expiryTime - ISO 8601 UTC string (e.g. "2026-08-17T14:30:00.000Z")
 *                     Pass null/undefined while loading; countdown starts when set.
 * @param onExpired  - Optional callback fired exactly once when the countdown
 *                     reaches zero.
 * @returns CountdownParts — { days, hours, minutes, seconds, totalMs, isExpired }
 */
export function useCountdown(
  expiryTime: string | null | undefined,
  onExpired?: () => void,
): CountdownParts {
  const getRemainingMs = useCallback((): number => {
    if (!expiryTime) return 0;
    return new Date(expiryTime).getTime() - Date.now();
  }, [expiryTime]);

  const [parts, setParts] = useState<CountdownParts>(() =>
    msToCountdownParts(getRemainingMs()),
  );

  // Track whether we've already fired onExpired to avoid duplicate calls
  const firedRef = useRef(false);

  useEffect(() => {
    // Reset fired flag whenever expiryTime changes
    firedRef.current = false;

    if (!expiryTime) {
      setParts(msToCountdownParts(0));
      return;
    }

    // Tick immediately, then every second
    const tick = () => {
      const remaining = getRemainingMs();
      const newParts = msToCountdownParts(remaining);
      setParts(newParts);

      if (newParts.isExpired && !firedRef.current) {
        firedRef.current = true;
        onExpired?.();
      }
    };

    tick(); // fire right away

    const intervalId = setInterval(tick, TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [expiryTime, getRemainingMs, onExpired]);

  return parts;
}
