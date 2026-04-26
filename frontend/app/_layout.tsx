import React, { useEffect, useRef, useState } from "react";
import { Stack, useRouter, useSegments, type Href } from "expo-router";
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
 * First path-segment values that represent real in-app screens.
 * A logged-in user on any of these must NEVER be redirected to their role home.
 *
 * This list is also used to detect transitional empty-segment states:
 * Expo Router (especially with the new architecture) can briefly emit
 * segments=[] while navigating between screens. If the last settled
 * segment was one of these, the empty emission is a transition artefact
 * and we skip the guard for that render cycle.
 */
const VALID_APP_SEGMENTS: readonly string[] = [
  "(tabs)",          // customer tabs: home, services, cart, notifications, profile
  "product",         // product detail
  "company",         // company detail
  "workshop",        // workshop detail
  "booking",         // booking detail
  "workshop-dashboard",
  "company-dashboard",
  "admin",
];

/**
 * Single source of navigation truth.
 * Watches session + loading and redirects based on auth state only.
 * No screen should call router.replace() after an auth action.
 */
function AuthGuard() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  /**
   * Tracks the last settled (non-empty) first path-segment.
   * Used to distinguish genuine splash-screen renders (segments=[])
   * from transient empty states that Expo Router emits mid-navigation.
   */
  const prevSeg0 = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (loading) return;

    const seg0 = segments[0] as string | undefined;

    // ── Transition guard ──────────────────────────────────────────────────
    // Expo Router can briefly emit segments=[] while the navigator is
    // committing a push/replace between screens.  If the previous settled
    // screen was a valid in-app screen, treat the empty emission as a
    // transition artefact and skip this cycle.  The next render will carry
    // the real destination segments.
    const inTransition =
      seg0 === undefined &&
      prevSeg0.current !== undefined &&
      VALID_APP_SEGMENTS.includes(prevSeg0.current);

    // Update the ref AFTER the transition check so it always reflects the
    // last truly settled screen, not the artefact.
    if (seg0 !== undefined) {
      prevSeg0.current = seg0;
    }

    if (inTransition) return;
    // ─────────────────────────────────────────────────────────────────────

    // A logged-in user should be redirected to their role home ONLY when
    // they are on the splash screen (segments=[]) or inside the auth group.
    const onAuthOrSplash =
      seg0 === "auth" || segments.length === 0;

    // Screens that require authentication — unauthenticated users are sent
    // back to the splash/index.
    const onProtected =
      seg0 === "(tabs)" ||
      seg0 === "workshop-dashboard" ||
      seg0 === "company-dashboard" ||
      seg0 === "admin";

    if (session && onAuthOrSplash) {
      router.replace(roleHome(session.role) as Href);
    } else if (!session && onProtected) {
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
