// ─────────────────────────────────────────────────────────────────────────────
// src/screens/WebViewScreen.tsx
// Full-featured WebView with:
//   - Android back button (goBack or exit)
//   - External URL / tel: / mailto: handling
//   - Pull-to-refresh
//   - In-WebView loading indicator
//   - Website error state + retry
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  RefreshControl,
  ScrollView,
  Platform,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { WebView, type WebViewNavigation } from "react-native-webview";
import * as Linking from "expo-linking";
import { WEBSITE_URL } from "@/constants/config";
import { ErrorScreen } from "@/components/ErrorScreen";

// Alternate URL — intentionally disabled, do NOT activate
// const ALTERNATE_WEBSITE_URL =
//   "https://damanvipgames.com/#/register?invitationCode=V3Y7F1661445";

/**
 * URL schemes that should be handled by the OS, not the WebView.
 */
const NATIVE_SCHEMES = ["tel:", "mailto:", "sms:", "tg:", "whatsapp:"];

function shouldHandleNatively(url: string): boolean {
  return NATIVE_SCHEMES.some((scheme) => url.startsWith(scheme));
}

/**
 * Returns true if the URL should stay inside the WebView.
 * External links (different domains, app stores, etc.) are opened via Linking.
 */
function shouldOpenInWebView(url: string): boolean {
  // Always intercept native schemes
  if (shouldHandleNatively(url)) return false;

  try {
    const { hostname } = new URL(url);
    // Keep damanvipgames.com pages inside WebView
    return hostname === "damanvipgames.com" || hostname.endsWith(".damanvipgames.com");
  } catch {
    return true; // Unknown URL — default to WebView
  }
}

export function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ─── Android back button ────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return;

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (canGoBack && webViewRef.current) {
            webViewRef.current.goBack();
            return true; // Consume event — don't exit app
          }
          // No history → exit app
          BackHandler.exitApp();
          return true;
        },
      );

      return () => backHandler.remove();
    }, [canGoBack]),
  );

  // ─── Pull-to-refresh ────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setWebViewError(false);
    webViewRef.current?.reload();
    // The spinner will stop when onLoadEnd fires
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // ─── WebView event handlers ─────────────────────────────────────────────────
  const handleNavigationStateChange = (state: WebViewNavigation) => {
    setCanGoBack(state.canGoBack);
  };

  const handleShouldStartLoadWithRequest = (
    request: WebViewNavigation,
  ): boolean => {
    const { url } = request;

    // Native scheme (tel:, mailto:, etc.) — hand off to OS
    if (shouldHandleNatively(url)) {
      Linking.openURL(url).catch(() => {
        // Silently ignore if the OS can't handle it
      });
      return false;
    }

    // External URL — open in browser
    if (!shouldOpenInWebView(url)) {
      Linking.openURL(url).catch(() => {});
      return false;
    }

    return true; // Load inside WebView
  };

  const handleLoadStart = () => {
    setIsWebViewLoading(true);
    setWebViewError(false);
  };

  const handleLoadEnd = () => {
    setIsWebViewLoading(false);
    setRefreshing(false);
  };

  const handleError = () => {
    setIsWebViewLoading(false);
    setWebViewError(true);
    setRefreshing(false);
  };

  const handleRetry = () => {
    setWebViewError(false);
    setIsWebViewLoading(true);
    webViewRef.current?.reload();
  };

  // ─── Error state ─────────────────────────────────────────────────────────────
  if (webViewError) {
    return (
      <ErrorScreen
        title="Unable to load the application"
        message="Please check your internet connection and try again."
        retryLabel="Retry"
        onRetry={handleRetry}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Pull-to-refresh wrapper */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FFD700"]}
            tintColor="#FFD700"
            progressBackgroundColor="#13131a"
          />
        }
        scrollEnabled={false}
      >
        <WebView
          ref={webViewRef}
          source={{ uri: WEBSITE_URL }}
          style={styles.webView}
          // Feature flags
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          // Callbacks
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onHttpError={handleError}
          // Security — no SSL bypass
          allowsProtectedMedia
          // User-Agent: keep the site's mobile detection working
          applicationNameForUserAgent="DamanVIPGames/1.0"
          // File/image upload support
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs={false}
        />
      </ScrollView>

      {/* In-WebView loading overlay */}
      {isWebViewLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#0a0a0f",
    alignItems: "center",
    justifyContent: "center",
  },
});
