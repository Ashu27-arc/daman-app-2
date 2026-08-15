// ─────────────────────────────────────────────────────────────────────────────
// src/components/LoadingScreen.tsx
// Professional loading screen — all animations use useNativeDriver: true
// to avoid the "native/JS driver" conflict error.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export function LoadingScreen() {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the whole screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Pulse animation on the logo (opacity only — native driver safe)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Spinner rotation (transform — native driver safe)
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [pulseAnim, spinAnim, fadeAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spinReverse = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      {/* Background decoration circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      {/* Logo section */}
      <Animated.View style={[styles.logoContainer, { opacity: pulseAnim }]}>
        <Text style={styles.logoEmoji}>🎮</Text>
        <Text style={styles.appName}>Daman VIP Games</Text>
        <View style={styles.divider} />
      </Animated.View>

      {/* Spinner — two rings rotating in opposite directions */}
      <View style={styles.spinnerContainer}>
        <Animated.View
          style={[styles.spinnerOuter, { transform: [{ rotate: spin }] }]}
        />
        <Animated.View
          style={[
            styles.spinnerInner,
            { transform: [{ rotate: spinReverse }] },
          ]}
        />
        <View style={styles.spinnerCore} />
      </View>

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <Text style={styles.subText}>Please wait</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>Powered by Daman VIP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    alignItems: "center",
    justifyContent: "center",
  },
  bgCircle1: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(212,175,55,0.04)",
    top: -width * 0.2,
    right: -width * 0.2,
  },
  bgCircle2: {
    position: "absolute",
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "rgba(212,175,55,0.05)",
    bottom: -width * 0.1,
    left: -width * 0.15,
  },
  bgCircle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(212,175,55,0.06)",
    top: "35%",
    left: "10%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFD700",
    letterSpacing: 0.5,
    textShadowColor: "rgba(255,215,0,0.35)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: "#FFD700",
    marginTop: 16,
    borderRadius: 1,
    opacity: 0.5,
  },
  spinnerContainer: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  // Outer ring — solid gold arc via border trick
  spinnerOuter: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: "#FFD700",
    borderRightColor: "rgba(255,215,0,0.3)",
  },
  // Inner ring — counter-rotating
  spinnerInner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "transparent",
    borderTopColor: "rgba(255,215,0,0.6)",
    borderLeftColor: "rgba(255,215,0,0.2)",
  },
  spinnerCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFD700",
    opacity: 0.7,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.3,
  },
  footerText: {
    position: "absolute",
    bottom: 32,
    fontSize: 12,
    color: "rgba(255,215,0,0.3)",
    letterSpacing: 0.8,
  },
});
