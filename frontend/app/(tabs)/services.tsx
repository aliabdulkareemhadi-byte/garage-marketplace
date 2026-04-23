import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { services, workshops } from "../../src/data/mockData";
import ServiceCard from "../../src/components/ServiceCard";
import WorkshopCard from "../../src/components/WorkshopCard";

const filters = ["الكل", "الأكثر طلباً", "الأرخص", "الأسرع", "الأعلى تقييماً"];

export default function Services() {
  const router = useRouter();
  const [active, setActive] = useState("الكل");
  const [query, setQuery] = useState("");

  const list = services.filter((s) => s.name.includes(query));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>الخدمات</Text>
        <Text style={styles.sub}>اختر الخدمة المناسبة لسيارتك</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <Search size={18} color={colors.textLight} />
          <TextInput
            testID="services-search-input"
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث عن خدمة..."
            placeholderTextColor={colors.textLight}
            style={styles.search}
          />
        </View>
        <TouchableOpacity testID="services-filter-btn" style={styles.filterBtn}>
          <SlidersHorizontal size={18} color={colors.textMain} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            testID={`filter-chip-${f}`}
            onPress={() => setActive(f)}
            style={[styles.chip, active === f && styles.chipActive]}
          >
            <Text style={[styles.chipTxt, active === f && styles.chipTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onPress={() => router.push(`/booking/${item.id}`)}
          />
        )}
        ListFooterComponent={
          <View style={{ marginTop: spacing.xl }}>
            <Text style={styles.subSection}>ورش تقدم هذه الخدمات</Text>
            <FlatList
              data={workshops.slice(0, 3)}
              keyExtractor={(i) => i.id}
              horizontal
              inverted
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
              contentContainerStyle={{ paddingVertical: spacing.md }}
              renderItem={({ item }) => (
                <WorkshopCard workshop={item} onPress={() => router.push(`/workshop/${item.id}`)} />
              )}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  title: { ...typography.h1, textAlign: "right" },
  sub: { fontSize: 13, color: colors.textMuted, textAlign: "right", marginTop: 4 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.lg, marginTop: spacing.md },
  searchWrap: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 48, borderWidth: 1, borderColor: colors.border },
  search: { flex: 1, fontSize: 13, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
  filterBtn: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  chipsRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm, flexDirection: "row" },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginEnd: spacing.sm },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  chipTxtActive: { color: "#fff" },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  subSection: { ...typography.h3, textAlign: "right", paddingHorizontal: 0, marginTop: spacing.md },
});
