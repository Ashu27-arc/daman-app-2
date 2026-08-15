// ─────────────────────────────────────────────────────────────────────────────
// src/app/index.tsx
// Main orchestrator — routes between Loading / Offline / Error / Active / Expired
// based on the result of useAppExpiry.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppExpiry } from "@/hooks/useAppExpiry";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorScreen } from "@/components/ErrorScreen";
import { AppHeader } from "@/components/AppHeader";
import { WebViewScreen } from "@/screens/WebViewScreen";

export default function Index() {
  const {
    screenState,
    accessStatus,
    errorMessage,
    refetch,
  } = useAppExpiry();

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (screenState === "loading") {
    return <LoadingScreen />;
  }

  // ── Offline ──────────────────────────────────────────────────────────────────
  if (screenState === "offline") {
    return (
      <ErrorScreen
        title="No Internet Connection"
        message="Please check your internet connection."
        retryLabel="Retry"
        onRetry={refetch}
      />
    );
  }

  // ── API error ────────────────────────────────────────────────────────────────
  if (screenState === "error") {
    return (
      <ErrorScreen
        title="Connection Failed"
        message={
          errorMessage ??
          "Unable to verify application access. Please try again."
        }
        retryLabel="Retry"
        onRetry={refetch}
      />
    );
  }

  // ── Expired ──────────────────────────────────────────────────────────────────
  if (screenState === "expired") {
    return (
      <ErrorScreen
        title="Application Expired"
        message="Your application access has expired. Please contact support to renew."
      />
    );
  }

  // ── Active ───────────────────────────────────────────────────────────────────
  if (screenState === "active" && accessStatus) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <AppHeader
          accessStatus={accessStatus}
          onExpired={() => {
            // Countdown reached zero — trigger server re-check to confirm
            void refetch();
          }}
        />
        <View style={styles.webViewContainer}>
          <WebViewScreen />
        </View>
      </SafeAreaView>
    );
  }

  // Fallback (should never render)
  return <LoadingScreen />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  webViewContainer: {
    flex: 1,
  },
});
