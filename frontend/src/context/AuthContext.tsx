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
  reload,
  sendEmailVerification,
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
 * Source of truth for role / name / entityId is the Firestore `users` collection
 * (doc id = firebase uid). AsyncStorage is kept ONLY as an offline cache/fallback
 * in case the Firestore read fails (network, permissions, first-run race).
 *
 * Public API is unchanged from the previous Firebase-only version; callers do
 * not need to change.
 */

type SessionMeta = { role: UserRole; name: string; entityId?: string };
const META_KEY = (uid: string) => `auth:meta:${uid}`;

type UserDoc = {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  entityId?: string;
  emailVerified: boolean;
  createdAt?: any; // firestore Timestamp on read, serverTimestamp() sentinel on write
  updatedAt?: any;
};

type AuthCtx = {
  session: Session | null;
  loading: boolean;
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
  resendVerification: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

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

async function readUserDoc(uid: string): Promise<UserDoc | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserDoc) : null;
  } catch {
    // Network / permission error → let caller fall back to cache.
    return null;
  }
}

async function writeUserDoc(
  uid: string,
  data: Partial<UserDoc>,
  opts: { isCreate?: boolean } = {}
): Promise<void> {
  const ref = doc(db, "users", uid);
  // Firestore rejects `undefined` field values — strip them before writing.
  const cleaned: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) cleaned[k] = v;
  }
  const payload: Record<string, any> = {
    ...cleaned,
    updatedAt: serverTimestamp(),
  };
  if (opts.isCreate) payload.createdAt = serverTimestamp();
  await setDoc(ref, payload, { merge: true });
}

async function cacheMeta(uid: string, meta: SessionMeta): Promise<void> {
  try {
    await AsyncStorage.setItem(META_KEY(uid), JSON.stringify(meta));
  } catch {
    /* ignore cache failures */
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate whenever Firebase auth state changes.
  // Firestore is the source of truth; AsyncStorage is a fallback cache.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user || !user.emailVerified) {
          setSession(null);
          return;
        }

        // Primary: Firestore
        let role: UserRole | null = null;
        let name = "";
        let entityId: string | undefined;

        const fsDoc = await readUserDoc(user.uid);
        if (fsDoc) {
          role = fsDoc.role;
          name = fsDoc.name || user.displayName || user.email || "";
          entityId = fsDoc.entityId;
          // Keep emailVerified in Firestore in sync; best-effort.
          if (fsDoc.emailVerified !== true) {
            writeUserDoc(user.uid, { emailVerified: true }).catch(() => {});
          }
        } else {
          // Fallback: AsyncStorage cache (offline / legacy / first-run race)
          const cached = await readCachedMeta(user.uid);
          if (cached) {
            role = cached.role;
            name = cached.name;
            entityId = cached.entityId;
            // Best-effort: create the missing Firestore doc from the cache.
            writeUserDoc(
              user.uid,
              {
                uid: user.uid,
                email: user.email ?? "",
                name,
                role,
                entityId,
                emailVerified: true,
              },
              { isCreate: true }
            ).catch(() => {});
          }
        }

        if (!role) {
          // Verified user but no profile metadata anywhere → treat as unauth.
          setSession(null);
          return;
        }

        // Refresh cache.
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

  const login = useCallback<AuthCtx["login"]>(
    async (role, email, password, name, entityId) => {
      try {
        const cred = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        await reload(cred.user);
        if (!cred.user.emailVerified) {
          await fbSignOut(auth).catch(() => {});
          throw new Error("يرجى تأكيد البريد الإلكتروني أولاً");
        }

        // Firestore is the source of truth — prefer its values over passed args.
        const fsDoc = await readUserDoc(cred.user.uid);

        let finalRole: UserRole;
        let finalName: string;
        let finalEntityId: string | undefined;

        if (fsDoc) {
          finalRole = fsDoc.role;
          finalName =
            fsDoc.name || name?.trim() || cred.user.displayName || email;
          finalEntityId = fsDoc.entityId ?? entityId;
          // Best-effort: sync emailVerified flag if Firestore is stale.
          if (fsDoc.emailVerified !== true) {
            writeUserDoc(cred.user.uid, { emailVerified: true }).catch(
              () => {}
            );
          }
        } else {
          // Safety net: legacy / pre-Firestore user — create the doc now.
          finalRole = role;
          finalName =
            name?.trim() || cred.user.displayName || email.split("@")[0];
          finalEntityId = entityId;
          await writeUserDoc(
            cred.user.uid,
            {
              uid: cred.user.uid,
              email: cred.user.email ?? email,
              name: finalName,
              role: finalRole,
              entityId: finalEntityId,
              emailVerified: true,
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
        if (err?.message === "يرجى تأكيد البريد الإلكتروني أولاً") throw err;
        throw new Error(mapAuthError(err));
      }
    },
    []
  );

  const register = useCallback<AuthCtx["register"]>(
    async (role, email, password, name, entityId) => {
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        const finalName = name?.trim() || email.split("@")[0];

        if (finalName) {
          await updateProfile(cred.user, { displayName: finalName }).catch(
            () => {}
          );
        }

        // Create Firestore user profile while still authenticated as this user
        // (rules typically require request.auth.uid == userId for writes).
        await writeUserDoc(
          cred.user.uid,
          {
            uid: cred.user.uid,
            email: cred.user.email ?? email.trim(),
            name: finalName,
            role,
            entityId,
            emailVerified: false,
          },
          { isCreate: true }
        );

        // Cache locally as backup for offline first-login.
        await cacheMeta(cred.user.uid, {
          role,
          name: finalName,
          entityId,
        });

        // Send verification email.
        await sendEmailVerification(cred.user);

        // Force sign-out: user must verify before they can access the app.
        await fbSignOut(auth).catch(() => {});
        setSession(null);
      } catch (err: any) {
        throw new Error(mapAuthError(err));
      }
    },
    []
  );

  const logout = useCallback<AuthCtx["logout"]>(async () => {
    try {
      await fbSignOut(auth);
    } finally {
      setSession(null);
    }
  }, []);

  const resendVerification = useCallback<
    AuthCtx["resendVerification"]
  >(async () => {
    const u = auth.currentUser;
    if (!u) {
      throw new Error("لا يوجد مستخدم حالي لإعادة إرسال التأكيد");
    }
    try {
      await sendEmailVerification(u);
    } catch (err: any) {
      throw new Error(mapAuthError(err));
    }
  }, []);

  return (
    <Ctx.Provider
      value={{ session, loading, login, register, logout, resendVerification }}
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
