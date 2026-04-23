import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Star, MapPin, Package, Building2, Edit3, LogOut, CheckCircle2, TrendingUp, Eye } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";
import { companies, products } from "../../src/data/mockData";
import StatCard from "../../src/components/StatCard";

export default function CompanyProfile() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const company = companies.find((c) => c.id === session?.entityId) || companies[0];
  const myProducts = products.length; // mock: all products belong to this company

  const doLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={styles.header}>
          <Text style={styles.hi}>مرحباً 👋</Text>
          <Text style={styles.title}>{session?.name || company.name}</Text>
          <View style={styles.roleTag}>
            <Building2 size={12} color={colors.accent} />
            <Text style={styles.roleTxt}>حساب شركة</Text>
          </View>
        </View>

        <View style={styles.coverWrap}>
          <Image source={{ uri: company.cover }} style={styles.cover} />
          <View style={styles.coverOverlay} />
          <View style={styles.logoRow}>
            <Image source={{ uri: company.logo }} style={styles.logo} />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{company.name}</Text>
                <CheckCircle2 size={16} color="#fff" />
              </View>
              <Text style={styles.category}>{company.category}</Text>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          <StatCard icon={<Package size={20} color={colors.accent} />} value={myProducts} label="منتج نشط" trend={{ value: "+12%", up: true }} tint={colors.accentSoft} testID="stat-products" />
          <StatCard icon={<Eye size={20} color={colors.success} />} value="3.2k" label="مشاهدة الشهر" trend={{ value: "+28%", up: true }} tint="#D1FAE5" testID="stat-views" />
          <StatCard icon={<TrendingUp size={20} color={colors.warning} />} value="48" label="طلب هذا الشهر" trend={{ value: "-4%", up: false }} tint="#FEF3C7" testID="stat-orders" />
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>معلومات الشركة</Text>
            <TouchableOpacity testID="edit-profile-btn" style={styles.editBtn}>
              <Edit3 size={14} color={colors.textMain} />
              <Text style={styles.editTxt}>تعديل</Text>
            </TouchableOpacity>
          </View>
          <InfoRow icon={<MapPin size={14} color={colors.textLight} />} label="المدينة" value={company.city} />
          <InfoRow icon={<Star size={14} color={colors.star} />} label="التقييم" value={`${company.rating.toFixed(1)} (${company.reviews})`} />
          <InfoRow icon={<Building2 size={14} color={colors.textLight} />} label="التصنيف" value={company.category} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>الوصف</Text>
          <Text style={styles.desc}>{company.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>الخدمات</Text>
          <View style={styles.servWrap}>
            {company.services.map((s) => (
              <View key={s} style={styles.tag}>
                <Text style={styles.tagTxt}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity testID="logout-btn" style={styles.logout} onPress={doLogout}>
          <LogOut size={18} color={colors.error} />
          <Text style={styles.logoutTxt}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon, v, l }: any) {
  return (
    <View style={styles.statBox}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statV}>{v}</Text>
      <Text style={styles.statL}>{l}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        {icon}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, gap: 4 },
  hi: { fontSize: 13, color: colors.textMuted, textAlign: "right" },
  title: { ...typography.h1, textAlign: "right" },
  roleTag: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", backgroundColor: colors.accentSoft, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill, marginTop: 4 },
  roleTxt: { color: colors.accent, fontSize: 11, fontWeight: "700" },
  coverWrap: { marginHorizontal: spacing.lg, height: 140, borderRadius: radius.xl, overflow: "hidden", position: "relative" },
  cover: { ...StyleSheet.absoluteFillObject },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  logoRow: { position: "absolute", bottom: spacing.md, insetInlineStart: spacing.md, insetInlineEnd: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  logo: { width: 56, height: 56, borderRadius: radius.md, borderWidth: 2, borderColor: "#fff", backgroundColor: "#fff" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 17, fontWeight: "800", color: "#fff", textAlign: "right" },
  category: { fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2, textAlign: "right" },
  stats: { flexDirection: "row", gap: spacing.md, padding: spacing.lg },
  statBox: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, alignItems: "center", gap: 6 },
  statIcon: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  statV: { fontSize: 18, fontWeight: "800", color: colors.textMain },
  statL: { fontSize: 11, color: colors.textMuted },
  card: { marginHorizontal: spacing.lg, marginTop: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, gap: spacing.sm },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  cardTitle: { ...typography.h3, textAlign: "right" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.sm },
  editTxt: { fontSize: 11, color: colors.textMain, fontWeight: "700" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  infoLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoLabel: { fontSize: 12, color: colors.textMuted },
  infoValue: { fontSize: 13, color: colors.textMain, fontWeight: "700" },
  desc: { fontSize: 13, color: colors.textMuted, lineHeight: 22, textAlign: "right" },
  servWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  tag: { backgroundColor: colors.accentSoft, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  tagTxt: { color: colors.accent, fontSize: 11, fontWeight: "700" },
  logout: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.lg, paddingVertical: spacing.md + 2, borderRadius: radius.md, borderWidth: 1, borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  logoutTxt: { color: colors.error, fontSize: 14, fontWeight: "700" },
});
