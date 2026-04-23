import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Edit3, Trash2, Plus, Package, Star } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { products as seed, type Product } from "../../src/data/mockData";

export default function CompanyProducts() {
  const router = useRouter();
  const [items, setItems] = useState<Product[]>(seed);

  const remove = (id: string) => {
    Alert.alert("حذف المنتج", "هل أنت متأكد؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => setItems((l) => l.filter((p) => p.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>منتجاتي</Text>
          <Text style={styles.sub}>{items.length} منتج نشط</Text>
        </View>
        <TouchableOpacity
          testID="add-product-btn"
          style={styles.addBtn}
          onPress={() => router.push("/company-dashboard/product-edit")}
        >
          <Plus size={18} color="#fff" />
          <Text style={styles.addTxt}>إضافة</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Package size={40} color={colors.textLight} />
            <Text style={styles.emptyTxt}>لا توجد منتجات بعد</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row} testID={`my-product-${item.id}`}>
            <Image source={{ uri: item.images[0] }} style={styles.img} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.brand}>{item.brand}</Text>
              <Text style={styles.name} numberOfLines={2}>{item.title}</Text>
              <View style={styles.metaRow}>
                <View style={styles.ratingRow}>
                  <Star size={11} color={colors.star} fill={colors.star} />
                  <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.price}>{item.price} ر.س</Text>
              </View>
              <View style={styles.stockRow}>
                <View style={[styles.stockDot, { backgroundColor: item.inStock ? colors.success : colors.error }]} />
                <Text style={styles.stockTxt}>{item.inStock ? "متوفر" : "غير متوفر"}</Text>
              </View>
            </View>
            <View style={{ gap: spacing.sm }}>
              <TouchableOpacity
                testID={`edit-product-${item.id}`}
                style={styles.iconBtn}
                onPress={() => router.push({ pathname: "/company-dashboard/product-edit", params: { id: item.id } })}
              >
                <Edit3 size={15} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity testID={`delete-product-${item.id}`} style={[styles.iconBtn, { backgroundColor: "#FEE2E2" }]} onPress={() => remove(item.id)}>
                <Trash2 size={15} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  title: { ...typography.h1, textAlign: "right" },
  sub: { fontSize: 12, color: colors.textMuted, textAlign: "right" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.primary, paddingHorizontal: spacing.md, height: 40, borderRadius: radius.md },
  addTxt: { color: "#fff", fontSize: 13, fontWeight: "700" },
  list: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  row: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  img: { width: 70, height: 70, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  brand: { fontSize: 11, color: colors.textLight, fontWeight: "700", textAlign: "right" },
  name: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  rating: { fontSize: 11, fontWeight: "700", color: colors.textMain },
  price: { fontSize: 13, fontWeight: "800", color: colors.accent },
  stockRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockTxt: { fontSize: 11, color: colors.textMuted },
  iconBtn: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", paddingVertical: 80, gap: spacing.md },
  emptyTxt: { color: colors.textMuted, fontSize: 14, fontWeight: "600" },
});
