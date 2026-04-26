import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Star, MapPin, ChevronLeft, BadgeCheck } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../theme/theme";
import type { Company } from "../data/mockData";

export default function CompanyCard({ company, onPress }: { company: Company; onPress?: () => void }) {
  return (
    <TouchableOpacity
      testID={`company-card-${company.id}`}
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.imgWrap}>
        <Image source={{ uri: company.logo }} style={styles.img} />
        <View style={styles.verified}>
          <BadgeCheck size={11} color="#fff" />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{company.name}</Text>
        <View style={styles.row}>
          <Star size={11} color={colors.star} fill={colors.star} />
          <Text style={styles.ratingTxt}>{company.rating.toFixed(1)}</Text>
          <Text style={styles.reviewsTxt}>({company.reviews})</Text>
        </View>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagTxt}>{company.category}</Text>
          </View>
        </View>
        <View style={styles.cityRow}>
          <MapPin size={10} color={colors.textLight} />
          <Text style={styles.city}>{company.city}</Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <ChevronLeft size={18} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    width: 290,
    gap: spacing.md,
  },
  imgWrap: { position: "relative" },
  img: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  verified: { position: "absolute", bottom: -2, insetInlineEnd: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.surface },
  body: { flex: 1, gap: 4 },
  title: { ...typography.h3 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingTxt: { fontSize: 12, fontWeight: "800", color: colors.textMain },
  reviewsTxt: { fontSize: 10, color: colors.textLight },
  tagRow: { flexDirection: "row", alignItems: "center" },
  tag: { backgroundColor: colors.accentSoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  tagTxt: { fontSize: 10, color: colors.accent, fontWeight: "700" },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  city: { fontSize: 10, color: colors.textLight, fontWeight: "600" },
  chevron: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
});
