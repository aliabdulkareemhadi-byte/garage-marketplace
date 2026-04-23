import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Tag, Plus, Edit3, Trash2, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { companyOffers as seed, type CompanyOffer, type CompanyOfferState } from "../../src/data/mockData";
import EmptyState from "../../src/components/EmptyState";
import FilterTabs from "../../src/components/FilterTabs";

const stateMeta: Record<CompanyOfferState, { bg: string; fg: string; icon: React.ReactNode }> = {
  "نشط": { bg: "#D1FAE5", fg: "#10B981", icon: <CheckCircle2 size={12} color="#10B981" /> },
  "مجدول": { bg: "#FEF3C7", fg: "#F59E0B", icon: <Clock size={12} color="#F59E0B" /> },
  "منتهي": { bg: "#F3F4F6", fg: "#4B5563", icon: <XCircle size={12} color="#4B5563" /> },
};

type Filter = "الكل" | CompanyOfferState;
const filters: Filter[] = ["الكل", "نشط", "مجدول", "منتهي"];

export default function CompanyOffers() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("الكل");
  const [items, setItems] = useState<CompanyOffer[]>(seed);

  const list = filter === "الكل" ? items : items.filter((o) => o.state === filter);
  const active = items.filter((o) => o.state === "نشط").length;

  const remove = (id: string) => {
    Alert.alert("حذف العرض", "هل أنت متأكد من حذف هذا العرض؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => setItems((l) => l.filter((o) => o.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>العروض والخصومات</Text>
          <Text style={styles.sub}>{items.length} عرض · {active} نشط</Text>
        </View>
        <TouchableOpacity testID="add-offer-btn" style={styles.addBtn} onPress={() => router.push("/company-dashboard/offer-edit")}>
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
            description="أنشئ عروض وخصومات لجذب المزيد من العملاء وزيادة المبيعات"
            actionLabel="+ إنشاء عرض"
            onAction={() => router.push("/company-dashboard/offer-edit")}
            testID="empty-offers"
          />
        }
        renderItem={({ item }) => {
          const meta = stateMeta[item.state];
          return (
            <View style={styles.card} testID={`offer-${item.id}`}>
              <View style={styles.cardHead}>
                <Image source={{ uri: item.image }} style={styles.img} />
                <View style={styles.discountBadge}>
                  <Text style={styles.discountPercent}>{item.discountPercent}%</Text>
                  <Text style={styles.discountLabel}>خصم</Text>
                </View>
                <View style={[styles.stateTag, { backgroundColor: meta.bg }]}>
                  {meta.icon}
                  <Text style={[styles.stateTxt, { color: meta.fg }]}>{item.state}</Text>
                </View>
              </View>

              <View style={styles.body}>
                <Text style={styles.offerTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.offerProduct} numberOfLines={1}>على: {item.productTitle}</Text>
                {item.description ? (
                  <Text style={styles.offerDesc} numberOfLines={2}>{item.description}</Text>
                ) : null}
                <View style={styles.dateRow}>
                  <Calendar size={12} color={colors.textMuted} />
                  <Text style={styles.dateTxt}>{item.startDate} → {item.endDate}</Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    testID={`edit-offer-${item.id}`}
                    style={styles.editBtn}
                    onPress={() => router.push({ pathname: "/company-dashboard/offer-edit", params: { id: item.id } })}
                  >
                    <Edit3 size={13} color={colors.textMain} />
                    <Text style={styles.editTxt}>تعديل</Text>
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
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  cardHead: { position: "relative", height: 120 },
  img: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.surfaceAlt, width: "100%", height: 120 },
  discountBadge: { position: "absolute", top: spacing.md, insetInlineEnd: spacing.md, backgroundColor: colors.error, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.md, alignItems: "center" },
  discountPercent: { color: "#fff", fontSize: 18, fontWeight: "800", lineHeight: 20 },
  discountLabel: { color: "#fff", fontSize: 10, fontWeight: "700" },
  stateTag: { position: "absolute", top: spacing.md, insetInlineStart: spacing.md, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  stateTxt: { fontSize: 11, fontWeight: "800" },

  body: { padding: spacing.md, gap: 6 },
  offerTitle: { fontSize: 15, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  offerProduct: { fontSize: 12, color: colors.textMuted, textAlign: "right" },
  offerDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 18, textAlign: "right", marginTop: 2 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  dateTxt: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },

  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  editBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, height: 38, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  editTxt: { color: colors.textMain, fontSize: 12, fontWeight: "800" },
  deleteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingHorizontal: spacing.md, height: 38, borderRadius: radius.md, backgroundColor: "#FEE2E2", borderWidth: 1, borderColor: "#FECACA" },
  deleteTxt: { color: colors.error, fontSize: 12, fontWeight: "800" },
});
