import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../services/firebase";
import type { Session, UserRole } from "../data/mockData";

/**
 * Firebase-backed AuthContext + Firestore user profile persistence.
 *
 * Every authenticated user has exactly one document at users/{uid}.
 * Firestore is the source of truth for role / name / entityId.
 * AsyncStorage is kept as an offline fallback cache so that:
 *   1. The app works during brief network outages.
 *   2. If a Firestore write fails during registration, the next auth-state
 *      change can recreate the document from the cache.
 *
 * Unified UserDoc schema (all roles):
 *   uid          – Firebase Auth UID (mirrors the doc ID)
 *   email        – sign-in email
 *   name         – display name
 *   role         – "customer" | "workshop" | "company" | "admin"
 *   entityId     – (optional) ID of the workshop / company the owner manages
 *   createdAt    – server timestamp, written once on document creation
 *   updatedAt    – server timestamp, updated on every write
 *
 * Duplicate-prevention strategy:
 *   - setDoc with { merge: true } is used for all writes, so a second write
 *     for the same uid never overwrites existing fields that aren't in the
 *     payload.
 *   - createdAt is only included in the payload when we have confirmed (via
 *     getDoc) that the document does not yet exist.
 *   - The helpers below centralise this logic so no caller can accidentally
 *     create an inconsistent document.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shape of every document in the Firestore `users` collection. */
export type UserDoc = {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  entityId?: string;
  createdAt?: any; // firestore Timestamp on read, serverTimestamp() sentinel on write
  updatedAt?: any;
};

type SessionMeta = { role: UserRole; name: string; entityId?: string };

type AuthCtx = {
  session: Session | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  login: (
    role: UserRole,
    email: string,
    password: string,
    name?: string,
    entityId?: string
  ) => Promise<void>;
  register: (
    role: UserRole,
    email: string,
    password: string,
    name: string,
    entityId?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  /** No-op stub — email verification removed. Kept for API compatibility. */
  resendVerification: () => Promise<void>;
};

// ---------------------------------------------------------------------------
// Firestore helpers
// ---------------------------------------------------------------------------

const META_KEY = (uid: string) => `auth:meta:${uid}`;

function mapAuthError(err: any): string {
  const code: string = err?.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "هذا البريد الإلكتروني مستخدم مسبقاً";
    case "auth/invalid-email":
      return "صيغة بريد إلكتروني غير صحيحة";
    case "auth/weak-password":
      return "كلمة المرور ضعيفة جداً";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    case "auth/too-many-requests":
      return "محاولات كثيرة، يرجى المحاولة لاحقاً";
    case "auth/network-request-failed":
      return "تعذّر الاتصال بالخادم، تحقّق من الإنترنت";
    default:
      return err?.message || "حدث خطأ غير متوقّع";
  }
}

/**
 * Read the Firestore user document for `uid`.
 * Returns null on any error so callers can fall back to the cache.
 */
async function readUserDoc(uid: string): Promise<UserDoc | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserDoc) : null;
  } catch {
    return null;
  }
}

/**
 * Write (or update) the Firestore user document at users/{uid}.
 *
 * Always uses setDoc with { merge: true } so existing fields not present in
 * `data` are preserved — this guarantees no data loss on repeated writes.
 *
 * Pass `isCreate: true` only when you have confirmed (via readUserDoc) that
 * the document does not exist yet, so that `createdAt` is written exactly once.
 */
async function writeUserDoc(
  uid: string,
  data: Partial<UserDoc>,
  opts: { isCreate?: boolean } = {}
): Promise<void> {
  const ref = doc(db, "users", uid);
  // Strip undefined values — Firestore rejects them.
  const cleaned: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) cleaned[k] = v;
  }
  const payload: Record<string, any> = { ...cleaned, updatedAt: serverTimestamp() };
  if (opts.isCreate) payload.createdAt = serverTimestamp();
  await setDoc(ref, payload, { merge: true });
}

// ---------------------------------------------------------------------------
// AsyncStorage cache helpers
// ---------------------------------------------------------------------------

async function cacheMeta(uid: string, meta: SessionMeta): Promise<void> {
  try {
    await AsyncStorage.setItem(META_KEY(uid), JSON.stringify(meta));
  } catch {
    /* ignore */
  }
}

