import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, User, Building2, Wrench, CheckCircle2 } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";

type Role = {
  id: "customer" | "company" | "workshop";
  title: string;
  subtitle: string;
  image: string;
  icon: React.ReactNode;
  bullets: string[];
  to: string;
};

const roles: Role[] = [
  {
    id: "customer",
    title: "عميل",
    subtitle: "ابحث عن الخدمات واطلب قطع الغيار",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    icon: <User size={22} color={colors.accent} />,
    bullets: ["احجز ورش الصيانة", "اطلب قطع الغيار", "تابع الطلبات"],
    to: "/(tabs)/home",
  },
  {
    id: "company",
    title: "شركة",
    subtitle: "أدر منتجاتك ومبيعاتك",
    image: "https://images.pexels.com/photos/8986039/pexels-photo-8986039.jpeg?w=400",
    icon: <Building2 size={22} color={colors.accent} />,
    bullets: ["إدارة المنتجات", "متابعة الطلبات", "إحصائيات المبيعات"],
    to: "/auth/company-login",
  },
  {
    id: "workshop",
    title: "ورشة",
    subtitle: "أدر خدماتك وحجوزاتك",
    image: "https://images.unsplash.com/photo-1636613112804-c5aebc1f4d8d?w=400",
    icon: <Wrench size={22} color={colors.accent} />,
    bullets: ["إدارة الخدمات", "استقبال الحجوزات", "تقييم العملاء"],
    to: "/auth/workshop-login",
  },
];

export default function RoleSelect() {
  const router = useRouter();
  const [selected, setSelected] = React.useState<Role["id"]>("customer");

  const current = roles.find((r) => r.id === selected)!;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <TouchableOpacity testID="role-back" onPress={() => router.back()} style={styles.back}>
        <ChevronRight size={22} color={colors.textMain} />
      </TouchableOpacity>

      <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.md }}>
        <Text style={styles.title}>كيف تريد استخدام التطبيق؟</Text>
        <Text style={styles.sub}>اختر نوع الحساب المناسب لاحتياجاتك</Text>
      </View>

      <View style={styles.list}>
        {roles.map((r) => {
          const active = selected === r.id;
          return (
            <TouchableOpacity
              key={r.id}
              testID={`role-${r.id}`}
              activeOpacity={0.9}
              onPress={() => setSelected(r.id)}
              style={[styles.card, active && styles.cardActive]}
            >
              <View style={styles.cardHead}>
                <View style={[styles.iconWrap, active && { backgroundColor: colors.primary }]}>
                  {active ? React.cloneElement(r.icon as any, { color: "#fff" }) : r.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{r.title}</Text>
                  <Text style={styles.cardSub} numberOfLines={1}>{r.subtitle}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioOn]}>
                  {active && <View style={styles.radioInner} />}
                </View>
              </View>

              {active && (
                <View style={styles.bullets}>
                  {r.bullets.map((b) => (
                    <View key={b} style={styles.bulletRow}>
                      <CheckCircle2 size={14} color={colors.success} />
                      <Text style={styles.bulletTxt}>{b}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          testID="role-continue-btn"
          style={styles.primaryBtn}
          onPress={() => {
            if (current.id === "customer") router.replace("/(tabs)/home");
            else router.push(current.to as any);
          }}
        >
          <Text style={styles.primaryTxt}>متابعة كـ {current.title}</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          يمكنك تغيير نوع الحساب لاحقاً من الإعدادات
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginStart: spacing.lg, marginTop: spacing.md },
  title: { fontSize: 24, fontWeight: "800", color: colors.textMain, textAlign: "right", marginTop: spacing.lg },
  sub: { fontSize: 13, color: colors.textMuted, textAlign: "right", marginTop: spacing.sm, lineHeight: 20 },
  list: { padding: spacing.lg, gap: spacing.md, flex: 1 },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1.5, borderColor: colors.border, padding: spacing.lg, gap: spacing.md },
  cardActive: { borderColor: colors.primary, backgroundColor: "#FAFBFF" },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconWrap: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  cardSub: { fontSize: 12, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  radioOn: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  bullets: { gap: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  bulletRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  bulletTxt: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  footer: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  primaryBtn: { backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  primaryTxt: { color: "#fff", fontSize: 15, fontWeight: "800" },
  hint: { fontSize: 11, color: colors.textLight, textAlign: "center" },
});
