import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Star, MapPin, Package, Building2, Edit3, LogOut, CheckCircle2, TrendingUp, ShoppingBag, Phone, MessageCircle, Clock, DollarSign, Trophy, Share2, Bell, Megaphone } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";
import { companies, companyStats } from "../../src/data/mockData";
import StatCard from "../../src/components/StatCard";

export default function CompanyProfile() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const company = companies.find((c) => c.id === session?.entityId) || companies[0];

  const workingHours = [
    { day: "السبت - الخميس", hours: "8:00 ص - 10:00 م" },
    { day: "الجمعة", hours: "2:00 م - 10:00 م" },
  ];
  const phone = "+966 11 123 4567";
  const whatsapp = "+966 55 123 4567";
  const address = "طريق الملك فهد، حي العليا";

  const doLogout = () => { logout(); router.replace("/"); };

  const comingSoon = (title: string) =>
    Alert.alert(title, "هذه الميزة قيد التطوير وستتوفر قريباً.");

  const handleShareCompany = async () => {
    try {
      await Share.share({
        title: company.name,
        message: `${company.name}\n${company.category} · ${company.city}`,
      });
    } catch (err: any) {
      Alert.alert("تعذّر المشاركة", err?.message || "حدث خطأ غير متوقّع.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hi}>لوحة تحكم الشركة</Text>
            <Text style={styles.title}>{session?.name || company.name}</Text>
          </View>
          <TouchableOpacity
            testID="notif-btn"
            style={styles.bellBtn}
            onPress={() => router.push("/(tabs)/notifications")}
            activeOpacity={0.7}
          >
            <Bell size={18} color={colors.textMain} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>

        {/* Cover + Logo overlap card */}
        <View style={styles.identityCard}>
          <View style={styles.coverWrap}>
            <Image source={{ uri: company.cover }} style={styles.cover} />
            <View style={styles.coverOverlay} />
            <View style={styles.coverActions}>
              <TouchableOpacity testID="cover-share-btn" style={styles.coverActBtn} onPress={handleShareCompany} activeOpacity={0.7}>
                <Share2 size={14} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity testID="edit-cover-btn" style={styles.coverActBtn} onPress={() => comingSoon("تغيير صورة الغلاف")} activeOpacity={0.7}>
                <Edit3 size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.logoRow}>
            <View style={styles.logoWrap}>
              <Image source={{ uri: company.logo }} style={styles.logo} />
              <View style={styles.verified}>
                <CheckCircle2 size={14} color="#fff" />
              </View>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{company.name}</Text>
                <View style={styles.roleTag}>
                  <Building2 size={10} color={colors.accent} />
                  <Text style={styles.roleTxt}>شركة</Text>
                </View>
              </View>
              <Text style={styles.category}>{company.category}</Text>
              <View style={styles.ratingRow}>
                <Star size={12} color={colors.star} fill={colors.star} />
                <Text style={styles.rating}>{company.rating.toFixed(1)}</Text>
                <Text style={styles.reviews}>({company.reviews} تقييم)</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            testID="edit-profile-btn"
            style={styles.editCTA}
            onPress={() => comingSoon("تعديل معلومات الشركة")}
            activeOpacity={0.8}
          >
            <Edit3 size={14} color={colors.textMain} />
            <Text style={styles.editCTATxt}>تعديل معلومات الشركة</Text>
          </TouchableOpacity>
        </View>

        {/* Stats 2x2 */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>نظرة سريعة</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon={<Package size={20} color={colors.accent} />} value={companyStats.totalProducts} label="إجمالي المنتجات" trend={{ value: "+3", up: true }} tint={colors.accentSoft} testID="stat-products" />
          <StatCard icon={<ShoppingBag size={20} color={colors.success} />} value={companyStats.monthlyOrders} label="طلبات الشهر" trend={{ value: "+18%", up: true }} tint="#D1FAE5" testID="stat-orders" />
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon={<DollarSign size={20} color={colors.warning} />} value={`${companyStats.totalSales.toLocaleString()} ر.س`} label="إجمالي المبيعات" trend={{ value: "+24%", up: true }} tint="#FEF3C7" testID="stat-sales" />
          <StatCard icon={<TrendingUp size={20} color="#8B5CF6" />} value={companyStats.views} label="مشاهدة الشهر" trend={{ value: "+28%", up: true }} tint="#EDE9FE" testID="stat-views" />
        </View>

        {/* Best seller */}
        <View style={styles.bestCard}>
          <View style={styles.bestHead}>
            <View style={styles.trophyWrap}>
              <Trophy size={18} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bestLabel}>الأكثر مبيعاً</Text>
              <Text style={styles.bestSub}>هذا الشهر</Text>
            </View>
          </View>
          <View style={styles.bestBody}>
            <Image source={{ uri: companyStats.bestSeller.image }} style={styles.bestImg} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.bestTitle} numberOfLines={2}>{companyStats.bestSeller.title}</Text>
              <View style={styles.bestMeta}>
                <View style={styles.bestPill}>
                  <Text style={styles.bestPillTxt}>{companyStats.bestSeller.sales} مبيعة</Text>
                </View>
                <Text style={styles.bestRev}>{companyStats.bestSeller.revenue.toLocaleString()} ر.س</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>معلومات التواصل</Text>
        </View>
        <View style={styles.card}>
          <ContactRow icon={<Phone size={16} color={colors.accent} />} label="الهاتف" value={phone} onPress={() => Linking.openURL(`tel:${phone}`)} actionLabel="اتصال" />
          <Divider />
          <ContactRow icon={<MessageCircle size={16} color={colors.success} />} label="واتساب" value={whatsapp} onPress={() => Linking.openURL(`https://wa.me/${whatsapp.replace(/\D/g, "")}`)} actionLabel="محادثة" accentColor={colors.success} />
          <Divider />
          <InfoLine icon={<MapPin size={14} color={colors.textLight} />} label="العنوان" value={`${address}، ${company.city}`} />
          <Divider />
          <InfoLine icon={<Building2 size={14} color={colors.textLight} />} label="التصنيف" value={company.category} />
        </View>

        {/* Working hours */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>ساعات العمل</Text>
        </View>
        <View style={styles.card}>
          {workingHours.map((w, i) => (
            <View key={w.day}>
              <View style={styles.hoursRow}>
                <View style={styles.hoursLeft}>
                  <Clock size={14} color={colors.accent} />
                  <Text style={styles.hoursDay}>{w.day}</Text>
                </View>
                <Text style={styles.hoursTxt}>{w.hours}</Text>
              </View>
              {i < workingHours.length - 1 && <Divider />}
            </View>
          ))}
        </View>

        {/* Description */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>نبذة عن الشركة</Text>
          <TouchableOpacity testID="edit-desc-btn" onPress={() => comingSoon("تعديل النبذة")} activeOpacity={0.7}>
            <Text style={styles.sectionAction}>تعديل</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.desc}>{company.description}</Text>
        </View>

        {/* Services / business tags */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>الخدمات والتخصصات</Text>
          <TouchableOpacity testID="edit-services-btn" onPress={() => comingSoon("تعديل الخدمات والتخصصات")} activeOpacity={0.7}>
            <Text style={styles.sectionAction}>تعديل</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.tagsWrap}>
            {company.services.map((s) => (
              <View key={s} style={styles.tag}>
                <CheckCircle2 size={12} color={colors.accent} />
                <Text style={styles.tagTxt}>{s}</Text>
              </View>
            ))}
            <TouchableOpacity
              testID="add-tag-btn"
              style={styles.addTag}
              onPress={() => comingSoon("إضافة تخصص جديد")}
              activeOpacity={0.7}
            >
              <Text style={styles.addTagTxt}>+ إضافة</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ads entry point */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>الإعلانات</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity
            testID="company-open-ads-btn"
            style={styles.adsRow}
            onPress={() => router.push("/company-dashboard/ads")}
          >
            <View style={styles.adsIcon}>
              <Megaphone size={14} color={colors.accent} />
            </View>
            <Text style={styles.adsName}>إدارة الإعلانات والترويج</Text>
            <Text style={styles.sectionAction}>فتح</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity testID="logout-btn" style={styles.logout} onPress={doLogout}>
          <LogOut size={18} color={colors.error} />
          <Text style={styles.logoutTxt}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ContactRow({ icon, label, value, onPress, actionLabel, accentColor }: any) {
  return (
    <View style={styles.contactRow}>
      <View style={[styles.contactIcon, accentColor && { backgroundColor: accentColor + "20" }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
      <TouchableOpacity onPress={onPress} style={[styles.contactAct, accentColor && { backgroundColor: accentColor }]}>
        <Text style={styles.contactActTxt}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoLine({ icon, label, value }: any) {
  return (
    <View style={styles.infoLine}>
      <View style={styles.infoLeft}>{icon}<Text style={styles.infoLabel}>{label}</Text></View>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function Divider() { return <View style={styles.divider} />; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", padding: spacing.lg, gap: spacing.md },
  hi: { fontSize: 12, color: colors.textMuted, textAlign: "right" },
  title: { ...typography.h1, textAlign: "right", marginTop: 2 },
  bellBtn: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  dot: { position: "absolute", top: 10, insetInlineEnd: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },

  identityCard: { marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  coverWrap: { height: 120, position: "relative" },
  cover: { ...StyleSheet.absoluteFillObject },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  coverActions: { position: "absolute", top: spacing.sm, insetInlineStart: spacing.sm, flexDirection: "row", gap: 6 },
  coverActBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },
  logoRow: { flexDirection: "row", gap: spacing.md, padding: spacing.lg, marginTop: -36, alignItems: "flex-end" },
  logoWrap: { position: "relative" },
  logo: { width: 72, height: 72, borderRadius: radius.lg, backgroundColor: "#fff", borderWidth: 3, borderColor: "#fff" },
  verified: { position: "absolute", bottom: -2, insetInlineEnd: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  name: { fontSize: 17, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  roleTag: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: colors.accentSoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  roleTxt: { color: colors.accent, fontSize: 10, fontWeight: "800" },
  category: { fontSize: 12, color: colors.textMuted, textAlign: "right" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  rating: { fontSize: 12, fontWeight: "800", color: colors.textMain },
  reviews: { fontSize: 11, color: colors.textLight },
  editCTA: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginHorizontal: spacing.lg, marginBottom: spacing.lg, paddingVertical: spacing.sm + 2, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  editCTATxt: { fontSize: 13, fontWeight: "700", color: colors.textMain },

  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, textAlign: "right" },
  sectionAction: { color: colors.accent, fontSize: 12, fontWeight: "700" },

  statsGrid: { flexDirection: "row", gap: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.md },

  bestCard: { marginHorizontal: spacing.lg, marginTop: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.md },
  bestHead: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  trophyWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" },
  bestLabel: { fontSize: 14, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  bestSub: { fontSize: 11, color: colors.textMuted, textAlign: "right" },
  bestBody: { flexDirection: "row", gap: spacing.md, alignItems: "center", paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  bestImg: { width: 60, height: 60, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  bestTitle: { fontSize: 13, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  bestMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  bestPill: { backgroundColor: colors.accentSoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  bestPillTxt: { color: colors.accent, fontSize: 11, fontWeight: "800" },
  bestRev: { fontSize: 13, fontWeight: "800", color: colors.success },

  card: { marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  contactRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  contactIcon: { width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  contactLabel: { fontSize: 11, color: colors.textMuted, textAlign: "right" },
  contactValue: { fontSize: 13, color: colors.textMain, fontWeight: "700", textAlign: "right", marginTop: 2 },
  contactAct: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, height: 32, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  contactActTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },
  infoLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.md },
  infoLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoLabel: { fontSize: 12, color: colors.textMuted },
  infoValue: { fontSize: 13, color: colors.textMain, fontWeight: "700", maxWidth: "55%" },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },

  hoursRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.md },
  hoursLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  hoursDay: { fontSize: 13, color: colors.textMain, fontWeight: "700" },
  hoursTxt: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },

  desc: { fontSize: 13, color: colors.textMuted, lineHeight: 22, textAlign: "right", padding: spacing.md },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, padding: spacing.md },
  tag: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.accentSoft, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  tagTxt: { color: colors.accent, fontSize: 12, fontWeight: "800" },
  addTag: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border, borderStyle: "dashed" },
  addTagTxt: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },

  logout: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.lg, paddingVertical: spacing.md + 2, borderRadius: radius.md, borderWidth: 1, borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  logoutTxt: { color: colors.error, fontSize: 14, fontWeight: "700" },

  adsRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  adsIcon: { width: 32, height: 32, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  adsName: { flex: 1, fontSize: 13, color: colors.textMain, fontWeight: "700", textAlign: "right" },
});
