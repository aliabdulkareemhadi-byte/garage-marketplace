import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, Clock, Car, Phone, User, Filter } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { workshopBookings, type WorkshopBooking } from "../../src/data/mockData";

const statusColors: Record<WorkshopBooking["status"], { bg: string; fg: string }> = {
  "جديد": { bg: "#E6F0FF", fg: "#0066FF" },
  "مؤكد": { bg: "#D1FAE5", fg: "#10B981" },
  "قيد التنفيذ": { bg: "#FEF3C7", fg: "#F59E0B" },
  "مكتمل": { bg: "#F3F4F6", fg: "#4B5563" },
  "ملغي": { bg: "#FEE2E2", fg: "#EF4444" },
};

const filters: ("الكل" | WorkshopBooking["status"])[] = ["الكل", "جديد", "مؤكد", "قيد التنفيذ", "مكتمل", "ملغي"];

export default function WorkshopBookingsScreen() {
  const [filter, setFilter] = useState<string>("الكل");
  const [items, setItems] = useState(workshopBookings);

  const list = filter === "الكل" ? items : items.filter((b) => b.status === filter);

  const confirm = (id: string) => setItems((l) => l.map((b) => (b.id === id ? { ...b, status: "مؤكد" } : b)));
  const complete = (id: string) => setItems((l) => l.map((b) => (b.id === id ? { ...b, status: "مكتمل" } : b)));
  const cancel = (id: string) => setItems((l) => l.map((b) => (b.id === id ? { ...b, status: "ملغي" } : b)));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>الحجوزات</Text>
          <Text style={styles.sub}>{items.length} حجز إجمالاً</Text>
        </View>
        <View style={styles.filterIcon}>
          <Filter size={18} color={colors.textMain} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            testID={`chip-${f}`}
            onPress={() => setFilter(f)}
            style={[styles.chip, filter === f && styles.chipActive]}
          >
            <Text style={[styles.chipTxt, filter === f && styles.chipTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={list}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Calendar size={40} color={colors.textLight} />
            <Text style={styles.emptyTxt}>لا توجد حجوزات</Text>
          </View>
        }
        renderItem={({ item }) => {
          const sc = statusColors[item.status];
          return (
            <View style={styles.card} testID={`booking-${item.id}`}>
              <View style={styles.topRow}>
                <Text style={styles.service}>{item.service}</Text>
                <View style={[styles.statusTag, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusTxt, { color: sc.fg }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.gridRow}>
                <MetaLine icon={<User size={13} color={colors.textMuted} />} value={item.customerName} />
                <MetaLine icon={<Phone size={13} color={colors.textMuted} />} value={item.customerPhone} />
              </View>
              <MetaLine icon={<Car size={13} color={colors.textMuted} />} value={item.vehicle} />
              <View style={styles.gridRow}>
                <MetaLine icon={<Calendar size={13} color={colors.textMuted} />} value={item.date} />
                <MetaLine icon={<Clock size={13} color={colors.textMuted} />} value={item.time} />
              </View>

              <View style={styles.divider} />

              <View style={styles.bottom}>
                <Text style={styles.price}>{item.price} ر.س</Text>
                <View style={styles.actions}>
                  {item.status === "جديد" && (
                    <>
                      <TouchableOpacity testID={`confirm-${item.id}`} style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => confirm(item.id)}>
                        <Text style={styles.actionTxt}>قبول</Text>
                      </TouchableOpacity>
                      <TouchableOpacity testID={`cancel-${item.id}`} style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]} onPress={() => cancel(item.id)}>
                        <Text style={[styles.actionTxt, { color: colors.error }]}>رفض</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {(item.status === "مؤكد" || item.status === "قيد التنفيذ") && (
                    <TouchableOpacity testID={`complete-${item.id}`} style={[styles.actionBtn, { backgroundColor: colors.success }]} onPress={() => complete(item.id)}>
                      <Text style={styles.actionTxt}>إنهاء</Text>
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

function MetaLine({ icon, value }: any) {
  return (
    <View style={styles.metaLine}>
      {icon}
      <Text style={styles.metaVal} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  title: { ...typography.h1, textAlign: "right" },
  sub: { fontSize: 12, color: colors.textMuted, textAlign: "right" },
  filterIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  chips: { paddingHorizontal: spacing.lg, gap: spacing.sm, flexDirection: "row", paddingBottom: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginEnd: spacing.sm },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  chipTxtActive: { color: "#fff" },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  service: { fontSize: 15, fontWeight: "700", color: colors.textMain, flex: 1, textAlign: "right" },
  statusTag: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  statusTxt: { fontSize: 11, fontWeight: "700" },
  gridRow: { flexDirection: "row", gap: spacing.md },
  metaLine: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  metaVal: { fontSize: 12, color: colors.textMain, fontWeight: "600", flex: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  bottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 16, fontWeight: "800", color: colors.textMain },
  actions: { flexDirection: "row", gap: spacing.sm },
  actionBtn: { paddingHorizontal: spacing.md, height: 36, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  actionTxt: { color: "#fff", fontSize: 12, fontWeight: "700" },
  empty: { alignItems: "center", paddingVertical: 80, gap: spacing.md },
  emptyTxt: { color: colors.textMuted, fontSize: 14, fontWeight: "600" },
});
