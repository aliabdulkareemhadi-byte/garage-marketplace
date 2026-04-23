import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Package, Calendar, MapPin, Settings as Sett, CreditCard, Globe, HelpCircle, LogOut, Star, Edit3 } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";

const menu = [
  { id: "m1", icon: Package, label: "طلباتي", color: "#0066FF", bg: "#E6F0FF" },
  { id: "m2", icon: Calendar, label: "حجوزاتي", color: "#10B981", bg: "#D1FAE5" },
  { id: "m3", icon: MapPin, label: "العناوين المحفوظة", color: "#F59E0B", bg: "#FEF3C7" },
  { id: "m4", icon: CreditCard, label: "طرق الدفع", color: "#8B5CF6", bg: "#EDE9FE" },
  { id: "m5", icon: Star, label: "تقييماتي", color: "#EF4444", bg: "#FEE2E2" },
  { id: "m6", icon: Globe, label: "اللغة", color: "#06B6D4", bg: "#CFFAFE" },
  { id: "m7", icon: Sett, label: "الإعدادات", color: "#6B7280", bg: "#F3F4F6" },
  { id: "m8", icon: HelpCircle, label: "المساعدة والدعم", color: "#EC4899", bg: "#FCE7F3" },
];

export default function Profile() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>حسابي</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>أح</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.name}>أحمد محمد</Text>
              <Text style={styles.email}>ahmed@example.com</Text>
              <Text style={styles.phone}>+966 5xxxxxxxx</Text>
            </View>
            <TouchableOpacity testID="edit-profile-btn" style={styles.editBtn}>
              <Edit3 size={16} color={colors.textMain} />
            </TouchableOpacity>
          </View>

          <View style={styles.stats}>
            <Stat v="12" l="طلبات" />
            <View style={styles.sep} />
            <Stat v="5" l="حجوزات" />
            <View style={styles.sep} />
            <Stat v="4.8" l="تقييم" />
          </View>
        </View>

        <View style={styles.menu}>
          {menu.map((m, i) => (
            <TouchableOpacity
              key={m.id}
              testID={`profile-menu-${m.id}`}
              activeOpacity={0.7}
              style={[styles.menuItem, i !== menu.length - 1 && styles.menuDivider]}
            >
              <View style={[styles.menuIcon, { backgroundColor: m.bg }]}>
                <m.icon size={18} color={m.color} />
              </View>
              <Text style={styles.menuLabel}>{m.label}</Text>
              <ChevronLeft size={18} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          testID="logout-btn"
          style={styles.logout}
          onPress={() => router.replace("/")}
        >
          <LogOut size={18} color={colors.error} />
          <Text style={styles.logoutTxt}>تسجيل الخروج</Text>
        </TouchableOpacity>

        <Text style={styles.version}>الإصدار 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
      <Text style={{ fontSize: 18, fontWeight: "800", color: colors.textMain }}>{v}</Text>
      <Text style={{ fontSize: 11, color: colors.textMuted }}>{l}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { ...typography.h1, textAlign: "right" },
  card: { marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, gap: spacing.lg },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  avatarTxt: { color: "#fff", fontSize: 22, fontWeight: "800" },
  name: { fontSize: 16, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  email: { fontSize: 12, color: colors.textMuted, textAlign: "right" },
  phone: { fontSize: 12, color: colors.textLight, textAlign: "right" },
  editBtn: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  stats: { flexDirection: "row", paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  sep: { width: 1, backgroundColor: colors.border, marginHorizontal: spacing.sm },
  menu: { marginHorizontal: spacing.lg, marginTop: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.textMain, textAlign: "right" },
  logout: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.lg, paddingVertical: spacing.md + 2, borderRadius: radius.md, borderWidth: 1, borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  logoutTxt: { color: colors.error, fontSize: 14, fontWeight: "700" },
  version: { textAlign: "center", color: colors.textLight, fontSize: 11, marginTop: spacing.lg },
});
