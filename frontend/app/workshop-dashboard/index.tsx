import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Star, MapPin, Wrench, Edit3, LogOut, Clock, Calendar, TrendingUp } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";
import { workshops, workshopBookings } from "../../src/data/mockData";
import StatCard from "../../src/components/StatCard";

export default function WorkshopProfile() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const ws = workshops.find((w) => w.id === session?.entityId) || workshops[0];
  const activeBookings = workshopBookings.filter((b) => b.status === "جديد" || b.status === "مؤكد" || b.status === "قيد التنفيذ").length;
  const completed = workshopBookings.filter((b) => b.status === "مكتمل").length;

  const doLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={styles.header}>
          <Text style={styles.hi}>مرحباً 👋</Text>
          <Text style={styles.title}>{session?.name || ws.name}</Text>
          <View style={styles.roleTag}>
            <Wrench size={12} color={colors.accent} />
            <Text style={styles.roleTxt}>حساب ورشة</Text>
          </View>
        </View>

        <View style={styles.coverWrap}>
          <Image source={{ uri: ws.image }} style={styles.cover} />
          <View style={styles.coverOverlay} />
          <View style={styles.infoBottom}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{ws.name}</Text>
              {ws.open && (
                <View style={styles.openTag}>
                  <View style={styles.openDot} />
                  <Text style={styles.openTxt}>مفتوحة</Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MapPin size={12} color="rgba(255,255,255,0.9)" />
              <Text style={styles.loc}>{ws.area} · {ws.city}</Text>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          <StatCard icon={<Calendar size={20} color={colors.accent} />} value={activeBookings} label="حجز نشط" trend={{ value: "+18%", up: true }} tint={colors.accentSoft} testID="stat-active" />
          <StatCard icon={<TrendingUp size={20} color={colors.success} />} value={completed} label="مكتمل" trend={{ value: "+32%", up: true }} tint="#D1FAE5" testID="stat-completed" />
          <StatCard icon={<Star size={20} color={colors.star} />} value={ws.rating.toFixed(1)} label={`${ws.reviews} تقييم`} tint="#FEF3C7" testID="stat-rating" />
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>معلومات الورشة</Text>
            <TouchableOpacity testID="edit-ws-btn" style={styles.editBtn}>
              <Edit3 size={14} color={colors.textMain} />
              <Text style={styles.editTxt}>تعديل</Text>
            </TouchableOpacity>
          </View>
          <InfoRow icon={<MapPin size={14} color={colors.textLight} />} label="الموقع" value={`${ws.area} - ${ws.city}`} />
          <InfoRow icon={<Clock size={14} color={colors.textLight} />} label="ساعات العمل" value="8:00 ص - 10:00 م" />
          <InfoRow icon={<Wrench size={14} color={colors.textLight} />} label="الفئة السعرية" value={ws.priceRange} />
          <InfoRow icon={<Star size={14} color={colors.star} />} label="التقييم" value={`${ws.rating.toFixed(1)} (${ws.reviews})`} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>إحصائيات سريعة</Text>
          <View style={styles.quickStats}>
            <View style={styles.quickStatBox}>
              <Text style={styles.quickStatV}>{workshopBookings.length}</Text>
              <Text style={styles.quickStatL}>إجمالي الحجوزات</Text>
            </View>
            <View style={styles.quickStatBox}>
              <Text style={styles.quickStatV}>{ws.services.length}</Text>
              <Text style={styles.quickStatL}>خدمة متوفرة</Text>
            </View>
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
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
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
  coverWrap: { marginHorizontal: spacing.lg, height: 160, borderRadius: radius.xl, overflow: "hidden", position: "relative" },
  cover: { ...StyleSheet.absoluteFillObject },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  infoBottom: { position: "absolute", bottom: spacing.md, insetInlineStart: spacing.md, insetInlineEnd: spacing.md, gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { fontSize: 18, fontWeight: "800", color: "#fff", textAlign: "right" },
  openTag: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(16,185,129,0.95)", paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  openDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#fff" },
  openTxt: { fontSize: 10, fontWeight: "700", color: "#fff" },
  loc: { fontSize: 12, color: "rgba(255,255,255,0.9)" },
  stats: { flexDirection: "row", gap: spacing.md, padding: spacing.lg },
  statBox: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, alignItems: "center", gap: 6 },
  statIcon: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  statV: { fontSize: 18, fontWeight: "800", color: colors.textMain },
  statL: { fontSize: 11, color: colors.textMuted, textAlign: "center" },
  card: { marginHorizontal: spacing.lg, marginTop: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, gap: spacing.sm },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  cardTitle: { ...typography.h3, textAlign: "right" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.sm },
  editTxt: { fontSize: 11, color: colors.textMain, fontWeight: "700" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  infoLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoLabel: { fontSize: 12, color: colors.textMuted },
  infoValue: { fontSize: 13, color: colors.textMain, fontWeight: "700", maxWidth: "55%" },
  quickStats: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
  quickStatBox: { flex: 1, backgroundColor: colors.accentSoft, padding: spacing.md, borderRadius: radius.md, alignItems: "center", gap: 4 },
  quickStatV: { fontSize: 22, fontWeight: "800", color: colors.accent },
  quickStatL: { fontSize: 11, color: colors.textMuted },
  logout: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.lg, paddingVertical: spacing.md + 2, borderRadius: radius.md, borderWidth: 1, borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  logoutTxt: { color: colors.error, fontSize: 14, fontWeight: "700" },
});
