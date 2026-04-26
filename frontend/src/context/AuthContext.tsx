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
 * Source of truth for role / name / entityId is the Firestore `users` collection
 * (doc id = firebase uid). AsyncStorage is kept ONLY as an offline cache/fallback
 * in case the Firestore read fails (network, permissions, first-run race).
 *
 * Email verification is not required — users are logged in immediately after
 * registration.
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
  createdAt?: any;
  updatedAt?: any;
};

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
    return null;
  }
}

async function writeUserDoc(
  uid: string,
  data: Partial<UserDoc>,
  opts: { isCreate?: boolean } = {}
): Promise<void> {
  const ref = doc(db, "users", uid);
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
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

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

        const fsDoc = await readUserDoc(user.uid);
        if (fsDoc) {
          role = fsDoc.role;
          name = fsDoc.name || user.displayName || user.email || "";
          entityId = fsDoc.entityId;
        } else {
          const cached = await readCachedMeta(user.uid);
          if (cached) {
            role = cached.role;
            name = cached.name;
            entityId = cached.entityId;
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
          setSession(null);
          return;
        }

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

        const fsDoc = await readUserDoc(cred.user.uid);

        let finalRole: UserRole;
        let finalName: string;
        let finalEntityId: string | undefined;

        if (fsDoc) {
          finalRole = fsDoc.role;
          finalName =
            fsDoc.name || name?.trim() || cred.user.displayName || email;
          finalEntityId = fsDoc.entityId ?? entityId;
        } else {
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
        const msg = mapAuthError(err);
        setError(msg);
        throw new Error(msg);
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

        await writeUserDoc(
          cred.user.uid,
          {
            uid: cred.user.uid,
            email: cred.user.email ?? email.trim(),
            name: finalName,
            role,
            entityId,
            emailVerified: true,
          },
          { isCreate: true }
        );

        await cacheMeta(cred.user.uid, {
          role,
          name: finalName,
          entityId,
        });

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

  const resendVerification = useCallback<
    AuthCtx["resendVerification"]
  >(async () => {
    // Email verification removed — this is a no-op stub kept for API compatibility.
  }, []);

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
