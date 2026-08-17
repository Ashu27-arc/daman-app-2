// ─────────────────────────────────────────────────────────────────────────────
// src/screens/WebViewScreen.tsx
// Single screen with image, content, and "Open Now" button to open link in Chrome
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "expo-router";
import * as Linking from "expo-linking";
import { WEBSITE_URL } from "@/constants/config";

export function WebViewScreen() {
  const handleOpenInChrome = () => {
    Linking.openURL(WEBSITE_URL).catch(() => {
      console.error("Failed to open URL");
    });
  };

  // ─── Android back button ────────────────────────────────────────────────────
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== "android") return;

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          BackHandler.exitApp();
          return true;
        },
      );

      return () => backHandler.remove();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Image */}
          <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={require("@/assets/app-icon.jpg")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Welcome to Daman VIP Games</Text>
            <Text style={styles.description}>
              Experience the ultimate gaming platform with exclusive rewards and
              exciting games. Click the button below to get started!
            </Text>
          </View>

          {/* Open Now Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleOpenInChrome}
            activeOpacity={0.8}
          >
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Open Now</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  gradient: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  imageWrapper: {
    width: 280,
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1a1a2e",
    borderWidth: 2,
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
    textShadowColor: "#FFD700",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 16,
    color: "#E0E0E0",
    lineHeight: 26,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button: {
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0a0a0f",
    letterSpacing: 1,
  },
});
