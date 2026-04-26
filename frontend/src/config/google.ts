/**
 * Google OAuth Client IDs for Firebase Authentication.
 *
 * HOW TO GET THESE VALUES
 * ────────────────────────────────────────────────────────────────────────────
 * Step 1 — Enable Google Sign-In in Firebase
 *   • Firebase Console → Authentication → Sign-in method → Google → Enable → Save
 *   • Firebase auto-creates a "Web client (auto created by Google Service)" credential.
 *
 * Step 2 — Copy the Web Client ID
 *   • Firebase Console → Authentication → Sign-in method → Google →
 *     "Web SDK configuration" → Web client ID
 *   → paste as `webClientId` below.
 *
 * Step 3 — Android Client ID
 *   • Google Cloud Console → APIs & Services → Credentials
 *   • Create credential → OAuth 2.0 Client ID → Android
 *   • Enter your package name and SHA-1 fingerprint
 *   → paste as `androidClientId` below.
 *
 * Step 4 — iOS Client ID
 *   • Google Cloud Console → APIs & Services → Credentials
 *   • Create credential → OAuth 2.0 Client ID → iOS
 *   • Enter your bundle identifier
 *   → paste as `iosClientId` below.
 *
 * NOTE: The app works without androidClientId / iosClientId during Expo Go
 * development (only webClientId is required for the Expo proxy flow).
 * You need all three IDs for production EAS builds.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const GOOGLE_CLIENT_IDS = {
  webClientId: "473466820687-q58fhdmll0tp0s725r2u0020gpo0po6l.apps.googleusercontent.com",
  iosClientId: "REPLACE_WITH_IOS_CLIENT_ID.apps.googleusercontent.com",
  androidClientId: "REPLACE_WITH_ANDROID_CLIENT_ID.apps.googleusercontent.com",
} as const;
