import React from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, MapPin, Bell, Wrench, ShoppingBag, Building2, ChevronLeft } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { companies, workshops, products, services } from "../../src/data/mockData";
import CompanyCard from "../../src/components/CompanyCard";
import WorkshopCard from "../../src/components/WorkshopCard";
import ProductCard from "../../src/components/ProductCard";
import AdsSection from "../../src/components/AdsSection";

export default function Home() {
  const router = useRouter();

  const categories = [
    { id: "c1", name: "ورش", icon: Wrench, color: "#0066FF", bg: "#E6F0FF" },
    { id: "c2", name: "قطع غيار", icon: ShoppingBag, color: "#10B981", bg: "#D1FAE5" },
    { id: "c3", name: "شركات", icon: Building2, color: "#F59E0B", bg: "#FEF3C7" },
    { id: "c4", name: "خدمات", icon: Wrench, color: "#EF4444", bg: "#FEE2E2" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hi}>مرحباً، أحمد 👋</Text>
            <View style={styles.locRow}>
              <MapPin size={13} color={colors.textMuted} />
              <Text style={styles.loc}>الرياض، حي النزهة</Text>
            </View>
          </View>
          <TouchableOpacity testID="home-notif-btn" onPress={() => router.push("/(tabs)/notifications")} style={styles.bellBtn}>
            <Bell size={20} color={colors.textMain} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Search size={18} color={colors.textLight} />
          <TextInput
            testID="home-search-input"
            placeholder="ابحث عن ورشة، خدمة، أو قطعة غيار..."
            placeholderTextColor={colors.textLight}
            style={styles.search}
          />
        </View>

        {/* Hero banner */}
        <TouchableOpacity activeOpacity={0.9} style={styles.banner}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1636613112804-c5aebc1f4d8d?w=1200" }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <View style={styles.bannerTag}>
              <Text style={styles.bannerTagTxt}>عرض خاص</Text>
            </View>
            <Text style={styles.bannerTitle}>خصم 25% على{"\n"}الصيانة الدورية</Text>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnTxt}>احجز الآن</Text>
              <ChevronLeft size={14} color={colors.primary} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.catsRow}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              testID={`category-${c.id}`}
              style={styles.catItem}
              onPress={() => router.push("/(tabs)/services")}
            >
              <View style={[styles.catIcon, { backgroundColor: c.bg }]}>
                <c.icon size={22} color={c.color} />
              </View>
              <Text style={styles.catName}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sponsored Ads */}
        <AdsSection />

        {/* Companies */}
        <SectionHeader title="الشركات" onAll={() => {}} />
        <FlatList
          data={companies}
          keyExtractor={(i) => i.id}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
          renderItem={({ item }) => (
            <CompanyCard company={item} onPress={() => router.push(`/company/${item.id}`)} />
          )}
        />

        {/* Workshops */}
        <SectionHeader title="الورش الأعلى تقييماً" onAll={() => {}} />
        <FlatList
          data={workshops}
          keyExtractor={(i) => i.id}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
          renderItem={({ item }) => (
            <WorkshopCard workshop={item} onPress={() => router.push(`/workshop/${item.id}`)} />
          )}
        />

        {/* Services quick */}
        <SectionHeader title="الخدمات الشائعة" onAll={() => router.push("/(tabs)/services")} />
        <View style={styles.servicesGrid}>
          {services.slice(0, 4).map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.servMini}
              onPress={() => router.push("/(tabs)/services")}
              testID={`quick-service-${s.id}`}
            >
              <View style={styles.servMiniIcon}>
                <Wrench size={18} color={colors.accent} />
              </View>
              <Text style={styles.servMiniName} numberOfLines={1}>{s.name}</Text>
              <Text style={styles.servMiniPrice}>من {s.priceFrom} ر.س</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Products */}
        <SectionHeader title="قطع غيار مميزة" onAll={() => {}} />
        <FlatList
          data={products}
          keyExtractor={(i) => i.id}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
          renderItem={({ item }) => (
            <ProductCard product={item} compact onPress={() => router.push(`/product/${item.id}`)} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, onAll }: { title: string; onAll: () => void }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onAll}>
        <Text style={styles.sectionAll}>عرض الكل</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", padding: spacing.lg, gap: spacing.md },
  hi: { fontSize: 18, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  loc: { fontSize: 12, color: colors.textMuted },
  bellBtn: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  dot: { position: "absolute", top: 10, insetInlineEnd: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 48, borderWidth: 1, borderColor: colors.border },
  search: { flex: 1, fontSize: 13, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
  banner: { margin: spacing.lg, height: 160, borderRadius: radius.xl, overflow: "hidden", backgroundColor: colors.primary },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,10,10,0.55)" },
  bannerContent: { flex: 1, padding: spacing.xl, justifyContent: "space-between", alignItems: "flex-end" },
  bannerTag: { backgroundColor: colors.accent, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  bannerTagTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },
  bannerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "right", lineHeight: 30 },
  bannerBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2, borderRadius: radius.pill },
  bannerBtnTxt: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  catsRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  catItem: { alignItems: "center", gap: 6, flex: 1 },
  catIcon: { width: 56, height: 56, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  catName: { fontSize: 12, fontWeight: "600", color: colors.textMain },
  section: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { ...typography.h2 },
  sectionAll: { color: colors.accent, fontSize: 13, fontWeight: "600" },
  hList: { paddingHorizontal: spacing.lg },
  servicesGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, paddingHorizontal: spacing.lg },
  servMini: { width: "47%", backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: 6 },
  servMiniIcon: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  servMiniName: { fontSize: 13, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  servMiniPrice: { fontSize: 11, color: colors.textMuted, textAlign: "right" },
});
