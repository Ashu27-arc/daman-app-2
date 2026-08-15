// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useAppExpiry.ts
// Orchestrates: network check → API fetch → AppState → NetInfo.
// (No AsyncStorage caching — expiryService removed per project requirements)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";
import { fetchAccessStatus } from "@/services/api";
import { isExpired } from "@/utils/dateUtils";
import { BACKGROUND_CHECK_INTERVAL_MS } from "@/constants/config";
import type { AppAccessStatus, AppScreenState } from "@/types/appAccess";

interface UseAppExpiryReturn {
  screenState: AppScreenState;
  accessStatus: AppAccessStatus | null;
  errorMessage: string | null;
  refetch: () => Promise<void>;
}

export function useAppExpiry(): UseAppExpiryReturn {
  const [screenState, setScreenState] = useState<AppScreenState>("loading");
  const [accessStatus, setAccessStatus] = useState<AppAccessStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Prevent concurrent fetches
  const fetchingRef = useRef(false);
  // Interval handle for periodic background checks
  const periodicTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Apply a status object to state ───────────────────────────────────────

  const applyStatus = useCallback((status: AppAccessStatus) => {
    setAccessStatus(status);
    const expired = !status.active || isExpired(status.expiryTime);
    if (expired) {
      setScreenState("expired");
    } else {
      setScreenState("active");
      setErrorMessage(null);
    }
  }, []);

  // ─── Core fetch + state update ─────────────────────────────────────────────

  const performCheck = useCallback(
    async (fromBackground = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      try {
        // 1. Network check
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
          if (!fromBackground) {
            setScreenState("offline");
          }
          return;
        }

        // 2. Fetch from backend (source of truth)
        const status = await fetchAccessStatus();
        applyStatus(status);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setErrorMessage(message);
        setScreenState("error");
      } finally {
        fetchingRef.current = false;
      }
    },
    [applyStatus],
  );

  // ─── Public refetch (used by retry buttons, NetInfo reconnect) ─────────────

  const refetch = useCallback(async () => {
    setScreenState("loading");
    setErrorMessage(null);
    await performCheck(false);
  }, [performCheck]);

  // ─── Initial load ──────────────────────────────────────────────────────────

  useEffect(() => {
    void performCheck(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── AppState — foreground re-check ───────────────────────────────────────

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        void performCheck(true);
      }
    };
    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, [performCheck]);

  // ─── NetInfo — reconnect re-check ─────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      if (state.isConnected && screenState === "offline") {
        void refetch();
      }
    });
    return unsubscribe;
  }, [screenState, refetch]);

  // ─── Periodic background check ─────────────────────────────────────────────

  useEffect(() => {
    if (screenState !== "active") {
      if (periodicTimerRef.current) {
        clearInterval(periodicTimerRef.current);
        periodicTimerRef.current = null;
      }
      return;
    }

    periodicTimerRef.current = setInterval(() => {
      void performCheck(true);
    }, BACKGROUND_CHECK_INTERVAL_MS);

    return () => {
      if (periodicTimerRef.current) {
        clearInterval(periodicTimerRef.current);
        periodicTimerRef.current = null;
      }
    };
  }, [screenState, performCheck]);

  return {
    screenState,
    accessStatus,
    errorMessage,
    refetch,
  };
}
