import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Edit3, Trash2, Plus, Wrench, CheckCircle2, Clock, EyeOff } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";
import { workshops } from "../../src/data/mockData";
import EmptyState from "../../src/components/EmptyState";
import SearchBar from "../../src/components/SearchBar";
import FilterTabs from "../../src/components/FilterTabs";

type Filter = "الكل" | "نشط" | "معطّل";

type ServiceItem = { id: string; name: string; price: number; duration?: string; active?: boolean };

export default function WorkshopServices() {
  const router = useRouter();
  const { session } = useAuth();
  const ws = workshops.find((w) => w.id === session?.entityId) || workshops[0];
  const [items, setItems] = useState<ServiceItem[]>(
    ws.services.map((s) => ({ ...s, duration: "30 د", active: true }))
  );
  const [filter, setFilter] = useState<Filter>("الكل");
  const [query, setQuery] = useState("");

  const list = items
    .filter((s) => (filter === "الكل" ? true : filter === "نشط" ? s.active : !s.active))
    .filter((s) => s.name.includes(query));

  const stats = {
    total: items.length,
    active: items.filter((s) => s.active).length,
    disabled: items.filter((s) => !s.active).length,
  };

  const remove = (id: string) => {
    Alert.alert("حذف الخدمة", "هل أنت متأكد من حذف هذه الخدمة؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => setItems((l) => l.filter((s) => s.id !== id)) },
    ]);
  };
  const toggleActive = (id: string) => setItems((l) => l.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>خدماتي</Text>
          <Text style={styles.sub}>{stats.total} خدمة · {stats.active} نشط · {stats.disabled} معطّل</Text>
        </View>
        <TouchableOpacity testID="add-service-btn" style={styles.addBtn} onPress={() => router.push("/workshop-dashboard/service-edit")}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addTxt}>إضافة</Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        testID="services-search"
        value={query}
        onChangeText={setQuery}
        placeholder="ابحث في خدماتك..."
      />

      <FilterTabs
        tabs={["الكل", "نشط", "معطّل"] as Filter[]}
        active={filter}
        onChange={setFilter}
      />

      <FlatList
        data={list}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <EmptyState
            icon={<Wrench size={40} color={colors.textLight} />}
            title={query || filter !== "الكل" ? "لا نتائج مطابقة" : "لا توجد خدمات بعد"}
            description={query || filter !== "الكل" ? "جرّب تغيير الفلتر أو كلمة البحث" : "أضف الخدمات التي تقدمها ورشتك ليتمكن العملاء من حجزها"}
            actionLabel="+ إضافة خدمة"
            onAction={() => router.push("/workshop-dashboard/service-edit")}
            testID="empty-services"
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.row, !item.active && styles.rowDisabled]} testID={`my-service-${item.id}`}>
            <View style={[styles.iconWrap, !item.active && { backgroundColor: colors.surfaceAlt }]}>
              {item.active ? <CheckCircle2 size={20} color={colors.success} /> : <EyeOff size={20} color={colors.textLight} />}
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Clock size={11} color={colors.textMuted} />
                  <Text style={styles.metaTxt}>{item.duration}</Text>
                </View>
                <View style={styles.dotSep} />
                <Text style={styles.price}>{item.price} ر.س</Text>
              </View>
              <View style={styles.statusRow}>
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
              <TouchableOpacity
                testID={`edit-service-${item.id}`}
                style={styles.iconBtn}
                onPress={() => router.push({ pathname: "/workshop-dashboard/service-edit", params: { id: item.id } })}
              >
                <Edit3 size={14} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity testID={`delete-service-${item.id}`} style={[styles.iconBtn, { backgroundColor: "#FEE2E2" }]} onPress={() => remove(item.id)}>
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
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  rowDisabled: { opacity: 0.75, backgroundColor: colors.surfaceAlt },
  iconWrap: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaTxt: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  dotSep: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textLight },
  price: { fontSize: 14, fontWeight: "800", color: colors.accent },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  switchLbl: { fontSize: 11, color: colors.textMuted, fontWeight: "700" },
  iconBtn: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
});
