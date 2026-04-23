import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, Mail, Lock, Building2, Wrench, Phone, AlertCircle, Eye, EyeOff } from "lucide-react-native";
import { colors, spacing, radius } from "../theme/theme";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../data/mockData";

type Props = {
  mode: "login" | "register";
  role: "company" | "workshop";
  entityId: string;
  entityName: string;
};

export default function RoleAuthForm({ mode, role, entityId, entityName }: Props) {
  const router = useRouter();
  const { login } = useAuth();
  const isLogin = mode === "login";
  const isCompany = role === "company";
  const roleLabel = isCompany ? "شركة" : "ورشة";

  const [form, setForm] = useState({ name: "", phone: "", email: "", pwd: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isLogin) {
      if (!form.name.trim()) e.name = `يرجى إدخال اسم ال${roleLabel}`;
      if (!form.phone.trim()) e.phone = "يرجى إدخال رقم الجوال";
      else if (!/^05\d{8}$/.test(form.phone.trim())) e.phone = "رقم جوال غير صحيح (05xxxxxxxx)";
    }
    if (!form.email.trim()) e.email = "يرجى إدخال البريد الإلكتروني";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "صيغة بريد إلكتروني غير صحيحة";
    if (!form.pwd) e.pwd = "يرجى إدخال كلمة المرور";
    else if (form.pwd.length < 6) e.pwd = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    setTopError(null);
    if (!validate()) {
      setTopError("يرجى تصحيح الأخطاء في النموذج");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(role as UserRole, form.name || entityName, form.email, entityId);
      router.replace(isCompany ? "/company-dashboard" : "/workshop-dashboard");
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="auth-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>

          <View style={styles.heroBadge}>
            {isCompany ? <Building2 size={30} color="#fff" /> : <Wrench size={30} color="#fff" />}
          </View>

          <Text style={styles.title}>{isLogin ? `دخول ${roleLabel}` : `تسجيل ${roleLabel} جديدة`}</Text>
          <Text style={styles.sub}>
            {isLogin
              ? `سجّل الدخول لإدارة ${isCompany ? "منتجاتك" : "خدماتك"}`
              : `أنشئ حساباً لإدارة ${isCompany ? "منتجاتك" : "ورشتك"}`}
          </Text>

          {topError && (
            <View style={styles.errBanner}>
              <AlertCircle size={16} color={colors.error} />
              <Text style={styles.errBannerTxt}>{topError}</Text>
            </View>
          )}

          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            {!isLogin && (
              <>
                <Field
                  label={isCompany ? "اسم الشركة" : "اسم الورشة"}
                  icon={isCompany ? <Building2 size={18} color={colors.textLight} /> : <Wrench size={18} color={colors.textLight} />}
                  value={form.name}
                  onChangeText={(t: string) => setForm({ ...form, name: t })}
                  placeholder={isCompany ? "الجزيرة للسيارات" : "ورشة الفارس"}
                  testID="auth-name-input"
                  error={errors.name}
                />
                <Field
                  label="رقم الجوال"
                  icon={<Phone size={18} color={colors.textLight} />}
                  value={form.phone}
                  onChangeText={(t: string) => setForm({ ...form, phone: t })}
                  placeholder="05xxxxxxxx"
                  keyboardType="phone-pad"
                  testID="auth-phone-input"
                  error={errors.phone}
                />
              </>
            )}

            <Field
              label="البريد الإلكتروني"
              icon={<Mail size={18} color={colors.textLight} />}
              value={form.email}
              onChangeText={(t: string) => setForm({ ...form, email: t })}
              placeholder="business@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              testID="auth-email-input"
              error={errors.email}
            />
            <Field
              label="كلمة المرور"
              icon={<Lock size={18} color={colors.textLight} />}
              value={form.pwd}
              onChangeText={(t: string) => setForm({ ...form, pwd: t })}
              placeholder="••••••••"
              secureTextEntry={!showPwd}
              testID="auth-password-input"
              error={errors.pwd}
              right={
                <TouchableOpacity onPress={() => setShowPwd((s) => !s)}>
                  {showPwd ? <EyeOff size={18} color={colors.textLight} /> : <Eye size={18} color={colors.textLight} />}
                </TouchableOpacity>
              }
            />
          </View>

          <TouchableOpacity
            testID="auth-submit-btn"
            style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryTxt}>{isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerTxt}>{isLogin ? "ليس لديك حساب؟" : "لديك حساب؟"}</Text>
            <TouchableOpacity
              testID="auth-switch-link"
              onPress={() => router.replace(`/auth/${role}-${isLogin ? "register" : "login"}` as any)}
            >
              <Text style={styles.footerLink}>{isLogin ? "سجل الآن" : "تسجيل الدخول"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, icon, testID, error, right, ...rest }: any) {
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
        {right}
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
  heroBadge: { width: 68, height: 68, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginTop: spacing.xl, alignSelf: "flex-end" },
  title: { fontSize: 24, fontWeight: "800", color: colors.textMain, textAlign: "right", marginTop: spacing.lg },
  sub: { fontSize: 13, color: colors.textMuted, textAlign: "right", marginTop: spacing.sm, lineHeight: 20 },
  errBanner: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
  errBannerTxt: { color: colors.error, fontSize: 13, fontWeight: "700", flex: 1, textAlign: "right" },
  label: { fontSize: 13, fontWeight: "700", color: colors.textMain, marginBottom: 6, textAlign: "right" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 52, borderWidth: 1, borderColor: colors.border },
  inputWrapError: { borderColor: colors.error, backgroundColor: "#FEF2F2" },
  input: { flex: 1, fontSize: 14, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
  errRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  errTxt: { color: colors.error, fontSize: 11, fontWeight: "600" },
  primaryBtn: { backgroundColor: colors.primary, height: 54, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
  footer: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.xl },
  footerTxt: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.accent, fontSize: 14, fontWeight: "800" },
});
