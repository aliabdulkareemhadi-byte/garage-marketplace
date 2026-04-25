import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User, Mail, Lock, Phone, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react-native";
import { colors, spacing, radius } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", pwd: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; pwd?: string }>({});
  const [topError, setTopError] = useState<string>("");
  const [notice, setNotice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "يرجى إدخال الاسم";
    if (!form.email.trim()) e.email = "يرجى إدخال البريد الإلكتروني";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "صيغة بريد إلكتروني غير صحيحة";
    if (form.phone.trim() && !/^(05\d{8}|07\d{9}|\+9647\d{9})$/.test(form.phone.trim())) e.phone = "رقم الجوال غير صحيح";
    if (!form.pwd) e.pwd = "يرجى إدخال كلمة المرور";
    else if (form.pwd.length < 6) e.pwd = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setTopError("");
    setNotice("");
    if (!validate()) {
      setTopError("يرجى تصحيح الأخطاء في النموذج");
      return;
    }
    setLoading(true);
    try {
      await register("customer", form.email.trim(), form.pwd, form.name.trim());
      setNotice(
        "تم إنشاء الحساب. أرسلنا رابط التأكيد إلى بريدك الإلكتروني. يرجى تأكيد البريد ثم تسجيل الدخول."
      );
    } catch (err: any) {
      setTopError(err?.message || "تعذّر إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="register-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>

          <View style={{ marginTop: spacing.xl }}>
            <Text style={styles.title}>إنشاء حساب جديد</Text>
            <Text style={styles.sub}>انضم إلينا واستمتع بأفضل خدمات السيارات</Text>
          </View>

          {topError ? (
            <View style={styles.errBanner}>
              <AlertCircle size={16} color={colors.error} />
              <Text style={styles.errBannerTxt}>{topError}</Text>
            </View>
          ) : null}

          {notice ? (
            <View style={styles.okBanner} testID="register-verify-notice">
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.okBannerTxt}>{notice}</Text>
            </View>
          ) : null}

          <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
            <Field label="الاسم الكامل" icon={<User size={18} color={colors.textLight} />} value={form.name} onChangeText={(t: string) => setForm({ ...form, name: t })} placeholder="محمد أحمد" testID="register-name-input" error={errors.name} />
            <Field label="البريد الإلكتروني" icon={<Mail size={18} color={colors.textLight} />} value={form.email} onChangeText={(t: string) => setForm({ ...form, email: t })} placeholder="name@example.com" testID="register-email-input" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
            <Field label="رقم الجوال" icon={<Phone size={18} color={colors.textLight} />} value={form.phone} onChangeText={(t: string) => setForm({ ...form, phone: t })} placeholder="05xxxxxxxx" testID="register-phone-input" keyboardType="phone-pad" error={errors.phone} />
            <Field label="كلمة المرور" icon={<Lock size={18} color={colors.textLight} />} value={form.pwd} onChangeText={(t: string) => setForm({ ...form, pwd: t })} placeholder="••••••••" testID="register-password-input" secureTextEntry error={errors.pwd} />

            <TouchableOpacity testID="register-agree" onPress={() => setAgree((a) => !a)} style={styles.agreeRow}>
              <View style={[styles.checkbox, agree && styles.checkboxOn]}>
                {agree && <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>✓</Text>}
              </View>
              <Text style={styles.agreeTxt}>
                أوافق على <Text style={{ color: colors.accent, fontWeight: "700" }}>الشروط والأحكام</Text> وسياسة الخصوصية
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            testID="register-submit-btn"
            style={[styles.primaryBtn, (!agree || loading) && { opacity: 0.5 }]}
            disabled={!agree || loading}
            onPress={submit}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryTxt}>إنشاء الحساب</Text>}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerTxt}>لديك حساب بالفعل؟</Text>
            <TouchableOpacity testID="register-login-link" onPress={() => router.push("/auth/login")}>
              <Text style={styles.footerLink}>تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, icon, testID, error, ...rest }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error && styles.inputWrapError]}>
        {icon}
        <TextInput
          testID={testID}
          {...rest}
          placeholderTextColor={colors.textLight}
          style={styles.input}
        />
      </View>
      {error ? (
        <View style={styles.errRow}>
          <AlertCircle size={12} color={colors.error} />
          <Text style={styles.errTxt}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxl },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  sub: { fontSize: 14, color: colors.textMuted, textAlign: "right", marginTop: spacing.sm, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: "600", color: colors.textMain, marginBottom: 6, textAlign: "right" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWrapError: { borderColor: colors.error, backgroundColor: "#FEF2F2" },
  input: { flex: 1, fontSize: 14, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
  errRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  errTxt: { color: colors.error, fontSize: 11, fontWeight: "600" },
  errBanner: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
  errBannerTxt: { color: colors.error, fontSize: 13, fontWeight: "700", flex: 1, textAlign: "right" },
  okBanner: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
  okBannerTxt: { color: colors.success, fontSize: 13, fontWeight: "700", flex: 1, textAlign: "right" },
  agreeRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  checkboxOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  agreeTxt: { fontSize: 13, color: colors.textMuted, flex: 1, textAlign: "right" },
  primaryBtn: { backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.xl },
  footerTxt: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.accent, fontSize: 14, fontWeight: "700" },
});
