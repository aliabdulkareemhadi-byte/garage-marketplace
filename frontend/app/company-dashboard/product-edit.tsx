import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronRight, Save, Tag, DollarSign, Package, FileText } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { products } from "../../src/data/mockData";

export default function ProductEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = id ? products.find((p) => p.id === id) : null;
  const editMode = !!existing;

  const [form, setForm] = useState({
    title: existing?.title || "",
    brand: existing?.brand || "",
    price: existing?.price ? String(existing.price) : "",
    oldPrice: existing?.oldPrice ? String(existing.oldPrice) : "",
    description: existing?.description || "",
    inStock: existing?.inStock ?? true,
  });

  const save = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity testID="pe-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.title}>{editMode ? "تعديل المنتج" : "إضافة منتج جديد"}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Field
            label="اسم المنتج"
            icon={<Package size={18} color={colors.textLight} />}
            value={form.title}
            onChangeText={(t: string) => setForm({ ...form, title: t })}
            placeholder="مثال: زيت محرك شل هيلكس 5W-30"
            testID="pe-title"
          />
          <Field
            label="العلامة التجارية"
            icon={<Tag size={18} color={colors.textLight} />}
            value={form.brand}
            onChangeText={(t: string) => setForm({ ...form, brand: t })}
            placeholder="Shell"
            testID="pe-brand"
          />
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Field
                label="السعر (ر.س)"
                icon={<DollarSign size={18} color={colors.textLight} />}
                value={form.price}
                onChangeText={(t: string) => setForm({ ...form, price: t })}
                placeholder="175"
                keyboardType="numeric"
                testID="pe-price"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="السعر القديم"
                icon={<DollarSign size={18} color={colors.textLight} />}
                value={form.oldPrice}
                onChangeText={(t: string) => setForm({ ...form, oldPrice: t })}
                placeholder="210"
                keyboardType="numeric"
                testID="pe-oldprice"
              />
            </View>
          </View>

          <Field
            label="الوصف"
            icon={<FileText size={18} color={colors.textLight} />}
            value={form.description}
            onChangeText={(t: string) => setForm({ ...form, description: t })}
            placeholder="وصف المنتج..."
            multiline
            testID="pe-desc"
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>متوفر في المخزون</Text>
              <Text style={styles.switchSub}>يمكن للعملاء طلب المنتج</Text>
            </View>
            <Switch
              testID="pe-stock-switch"
              value={form.inStock}
              onValueChange={(v) => setForm({ ...form, inStock: v })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.imagesBox}>
            <Text style={styles.imagesTitle}>صور المنتج</Text>
            <View style={styles.imagesEmpty}>
              <Text style={styles.imagesEmptyTxt}>لم يتم رفع صور بعد</Text>
              <TouchableOpacity style={styles.uploadBtn}>
                <Text style={styles.uploadTxt}>+ رفع صورة</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <TouchableOpacity testID="pe-save-btn" style={styles.saveBtn} onPress={save}>
            <Save size={18} color="#fff" />
            <Text style={styles.saveTxt}>{editMode ? "حفظ التعديلات" : "إضافة المنتج"}</Text>
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
  label: { fontSize: 13, fontWeight: "600", color: colors.textMain, marginBottom: 6, textAlign: "right" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 52, borderWidth: 1, borderColor: colors.border },
  inputWrapMulti: { height: "auto", alignItems: "flex-start", paddingVertical: spacing.sm },
  input: { flex: 1, fontSize: 14, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  switchLabel: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  switchSub: { fontSize: 12, color: colors.textMuted, marginTop: 2, textAlign: "right" },
  imagesBox: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  imagesTitle: { ...typography.h3, marginBottom: spacing.md, textAlign: "right" },
  imagesEmpty: { borderWidth: 1.5, borderStyle: "dashed", borderColor: colors.border, borderRadius: radius.md, padding: spacing.xl, alignItems: "center", gap: spacing.md },
  imagesEmptyTxt: { color: colors.textMuted, fontSize: 12 },
  uploadBtn: { backgroundColor: colors.accentSoft, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.md },
  uploadTxt: { color: colors.accent, fontSize: 13, fontWeight: "700" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primary, height: 52, borderRadius: radius.md },
  saveTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
