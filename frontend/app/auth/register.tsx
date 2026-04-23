import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User, Mail, Lock, Phone, ChevronRight } from "lucide-react-native";
import { colors, spacing, radius } from "../../src/theme/theme";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", pwd: "" });
  const [agree, setAgree] = useState(false);

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

          <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
            <Field label="الاسم الكامل" icon={<User size={18} color={colors.textLight} />} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="محمد أحمد" testID="register-name-input" />
            <Field label="البريد الإلكتروني" icon={<Mail size={18} color={colors.textLight} />} value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} placeholder="name@example.com" testID="register-email-input" keyboardType="email-address" />
            <Field label="رقم الجوال" icon={<Phone size={18} color={colors.textLight} />} value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} placeholder="05xxxxxxxx" testID="register-phone-input" keyboardType="phone-pad" />
            <Field label="كلمة المرور" icon={<Lock size={18} color={colors.textLight} />} value={form.pwd} onChangeText={(t) => setForm({ ...form, pwd: t })} placeholder="••••••••" testID="register-password-input" secureTextEntry />

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
            style={[styles.primaryBtn, !agree && { opacity: 0.5 }]}
            disabled={!agree}
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text style={styles.primaryTxt}>إنشاء الحساب</Text>
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
  input: { flex: 1, fontSize: 14, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
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
