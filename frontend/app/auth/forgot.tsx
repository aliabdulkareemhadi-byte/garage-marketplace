import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, ChevronRight } from "lucide-react-native";
import { colors, spacing, radius } from "../../src/theme/theme";

export default function Forgot() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.scroll}>
          <TouchableOpacity testID="forgot-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>

          <View style={{ marginTop: spacing.xl }}>
            <Text style={styles.title}>نسيت كلمة المرور؟</Text>
            <Text style={styles.sub}>لا تقلق، سنرسل لك رابط لإعادة تعيين كلمة المرور</Text>
          </View>

          <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <View style={styles.inputWrap}>
              <Mail size={18} color={colors.textLight} />
              <TextInput
                testID="forgot-email-input"
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

          {sent && (
            <View style={styles.okBox}>
              <Text style={styles.okTxt}>✓ تم إرسال رابط إعادة التعيين إلى بريدك</Text>
            </View>
          )}

          <TouchableOpacity
            testID="forgot-submit-btn"
            style={styles.primaryBtn}
            onPress={() => setSent(true)}
          >
            <Text style={styles.primaryTxt}>إرسال الرابط</Text>
          </TouchableOpacity>

          <TouchableOpacity testID="forgot-login-link" onPress={() => router.push("/auth/login")} style={{ alignItems: "center", marginTop: spacing.lg }}>
            <Text style={styles.footerLink}>العودة لتسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scroll: { padding: spacing.xl, flex: 1 },
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
  primaryBtn: { backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  okBox: { backgroundColor: "#D1FAE5", padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
  okTxt: { color: colors.success, fontSize: 13, fontWeight: "700", textAlign: "right" },
  footerLink: { color: colors.accent, fontSize: 14, fontWeight: "700" },
});
