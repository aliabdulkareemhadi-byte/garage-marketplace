import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star, MapPin, Phone, ChevronRight, Share2, Heart, Clock, CheckCircle2 } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { workshops } from "../../src/data/mockData";

export default function WorkshopProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const w = workshops.find((x) => x.id === id) || workshops[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.coverWrap}>
          <Image source={{ uri: w.image }} style={styles.cover} />
          <View style={styles.coverOverlay} />
          <SafeAreaView edges={["top"]} style={styles.topBar}>
            <TouchableOpacity testID="wp-back" onPress={() => router.back()} style={styles.topBtn}>
              <ChevronRight size={20} color="#fff" />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <TouchableOpacity style={styles.topBtn}><Share2 size={18} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.topBtn}><Heart size={18} color="#fff" /></TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.card}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{w.name}</Text>
            {w.open && (
              <View style={styles.openTag}>
                <View style={styles.openDot} />
                <Text style={styles.openTxt}>مفتوحة الآن</Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            <MapPin size={13} color={colors.textMuted} />
            <Text style={styles.meta}>{w.area} · {w.city}</Text>
          </View>
          <View style={styles.metaRow}>
            <Star size={13} color={colors.star} fill={colors.star} />
            <Text style={styles.rating}>{w.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({w.reviews} تقييم)</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeTxt}>{w.priceRange}</Text>
            </View>
          </View>
        </View>

        <Section title="الخدمات المتوفرة">
          <View style={{ gap: spacing.sm }}>
            {w.services.map((s) => (
              <View key={s.id} style={styles.servRow}>
                <View style={styles.check}>
                  <CheckCircle2 size={18} color={colors.success} />
                </View>
                <Text style={styles.servName}>{s.name}</Text>
                <Text style={styles.servPrice}>{s.price} ر.س</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="ساعات العمل">
          <View style={styles.hoursBox}>
            <Clock size={18} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.hoursTitle}>من السبت إلى الخميس</Text>
              <Text style={styles.hoursSub}>8:00 ص - 10:00 م</Text>
            </View>
          </View>
        </Section>

        <Section title="التقييمات">
          <View style={styles.reviewCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.reviewer}>محمد العتيبي</Text>
              <View style={{ flexDirection: "row", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={12} color={colors.star} fill={colors.star} />
                ))}
              </View>
            </View>
            <Text style={styles.reviewBody}>خدمة ممتازة وأسعار مناسبة، الفنيون محترفون جداً وسرعة في الإنجاز.</Text>
            <Text style={styles.reviewTime}>قبل 3 أيام</Text>
          </View>
        </Section>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <TouchableOpacity style={styles.callBtn}>
          <Phone size={18} color={colors.textMain} />
        </TouchableOpacity>
        <TouchableOpacity
          testID="book-now-btn"
          style={styles.primaryBtn}
          onPress={() => router.push(`/booking/${w.id}`)}
        >
          <Text style={styles.primaryTxt}>احجز الآن</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  coverWrap: { height: 240, backgroundColor: colors.primary },
  cover: { ...StyleSheet.absoluteFillObject },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  topBar: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  topBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
  card: { marginHorizontal: spacing.lg, marginTop: -32, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, gap: spacing.sm },
  nameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { fontSize: 20, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  openTag: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#D1FAE5", paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  openDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  openTxt: { fontSize: 10, fontWeight: "700", color: colors.success },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  meta: { fontSize: 13, color: colors.textMuted },
  rating: { fontSize: 13, fontWeight: "700", color: colors.textMain },
  reviews: { fontSize: 12, color: colors.textLight },
  priceBadge: { marginStart: "auto", backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm },
  priceBadgeTxt: { fontSize: 11, color: colors.textMain, fontWeight: "600" },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md, textAlign: "right" },
  servRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  check: { width: 32, height: 32, borderRadius: radius.md, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" },
  servName: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.textMain, textAlign: "right" },
  servPrice: { fontSize: 14, fontWeight: "700", color: colors.accent },
  hoursBox: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  hoursTitle: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  hoursSub: { fontSize: 12, color: colors.textMuted, marginTop: 2, textAlign: "right" },
  reviewCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  reviewer: { fontSize: 14, fontWeight: "700", color: colors.textMain },
  reviewBody: { fontSize: 13, color: colors.textMuted, lineHeight: 20, textAlign: "right" },
  reviewTime: { fontSize: 11, color: colors.textLight, textAlign: "right" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg },
  callBtn: { width: 52, height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  primaryBtn: { flex: 1, backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  primaryTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
