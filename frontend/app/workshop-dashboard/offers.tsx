import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tag, Plus, Edit3, Trash2, Calendar, CheckCircle2, Clock, XCircle, Wrench } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { workshopOffers as seed, type WorkshopOffer, type WorkshopOfferState } from "../../src/data/mockData";
import EmptyState from "../../src/components/EmptyState";
import FilterTabs from "../../src/components/FilterTabs";

const stateMeta: Record<WorkshopOfferState, { bg: string; fg: string; icon: React.ReactNode }> = {
  "نشط": { bg: "#D1FAE5", fg: "#10B981", icon: <CheckCircle2 size={12} color="#10B981" /> },
  "مجدول": { bg: "#FEF3C7", fg: "#F59E0B", icon: <Clock size={12} color="#F59E0B" /> },
  "منتهي": { bg: "#F3F4F6", fg: "#4B5563", icon: <XCircle size={12} color="#4B5563" /> },
};

type Filter = "الكل" | WorkshopOfferState;
const filters: Filter[] = ["الكل", "نشط", "مجدول", "منتهي"];

export default function WorkshopOffersScreen() {
  const [filter, setFilter] = useState<Filter>("الكل");
  const [items, setItems] = useState<WorkshopOffer[]>(seed);

  const list = filter === "الكل" ? items : items.filter((o) => o.state === filter);
  const active = items.filter((o) => o.state === "نشط").length;

  const addMock = () => {
    const id = `wof${Date.now()}`;
    Alert.alert("إضافة عرض جديد", "هل تريد إنشاء عرض تجريبي؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "إنشاء",
        onPress: () =>
          setItems((l) => [
            { id, title: "عرض جديد", serviceName: "خدمة عامة", discountPercent: 10, startDate: "2026-02-20", endDate: "2026-03-01", state: "نشط", description: "عرض محدود لفترة قصيرة." },
            ...l,
          ]),
      },
    ]);
  };

  const remove = (id: string) => {
    Alert.alert("حذف العرض", "هل أنت متأكد؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => setItems((l) => l.filter((o) => o.id !== id)) },
    ]);
  };

  const toggleState = (id: string) => {
    setItems((l) => l.map((o) => (o.id === id ? { ...o, state: o.state === "نشط" ? "منتهي" : "نشط" } : o)));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>العروض والخصومات</Text>
          <Text style={styles.sub}>{items.length} عرض · {active} نشط</Text>
        </View>
        <TouchableOpacity testID="add-offer-btn" style={styles.addBtn} onPress={addMock}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addTxt}>عرض جديد</Text>
        </TouchableOpacity>
      </View>

      <FilterTabs tabs={filters} active={filter} onChange={setFilter} />

      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <EmptyState
            icon={<Tag size={40} color={colors.textLight} />}
            title={filter === "الكل" ? "لا توجد عروض بعد" : `لا توجد عروض ${filter}`}
            description="أنشئ عروض على خدماتك لجذب المزيد من العملاء"
            actionLabel="+ إنشاء عرض"
            onAction={addMock}
            testID="empty-offers"
          />
        }
        renderItem={({ item }) => {
          const meta = stateMeta[item.state];
          return (
            <View style={styles.card} testID={`offer-${item.id}`}>
              <View style={styles.cardLeft}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountPercent}>{item.discountPercent}%</Text>
                  <Text style={styles.discountLabel}>خصم</Text>
                </View>
              </View>
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={styles.offerTitle} numberOfLines={1}>{item.title}</Text>
                  <View style={[styles.stateTag, { backgroundColor: meta.bg }]}>
                    {meta.icon}
                    <Text style={[styles.stateTxt, { color: meta.fg }]}>{item.state}</Text>
                  </View>
                </View>
                <View style={styles.serviceRow}>
                  <Wrench size={11} color={colors.textMuted} />
                  <Text style={styles.serviceName} numberOfLines={1}>{item.serviceName}</Text>
                </View>
                <Text style={styles.offerDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.dateRow}>
                  <Calendar size={11} color={colors.textMuted} />
                  <Text style={styles.dateTxt}>{item.startDate} → {item.endDate}</Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity testID={`toggle-offer-${item.id}`} style={styles.editBtn} onPress={() => toggleState(item.id)}>
                    <Edit3 size={13} color={colors.textMain} />
                    <Text style={styles.editTxt}>{item.state === "نشط" ? "إيقاف" : "تفعيل"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity testID={`delete-offer-${item.id}`} style={styles.deleteBtn} onPress={() => remove(item.id)}>
                    <Trash2 size={13} color={colors.error} />
                    <Text style={styles.deleteTxt}>حذف</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  title: { ...typography.h1, textAlign: "right" },
  sub: { fontSize: 12, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.primary, paddingHorizontal: spacing.md, height: 40, borderRadius: radius.md },
  addTxt: { color: "#fff", fontSize: 12, fontWeight: "800" },

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { flexDirection: "row", backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  cardLeft: { width: 88, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", paddingVertical: spacing.md },
  discountBadge: { alignItems: "center", gap: 2 },
  discountPercent: { color: "#fff", fontSize: 26, fontWeight: "800", lineHeight: 30 },
  discountLabel: { color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: "700" },

  body: { flex: 1, padding: spacing.md, gap: 6 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  offerTitle: { flex: 1, fontSize: 14, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  stateTag: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  stateTxt: { fontSize: 10, fontWeight: "800" },
  serviceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  serviceName: { fontSize: 12, color: colors.textMuted, fontWeight: "600", flex: 1 },
  offerDesc: { fontSize: 11, color: colors.textMuted, lineHeight: 17, textAlign: "right" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateTxt: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },

  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  editBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, height: 34, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  editTxt: { color: colors.textMain, fontSize: 11, fontWeight: "800" },
  deleteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingHorizontal: spacing.sm, height: 34, borderRadius: radius.sm, backgroundColor: "#FEE2E2", borderWidth: 1, borderColor: "#FECACA" },
  deleteTxt: { color: colors.error, fontSize: 11, fontWeight: "800" },
});
