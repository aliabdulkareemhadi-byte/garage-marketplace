import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Alert, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star, ChevronRight, Share2, Heart, Minus, Plus, Truck, Shield, CheckCircle2 } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { products } from "../../src/data/mockData";
import { useCart } from "../../src/context/CartContext";

const { width } = Dimensions.get("window");
const IMG_W = Math.min(width, 480);

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const p = products.find((x) => x.id === id) || products[0];
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [favorite, setFavorite] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        title: p.title,
        message: `${p.title}\n${p.price} ر.س`,
      });
    } catch (err: any) {
      Alert.alert("تعذّر المشاركة", err?.message || "حدث خطأ غير متوقّع.");
    }
  };

  const handleFavorite = () => {
    setFavorite((f) => !f);
    Alert.alert(favorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة إلى المفضلة", p.title);
  };

  const handleAddToCart = () => {
    if (!p.inStock) return;
    try {
      for (let i = 0; i < qty; i++) {
        addItem({ id: p.id, title: p.title, price: p.price, image: p.images[0] });
      }
      router.push("/(tabs)/cart");
    } catch (err: any) {
      Alert.alert("تعذّر إضافة المنتج", err?.message || "حدث خطأ غير متوقّع، يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={{ position: "relative" }}>
          <FlatList
            data={p.images}
            keyExtractor={(_, i) => `${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setActive(Math.round(e.nativeEvent.contentOffset.x / IMG_W))}
            renderItem={({ item }) => (
              <View style={{ width: IMG_W, height: 320, backgroundColor: colors.surfaceAlt }}>
                <Image source={{ uri: item }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              </View>
            )}
          />
          <SafeAreaView edges={["top"]} style={styles.topBar}>
            <TouchableOpacity testID="pd-back" onPress={() => router.back()} style={styles.topBtn}>
              <ChevronRight size={20} color={colors.textMain} />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <TouchableOpacity testID="pd-share" style={styles.topBtn} onPress={handleShare}>
                <Share2 size={18} color={colors.textMain} />
              </TouchableOpacity>
              <TouchableOpacity testID="pd-favorite" style={styles.topBtn} onPress={handleFavorite}>
                <Heart size={18} color={favorite ? colors.error : colors.textMain} fill={favorite ? colors.error : "transparent"} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          {p.images.length > 1 && (
            <View style={styles.dots}>
              {p.images.map((_, i) => (
                <View key={i} style={[styles.dot, active === i && styles.dotActive]} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.brand}>{p.brand}</Text>
          <Text style={styles.title}>{p.title}</Text>
          <View style={styles.rateRow}>
            <Star size={14} color={colors.star} fill={colors.star} />
            <Text style={styles.rating}>{p.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({p.reviews} تقييم)</Text>
            {p.inStock ? (
              <View style={[styles.stockTag, { backgroundColor: "#D1FAE5" }]}>
                <Text style={[styles.stockTxt, { color: colors.success }]}>متوفر</Text>
              </View>
            ) : (
              <View style={[styles.stockTag, { backgroundColor: "#FEE2E2" }]}>
                <Text style={[styles.stockTxt, { color: colors.error }]}>غير متوفر</Text>
              </View>
            )}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{p.price} ر.س</Text>
            {p.oldPrice && <Text style={styles.oldPrice}>{p.oldPrice} ر.س</Text>}
            {p.oldPrice && (
              <View style={styles.discountTag}>
                <Text style={styles.discountTxt}>وفر {p.oldPrice - p.price} ر.س</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.benefits}>
          <Benefit icon={<Truck size={18} color={colors.accent} />} label="توصيل سريع" />
          <Benefit icon={<Shield size={18} color={colors.accent} />} label="ضمان أصلي" />
          <Benefit icon={<CheckCircle2 size={18} color={colors.accent} />} label="جودة مضمونة" />
        </View>

        <Section title="الوصف">
          <Text style={styles.desc}>{p.description}</Text>
        </Section>

        <Section title="المواصفات">
          <View style={styles.specs}>
            {p.specs.map((s, i) => (
              <View key={s.label} style={[styles.specRow, i !== p.specs.length - 1 && styles.specDivider]}>
                <Text style={styles.specLabel}>{s.label}</Text>
                <Text style={styles.specValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <View style={styles.qtyBox}>
          <TouchableOpacity testID="pd-minus" onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qBtn}>
            <Minus size={14} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.qtyTxt}>{qty}</Text>
          <TouchableOpacity testID="pd-plus" onPress={() => setQty(qty + 1)} style={styles.qBtn}>
            <Plus size={14} color={colors.textMain} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          testID="pd-add-btn"
          style={[styles.primaryBtn, !p.inStock && { opacity: 0.5 }]}
          onPress={handleAddToCart}
          disabled={!p.inStock}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryTxt}>أضف إلى السلة · {(p.price * qty).toFixed(0)} ر.س</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function Benefit({ icon, label }: any) {
  return (
    <View style={styles.benefit}>
      {icon}
      <Text style={styles.benefitTxt}>{label}</Text>
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
  topBar: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  topBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  dots: { position: "absolute", bottom: spacing.md, alignSelf: "center", flexDirection: "row", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.6)" },
  dotActive: { backgroundColor: "#fff", width: 18 },
  card: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, padding: spacing.lg, gap: spacing.sm },
  brand: { fontSize: 12, color: colors.textLight, fontWeight: "700", textAlign: "right" },
  title: { fontSize: 18, fontWeight: "800", color: colors.textMain, textAlign: "right", lineHeight: 26 },
  rateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { fontSize: 13, fontWeight: "700", color: colors.textMain },
  reviews: { fontSize: 12, color: colors.textLight },
  stockTag: { marginStart: "auto", paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm },
  stockTxt: { fontSize: 11, fontWeight: "700" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm },
  price: { fontSize: 24, fontWeight: "800", color: colors.textMain },
  oldPrice: { fontSize: 14, color: colors.textLight, textDecorationLine: "line-through" },
  discountTag: { backgroundColor: "#FEE2E2", paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm },
  discountTxt: { color: colors.error, fontSize: 11, fontWeight: "700" },
  benefits: { flexDirection: "row", justifyContent: "space-around", backgroundColor: colors.surface, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  benefit: { alignItems: "center", gap: 6 },
  benefitTxt: { fontSize: 11, fontWeight: "600", color: colors.textMain },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md, textAlign: "right" },
  desc: { fontSize: 13, color: colors.textMuted, lineHeight: 22, textAlign: "right" },
  specs: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  specRow: { flexDirection: "row", justifyContent: "space-between", padding: spacing.md },
  specDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  specLabel: { fontSize: 13, color: colors.textMuted },
  specValue: { fontSize: 13, color: colors.textMain, fontWeight: "700" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg, alignItems: "center" },
  qtyBox: { flexDirection: "row", alignItems: "center", gap: spacing.sm, height: 52, paddingHorizontal: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  qBtn: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  qtyTxt: { fontSize: 14, fontWeight: "800", color: colors.textMain, minWidth: 20, textAlign: "center" },
  primaryBtn: { flex: 1, backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  primaryTxt: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
