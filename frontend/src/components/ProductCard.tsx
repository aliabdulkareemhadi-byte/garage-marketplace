import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Plus, Star, Heart } from "lucide-react-native";
import { colors, spacing, radius } from "../theme/theme";
import type { Product } from "../data/mockData";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onPress, compact }: { product: Product; onPress?: () => void; compact?: boolean }) {
  const { addItem } = useCart();
  const [liked, setLiked] = React.useState(false);
  const width = compact ? 170 : "100%";
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <TouchableOpacity
      testID={`product-card-${product.id}`}
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { width: width as any }]}
    >
      <View style={styles.imgWrap}>
        <Image source={{ uri: product.images[0] }} style={styles.img} />
        {discount > 0 && (
          <View style={styles.discount}>
            <Text style={styles.discountTxt}>-{discount}%</Text>
          </View>
        )}
        <TouchableOpacity
          testID={`fav-${product.id}`}
          onPress={(e) => { e.stopPropagation(); setLiked((v) => !v); }}
          style={styles.fav}
        >
          <Heart size={13} color={liked ? colors.error : colors.textMuted} fill={liked ? colors.error : "transparent"} />
        </TouchableOpacity>
        {!product.inStock && (
          <View style={styles.outStockOverlay}>
            <Text style={styles.outStockTxt}>غير متوفر</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <View style={styles.ratingRow}>
          <Star size={10} color={colors.star} fill={colors.star} />
          <Text style={styles.ratingTxt}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviewsTxt}>· {product.reviews} تقييم</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.priceCol}>
            <Text style={styles.price}>{product.price} <Text style={styles.currency}>ر.س</Text></Text>
            {product.oldPrice ? <Text style={styles.oldPrice}>{product.oldPrice} ر.س</Text> : null}
          </View>
          <TouchableOpacity
            testID={`add-to-cart-${product.id}`}
            disabled={!product.inStock}
            onPress={(e) => {
              e.stopPropagation();
              addItem({ id: product.id, title: product.title, price: product.price, image: product.images[0] });
            }}
            style={[styles.addBtn, !product.inStock && { opacity: 0.4 }]}
          >
            <Plus size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  imgWrap: { position: "relative" },
  img: { width: "100%", height: 140, backgroundColor: colors.surfaceAlt },
  discount: { position: "absolute", top: spacing.sm, insetInlineEnd: spacing.sm, backgroundColor: colors.error, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm },
  discountTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
  fav: { position: "absolute", top: spacing.sm, insetInlineStart: spacing.sm, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center" },
  outStockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.7)", alignItems: "center", justifyContent: "center" },
  outStockTxt: { fontSize: 13, fontWeight: "800", color: colors.error, backgroundColor: "#fff", paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.error },
  body: { padding: spacing.md, gap: 4 },
  brand: { fontSize: 10, color: colors.textLight, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.3 },
  title: { fontSize: 13, fontWeight: "600", color: colors.textMain, lineHeight: 18, minHeight: 36, textAlign: "right" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingTxt: { fontSize: 11, fontWeight: "800", color: colors.textMain },
  reviewsTxt: { fontSize: 10, color: colors.textLight },
  bottomRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 2 },
  priceCol: { gap: 0 },
  price: { fontSize: 15, fontWeight: "800", color: colors.textMain },
  currency: { fontSize: 10, fontWeight: "700", color: colors.textMuted },
  oldPrice: { fontSize: 11, color: colors.textLight, textDecorationLine: "line-through" },
  addBtn: { width: 34, height: 34, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
});
