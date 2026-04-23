import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Star, MapPin, ChevronLeft } from "lucide-react-native";
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
      <Image source={{ uri: company.logo }} style={styles.img} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{company.name}</Text>
        <View style={styles.row}>
          <View style={styles.rating}>
            <Star size={12} color={colors.star} fill={colors.star} />
            <Text style={styles.ratingTxt}>{company.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsTxt}>({company.reviews})</Text>
          </View>
        </View>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagTxt}>{company.category}</Text>
          </View>
          <View style={styles.cityRow}>
            <MapPin size={11} color={colors.textLight} />
            <Text style={styles.city}>{company.city}</Text>
          </View>
        </View>
      </View>
      <ChevronLeft size={18} color={colors.textLight} />
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
    width: 280,
    gap: spacing.md,
  },
  img: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  body: { flex: 1, gap: 4 },
  title: { ...typography.h3 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rating: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingTxt: { fontSize: 12, fontWeight: "700", color: colors.textMain },
  reviewsTxt: { fontSize: 11, color: colors.textLight },
  tagRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 2 },
  tag: { backgroundColor: colors.accentSoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  tagTxt: { fontSize: 11, color: colors.accent, fontWeight: "600" },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  city: { fontSize: 11, color: colors.textLight },
});
