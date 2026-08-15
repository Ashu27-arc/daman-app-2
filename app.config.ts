// ─────────────────────────────────────────────────────────────────────────────
// app.config.ts
// Dynamic Expo config — replaces app.json for richer configuration.
// ─────────────────────────────────────────────────────────────────────────────

import { type ExpoConfig, type ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Daman VIP Games",
  slug: "daman-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/app-icon.jpg",
  scheme: "damanapp",
  userInterfaceStyle: "dark",


  // ─── Android ────────────────────────────────────────────────────────────────
  android: {
    package: "com.damanvipgames.app",
    adaptiveIcon: {
      backgroundColor: "#0a0a0f",
      foregroundImage: "./assets/images/android-icon-foreground.png",
    },
    // No intentFilters — we do NOT configure Android App Links for this domain.
    // The app explicitly loads the URL inside its own WebView.
    intentFilters: [],
    predictiveBackGestureEnabled: false,
    permissions: [
      // Required for file/image upload in WebView
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_MEDIA_VIDEO",
    ],
  },

  // ─── iOS (not the primary target but kept for completeness) ─────────────────
  ios: {
    bundleIdentifier: "com.damanvipgames.app",
    supportsTablet: false,
  },

  // ─── Web ─────────────────────────────────────────────────────────────────────
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  // ─── Plugins ────────────────────────────────────────────────────────────────
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#0a0a0f",
        image: "./assets/images/splash-icon.png",
        imageWidth: 76,
      },
    ],
  ],

  // ─── Extra env vars accessible via Constants.expoConfig.extra ───────────────
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "",
    mockMode: process.env.EXPO_PUBLIC_MOCK_MODE === "true",
    eas: {
      projectId: "", // Set after running `eas init`
    },
  },

  // ─── Experiments ─────────────────────────────────────────────────────────────
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
