// ─────────────────────────────────────────────────────────────────────────────
// src/app/_layout.tsx
// Root layout — wraps the entire app with required providers.
// ─────────────────────────────────────────────────────────────────────────────

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0a0a0f" },
            animation: "none",
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
