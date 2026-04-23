import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Edit3, Trash2, Plus, Wrench, CheckCircle2 } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";
import { workshops } from "../../src/data/mockData";

export default function WorkshopServices() {
  const router = useRouter();
  const { session } = useAuth();
  const ws = workshops.find((w) => w.id === session?.entityId) || workshops[0];
  const [items, setItems] = useState(ws.services);

  const remove = (id: string) => {
    Alert.alert("حذف الخدمة", "هل أنت متأكد؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => setItems((l) => l.filter((s) => s.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>خدماتي</Text>
          <Text style={styles.sub}>{items.length} خدمة متاحة للحجز</Text>
        </View>
        <TouchableOpacity
          testID="add-service-btn"
          style={styles.addBtn}
          onPress={() => router.push("/workshop-dashboard/service-edit")}
        >
          <Plus size={18} color="#fff" />
          <Text style={styles.addTxt}>إضافة</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Wrench size={40} color={colors.textLight} />
            <Text style={styles.emptyTxt}>لا توجد خدمات بعد</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row} testID={`my-service-${item.id}`}>
            <View style={styles.iconWrap}>
              <CheckCircle2 size={22} color={colors.success} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price} ر.س</Text>
            </View>
            <View style={{ gap: spacing.sm }}>
              <TouchableOpacity
                testID={`edit-service-${item.id}`}
                style={styles.iconBtn}
                onPress={() => router.push({ pathname: "/workshop-dashboard/service-edit", params: { id: item.id } })}
              >
                <Edit3 size={15} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity testID={`delete-service-${item.id}`} style={[styles.iconBtn, { backgroundColor: "#FEE2E2" }]} onPress={() => remove(item.id)}>
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
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  iconWrap: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  price: { fontSize: 15, fontWeight: "800", color: colors.accent, textAlign: "right" },
  iconBtn: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", paddingVertical: 80, gap: spacing.md },
  emptyTxt: { color: colors.textMuted, fontSize: 14, fontWeight: "600" },
});
