import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, Clock, Car, Phone, User } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { workshopBookings, type WorkshopBooking } from "../../src/data/mockData";
import EmptyState from "../../src/components/EmptyState";
import FilterTabs, { type FilterTab } from "../../src/components/FilterTabs";
import { getBookingStatusColor } from "../../src/utils/status";

type Tab = "الكل" | WorkshopBooking["status"];
const tabOrder: Tab[] = ["الكل", "جديد", "مؤكد", "قيد التنفيذ", "مكتمل", "ملغي"];

export default function WorkshopBookingsScreen() {
  const [tab, setTab] = useState<Tab>("جديد");
  const [items, setItems] = useState<WorkshopBooking[]>(workshopBookings);

  const counts = {
    "جديد": items.filter((b) => b.status === "جديد").length,
    "مؤكد": items.filter((b) => b.status === "مؤكد").length,
    "قيد التنفيذ": items.filter((b) => b.status === "قيد التنفيذ").length,
    "مكتمل": items.filter((b) => b.status === "مكتمل").length,
    "ملغي": items.filter((b) => b.status === "ملغي").length,
  };

  const list = tab === "الكل" ? items : items.filter((b) => b.status === tab);

  const updateStatus = (id: string, status: WorkshopBooking["status"]) => {
    setItems((l) => l.map((b) => (b.id === id ? { ...b, status } : b)));
  };
  const reject = (id: string) => {
    Alert.alert("رفض الحجز", "هل أنت متأكد من رفض هذا الحجز؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "رفض", style: "destructive", onPress: () => updateStatus(id, "ملغي") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>الحجوزات</Text>
          <Text style={styles.sub}>{items.length} حجز · {counts["جديد"]} جديد</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatMini value={counts["جديد"]} label="جديد" color={colors.accent} />
        <StatMini value={counts["قيد التنفيذ"]} label="قيد التنفيذ" color={colors.warning} />
        <StatMini value={counts["مكتمل"]} label="مكتمل" color={colors.success} />
      </View>

      <FilterTabs
        tabs={tabOrder.map<FilterTab<Tab>>((t) => ({
          value: t,
          count: t === "الكل" ? items.length : counts[t],
        }))}
        active={tab}
        onChange={setTab}
        showCounts
        testIDPrefix="tab"
      />

      <FlatList
        data={list}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <EmptyState
            icon={<Calendar size={40} color={colors.textLight} />}
            title={`لا توجد حجوزات ${tab === "الكل" ? "" : tab}`}
            description="ستظهر الحجوزات هنا فور وصولها من العملاء"
            testID="empty-bookings"
          />
        }
        renderItem={({ item }) => {
          const sc = getBookingStatusColor(item.status);
          return (
            <View style={styles.card} testID={`booking-${item.id}`}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.service}>{item.service}</Text>
                  <View style={styles.dateRow}>
                    <Calendar size={11} color={colors.textLight} />
                    <Text style={styles.dateTxt}>{item.date}</Text>
                    <View style={styles.dotSep} />
                    <Clock size={11} color={colors.textLight} />
                    <Text style={styles.dateTxt}>{item.time}</Text>
                  </View>
                </View>
                <View style={[styles.statusTag, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusTxt, { color: sc.fg }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.customerGrid}>
                <Info icon={<User size={12} color={colors.textMuted} />} value={item.customerName} />
                <Info icon={<Phone size={12} color={colors.textMuted} />} value={item.customerPhone} />
                <Info icon={<Car size={12} color={colors.textMuted} />} value={item.vehicle} full />
              </View>

              <View style={styles.divider} />

              <View style={styles.bottom}>
                <View>
                  <Text style={styles.totalLabel}>السعر</Text>
                  <Text style={styles.totalValue}>{item.price.toLocaleString()} ر.س</Text>
                </View>
                <View style={styles.actions}>
                  {item.status === "جديد" && (
                    <>
                      <TouchableOpacity testID={`reject-${item.id}`} style={[styles.actBtn, { backgroundColor: "#FEE2E2" }]} onPress={() => reject(item.id)}>
                        <Text style={[styles.actTxt, { color: colors.error }]}>رفض</Text>
                      </TouchableOpacity>
                      <TouchableOpacity testID={`accept-${item.id}`} style={[styles.actBtn, { backgroundColor: colors.primary }]} onPress={() => updateStatus(item.id, "مؤكد")}>
                        <Text style={styles.actTxt}>قبول</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {item.status === "مؤكد" && (
                    <TouchableOpacity testID={`start-${item.id}`} style={[styles.actBtn, { backgroundColor: colors.warning }]} onPress={() => updateStatus(item.id, "قيد التنفيذ")}>
                      <Text style={styles.actTxt}>بدء</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "قيد التنفيذ" && (
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

function Info({ icon, value, full }: any) {
  return (
    <View style={[styles.infoCell, full && { width: "100%" }]}>
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

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.sm },
  service: { fontSize: 15, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  dateTxt: { fontSize: 11, color: colors.textLight, fontWeight: "600" },
  dotSep: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textLight, marginHorizontal: 2 },
  statusTag: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  statusTxt: { fontSize: 11, fontWeight: "800" },

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
