import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronRight, Save, Tag, Percent, Calendar, FileText, Package } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { companyOffers, products } from "../../src/data/mockData";

export default function OfferEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = id ? companyOffers.find((o) => o.id === id) : null;
  const editMode = !!existing;

  const [form, setForm] = useState({
    title: existing?.title || "",
    productId: existing?.productId || products[0].id,
    discount: existing?.discountPercent ? String(existing.discountPercent) : "",
    startDate: existing?.startDate || "",
    endDate: existing?.endDate || "",
    description: existing?.description || "",
    active: (existing?.state || "نشط") === "نشط",
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity testID="oe-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.title}>{editMode ? "تعديل العرض" : "إنشاء عرض جديد"}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Field
            label="عنوان العرض"
            icon={<Tag size={18} color={colors.textLight} />}
            value={form.title}
            onChangeText={(t: string) => setForm({ ...form, title: t })}
            placeholder="مثال: خصم الشتاء على الزيوت"
            testID="oe-title"
          />

          <Text style={styles.label}>المنتج المستهدف</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: 2 }}>
            {products.map((p) => {
              const active = form.productId === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  testID={`oe-product-${p.id}`}
                  onPress={() => setForm({ ...form, productId: p.id })}
                  style={[styles.prodChip, active && styles.prodChipActive]}
                >
                  <Package size={14} color={active ? "#fff" : colors.textMain} />
                  <Text style={[styles.prodChipTxt, active && { color: "#fff" }]} numberOfLines={1}>{p.title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ height: spacing.md }} />

          <Field
            label="نسبة الخصم %"
            icon={<Percent size={18} color={colors.textLight} />}
            value={form.discount}
            onChangeText={(t: string) => setForm({ ...form, discount: t })}
            placeholder="20"
            keyboardType="numeric"
            testID="oe-discount"
          />

          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Field
                label="تاريخ البدء"
                icon={<Calendar size={18} color={colors.textLight} />}
                value={form.startDate}
                onChangeText={(t: string) => setForm({ ...form, startDate: t })}
                placeholder="YYYY-MM-DD"
                testID="oe-start"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="تاريخ الانتهاء"
                icon={<Calendar size={18} color={colors.textLight} />}
                value={form.endDate}
                onChangeText={(t: string) => setForm({ ...form, endDate: t })}
                placeholder="YYYY-MM-DD"
                testID="oe-end"
              />
            </View>
          </View>

          <Field
            label="الوصف"
            icon={<FileText size={18} color={colors.textLight} />}
            value={form.description}
            onChangeText={(t: string) => setForm({ ...form, description: t })}
            placeholder="تفاصيل مختصرة عن العرض..."
            multiline
            testID="oe-desc"
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>تفعيل العرض الآن</Text>
              <Text style={styles.switchSub}>سيظهر للعملاء فور الحفظ</Text>
            </View>
            <Switch
              testID="oe-active-switch"
              value={form.active}
              onValueChange={(v) => setForm({ ...form, active: v })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewLabel}>معاينة شارة الخصم</Text>
            <View style={styles.previewBadge}>
              <Text style={styles.previewPercent}>{form.discount || "0"}%</Text>
              <Text style={styles.previewTxt}>خصم</Text>
            </View>
          </View>
        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <TouchableOpacity testID="oe-save-btn" style={styles.saveBtn} onPress={() => router.back()}>
            <Save size={18} color="#fff" />
            <Text style={styles.saveTxt}>{editMode ? "حفظ التعديلات" : "إنشاء العرض"}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, icon, testID, multiline, ...rest }: any) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.inputWrapMulti]}>
        {icon}
        <TextInput
          testID={testID}
          {...rest}
          multiline={multiline}
          placeholderTextColor={colors.textLight}
          style={[styles.input, multiline && { minHeight: 80, paddingVertical: spacing.sm }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h2 },
  scroll: { padding: spacing.lg, paddingBottom: 120 },
  label: { fontSize: 13, fontWeight: "700", color: colors.textMain, marginBottom: 6, textAlign: "right" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 52, borderWidth: 1, borderColor: colors.border },
  inputWrapMulti: { height: "auto", alignItems: "flex-start", paddingVertical: spacing.sm },
  input: { flex: 1, fontSize: 14, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
  prodChip: { flexDirection: "row", alignItems: "center", gap: 6, maxWidth: 200, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginEnd: spacing.sm },
  prodChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  prodChipTxt: { fontSize: 12, color: colors.textMain, fontWeight: "700", flexShrink: 1 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  switchLabel: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  switchSub: { fontSize: 11, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  preview: { alignItems: "center", padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  previewLabel: { fontSize: 11, color: colors.textMuted, fontWeight: "700" },
  previewBadge: { backgroundColor: colors.error, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: "center" },
  previewPercent: { color: "#fff", fontSize: 28, fontWeight: "800" },
  previewTxt: { color: "#fff", fontSize: 12, fontWeight: "800" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primary, height: 52, borderRadius: radius.md },
  saveTxt: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
