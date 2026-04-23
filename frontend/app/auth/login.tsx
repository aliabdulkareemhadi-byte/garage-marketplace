import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, Lock, Eye, EyeOff, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react-native";
import { colors, spacing, radius } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login, resendVerification } = useAuth();
  const [form, setForm] = useState({ email: "", pwd: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = "يرجى إدخال البريد الإلكتروني";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "صيغة بريد إلكتروني غير صحيحة";
    if (!form.pwd) e.pwd = "يرجى إدخال كلمة المرور";
    else if (form.pwd.length < 6) e.pwd = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setTopError(null);
    setNotice(null);
    if (!validate()) {
      setTopError("يرجى تصحيح الأخطاء في النموذج");
      return;
    }
    setLoading(true);
    try {
      await login("customer", form.email.trim(), form.pwd);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      setTopError(err?.message || "تعذّر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    setTopError(null);
    try {
      await resendVerification();
      setNotice("تم إرسال رابط التأكيد مجدداً إلى بريدك.");
    } catch (err: any) {
      setTopError(err?.message || "تعذّر إعادة الإرسال");
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="login-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>

          <View style={{ marginTop: spacing.xl }}>
            <Text style={styles.title}>مرحباً بعودتك 👋</Text>
            <Text style={styles.sub}>سجّل الدخول للمتابعة والاستفادة من جميع الخدمات</Text>
          </View>

          {topError && (
            <View style={styles.errBanner}>
              <AlertCircle size={16} color={colors.error} />
              <Text style={styles.errBannerTxt}>{topError}</Text>
            </View>
          )}

          {notice && (
            <View style={styles.okBanner}>
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.okBannerTxt}>{notice}</Text>
            </View>
          )}

          <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
            <View>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <View style={[styles.inputWrap, errors.email && styles.inputWrapError]}>
                <Mail size={18} color={colors.textLight} />
                <TextInput
                  testID="login-email-input"
                  value={form.email}
                  onChangeText={(t) => setForm({ ...form, email: t })}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textLight}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              {errors.email && <ErrLine text={errors.email} />}
            </View>

            <View>
              <Text style={styles.label}>كلمة المرور</Text>
              <View style={[styles.inputWrap, errors.pwd && styles.inputWrapError]}>
                <Lock size={18} color={colors.textLight} />
                <TextInput
                  testID="login-password-input"
                  value={form.pwd}
                  onChangeText={(t) => setForm({ ...form, pwd: t })}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textLight}
                  style={styles.input}
                  secureTextEntry={!show}
                />
                <TouchableOpacity onPress={() => setShow((s) => !s)}>
                  {show ? <EyeOff size={18} color={colors.textLight} /> : <Eye size={18} color={colors.textLight} />}
                </TouchableOpacity>
              </View>
              {errors.pwd && <ErrLine text={errors.pwd} />}
            </View>

            <TouchableOpacity testID="login-forgot-btn" onPress={() => router.push("/auth/forgot")} style={{ alignSelf: "flex-start" }}>
              <Text style={styles.forgot}>نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            testID="login-submit-btn"
            style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryTxt}>تسجيل الدخول</Text>}
          </TouchableOpacity>

          {topError === "يرجى تأكيد البريد الإلكتروني أولاً" && (
            <TouchableOpacity
              testID="login-resend-btn"
              style={styles.resendBtn}
              onPress={onResend}
              disabled={resending}
            >
              {resending ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <Text style={styles.resendTxt}>إعادة إرسال رابط التأكيد</Text>
              )}
            </TouchableOpacity>
          )}

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>أو</Text>
            <View style={styles.line} />
          </View>

          <View style={{ gap: spacing.md }}>
            <TouchableOpacity testID="login-google-btn" style={styles.socialBtn}>
              <Text style={styles.socialTxt}>متابعة عبر Google</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="login-apple-btn" style={styles.socialBtn}>
              <Text style={styles.socialTxt}>متابعة عبر Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerTxt}>ليس لديك حساب؟</Text>
            <TouchableOpacity testID="login-register-link" onPress={() => router.push("/auth/register")}>
              <Text style={styles.footerLink}>إنشاء حساب</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ErrLine({ text }: { text: string }) {
  return (
    <View style={styles.errRow}>
      <AlertCircle size={12} color={colors.error} />
      <Text style={styles.errTxt}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxl },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  sub: { fontSize: 14, color: colors.textMuted, textAlign: "right", marginTop: spacing.sm, lineHeight: 22 },
  errBanner: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
  errBannerTxt: { color: colors.error, fontSize: 13, fontWeight: "700", flex: 1, textAlign: "right" },
  okBanner: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
  okBannerTxt: { color: colors.success, fontSize: 13, fontWeight: "700", flex: 1, textAlign: "right" },
  label: { fontSize: 13, fontWeight: "700", color: colors.textMain, marginBottom: 6, textAlign: "right" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 52, borderWidth: 1, borderColor: colors.border },
  inputWrapError: { borderColor: colors.error, backgroundColor: "#FEF2F2" },
  input: { flex: 1, fontSize: 14, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
  errRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  errTxt: { color: colors.error, fontSize: 11, fontWeight: "600" },
  forgot: { color: colors.accent, fontSize: 13, fontWeight: "700", marginTop: 4 },
  primaryBtn: { backgroundColor: colors.primary, height: 54, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
  resendBtn: { height: 44, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  resendTxt: { color: colors.accent, fontSize: 13, fontWeight: "800" },
  divider: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginVertical: spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.textLight, fontSize: 12, fontWeight: "700" },
  socialBtn: { height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  socialTxt: { color: colors.textMain, fontSize: 14, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.xl },
  footerTxt: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.accent, fontSize: 14, fontWeight: "800" },
});
