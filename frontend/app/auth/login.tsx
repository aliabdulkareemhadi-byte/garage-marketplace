import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react-native";
import { colors, spacing, radius } from "../../src/theme/theme";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);

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

          <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
            <View>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <View style={styles.inputWrap}>
                <Mail size={18} color={colors.textLight} />
                <TextInput
                  testID="login-email-input"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textLight}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>كلمة المرور</Text>
              <View style={styles.inputWrap}>
                <Lock size={18} color={colors.textLight} />
                <TextInput
                  testID="login-password-input"
                  value={pwd}
                  onChangeText={setPwd}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textLight}
                  style={styles.input}
                  secureTextEntry={!show}
                />
                <TouchableOpacity onPress={() => setShow((s) => !s)}>
                  {show ? <EyeOff size={18} color={colors.textLight} /> : <Eye size={18} color={colors.textLight} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity testID="login-forgot-btn" onPress={() => router.push("/auth/forgot")} style={{ alignSelf: "flex-start" }}>
              <Text style={styles.forgot}>نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            testID="login-submit-btn"
            style={styles.primaryBtn}
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text style={styles.primaryTxt}>تسجيل الدخول</Text>
          </TouchableOpacity>

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
  forgot: { color: colors.accent, fontSize: 13, fontWeight: "600", marginTop: 4 },
  primaryBtn: { backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  divider: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginVertical: spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.textLight, fontSize: 12 },
  socialBtn: { height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  socialTxt: { color: colors.textMain, fontSize: 14, fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.xl },
  footerTxt: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.accent, fontSize: 14, fontWeight: "700" },
});
