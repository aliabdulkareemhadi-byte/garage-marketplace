import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Minus, Plus, Trash2, Tag, ShoppingBag, Package } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useCart } from "../../src/context/CartContext";
import { orders } from "../../src/data/mockData";
import EmptyState from "../../src/components/EmptyState";

type Tab = "cart" | "active" | "history";

export default function Cart() {
  const [tab, setTab] = useState<Tab>("cart");
  const router = useRouter();
  const { items, updateQty, removeItem, total } = useCart();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>السلة والطلبات</Text>
      </View>

      <View style={styles.tabs}>
        {([
          { k: "cart", label: "السلة" },
          { k: "active", label: "النشطة" },
          { k: "history", label: "السجل" },
        ] as { k: Tab; label: string }[]).map((t) => (
          <TouchableOpacity
            key={t.k}
            testID={`cart-tab-${t.k}`}
            onPress={() => setTab(t.k)}
            style={[styles.tab, tab === t.k && styles.tabActive]}
          >
            <Text style={[styles.tabTxt, tab === t.k && styles.tabTxtActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "cart" && (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            {items.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag size={40} color={colors.textLight} />}
                title="السلة فارغة"
                description="لم تقم بإضافة أي منتجات بعد. تصفّح منتجاتنا وابدأ بالتسوق الآن."
                actionLabel="تصفّح المنتجات"
                onAction={() => router.push("/(tabs)/home")}
                testID="cart-empty"
              />
            ) : (
              items.map((i) => (
                <View key={i.id} style={styles.cartItem} testID={`cart-item-${i.id}`}>
                  <Image source={{ uri: i.image }} style={styles.cartImg} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={styles.itemTitle} numberOfLines={2}>{i.title}</Text>
                    <Text style={styles.itemPrice}>{i.price} ر.س</Text>
                    <View style={styles.qtyRow}>
                      <TouchableOpacity testID={`qty-minus-${i.id}`} onPress={() => updateQty(i.id, i.qty - 1)} style={styles.qtyBtn}>
                        <Minus size={14} color={colors.textMain} />
                      </TouchableOpacity>
                      <Text style={styles.qty}>{i.qty}</Text>
                      <TouchableOpacity testID={`qty-plus-${i.id}`} onPress={() => updateQty(i.id, i.qty + 1)} style={styles.qtyBtn}>
                        <Plus size={14} color={colors.textMain} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        testID={`remove-${i.id}`}
                        onPress={() => removeItem(i.id)}
                        style={[styles.qtyBtn, { backgroundColor: "#FEE2E2", borderColor: "#FECACA", marginStart: "auto" }]}
                      >
                        <Trash2 size={14} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}

            {items.length > 0 && (
              <View style={styles.promoBox}>
                <Tag size={18} color={colors.accent} />
                <Text style={styles.promoTxt}>هل لديك كود خصم؟</Text>
                <Text style={styles.promoLink}>أدخله</Text>
              </View>
            )}
          </ScrollView>

          {items.length > 0 && (
            <View style={styles.footer}>
              <View style={styles.row}>
                <Text style={styles.fLabel}>الإجمالي</Text>
                <Text style={styles.fTotal}>{total.toFixed(0)} ر.س</Text>
              </View>
              <TouchableOpacity testID="checkout-btn" style={styles.checkout} onPress={() => alert("تم إرسال الطلب (محاكاة)")}>
                <Text style={styles.checkoutTxt}>إتمام الشراء</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {tab !== "cart" && (
        <ScrollView contentContainerStyle={styles.scroll}>
          {(tab === "active"
            ? orders.filter((o) => o.status === "قيد التوصيل")
            : orders.filter((o) => o.status === "تم التسليم")
          ).map((o) => (
            <View key={o.id} style={styles.orderCard} testID={`order-${o.id}`}>
              <View style={styles.orderIcon}>
                <Package size={22} color={colors.accent} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.orderId}>#{o.id}</Text>
                  <View style={[styles.statusTag, o.status === "قيد التوصيل" ? { backgroundColor: "#FEF3C7" } : { backgroundColor: "#D1FAE5" }]}>
                    <Text style={[styles.statusTxt, { color: o.status === "قيد التوصيل" ? colors.warning : colors.success }]}>{o.status}</Text>
                  </View>
                </View>
                <Text style={styles.orderMeta}>{o.items} منتج · {o.date}</Text>
                <Text style={styles.orderTotal}>{o.total} ر.س</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function _UnusedEmpty() { return null; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title: { ...typography.h1, textAlign: "right" },
  tabs: { flexDirection: "row", backgroundColor: colors.surface, marginHorizontal: spacing.lg, marginTop: spacing.md, padding: 4, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  tab: { flex: 1, paddingVertical: spacing.sm + 2, alignItems: "center", borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabTxt: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
  tabTxtActive: { color: "#fff" },
  scroll: { padding: spacing.lg, paddingBottom: 140 },
  cartItem: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  cartImg: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  itemTitle: { fontSize: 14, fontWeight: "600", color: colors.textMain, textAlign: "right" },
  itemPrice: { fontSize: 15, fontWeight: "700", color: colors.accent, textAlign: "right" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 4 },
  qtyBtn: { width: 32, height: 32, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  qty: { fontSize: 14, fontWeight: "700", color: colors.textMain, minWidth: 20, textAlign: "center" },
  promoBox: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.accentSoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  promoTxt: { flex: 1, color: colors.textMain, fontSize: 13, fontWeight: "600", textAlign: "right" },
  promoLink: { color: colors.accent, fontSize: 13, fontWeight: "700" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between" },
  fLabel: { fontSize: 14, color: colors.textMuted },
  fTotal: { fontSize: 20, fontWeight: "800", color: colors.textMain },
  checkout: { backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  checkoutTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
  orderCard: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md, alignItems: "center" },
  orderIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  orderId: { fontSize: 14, fontWeight: "700", color: colors.textMain },
  orderMeta: { fontSize: 12, color: colors.textMuted },
  orderTotal: { fontSize: 15, fontWeight: "700", color: colors.textMain },
  statusTag: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  statusTxt: { fontSize: 11, fontWeight: "700" },
});
