import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Star } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../theme/theme";
import { initialWorkshopAds } from "../data/adsMockData";
import type { Ad } from "../types/ad";

type Props = {
  onPressAd?: (ad: Ad) => void;
};

export default function AdsSection({ onPressAd }: Props) {
  const ads = useMemo(() => {
    return initialWorkshopAds
      .filter((a) => a.status === "active")
      .sort((a, b) => {
        if (a.isFeatured === b.isFeatured) return 0;
        return a.isFeatured ? -1 : 1;
      });
  }, []);

  if (ads.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إعلانات ممولة</Text>
      </View>
      <FlatList
        data={ads}
        keyExtractor={(a) => a.id}
        horizontal
        inverted
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hList}
        ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`home-ad-${item.id}`}
            activeOpacity={0.9}
            style={styles.card}
            onPress={() => onPressAd?.(item)}
          >
            <View style={styles.imgWrap}>
              <Image source={{ uri: item.imageUrl }} style={styles.img} />
              {item.isFeatured ? (
                <View style={styles.featuredTag}>
                  <Star size={9} color="#fff" fill="#fff" />
                  <Text style={styles.featuredTxt}>مميز</Text>
                </View>
              ) : null}
              <View style={styles.sponsorTag}>
                <Text style={styles.sponsorTxt}>ممول</Text>
              </View>
            </View>
            <View style={styles.body}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h2 },
  hList: { paddingHorizontal: spacing.lg },

  card: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  imgWrap: { height: 110, position: "relative", backgroundColor: colors.surfaceAlt },
  img: { width: "100%", height: "100%" },
  featuredTag: {
    position: "absolute",
    top: spacing.sm,
    insetInlineStart: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  featuredTxt: { color: "#fff", fontSize: 9, fontWeight: "800" },
  sponsorTag: {
    position: "absolute",
    top: spacing.sm,
    insetInlineEnd: spacing.sm,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  sponsorTxt: { color: "#fff", fontSize: 9, fontWeight: "800" },

  body: { padding: spacing.md, gap: 4 },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textMain,
    textAlign: "right",
    lineHeight: 18,
  },
});