async function readCachedMeta(uid: string): Promise<SessionMeta | null> {
  try {
    const raw = await AsyncStorage.getItem(META_KEY(uid));
    return raw ? (JSON.parse(raw) as SessionMeta) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ------------------------------------------------------------------
  // Auth-state listener — single source of session truth on cold start
  // ------------------------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setSession(null);
          return;
        }

        let role: UserRole | null = null;
        let name = "";
        let entityId: string | undefined;

        // Primary: Firestore document
        const fsDoc = await readUserDoc(user.uid);
        if (fsDoc) {
          role = fsDoc.role;
          name = fsDoc.name || user.displayName || user.email || "";
          entityId = fsDoc.entityId;
        } else {
          // Fallback: AsyncStorage cache (network outage / first-run race /
          // Firestore write failed during register)
          const cached = await readCachedMeta(user.uid);
          if (cached) {
            role = cached.role;
            name = cached.name;
            entityId = cached.entityId;
            // Best-effort: recreate the missing Firestore document from cache.
            writeUserDoc(
              user.uid,
              {
                uid: user.uid,
                email: user.email ?? "",
                name,
                role,
                entityId,
              },
              { isCreate: true }
            ).catch(() => {});
          }
        }

        if (!role) {
          // Authenticated in Firebase but no user document found anywhere.
          // Cannot determine role → treat as unauthenticated.
          setSession(null);
          return;
        }

        // Keep cache in sync for next offline session.
        await cacheMeta(user.uid, { role, name, entityId });

        setSession({
          role,
          name,
          email: user.email ?? "",
          entityId,
          uid: user.uid,
          emailVerified: true,
        });
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // ------------------------------------------------------------------
  // login
  // ------------------------------------------------------------------
  const login = useCallback<AuthCtx["login"]>(
    async (role, email, password, name, entityId) => {
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

        // Firestore is the source of truth; only fall back to arguments if
        // the document doesn't exist yet (e.g. legacy user from before Firestore
        // was added, or a failed register write).
        const fsDoc = await readUserDoc(cred.user.uid);

        let finalRole: UserRole;
        let finalName: string;
        let finalEntityId: string | undefined;

        if (fsDoc) {
          finalRole = fsDoc.role;
          finalName = fsDoc.name || name?.trim() || cred.user.displayName || email;
          finalEntityId = fsDoc.entityId ?? entityId;
        } else {
          // Document missing — create it now using the role the login screen
          // knows about (passed by the caller: "customer", "workshop", etc.).
          finalRole = role;
          finalName = name?.trim() || cred.user.displayName || email.split("@")[0];
          finalEntityId = entityId;
          // Non-fatal: if this write fails, cache below ensures the next
          // onAuthStateChanged call can recreate the document.
          await writeUserDoc(
            cred.user.uid,
            {
              uid: cred.user.uid,
              email: cred.user.email ?? email,
              name: finalName,
              role: finalRole,
              entityId: finalEntityId,
            },
            { isCreate: true }
          ).catch(() => {});
        }

        await cacheMeta(cred.user.uid, {
          role: finalRole,
          name: finalName,
          entityId: finalEntityId,
        });

        setSession({
          role: finalRole,
          name: finalName,
          email: cred.user.email ?? email,
          entityId: finalEntityId,
          uid: cred.user.uid,
          emailVerified: true,
        });
      } catch (err: any) {
        const msg = mapAuthError(err);
        setError(msg);
        throw new Error(msg);
      }
    },
    []
  );

  // ------------------------------------------------------------------
  // register
  // ------------------------------------------------------------------
  const register = useCallback<AuthCtx["register"]>(
    async (role, email, password, name, entityId) => {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const finalName = name?.trim() || email.split("@")[0];

        if (finalName) {
          await updateProfile(cred.user, { displayName: finalName }).catch(() => {});
        }

        // Write the Firestore document.
        // Non-fatal: if the write fails (network blip, permissions), the user
        // still gets a valid session and the cache below ensures that the next
        // onAuthStateChanged can recreate the document automatically.
        await writeUserDoc(
          cred.user.uid,
          {
            uid: cred.user.uid,
            email: cred.user.email ?? email.trim(),
            name: finalName,
            role,
            entityId,
          },
          { isCreate: true }
        ).catch(() => {});

        // Always set the cache — this is the fallback for the Firestore
        // recreation path if the write above failed.
        await cacheMeta(cred.user.uid, { role, name: finalName, entityId });

        // Log the user in immediately — no email verification required.
        setSession({
          role,
          name: finalName,
          email: cred.user.email ?? email.trim(),
          entityId,
          uid: cred.user.uid,
          emailVerified: true,
        });
      } catch (err: any) {
        const msg = mapAuthError(err);
        setError(msg);
        throw new Error(msg);
      }
    },
    []
  );

  // ------------------------------------------------------------------
  // logout
  // ------------------------------------------------------------------
  const logout = useCallback<AuthCtx["logout"]>(async () => {
    try {
      await fbSignOut(auth);
    } catch (err: any) {
      const msg = mapAuthError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setSession(null);
    }
  }, []);

  // ------------------------------------------------------------------
  // resendVerification — no-op stub for API compatibility
  // ------------------------------------------------------------------
  const resendVerification = useCallback<AuthCtx["resendVerification"]>(
    async () => {
      // Email verification removed in Task 2. Kept so destructuring in
      // existing screens doesn't cause runtime errors.
    },
    []
  );

  return (
    <Ctx.Provider
      value={{ session, loading, error, clearError, login, register, logout, resendVerification }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
