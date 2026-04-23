import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Plus, Star } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../theme/theme";
import type { Product } from "../data/mockData";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onPress, compact }: { product: Product; onPress?: () => void; compact?: boolean }) {
  const { addItem } = useCart();
  const width = compact ? 160 : "100%";

  return (
    <TouchableOpacity
      testID={`product-card-${product.id}`}
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { width: width as any }]}
    >
      <Image source={{ uri: product.images[0] }} style={styles.img} />
      {product.oldPrice && (
        <View style={styles.discount}>
          <Text style={styles.discountTxt}>خصم</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <View style={styles.ratingRow}>
          <Star size={11} color={colors.star} fill={colors.star} />
          <Text style={styles.ratingTxt}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviewsTxt}>({product.reviews})</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.priceCol}>
            <Text style={styles.price}>{product.price} ر.س</Text>
            {product.oldPrice && <Text style={styles.oldPrice}>{product.oldPrice} ر.س</Text>}
          </View>
          <TouchableOpacity
            testID={`add-to-cart-${product.id}`}
            onPress={(e) => {
              e.stopPropagation();
              addItem({ id: product.id, title: product.title, price: product.price, image: product.images[0] });
            }}
            style={styles.addBtn}
          >
            <Plus size={16} color="#fff" />
          </TouchableOpacity>
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
  },
  img: { width: "100%", height: 130, backgroundColor: colors.surfaceAlt },
  discount: { position: "absolute", top: spacing.sm, insetInlineEnd: spacing.sm, backgroundColor: colors.error, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  discountTxt: { color: "#fff", fontSize: 10, fontWeight: "700" },
  body: { padding: spacing.md, gap: 4 },
  brand: { fontSize: 11, color: colors.textLight, fontWeight: "600" },
  title: { fontSize: 13, fontWeight: "600", color: colors.textMain, lineHeight: 18, minHeight: 36 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingTxt: { fontSize: 11, fontWeight: "700", color: colors.textMain },
  reviewsTxt: { fontSize: 10, color: colors.textLight },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.xs },
  priceCol: { gap: 0 },
  price: { fontSize: 14, fontWeight: "700", color: colors.textMain },
  oldPrice: { fontSize: 11, color: colors.textLight, textDecorationLine: "line-through" },
  addBtn: { width: 32, height: 32, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
});
