import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wrench, Shield, Zap, CheckCircle2 } from "lucide-react-native";
import { colors, spacing, radius } from "../src/theme/theme";

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
        <SafeAreaView edges={["top"]} style={styles.heroTop}>
          <View style={styles.logoBadge}>
            <Wrench size={22} color="#fff" />
          </View>
          <View style={styles.pill}>
            <View style={styles.pillDot} />
            <Text style={styles.pillTxt}>+1200 ورشة موثوقة</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcome}>أهلاً بك في</Text>
        <Text style={styles.brand}>جراج ماركت</Text>
        <Text style={styles.sub}>
          السوق الأول لخدمات السيارات وقطع الغيار. كل ما تحتاجه لسيارتك في تطبيق واحد.
        </Text>

        <View style={styles.featureRow}>
          <Feature icon={<Zap size={14} color={colors.accent} />} label="سريع" />
          <Feature icon={<Shield size={14} color={colors.success} />} label="آمن" />
          <Feature icon={<CheckCircle2 size={14} color={colors.warning} />} label="موثوق" />
        </View>

        <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
          <TouchableOpacity
            testID="splash-get-started-btn"
            style={styles.primaryBtn}
            onPress={() => router.push("/auth/role-select")}
          >
            <Text style={styles.primaryTxt}>ابدأ الآن</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="splash-login-btn"
            onPress={() => router.push("/auth/login")}
            style={{ alignItems: "center", paddingVertical: spacing.sm }}
          >
            <Text style={styles.loginLink}>
              لديك حساب؟ <Text style={{ color: colors.accent, fontWeight: "800" }}>سجّل الدخول</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Feature({ icon, label }: any) {
  return (
    <View style={styles.feat}>
      {icon}
      <Text style={styles.featTxt}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { height: 340, position: "relative", overflow: "hidden", borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,10,10,0.55)" },
  heroTop: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logoBadge: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  pillDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  pillTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, justifyContent: "space-between", paddingBottom: spacing.xl },
  welcome: { fontSize: 14, color: colors.textMuted, textAlign: "right" },
  brand: { fontSize: 34, fontWeight: "800", color: colors.textMain, textAlign: "right", marginTop: 2 },
  sub: { fontSize: 14, color: colors.textMuted, textAlign: "right", lineHeight: 22, marginTop: spacing.md },
  featureRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
  feat: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  featTxt: { fontSize: 11, fontWeight: "700", color: colors.textMain },
  primaryBtn: { backgroundColor: colors.primary, height: 54, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
  loginLink: { color: colors.textMuted, fontSize: 13 },
});
