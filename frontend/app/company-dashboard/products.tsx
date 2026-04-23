import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Edit3, Trash2, Plus, Package, Star, Images, EyeOff } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { products as seed, type Product } from "../../src/data/mockData";
import EmptyState from "../../src/components/EmptyState";
import SearchBar from "../../src/components/SearchBar";
import FilterTabs from "../../src/components/FilterTabs";

type Filter = "الكل" | "نشط" | "معطّل" | "غير متوفر";

export default function CompanyProducts() {
  const router = useRouter();
  const [items, setItems] = useState<(Product & { active?: boolean })[]>(
    seed.map((p) => ({ ...p, active: true }))
  );
  const [filter, setFilter] = useState<Filter>("الكل");
  const [query, setQuery] = useState("");

  const list = items
    .filter((p) => (filter === "الكل" ? true : filter === "نشط" ? p.active && p.inStock : filter === "معطّل" ? !p.active : !p.inStock))
    .filter((p) => p.title.includes(query) || p.brand.includes(query));

  const remove = (id: string) => {
    Alert.alert("حذف المنتج", "هل أنت متأكد من الحذف؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => setItems((l) => l.filter((p) => p.id !== id)) },
    ]);
  };

  const toggleActive = (id: string) => setItems((l) => l.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  const stats = {
    total: items.length,
    active: items.filter((p) => p.active && p.inStock).length,
    disabled: items.filter((p) => !p.active).length,
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>منتجاتي</Text>
          <Text style={styles.sub}>{stats.total} منتج · {stats.active} نشط · {stats.disabled} معطّل</Text>
        </View>
        <TouchableOpacity testID="add-product-btn" style={styles.addBtn} onPress={() => router.push("/company-dashboard/product-edit")}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addTxt}>إضافة</Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        testID="products-search"
        value={query}
        onChangeText={setQuery}
        placeholder="ابحث في منتجاتك..."
      />

      <FilterTabs
        tabs={["الكل", "نشط", "معطّل", "غير متوفر"] as Filter[]}
        active={filter}
        onChange={setFilter}
      />

      <FlatList
        data={list}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <EmptyState
            icon={<Package size={40} color={colors.textLight} />}
            title={query || filter !== "الكل" ? "لا نتائج مطابقة" : "لا توجد منتجات بعد"}
            description={query || filter !== "الكل" ? "جرب تغيير الفلتر أو كلمة البحث" : "ابدأ بإضافة أول منتج لك ليظهر للعملاء"}
            actionLabel="+ إضافة منتج"
            onAction={() => router.push("/company-dashboard/product-edit")}
            testID="empty-products"
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.row, !item.active && styles.rowDisabled]} testID={`my-product-${item.id}`}>
            <View style={styles.imgWrap}>
              <Image source={{ uri: item.images[0] }} style={styles.img} />
              {item.images.length > 1 && (
                <View style={styles.imgCount}>
                  <Images size={10} color="#fff" />
                  <Text style={styles.imgCountTxt}>{item.images.length}</Text>
                </View>
              )}
              {!item.active && (
                <View style={styles.disabledOverlay}>
                  <EyeOff size={18} color="#fff" />
                </View>
              )}
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.brand}>{item.brand}</Text>
              <Text style={styles.name} numberOfLines={2}>{item.title}</Text>
              <View style={styles.metaRow}>
                <View style={styles.ratingRow}>
                  <Star size={11} color={colors.star} fill={colors.star} />
                  <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                  <Text style={styles.reviewsTxt}>({item.reviews})</Text>
                </View>
                <Text style={styles.price}>{item.price} ر.س</Text>
              </View>
              <View style={styles.statusRow}>
                <View style={[styles.dot, { backgroundColor: item.inStock ? colors.success : colors.error }]} />
                <Text style={styles.stockTxt}>{item.inStock ? "متوفر" : "نفد"}</Text>
                <View style={styles.spacer} />
                <Text style={styles.switchLbl}>{item.active ? "مفعّل" : "معطّل"}</Text>
                <Switch
                  testID={`toggle-${item.id}`}
                  value={item.active}
                  onValueChange={() => toggleActive(item.id)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                  style={{ transform: [{ scale: 0.8 }] }}
                />
              </View>
            </View>
            <View style={{ gap: spacing.sm }}>
              <TouchableOpacity testID={`edit-product-${item.id}`} style={styles.iconBtn} onPress={() => router.push({ pathname: "/company-dashboard/product-edit", params: { id: item.id } })}>
                <Edit3 size={14} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity testID={`delete-product-${item.id}`} style={[styles.iconBtn, { backgroundColor: "#FEE2E2" }]} onPress={() => remove(item.id)}>
                <Trash2 size={14} color={colors.error} />
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
  sub: { fontSize: 11, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.primary, paddingHorizontal: spacing.md, height: 40, borderRadius: radius.md },
  addTxt: { color: "#fff", fontSize: 13, fontWeight: "800" },

  list: { paddingHorizontal: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  row: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  rowDisabled: { opacity: 0.7, backgroundColor: colors.surfaceAlt },
  imgWrap: { position: "relative" },
  img: { width: 76, height: 76, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  imgCount: { position: "absolute", bottom: 4, insetInlineEnd: 4, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 5, paddingVertical: 2, borderRadius: radius.sm },
  imgCountTxt: { color: "#fff", fontSize: 9, fontWeight: "800" },
  disabledOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  brand: { fontSize: 10, color: colors.textLight, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.3, textAlign: "right" },
  name: { fontSize: 13, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  rating: { fontSize: 11, fontWeight: "800", color: colors.textMain },
  reviewsTxt: { fontSize: 10, color: colors.textLight },
  price: { fontSize: 13, fontWeight: "800", color: colors.accent },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  stockTxt: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  spacer: { flex: 1 },
  switchLbl: { fontSize: 11, color: colors.textMuted, fontWeight: "700" },
  iconBtn: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
});
