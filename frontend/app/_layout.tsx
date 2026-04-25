import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { I18nManager, View, ActivityIndicator, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "../src/context/CartContext";
import { AuthProvider } from "../src/context/AuthContext";
import { WalletProvider } from "../src/context/WalletContext";
import { colors } from "../src/theme/theme";

// Force RTL globally
if (!I18nManager.isRTL) {
  try {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  } catch {}
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Short delay to ensure RTL applied before first render on web
    const t = setTimeout(() => setReady(true), Platform.OS === "web" ? 50 : 0);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WalletProvider>
          <CartProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="company/[id]" />
              <Stack.Screen name="workshop/[id]" />
              <Stack.Screen name="product/[id]" />
              <Stack.Screen name="booking/[id]" />
              <Stack.Screen name="company-dashboard" />
              <Stack.Screen name="workshop-dashboard" />
            </Stack>
          </CartProvider>
        </WalletProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
