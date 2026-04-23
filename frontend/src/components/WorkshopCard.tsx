import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Star, MapPin } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../theme/theme";
import type { Workshop } from "../data/mockData";

export default function WorkshopCard({ workshop, onPress }: { workshop: Workshop; onPress?: () => void }) {
  return (
    <TouchableOpacity
      testID={`workshop-card-${workshop.id}`}
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.imgWrap}>
        <Image source={{ uri: workshop.image }} style={styles.img} />
        <View style={[styles.openTag, { backgroundColor: workshop.open ? colors.success : colors.textLight }]}>
          <Text style={styles.openTxt}>{workshop.open ? "مفتوحة" : "مغلقة"}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{workshop.name}</Text>
        <View style={styles.row}>
          <MapPin size={11} color={colors.textLight} />
          <Text style={styles.loc} numberOfLines={1}>{workshop.area} · {workshop.city}</Text>
        </View>
        <View style={styles.row}>
          <Star size={12} color={colors.star} fill={colors.star} />
          <Text style={styles.ratingTxt}>{workshop.rating.toFixed(1)}</Text>
          <Text style={styles.reviewsTxt}>({workshop.reviews} تقييم)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    width: 200,
  },
  imgWrap: { position: "relative" },
  img: { width: "100%", height: 120, backgroundColor: colors.surfaceAlt },
  openTag: { position: "absolute", top: spacing.sm, insetInlineStart: spacing.sm, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm },
  openTxt: { color: "#fff", fontSize: 10, fontWeight: "700" },
  body: { padding: spacing.md, gap: 4 },
  title: { ...typography.h3 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  loc: { fontSize: 12, color: colors.textMuted, flex: 1 },
  ratingTxt: { fontSize: 12, fontWeight: "700", color: colors.textMain },
  reviewsTxt: { fontSize: 11, color: colors.textLight },
});
