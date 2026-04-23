import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Star, MapPin, Wrench, Edit3, LogOut, Clock, Calendar, TrendingUp, DollarSign, Phone, MessageCircle, CheckCircle2, Trophy, Share2, Bell, Wallet as WalletIcon } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";
import { workshops, workshopStats } from "../../src/data/mockData";
import { useWallet } from "../../src/context/WalletContext";
import StatCard from "../../src/components/StatCard";

export default function WorkshopProfile() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const { wallet } = useWallet();
  const ws = workshops.find((w) => w.id === session?.entityId) || workshops[0];

  const workingHours = [
    { day: "السبت - الخميس", hours: "8:00 ص - 10:00 م" },
    { day: "الجمعة", hours: "2:00 م - 10:00 م" },
  ];
  const phone = "+966 11 456 7890";
  const whatsapp = "+966 55 789 1234";

  const doLogout = () => { logout(); router.replace("/"); };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hi}>لوحة تحكم الورشة</Text>
            <Text style={styles.title}>{session?.name || ws.name}</Text>
          </View>
          <TouchableOpacity testID="notif-btn" style={styles.bellBtn}>
            <Bell size={18} color={colors.textMain} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>

        {/* Identity card */}
        <View style={styles.identityCard}>
          <View style={styles.coverWrap}>
            <Image source={{ uri: ws.image }} style={styles.cover} />
            <View style={styles.coverOverlay} />
            <View style={styles.coverActions}>
              <TouchableOpacity style={styles.coverActBtn}><Share2 size={14} color="#fff" /></TouchableOpacity>
              <TouchableOpacity testID="edit-cover-btn" style={styles.coverActBtn}><Edit3 size={14} color="#fff" /></TouchableOpacity>
            </View>
            <View style={styles.coverBottom}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{ws.name}</Text>
                {ws.open ? (
                  <View style={styles.openTag}><View style={styles.openDot} /><Text style={styles.openTxt}>مفتوحة</Text></View>
                ) : (
                  <View style={styles.closedTag}><Text style={styles.closedTxt}>مغلقة</Text></View>
                )}
              </View>
              <View style={styles.coverMeta}>
                <View style={styles.metaRow}>
                  <MapPin size={11} color="#fff" />
                  <Text style={styles.metaTxt}>{ws.area} · {ws.city}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Star size={11} color={colors.star} fill={colors.star} />
                  <Text style={styles.metaTxt}>{ws.rating.toFixed(1)} ({ws.reviews} تقييم)</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity testID="edit-profile-btn" style={styles.editCTA}>
            <Edit3 size={14} color={colors.textMain} />
            <Text style={styles.editCTATxt}>تعديل معلومات الورشة</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>نظرة سريعة</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon={<Calendar size={20} color={colors.accent} />} value={workshopStats.totalBookings} label="إجمالي الحجوزات" trend={{ value: "+12%", up: true }} tint={colors.accentSoft} testID="stat-total" />
          <StatCard icon={<TrendingUp size={20} color={colors.success} />} value={workshopStats.monthlyBookings} label="حجوزات الشهر" trend={{ value: "+18%", up: true }} tint="#D1FAE5" testID="stat-monthly" />
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon={<DollarSign size={20} color={colors.warning} />} value={`${workshopStats.revenue.toLocaleString()} ر.س`} label="الإيرادات" trend={{ value: "+24%", up: true }} tint="#FEF3C7" testID="stat-revenue" />
          <StatCard icon={<Wrench size={20} color="#8B5CF6" />} value={workshopStats.activeServices} label="خدمات نشطة" tint="#EDE9FE" testID="stat-services" />
        </View>

        {/* Top service */}
        <View style={styles.topCard}>
          <View style={styles.topHead}>
            <View style={styles.trophyWrap}><Trophy size={18} color="#F59E0B" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.topLabel}>الخدمة الأكثر طلباً</Text>
              <Text style={styles.topSub}>هذا الشهر</Text>
            </View>
          </View>
          <View style={styles.topBody}>
            <View style={styles.topIcon}><Wrench size={22} color={colors.accent} /></View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.topTitle}>{workshopStats.topService.name}</Text>
              <View style={styles.topMeta}>
                <View style={styles.topPill}><Text style={styles.topPillTxt}>{workshopStats.topService.count} حجز</Text></View>
                <Text style={styles.topRev}>{workshopStats.topService.revenue.toLocaleString()} ر.س</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>معلومات التواصل</Text></View>
        <View style={styles.card}>
          <ContactRow icon={<Phone size={16} color={colors.accent} />} label="الهاتف" value={phone} onPress={() => Linking.openURL(`tel:${phone}`)} actionLabel="اتصال" />
          <Divider />
          <ContactRow icon={<MessageCircle size={16} color={colors.success} />} label="واتساب" value={whatsapp} onPress={() => Linking.openURL(`https://wa.me/${whatsapp.replace(/\D/g, "")}`)} actionLabel="محادثة" accentColor={colors.success} />
          <Divider />
          <InfoLine icon={<MapPin size={14} color={colors.textLight} />} label="العنوان" value={`${ws.area}، ${ws.city}`} />
          <Divider />
          <InfoLine icon={<Wrench size={14} color={colors.textLight} />} label="الفئة السعرية" value={ws.priceRange} />
        </View>

        {/* Working hours */}
        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>ساعات العمل</Text></View>
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
          <Text style={styles.sectionTitle}>نبذة عن الورشة</Text>
          <TouchableOpacity><Text style={styles.sectionAction}>تعديل</Text></TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.desc}>
            ورشة متخصصة في صيانة السيارات بأعلى المعايير. فنيون مؤهلون ومعدات حديثة مع ضمان على جميع الخدمات المقدمة.
          </Text>
        </View>

        {/* Services preview */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>الخدمات ({ws.services.length})</Text>
          <TouchableOpacity onPress={() => router.push("/workshop-dashboard/services")}>
            <Text style={styles.sectionAction}>عرض الكل</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {ws.services.map((s, i) => (
            <View key={s.id}>
              <View style={styles.servRow}>
                <View style={styles.servIcon}>
                  <CheckCircle2 size={14} color={colors.success} />
                </View>
                <Text style={styles.servName}>{s.name}</Text>
                <Text style={styles.servPrice}>{s.price} ر.س</Text>
              </View>
              {i < ws.services.length - 1 && <Divider />}
            </View>
          ))}
        </View>

        {/* Customer Maintenance Reminders entry point */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>تذكيرات الصيانة</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity
            testID="open-reminders-btn"
            style={styles.servRow}
            onPress={() => router.push("/workshop-dashboard/reminders")}
          >
            <View style={[styles.servIcon, { backgroundColor: colors.accentSoft }]}>
              <Bell size={14} color={colors.accent} />
            </View>
            <Text style={styles.servName}>إدارة تذكيرات العملاء</Text>
            <Text style={styles.sectionAction}>فتح</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet entry point */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>المحفظة</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity
            testID="open-wallet-btn"
            style={styles.servRow}
            onPress={() => router.push("/workshop-dashboard/wallet")}
          >
            <View style={[styles.servIcon, { backgroundColor: colors.accentSoft }]}>
              <WalletIcon size={14} color={colors.accent} />
            </View>
            <Text style={styles.servName}>الرصيد والمعاملات</Text>
            <Text style={styles.servPrice}>{wallet.balance.toLocaleString()} {wallet.currency}</Text>
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
  coverWrap: { height: 180, position: "relative" },
  cover: { ...StyleSheet.absoluteFillObject },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  coverActions: { position: "absolute", top: spacing.sm, insetInlineStart: spacing.sm, flexDirection: "row", gap: 6 },
  coverActBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },
  coverBottom: { position: "absolute", bottom: spacing.md, insetInlineStart: spacing.md, insetInlineEnd: spacing.md, gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  name: { fontSize: 18, fontWeight: "800", color: "#fff", textAlign: "right" },
  openTag: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(16,185,129,0.95)", paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  openDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#fff" },
  openTxt: { fontSize: 10, fontWeight: "800", color: "#fff" },
  closedTag: { backgroundColor: "rgba(156,163,175,0.95)", paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  closedTxt: { fontSize: 10, fontWeight: "800", color: "#fff" },
  coverMeta: { gap: 3 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaTxt: { fontSize: 12, color: "#fff", fontWeight: "600" },

  editCTA: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginHorizontal: spacing.lg, marginVertical: spacing.lg, paddingVertical: spacing.sm + 2, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  editCTATxt: { fontSize: 13, fontWeight: "700", color: colors.textMain },

  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, textAlign: "right" },
  sectionAction: { color: colors.accent, fontSize: 12, fontWeight: "700" },

  statsGrid: { flexDirection: "row", gap: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.md },

  topCard: { marginHorizontal: spacing.lg, marginTop: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.md },
  topHead: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  trophyWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" },
  topLabel: { fontSize: 14, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  topSub: { fontSize: 11, color: colors.textMuted, textAlign: "right" },
  topBody: { flexDirection: "row", gap: spacing.md, alignItems: "center", paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  topIcon: { width: 50, height: 50, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  topTitle: { fontSize: 13, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  topMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  topPill: { backgroundColor: colors.accentSoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  topPillTxt: { color: colors.accent, fontSize: 11, fontWeight: "800" },
  topRev: { fontSize: 13, fontWeight: "800", color: colors.success },

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

  servRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  servIcon: { width: 28, height: 28, borderRadius: radius.sm, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" },
  servName: { flex: 1, fontSize: 13, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  servPrice: { fontSize: 13, fontWeight: "800", color: colors.accent },

  logout: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.lg, paddingVertical: spacing.md + 2, borderRadius: radius.md, borderWidth: 1, borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  logoutTxt: { color: colors.error, fontSize: 14, fontWeight: "700" },
});
