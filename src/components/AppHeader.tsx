// ─────────────────────────────────────────────────────────────────────────────
// src/components/AppHeader.tsx
// Compact status header shown above the WebView while access is active.
// Countdown is rendered inline here (no external CountdownTimer component).
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCountdown } from "@/hooks/useCountdown";
import { formatExpiryDate, pad2 } from "@/utils/dateUtils";
import type { AppAccessStatus } from "@/types/appAccess";

interface AppHeaderProps {
  accessStatus: AppAccessStatus;
  onExpired: () => void;
}

export function AppHeader({ accessStatus, onExpired }: AppHeaderProps) {
  const { days, hours, minutes, seconds } = useCountdown(
    accessStatus.expiryTime,
    onExpired,
  );

  return null;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0f",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,215,0,0.15)",
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#22c55e",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#22c55e",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,215,0,0.7)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  unitsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 5,
  },
  unitBox: {
    alignItems: "center",
    backgroundColor: "rgba(255,215,0,0.1)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.2)",
    minWidth: 34,
  },
  unitValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFD700",
    fontVariant: ["tabular-nums"],
  },
  unitLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.3,
  },
  colon: {
    fontSize: 15,
    fontWeight: "800",
    color: "rgba(255,215,0,0.5)",
    marginBottom: 10,
  },
  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  expiryLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
  },
  expiryValue: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "600",
  },
});
