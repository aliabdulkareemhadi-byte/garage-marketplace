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
 * All first path-segments that represent valid in-app destinations.
 *
 * Used for two purposes:
 *  1. Resetting the redirect-lock when navigation settles on a real screen.
 *  2. Documenting every legitimate in-app first-segment so the guard never
 *     fires a redirect while a user is already inside the app.
 */
const VALID_APP_SEGMENTS: readonly string[] = [
  "(tabs)",           // customer tabs: home, services, cart, notifications, profile
  "product",          // product detail  /product/[id]
  "company",          // company detail  /company/[id]
  "workshop",         // workshop detail /workshop/[id]
  "booking",          // booking detail  /booking/[id]
  "workshop-dashboard",
  "company-dashboard",
  "admin",
];

/**
 * Single source of navigation truth.
 *
 * Two problems this guard solves:
 *
 * A) Transitional empty-segment states
 *    Expo Router (new architecture, SDK 54) can briefly emit segments=[] while
 *    committing a push/replace.  The `prevSeg0` ref tracks the last settled
 *    first-segment so we can detect these artefacts and skip the cycle.
 *    Rule: if seg0===undefined AND prevSeg0 is any defined value, it's a
 *    transition — return early.  (Expanded from the previous version which
 *    only guarded VALID_APP_SEGMENT predecessors; "auth" is also a valid
 *    predecessor after a successful login redirect.)
 *
 * B) Double router.replace() during login
 *    After signInWithEmailAndPassword, BOTH login() and onAuthStateChanged
 *    call setSession() — the second call creates a new object reference and
 *    re-fires the guard while the first router.replace() is still in flight.
 *    Two concurrent replaces corrupt the navigation stack and land the user
 *    on "/" (the public splash) instead of "/(tabs)/home".
 *    The `redirectingTo` ref prevents the second call from reaching the router.
 */
function AuthGuard() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  /**
   * Last settled (non-undefined) first path-segment.
   * Updated only when seg0 is defined so transitions never overwrite it.
   */
  const prevSeg0 = useRef<string | undefined>(undefined);

  /**
   * The href of an in-progress router.replace() call.
   * Set when a redirect fires; cleared when navigation lands on a
   * VALID_APP_SEGMENT screen (meaning the redirect completed).
   * While set, duplicate calls to the same target are suppressed.
   */
  const redirectingTo = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    const seg0 = segments[0] as string | undefined;

    // ── A: Transition guard ───────────────────────────────────────────────
    // Any time seg0 is undefined but we have a previous settled segment,
    // treat it as a navigation transition artefact and skip this cycle.
    // The next render will carry the real destination segment.
    const inTransition = seg0 === undefined && prevSeg0.current !== undefined;

    if (seg0 !== undefined) {
      prevSeg0.current = seg0;
      // ── B: Reset redirect lock ─────────────────────────────────────────
      // Once we land on any valid in-app screen, the in-flight redirect is
      // complete.  Clear the lock so future redirects can fire normally.
      if (redirectingTo.current !== null && VALID_APP_SEGMENTS.includes(seg0)) {
        redirectingTo.current = null;
      }
    }

    if (inTransition) return;
    // ─────────────────────────────────────────────────────────────────────

    // A logged-in user should leave the auth/splash area and go to their home.
    const onAuthOrSplash = seg0 === "auth" || segments.length === 0;

    // Screens that require authentication — unauthenticated users go to splash.
    const onProtected =
      seg0 === "(tabs)" ||
      seg0 === "workshop-dashboard" ||
      seg0 === "company-dashboard" ||
      seg0 === "admin";

    if (session && onAuthOrSplash) {
      // ── B: Redirect lock ────────────────────────────────────────────────
      // Suppress duplicate router.replace() calls to the same destination.
      // This prevents two concurrent replaces (from login() + onAuthStateChanged
      // both calling setSession) from corrupting the navigation stack.
      const target = roleHome(session.role);
      if (redirectingTo.current === target) return;
      redirectingTo.current = target;
      router.replace(target as Href);
    } else if (!session && onProtected) {
      if (redirectingTo.current === "/") return;
      redirectingTo.current = "/";
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
