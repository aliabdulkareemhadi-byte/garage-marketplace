import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronRight, Save, Wrench, DollarSign, Clock, FileText } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";
import { workshops } from "../../src/data/mockData";

export default function ServiceEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { session } = useAuth();
  const ws = workshops.find((w) => w.id === session?.entityId) || workshops[0];
  const existing = id ? ws.services.find((s) => s.id === id) : null;
  const editMode = !!existing;

  const [form, setForm] = useState({
    name: existing?.name || "",
    price: existing?.price ? String(existing.price) : "",
    duration: "30 د",
    description: "",
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity testID="se-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.title}>{editMode ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Field
            label="اسم الخدمة"
            icon={<Wrench size={18} color={colors.textLight} />}
            value={form.name}
            onChangeText={(t: string) => setForm({ ...form, name: t })}
            placeholder="مثال: تغيير زيت + فلتر"
            testID="se-name"
          />
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Field
                label="السعر (ر.س)"
                icon={<DollarSign size={18} color={colors.textLight} />}
                value={form.price}
                onChangeText={(t: string) => setForm({ ...form, price: t })}
                placeholder="180"
                keyboardType="numeric"
                testID="se-price"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="المدة"
                icon={<Clock size={18} color={colors.textLight} />}
                value={form.duration}
                onChangeText={(t: string) => setForm({ ...form, duration: t })}
                placeholder="30 د"
                testID="se-duration"
              />
            </View>
          </View>

          <Field
            label="الوصف"
            icon={<FileText size={18} color={colors.textLight} />}
            value={form.description}
            onChangeText={(t: string) => setForm({ ...form, description: t })}
            placeholder="وصف مختصر للخدمة..."
            multiline
            testID="se-desc"
          />
        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <TouchableOpacity testID="se-save-btn" style={styles.saveBtn} onPress={() => router.back()}>
            <Save size={18} color="#fff" />
            <Text style={styles.saveTxt}>{editMode ? "حفظ التعديلات" : "إضافة الخدمة"}</Text>
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
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primary, height: 52, borderRadius: radius.md },
  saveTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
