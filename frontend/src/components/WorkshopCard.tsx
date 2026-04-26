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
        <View style={styles.imgOverlay} />
        <View style={[styles.openTag, { backgroundColor: workshop.open ? "rgba(16,185,129,0.95)" : "rgba(156,163,175,0.95)" }]}>
          <View style={[styles.openDot, { backgroundColor: "#fff" }]} />
          <Text style={styles.openTxt}>{workshop.open ? "مفتوحة" : "مغلقة"}</Text>
        </View>
        <View style={styles.ratingOnImg}>
          <Star size={10} color={colors.star} fill={colors.star} />
          <Text style={styles.ratingOnImgTxt}>{workshop.rating.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{workshop.name}</Text>
        <View style={styles.metaRow}>
          <MapPin size={11} color={colors.textLight} />
          <Text style={styles.loc} numberOfLines={1}>{workshop.area} · {workshop.city}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.reviewsTxt}>{workshop.reviews} تقييم</Text>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeTxt}>{workshop.priceRange}</Text>
          </View>
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
    width: 210,
  },
  imgWrap: { position: "relative" },
  img: { width: "100%", height: 130, backgroundColor: colors.surfaceAlt },
  imgOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: 50, backgroundColor: "rgba(0,0,0,0.25)" },
  openTag: { position: "absolute", top: spacing.sm, insetInlineStart: spacing.sm, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  openDot: { width: 5, height: 5, borderRadius: 3 },
  openTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
  ratingOnImg: { position: "absolute", bottom: spacing.sm, insetInlineEnd: spacing.sm, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(255,255,255,0.95)", paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  ratingOnImgTxt: { fontSize: 11, fontWeight: "800", color: colors.textMain },
  body: { padding: spacing.md, gap: 4 },
  title: { ...typography.h3 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  loc: { fontSize: 11, color: colors.textMuted, flex: 1 },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  reviewsTxt: { fontSize: 10, color: colors.textLight, fontWeight: "600" },
  priceBadge: { backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  priceBadgeTxt: { fontSize: 10, color: colors.textMain, fontWeight: "700" },
});
