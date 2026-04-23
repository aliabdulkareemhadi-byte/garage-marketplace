// Firebase SDK initialization — safe, isolated module.
// Usage: `import { app, auth, db, storage } from "@/src/services/firebase";`
// NOTE: Analytics is intentionally NOT initialized (unsupported on React Native).
//
// This module does NOT touch existing app state, navigation, UI, or mock logic.
// It only exposes ready-to-use Firebase singletons for future feature work.

import { Platform } from "react-native";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  // Web/default
  getAuth,
  // React Native
  initializeAuth,
  // Exported but untyped in firebase/auth's public d.ts — present at runtime.
  // @ts-expect-error getReactNativePersistence is exported but not typed
  getReactNativePersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCiDB1fpoH411GkTIroODc-ztPvtoZaXJA",
  authDomain: "sinkmarket-73267.firebaseapp.com",
  projectId: "sinkmarket-73267",
  storageBucket: "sinkmarket-73267.firebasestorage.app",
  messagingSenderId: "473466820687",
  appId: "1:473466820687:web:ff33e15888c3fee552323a",
};

// Initialize (or reuse existing) Firebase App singleton.
// Guards against Fast Refresh / double-initialization in dev.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth:
//  - On native (iOS/Android): use initializeAuth with AsyncStorage persistence
//    so sessions survive app restarts.
//  - On web: use getAuth (browser persistence handled by the SDK).
//  - Fast Refresh guard: initializeAuth throws if called twice; fall back to getAuth.
let auth: Auth;
try {
  if (Platform.OS === "web") {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
} catch {
  // Already initialized (e.g. during Fast Refresh) — reuse it.
  auth = getAuth(app);
}

const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
export default app;
