import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, CheckCircle2, ChevronRight, Mail } from "lucide-react-native";
import { colors, spacing, radius } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";

export default function Verify() {
  const router = useRouter();
  const { resendVerification } = useAuth();
  const params = useLocalSearchParams<{ email?: string; password?: string }>();

  const email = String(params.email || "");

  const [code, setCode] = useState("");
  const [topError, setTopError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async () => {
    setTopError("");
    setNotice("");

    if (!code.trim() || code.trim().length !== 6) {
      setTopError("يرجى إدخال كود التحقق المكوّن من 6 أرقام");
      return;
    }

    setLoading(true);
    try {
      // Email verification is not required — navigate directly to login.
      setNotice("تم تأكيد الحساب بنجاح");
      router.replace("/auth/login");
    } catch (err: any) {
      setTopError(err?.message || "الكود غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setTopError("");
    setNotice("");
    setResending(true);

    try {
      await resendVerification();
      setNotice("تم إرسال كود جديد إلى بريدك الإلكتروني");
    } catch (err: any) {
      setTopError(err?.message || "تعذّر إعادة إرسال الكود");
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>

          <View style={styles.iconBox}>
            <Mail size={32} color={colors.primary} />
          </View>

          <Text style={styles.title}>تأكيد البريد الإلكتروني</Text>
          <Text style={styles.sub}>
            أرسلنا كود تحقق مكوّن من 6 أرقام إلى:
          </Text>
          <Text style={styles.email}>{email}</Text>

          {topError ? (
            <View style={styles.errBanner}>
              <AlertCircle size={16} color={colors.error} />
              <Text style={styles.errBannerTxt}>{topError}</Text>
            </View>
          ) : null}

          {notice ? (
            <View style={styles.okBanner}>
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.okBannerTxt}>{notice}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Text style={styles.label}>كود التحقق</Text>
            <TextInput
              value={code}
              onChangeText={(t) => setCode(t.replace(/[^0-9]/g, "").slice(0, 6))}
              keyboardType="number-pad"
              placeholder="000000"
              placeholderTextColor={colors.textLight}
              style={styles.codeInput}
              maxLength={6}
              textAlign="center"
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
            disabled={loading}
            onPress={submit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryTxt}>تأكيد الحساب</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, resending && { opacity: 0.6 }]}
            disabled={resending}
            onPress={resend}
          >
            {resending ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.secondaryTxt}>إعادة إرسال الكود</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/auth/login")}>
            <Text style={styles.loginLink}>الرجوع لتسجيل الدخول</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxl },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textMain,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  email: {
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "700",
  },
  form: { marginTop: spacing.xl },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMain,
    marginBottom: 8,
    textAlign: "right",
  },
  codeInput: {
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    fontSize: 22,
    fontWeight: "800",
    color: colors.textMain,
    letterSpacing: 6,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryTxt: { color: colors.primary, fontSize: 14, fontWeight: "700" },
  loginLink: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginTop: spacing.lg,
  },
  errBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  errBannerTxt: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },
  okBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  okBannerTxt: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },
});
