// ─────────────────────────────────────────────────────────────────────────────
// src/components/ErrorScreen.tsx
// Shown when the API is unreachable or the WebView fails to load.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface ErrorScreenProps {
  /** Title override — defaults to "Unable to Load" */
  title?: string;
  /** Message override */
  message?: string;
  /** Label for the retry button */
  retryLabel?: string;
  /** Called when the user taps Retry */
  onRetry?: () => void;
}

export function ErrorScreen({
  title = "Unable to load the application",
  message = "Please check your internet connection and try again.",
  retryLabel = "Retry",
  onRetry,
}: ErrorScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.card}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>

        {/* Text */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {/* Retry */}
        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.retryText}>{retryLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.footerText}>Daman VIP Games</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  bgCircle1: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "rgba(220,53,69,0.05)",
    top: -width * 0.15,
    right: -width * 0.15,
  },
  bgCircle2: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "rgba(220,53,69,0.04)",
    bottom: -width * 0.1,
    left: -width * 0.1,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(220,53,69,0.25)",
    padding: 32,
    alignItems: "center",
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(220,53,69,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  message: {
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  retryButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 14,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  retryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0a0a0f",
    letterSpacing: 0.5,
  },
  footerText: {
    position: "absolute",
    bottom: 32,
    fontSize: 12,
    color: "rgba(255,215,0,0.3)",
    letterSpacing: 0.8,
  },
});
