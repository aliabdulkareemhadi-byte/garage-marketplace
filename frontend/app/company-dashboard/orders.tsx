import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingBag, Phone, MapPin, CreditCard, Calendar, Package } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { companyOrders as seed, type CompanyOrder, type CompanyOrderStatus } from "../../src/data/mockData";
import EmptyState from "../../src/components/EmptyState";

const statusColors: Record<CompanyOrderStatus, { bg: string; fg: string }> = {
  "جديد": { bg: "#E6F0FF", fg: "#0066FF" },
  "مقبول": { bg: "#D1FAE5", fg: "#10B981" },
  "قيد التجهيز": { bg: "#FEF3C7", fg: "#F59E0B" },
  "مكتمل": { bg: "#F3F4F6", fg: "#4B5563" },
  "ملغي": { bg: "#FEE2E2", fg: "#EF4444" },
};

type Tab = "الكل" | CompanyOrderStatus;
const tabs: Tab[] = ["الكل", "جديد", "مقبول", "قيد التجهيز", "مكتمل", "ملغي"];

export default function CompanyOrders() {
  const [tab, setTab] = useState<Tab>("جديد");
  const [items, setItems] = useState<CompanyOrder[]>(seed);

  const counts = {
    "جديد": items.filter((o) => o.status === "جديد").length,
    "مقبول": items.filter((o) => o.status === "مقبول").length,
    "قيد التجهيز": items.filter((o) => o.status === "قيد التجهيز").length,
    "مكتمل": items.filter((o) => o.status === "مكتمل").length,
    "ملغي": items.filter((o) => o.status === "ملغي").length,
  };

  const list = tab === "الكل" ? items : items.filter((o) => o.status === tab);

  const updateStatus = (id: string, status: CompanyOrderStatus) => {
    setItems((l) => l.map((o) => (o.id === id ? { ...o, status } : o)));
  };
  const reject = (id: string) => {
    Alert.alert("رفض الطلب", "هل أنت متأكد من رفض هذا الطلب؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "رفض", style: "destructive", onPress: () => updateStatus(id, "ملغي") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>الطلبات</Text>
          <Text style={styles.sub}>{items.length} طلب · {counts["جديد"]} جديد</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatMini value={counts["جديد"]} label="جديد" color={colors.accent} />
        <StatMini value={counts["قيد التجهيز"]} label="قيد التجهيز" color={colors.warning} />
        <StatMini value={counts["مكتمل"]} label="مكتمل" color={colors.success} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {tabs.map((t) => {
          const count = t === "الكل" ? items.length : counts[t];
          return (
            <TouchableOpacity key={t} testID={`tab-${t}`} onPress={() => setTab(t)} style={[styles.chip, tab === t && styles.chipActive]}>
              <Text style={[styles.chipTxt, tab === t && styles.chipTxtActive]}>{t}</Text>
              {count > 0 && (
                <View style={[styles.chipBadge, tab === t && { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                  <Text style={[styles.chipBadgeTxt, tab === t && { color: "#fff" }]}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <EmptyState
            icon={<ShoppingBag size={40} color={colors.textLight} />}
            title={`لا توجد طلبات ${tab === "الكل" ? "" : tab}`}
            description="ستظهر الطلبات هنا فور وصولها من العملاء"
            testID="empty-orders"
          />
        }
        renderItem={({ item }) => {
          const sc = statusColors[item.status];
          return (
            <View style={styles.card} testID={`order-${item.id}`}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.orderId}>#{item.id.toUpperCase()}</Text>
                  <View style={styles.dateRow}>
                    <Calendar size={11} color={colors.textLight} />
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                </View>
                <View style={[styles.statusTag, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusTxt, { color: sc.fg }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.productRow}>
                <Image source={{ uri: item.productImage }} style={styles.productImg} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={styles.productTitle} numberOfLines={2}>{item.productTitle}</Text>
                  <View style={styles.qtyRow}>
                    <View style={styles.qtyPill}>
                      <Text style={styles.qtyPillTxt}>×{item.quantity}</Text>
                    </View>
                    <Text style={styles.unitPrice}>{item.unitPrice} ر.س للوحدة</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.customerGrid}>
                <Info icon={<ShoppingBag size={12} color={colors.textMuted} />} value={item.customerName} />
                <Info icon={<Phone size={12} color={colors.textMuted} />} value={item.customerPhone} />
                <Info icon={<MapPin size={12} color={colors.textMuted} />} value={item.city} />
                <Info icon={<CreditCard size={12} color={colors.textMuted} />} value={item.paymentMethod} />
              </View>

              <View style={styles.divider} />

              <View style={styles.bottom}>
                <View>
                  <Text style={styles.totalLabel}>الإجمالي</Text>
                  <Text style={styles.totalValue}>{item.total.toLocaleString()} ر.س</Text>
                </View>
                <View style={styles.actions}>
                  {item.status === "جديد" && (
                    <>
                      <TouchableOpacity testID={`reject-${item.id}`} style={[styles.actBtn, { backgroundColor: "#FEE2E2" }]} onPress={() => reject(item.id)}>
                        <Text style={[styles.actTxt, { color: colors.error }]}>رفض</Text>
                      </TouchableOpacity>
                      <TouchableOpacity testID={`accept-${item.id}`} style={[styles.actBtn, { backgroundColor: colors.primary }]} onPress={() => updateStatus(item.id, "مقبول")}>
                        <Text style={styles.actTxt}>قبول</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {item.status === "مقبول" && (
                    <TouchableOpacity testID={`process-${item.id}`} style={[styles.actBtn, { backgroundColor: colors.warning }]} onPress={() => updateStatus(item.id, "قيد التجهيز")}>
                      <Text style={styles.actTxt}>بدء التجهيز</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "قيد التجهيز" && (
                    <TouchableOpacity testID={`complete-${item.id}`} style={[styles.actBtn, { backgroundColor: colors.success }]} onPress={() => updateStatus(item.id, "مكتمل")}>
                      <Text style={styles.actTxt}>إنهاء</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

function StatMini({ value, label, color }: any) {
  return (
    <View style={styles.statMini}>
      <View style={[styles.statDot, { backgroundColor: color }]} />
      <View>
        <Text style={styles.statVal}>{value}</Text>
        <Text style={styles.statLbl}>{label}</Text>
      </View>
    </View>
  );
}

function Info({ icon, value }: any) {
  return (
    <View style={styles.infoCell}>
      {icon}
      <Text style={styles.infoTxt} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", padding: spacing.lg, gap: spacing.md },
  title: { ...typography.h1, textAlign: "right" },
  sub: { fontSize: 12, color: colors.textMuted, textAlign: "right", marginTop: 2 },

  statsRow: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  statMini: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm + 2 },
  statDot: { width: 6, height: 24, borderRadius: 3 },
  statVal: { fontSize: 16, fontWeight: "800", color: colors.textMain },
  statLbl: { fontSize: 10, color: colors.textMuted, fontWeight: "600" },

  chips: { paddingHorizontal: spacing.lg, gap: spacing.sm, flexDirection: "row", paddingBottom: spacing.md },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginEnd: spacing.sm },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { fontSize: 12, color: colors.textMuted, fontWeight: "700" },
  chipTxtActive: { color: "#fff" },
  chipBadge: { minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  chipBadgeTxt: { fontSize: 10, fontWeight: "800", color: colors.accent },

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderId: { fontSize: 13, fontWeight: "800", color: colors.textMain },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  date: { fontSize: 11, color: colors.textLight },
  statusTag: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  statusTxt: { fontSize: 11, fontWeight: "800" },

  productRow: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  productImg: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  productTitle: { fontSize: 13, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  qtyPill: { backgroundColor: colors.accentSoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  qtyPillTxt: { color: colors.accent, fontSize: 11, fontWeight: "800" },
  unitPrice: { fontSize: 11, color: colors.textMuted },

  divider: { height: 1, backgroundColor: colors.border },
  customerGrid: { flexDirection: "row", flexWrap: "wrap" },
  infoCell: { width: "50%", flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4 },
  infoTxt: { fontSize: 11, color: colors.textMain, fontWeight: "600", flex: 1 },

  bottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 11, color: colors.textMuted, textAlign: "right" },
  totalValue: { fontSize: 17, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  actions: { flexDirection: "row", gap: spacing.sm },
  actBtn: { paddingHorizontal: spacing.md, height: 36, borderRadius: radius.md, alignItems: "center", justifyContent: "center", minWidth: 72 },
  actTxt: { color: "#fff", fontSize: 12, fontWeight: "800" },
});
