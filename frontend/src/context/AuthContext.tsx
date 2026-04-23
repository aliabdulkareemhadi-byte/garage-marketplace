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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../services/firebase";
import type { Session, UserRole } from "../data/mockData";

/**
 * Firebase-backed AuthContext.
 *
 * Shape is a superset of the previous mock version so existing screens keep working:
 *   - `session` / `logout()` remain compatible.
 *   - `login(...)` now requires a password and is async (callers updated).
 *   - `register(...)` / `resendVerification()` are new helpers.
 *
 * Role / name / entityId are persisted locally (AsyncStorage) keyed by uid since
 * they are not part of Firebase Auth itself. Backend/Firestore wiring is out of
 * scope for this step and must not change existing features.
 */

type SessionMeta = { role: UserRole; name: string; entityId?: string };
const META_KEY = (uid: string) => `auth:meta:${uid}`;

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session whenever Firebase auth state changes (app start, login, logout).
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user || !user.emailVerified) {
          setSession(null);
          return;
        }
        const raw = await AsyncStorage.getItem(META_KEY(user.uid));
        if (!raw) {
          // No persisted role metadata — treat as unauthenticated for this app.
          setSession(null);
          return;
        }
        const meta = JSON.parse(raw) as SessionMeta;
        setSession({
          role: meta.role,
          name: meta.name || user.displayName || (user.email ?? ""),
          email: user.email ?? "",
          entityId: meta.entityId,
          uid: user.uid,
          emailVerified: user.emailVerified,
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
        // Ensure emailVerified reflects latest server state.
        await reload(cred.user);
        if (!cred.user.emailVerified) {
          await fbSignOut(auth).catch(() => {});
          throw new Error("يرجى تأكيد البريد الإلكتروني أولاً");
        }
        const finalName =
          name?.trim() || cred.user.displayName || email.split("@")[0];
        const meta: SessionMeta = { role, name: finalName, entityId };
        await AsyncStorage.setItem(
          META_KEY(cred.user.uid),
          JSON.stringify(meta)
        );
        setSession({
          role,
          name: finalName,
          email: cred.user.email ?? email,
          entityId,
          uid: cred.user.uid,
          emailVerified: true,
        });
      } catch (err: any) {
        // Preserve explicit Arabic verification message if we threw it above.
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
        if (name?.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() }).catch(
            () => {}
          );
        }
        // Persist role metadata now so that after verification + login we can restore it.
        const meta: SessionMeta = {
          role,
          name: name?.trim() || email.split("@")[0],
          entityId,
        };
        await AsyncStorage.setItem(
          META_KEY(cred.user.uid),
          JSON.stringify(meta)
        );
        // Fire verification email.
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
