import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, Mail, Lock, Building2, Wrench } from "lucide-react-native";
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
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [name, setName] = useState(entityName);
  const [phone, setPhone] = useState("");

  const isLogin = mode === "login";
  const isCompany = role === "company";
  const titleIcon = isCompany ? <Building2 size={32} color="#fff" /> : <Wrench size={32} color="#fff" />;
  const roleLabel = isCompany ? "شركة" : "ورشة";

  const submit = () => {
    login(role as UserRole, name || entityName, email || "demo@garage.app", entityId);
    router.replace(isCompany ? "/company-dashboard" : "/workshop-dashboard");
  };

  const otherMode = isLogin ? "register" : "login";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="auth-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>

          <View style={styles.heroBadge}>{titleIcon}</View>

          <Text style={styles.title}>
            {isLogin ? `دخول ${roleLabel}` : `تسجيل ${roleLabel} جديدة`}
          </Text>
          <Text style={styles.sub}>
            {isLogin
              ? `سجّل الدخول لإدارة ${isCompany ? "منتجاتك وعروضك" : "ورشتك وحجوزاتك"}`
              : `أنشئ حساباً لإدارة ${isCompany ? "منتجاتك" : "ورشتك"} وابدأ بالبيع`}
          </Text>

          <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
            {!isLogin && (
              <>
                <Field
                  label={isCompany ? "اسم الشركة" : "اسم الورشة"}
                  icon={isCompany ? <Building2 size={18} color={colors.textLight} /> : <Wrench size={18} color={colors.textLight} />}
                  value={name}
                  onChangeText={setName}
                  placeholder={isCompany ? "الجزيرة للسيارات" : "ورشة الفارس"}
                  testID="auth-name-input"
                />
                <Field
                  label="رقم الجوال"
                  icon={<Mail size={18} color={colors.textLight} />}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="05xxxxxxxx"
                  keyboardType="phone-pad"
                  testID="auth-phone-input"
                />
              </>
            )}

            <Field
              label="البريد الإلكتروني"
              icon={<Mail size={18} color={colors.textLight} />}
              value={email}
              onChangeText={setEmail}
              placeholder="business@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              testID="auth-email-input"
            />
            <Field
              label="كلمة المرور"
              icon={<Lock size={18} color={colors.textLight} />}
              value={pwd}
              onChangeText={setPwd}
              placeholder="••••••••"
              secureTextEntry
              testID="auth-password-input"
            />
          </View>

          <TouchableOpacity testID="auth-submit-btn" style={styles.primaryBtn} onPress={submit}>
            <Text style={styles.primaryTxt}>{isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerTxt}>{isLogin ? "ليس لديك حساب؟" : "لديك حساب؟"}</Text>
            <TouchableOpacity
              testID="auth-switch-link"
              onPress={() =>
                router.replace(
                  `/auth/${role}-${otherMode}` as any,
                )
              }
            >
              <Text style={styles.footerLink}>{isLogin ? "سجل الآن" : "تسجيل الدخول"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, icon, testID, ...rest }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon}
        <TextInput
          testID={testID}
          {...rest}
          placeholderTextColor={colors.textLight}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxl },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  heroBadge: { width: 72, height: 72, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginTop: spacing.xl, alignSelf: "flex-end" },
  title: { fontSize: 24, fontWeight: "800", color: colors.textMain, textAlign: "right", marginTop: spacing.lg },
  sub: { fontSize: 13, color: colors.textMuted, textAlign: "right", marginTop: spacing.sm, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: "600", color: colors.textMain, marginBottom: 6, textAlign: "right" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 52, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, fontSize: 14, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
  primaryBtn: { backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.xl },
  footerTxt: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.accent, fontSize: 14, fontWeight: "700" },
});
