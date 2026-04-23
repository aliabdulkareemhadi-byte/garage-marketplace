import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wrench } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../src/theme/theme";
export default function Splash() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.hero}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1636613112804-c5aebc1f4d8d?w=1200" }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlay} />
        <View style={styles.logoBadge}>
          <Wrench size={28} color="#fff" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcome}>أهلاً بك في</Text>
        <Text style={styles.brand}>جراج ماركت</Text>
        <Text style={styles.sub}>
          سوق خدمات السيارات وقطع الغيار الأول في المنطقة. احجز ورشة، اطلب قطعة، اكتشف أفضل الشركات.
        </Text>

        <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
          <TouchableOpacity
            testID="splash-login-btn"
            style={styles.primaryBtn}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.primaryTxt}>تسجيل الدخول</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="splash-register-btn"
            style={styles.secondaryBtn}
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.secondaryTxt}>إنشاء حساب جديد</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="splash-guest-btn"
            onPress={() => router.replace("/(tabs)/home")}
            style={{ alignItems: "center", paddingVertical: spacing.md }}
          >
            <Text style={styles.guest}>متابعة كزائر ←</Text>
          </TouchableOpacity>

          <View style={styles.roleRow}>
            <TouchableOpacity
              testID="splash-company-btn"
              style={styles.roleBtn}
              onPress={() => router.push("/auth/company-login")}
            >
              <Text style={styles.roleTxt}>🏢 حساب شركة</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="splash-workshop-btn"
              style={styles.roleBtn}
              onPress={() => router.push("/auth/workshop-login")}
            >
              <Text style={styles.roleTxt}>🔧 حساب ورشة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { height: 320, position: "relative", overflow: "hidden", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,10,10,0.55)" },
  logoBadge: {
    position: "absolute",
    bottom: spacing.xl,
    alignSelf: "flex-start",
    insetInlineStart: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, justifyContent: "space-between", paddingBottom: spacing.xl },
  welcome: { fontSize: 16, color: colors.textMuted, textAlign: "right" },
  brand: { fontSize: 32, fontWeight: "800", color: colors.textMain, textAlign: "right", marginTop: 4 },
  sub: { fontSize: 14, color: colors.textMuted, textAlign: "right", lineHeight: 22, marginTop: spacing.md },
  primaryBtn: { backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: { backgroundColor: colors.surface, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  secondaryTxt: { color: colors.textMain, fontSize: 16, fontWeight: "700" },
  guest: { color: colors.accent, fontSize: 14, fontWeight: "600" },
  roleRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
  roleBtn: { flex: 1, height: 44, borderRadius: radius.md, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt },
  roleTxt: { color: colors.textMain, fontSize: 12, fontWeight: "700" },
});
