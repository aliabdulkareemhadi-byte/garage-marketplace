import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, Plus, Calendar, Car, Phone, Wrench, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, Clock, FileText } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import EmptyState from "../../src/components/EmptyState";
import FilterTabs, { type FilterTab } from "../../src/components/FilterTabs";
import { useReminders } from "../../src/context/RemindersContext";
import type { MaintenanceReminder, ReminderStatus } from "../../src/types/reminder";

type Tab = "الكل" | ReminderStatus;
const tabOrder: Tab[] = ["الكل", "نشط", "قريب الاستحقاق", "مكتمل", "ملغي"];

const statusMeta: Record<ReminderStatus, { bg: string; fg: string }> = {
  "نشط": { bg: "#E6F0FF", fg: "#0066FF" },
  "قريب الاستحقاق": { bg: "#FEF3C7", fg: "#F59E0B" },
  "مكتمل": { bg: "#D1FAE5", fg: "#10B981" },
  "ملغي": { bg: "#FEE2E2", fg: "#EF4444" },
};

export default function RemindersScreen() {
  const router = useRouter();
  const { reminders, updateStatus, removeReminder } = useReminders();
  const [tab, setTab] = useState<Tab>("الكل");
  const [expanded, setExpanded] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<ReminderStatus, number> = {
      "نشط": 0,
      "قريب الاستحقاق": 0,
      "مكتمل": 0,
      "ملغي": 0,
    };
    reminders.forEach((r) => {
      c[r.status] += 1;
    });
    return c;
  }, [reminders]);

  const list = tab === "الكل" ? reminders : reminders.filter((r) => r.status === tab);

  const onChangeStatus = (item: MaintenanceReminder) => {
    Alert.alert(
      "تغيير الحالة",
      `${item.customerName} — ${item.serviceType}`,
      [
        { text: "نشط", onPress: () => updateStatus(item.id, "نشط") },
        { text: "قريب الاستحقاق", onPress: () => updateStatus(item.id, "قريب الاستحقاق") },
        { text: "مكتمل", onPress: () => updateStatus(item.id, "مكتمل") },
        { text: "ملغي", style: "destructive", onPress: () => updateStatus(item.id, "ملغي") },
        { text: "إغلاق", style: "cancel" },
      ]
    );
  };

  const confirmDelete = (id: string) => {
    Alert.alert("حذف التذكير", "هل أنت متأكد من حذف هذا التذكير؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => removeReminder(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>تذكيرات الصيانة</Text>
          <Text style={styles.sub}>
            {reminders.length} تذكير · {counts["قريب الاستحقاق"]} قريب الاستحقاق
          </Text>
        </View>
        <TouchableOpacity
          testID="add-reminder-btn"
          style={styles.addBtn}
          onPress={() => router.push("/workshop-dashboard/reminder-edit")}
        >
          <Plus size={18} color="#fff" />
          <Text style={styles.addTxt}>تذكير جديد</Text>
        </TouchableOpacity>
      </View>

      <FilterTabs
        tabs={tabOrder.map<FilterTab<Tab>>((t) => ({
          value: t,
          count: t === "الكل" ? reminders.length : counts[t],
        }))}
        active={tab}
        onChange={setTab}
        showCounts
        testIDPrefix="reminder-tab"
      />

      <FlatList
        data={list}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <EmptyState
            icon={<Bell size={40} color={colors.textLight} />}
            title={tab === "الكل" ? "لا توجد تذكيرات بعد" : `لا توجد تذكيرات ${tab}`}
            description="أضف تذكير صيانة ليصل إليك العميل في الوقت المناسب"
            actionLabel="+ إضافة تذكير"
            onAction={() => router.push("/workshop-dashboard/reminder-edit")}
            testID="empty-reminders"
          />
        }
        renderItem={({ item }) => {
          const sc = statusMeta[item.status];
          const isOpen = expanded === item.id;
          return (
            <View style={styles.card} testID={`reminder-${item.id}`}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.customer}>{item.customerName}</Text>
                  <View style={styles.phoneRow}>
                    <Phone size={11} color={colors.textLight} />
                    <Text style={styles.phone}>{item.customerPhone}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  testID={`status-${item.id}`}
                  onPress={() => onChangeStatus(item)}
                  style={[styles.statusTag, { backgroundColor: sc.bg }]}
                >
                  <Text style={[styles.statusTxt, { color: sc.fg }]}>{item.status}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaGrid}>
                <MetaCell icon={<Wrench size={12} color={colors.textMuted} />} value={item.serviceType} />
                <MetaCell icon={<Car size={12} color={colors.textMuted} />} value={`${item.carModel} ${item.carYear}`} />
                <MetaCell
                  icon={<Calendar size={12} color={colors.textMuted} />}
                  label="الخدمة السابقة"
                  value={item.serviceDate}
                />
                <MetaCell
                  icon={<AlertCircle size={12} color={colors.accent} />}
                  label="التذكير القادم"
                  value={item.nextReminderDate}
                  highlight
                />
              </View>

              {isOpen && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailsBlock}>
                    {item.workDone ? (
                      <DetailRow icon={<CheckCircle2 size={12} color={colors.success} />} label="العمل المنجز" value={item.workDone} />
                    ) : null}
                    {item.workshopNotes ? (
                      <DetailRow icon={<FileText size={12} color={colors.textMuted} />} label="ملاحظات الورشة" value={item.workshopNotes} />
                    ) : null}
                    {item.returnDuration ? (
                      <DetailRow icon={<Clock size={12} color={colors.textMuted} />} label="مدة العودة" value={item.returnDuration} />
                    ) : null}
                  </View>
                </>
              )}

              <View style={styles.divider} />

              <View style={styles.actions}>
                <TouchableOpacity
                  testID={`expand-${item.id}`}
                  style={styles.expandBtn}
                  onPress={() => setExpanded(isOpen ? null : item.id)}
                >
                  {isOpen ? <ChevronUp size={14} color={colors.textMain} /> : <ChevronDown size={14} color={colors.textMain} />}
                  <Text style={styles.expandTxt}>{isOpen ? "إخفاء التفاصيل" : "عرض التفاصيل"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID={`call-${item.id}`}
                  style={styles.callBtn}
                  onPress={() => Linking.openURL(`tel:${item.customerPhone}`)}
                >
                  <Phone size={13} color="#fff" />
                  <Text style={styles.callTxt}>اتصال</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID={`delete-${item.id}`}
                  style={styles.deleteBtn}
                  onPress={() => confirmDelete(item.id)}
                >
                  <XCircle size={13} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

function MetaCell({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label?: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.metaCell}>
      <View style={styles.metaCellIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        {label ? <Text style={styles.metaLabel}>{label}</Text> : null}
        <Text style={[styles.metaValue, highlight && { color: colors.accent }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  title: { ...typography.h1, textAlign: "right" },
  sub: { fontSize: 11, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.primary, paddingHorizontal: spacing.md, height: 40, borderRadius: radius.md },
  addTxt: { color: "#fff", fontSize: 12, fontWeight: "800" },

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.sm },
  customer: { fontSize: 15, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  phone: { fontSize: 11, color: colors.textLight, fontWeight: "600" },
  statusTag: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  statusTxt: { fontSize: 11, fontWeight: "800" },

  divider: { height: 1, backgroundColor: colors.border },

  metaGrid: { flexDirection: "row", flexWrap: "wrap" },
  metaCell: { width: "50%", flexDirection: "row", alignItems: "flex-start", gap: 6, paddingVertical: 6 },
  metaCellIcon: { marginTop: 2 },
  metaLabel: { fontSize: 10, color: colors.textLight, fontWeight: "700", textAlign: "right" },
  metaValue: { fontSize: 12, color: colors.textMain, fontWeight: "700", textAlign: "right", marginTop: 1 },

  detailsBlock: { gap: spacing.sm, paddingVertical: 2 },
  detailRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  detailIcon: { marginTop: 2 },
  detailLabel: { fontSize: 10, color: colors.textLight, fontWeight: "700", textAlign: "right" },
  detailValue: { fontSize: 12, color: colors.textMain, fontWeight: "600", lineHeight: 18, textAlign: "right", marginTop: 1 },

  actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  expandBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, height: 34, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  expandTxt: { color: colors.textMain, fontSize: 11, fontWeight: "800" },
  callBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.md, height: 34, borderRadius: radius.sm, backgroundColor: colors.success },
  callTxt: { color: "#fff", fontSize: 11, fontWeight: "800" },
  deleteBtn: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FECACA" },
});
