import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { I18nManager, View, ActivityIndicator, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "../src/context/CartContext";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { WalletProvider } from "../src/context/WalletContext";
import { colors } from "../src/theme/theme";
import type { UserRole } from "../src/data/mockData";

// Force RTL globally
if (!I18nManager.isRTL) {
  try {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  } catch {}
}

function roleHome(role: UserRole): string {
  if (role === "workshop") return "/workshop-dashboard";
  if (role === "company") return "/company-dashboard";
  if (role === "admin") return "/admin/wallet-requests";
  return "/(tabs)/home";
}

/**
 * Single source of navigation truth.
 * Watches session + loading and redirects based on auth state only.
 * No screen should call router.replace() after an auth action.
 */
function AuthGuard() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthOrSplash =
      segments[0] === "auth" || segments.length === 0;
    const inProtected =
      segments[0] === "(tabs)" ||
      segments[0] === "workshop-dashboard" ||
      segments[0] === "company-dashboard" ||
      segments[0] === "admin";

    if (session && inAuthOrSplash) {
      router.replace(roleHome(session.role) as any);
    } else if (!session && inProtected) {
      router.replace("/");
    }
  }, [session, loading, segments]);

  return null;
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
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
            <AuthGuard />
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
