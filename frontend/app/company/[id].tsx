import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star, MapPin, Phone, Globe, ChevronRight, Share2, Heart, CheckCircle2 } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { companies, workshops } from "../../src/data/mockData";
import WorkshopCard from "../../src/components/WorkshopCard";

export default function CompanyProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const company = companies.find((c) => c.id === id) || companies[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl * 2 }}>
        <View style={styles.coverWrap}>
          <Image source={{ uri: company.cover }} style={styles.cover} />
          <View style={styles.coverOverlay} />
          <SafeAreaView edges={["top"]} style={styles.topBar}>
            <TouchableOpacity testID="cp-back" onPress={() => router.back()} style={styles.topBtn}>
              <ChevronRight size={20} color="#fff" />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <TouchableOpacity style={styles.topBtn}>
                <Share2 size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.topBtn}>
                <Heart size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.logoRow}>
          <Image source={{ uri: company.logo }} style={styles.logo} />
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{company.name}</Text>
              <CheckCircle2 size={18} color={colors.accent} />
            </View>
            <Text style={styles.category}>{company.category}</Text>
            <View style={styles.ratingRow}>
              <Star size={14} color={colors.star} fill={colors.star} />
              <Text style={styles.rating}>{company.rating.toFixed(1)}</Text>
              <Text style={styles.reviews}>({company.reviews} تقييم)</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickRow}>
          <QuickItem icon={<Phone size={16} color={colors.accent} />} label="اتصال" />
          <QuickItem icon={<MapPin size={16} color={colors.accent} />} label="الموقع" />
          <QuickItem icon={<Globe size={16} color={colors.accent} />} label="الموقع" />
          <QuickItem icon={<Share2 size={16} color={colors.accent} />} label="مشاركة" />
        </View>

        <Section title="نبذة عن الشركة">
          <Text style={styles.desc}>{company.description}</Text>
        </Section>

        <Section title="الخدمات المقدمة">
          <View style={styles.servWrap}>
            {company.services.map((s) => (
              <View key={s} style={styles.servTag}>
                <Text style={styles.servTagTxt}>{s}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="الموقع">
          <View style={styles.mapBox}>
            <MapPin size={24} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.locTitle}>{company.city}</Text>
              <Text style={styles.locAddr}>طريق الملك فهد، حي العليا</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </View>
        </Section>

        <Section title="ورش تابعة">
          <View style={{ gap: spacing.md }}>
            {workshops.slice(0, 2).map((w) => (
              <View key={w.id} style={{ alignSelf: "stretch" }}>
                <WorkshopCardFull workshop={w} onPress={() => router.push(`/workshop/${w.id}`)} />
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <TouchableOpacity testID="cp-contact-btn" style={styles.primaryBtn}>
          <Text style={styles.primaryTxt}>التواصل مع الشركة</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function WorkshopCardFull({ workshop, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wsRow}>
      <Image source={{ uri: workshop.image }} style={styles.wsImg} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.wsName}>{workshop.name}</Text>
        <Text style={styles.wsLoc}>{workshop.area} · {workshop.city}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Star size={11} color={colors.star} fill={colors.star} />
          <Text style={{ fontSize: 12, fontWeight: "700" }}>{workshop.rating.toFixed(1)}</Text>
        </View>
      </View>
      <ChevronRight size={16} color={colors.textLight} />
    </TouchableOpacity>
  );
}

function QuickItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <TouchableOpacity style={styles.quickItem}>
      <View style={styles.quickIcon}>{icon}</View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
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
  coverWrap: { height: 220, backgroundColor: colors.primary },
  cover: { ...StyleSheet.absoluteFillObject },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  topBar: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  topBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
  logoRow: { flexDirection: "row", gap: spacing.md, padding: spacing.lg, marginTop: -40, alignItems: "flex-end" },
  logo: { width: 80, height: 80, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 3, borderColor: colors.surface },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 20, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  category: { fontSize: 13, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  rating: { fontSize: 13, fontWeight: "700", color: colors.textMain },
  reviews: { fontSize: 12, color: colors.textLight },
  quickRow: { flexDirection: "row", justifyContent: "space-around", marginHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  quickItem: { alignItems: "center", gap: 4, flex: 1 },
  quickIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md, textAlign: "right" },
  desc: { fontSize: 13, color: colors.textMuted, lineHeight: 22, textAlign: "right" },
  servWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  servTag: { backgroundColor: colors.accentSoft, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill },
  servTagTxt: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  mapBox: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  locTitle: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  locAddr: { fontSize: 12, color: colors.textMuted, marginTop: 2, textAlign: "right" },
  wsRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  wsImg: { width: 60, height: 60, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  wsName: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  wsLoc: { fontSize: 12, color: colors.textMuted, textAlign: "right" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg },
  primaryBtn: { backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  primaryTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
