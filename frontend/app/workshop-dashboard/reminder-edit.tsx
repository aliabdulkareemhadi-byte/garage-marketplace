import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, Save, User, Phone, Car, Calendar, Wrench, FileText, Clock, AlertCircle } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { REMINDER_SERVICE_TYPES, type ReminderServiceType } from "../../src/types/reminder";
import { useReminders } from "../../src/context/RemindersContext";

type FormState = {
  customerName: string;
  customerPhone: string;
  carModel: string;
  carYear: string;
  serviceType: ReminderServiceType;
  workDone: string;
  workshopNotes: string;
  serviceDate: string;
  returnDuration: string;
  nextReminderDate: string;
};

const initialState: FormState = {
  customerName: "",
  customerPhone: "",
  carModel: "",
  carYear: "",
  serviceType: "تغيير زيت",
  workDone: "",
  workshopNotes: "",
  serviceDate: "",
  returnDuration: "",
  nextReminderDate: "",
};

export default function ReminderEdit() {
  const router = useRouter();
  const { addReminder } = useReminders();
  const [form, setForm] = useState<FormState>(initialState);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const missing = !form.customerName.trim() || !form.customerPhone.trim() || !form.serviceDate.trim() || !form.nextReminderDate.trim();

  const save = () => {
    if (missing) {
      Alert.alert(
        "بيانات ناقصة",
        "يرجى تعبئة الحقول الأساسية: اسم العميل، رقم الجوال، تاريخ الخدمة، وتاريخ التذكير القادم."
      );
      return;
    }
    addReminder({
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      carModel: form.carModel.trim(),
      carYear: form.carYear.trim(),
      serviceType: form.serviceType,
      workDone: form.workDone.trim(),
      workshopNotes: form.workshopNotes.trim(),
      serviceDate: form.serviceDate.trim(),
      returnDuration: form.returnDuration.trim(),
      nextReminderDate: form.nextReminderDate.trim(),
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity testID="re-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.title}>تذكير صيانة جديد</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <SectionLabel text="بيانات العميل" />
          <Field
            label="اسم العميل"
            icon={<User size={18} color={colors.textLight} />}
            value={form.customerName}
            onChangeText={(t: string) => set("customerName", t)}
            placeholder="محمد أحمد"
            testID="re-customer-name"
          />
          <Field
            label="رقم الجوال"
            icon={<Phone size={18} color={colors.textLight} />}
            value={form.customerPhone}
            onChangeText={(t: string) => set("customerPhone", t)}
            placeholder="05xxxxxxxx"
            keyboardType="phone-pad"
            testID="re-customer-phone"
          />

          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ flex: 2 }}>
              <Field
                label="موديل السيارة"
                icon={<Car size={18} color={colors.textLight} />}
                value={form.carModel}
                onChangeText={(t: string) => set("carModel", t)}
                placeholder="تويوتا كامري"
                testID="re-car-model"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="السنة"
                icon={<Calendar size={18} color={colors.textLight} />}
                value={form.carYear}
                onChangeText={(t: string) => set("carYear", t)}
                placeholder="2022"
                keyboardType="numeric"
                testID="re-car-year"
              />
            </View>
          </View>

          <SectionLabel text="تفاصيل الخدمة" />
          <Text style={styles.label}>نوع الخدمة</Text>
          <View style={styles.chipsWrap}>
            {REMINDER_SERVICE_TYPES.map((s) => {
              const active = form.serviceType === s;
              return (
                <TouchableOpacity
                  key={s}
                  testID={`re-service-${s}`}
                  onPress={() => set("serviceType", s)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Field
            label="العمل المنجز"
            icon={<Wrench size={18} color={colors.textLight} />}
            value={form.workDone}
            onChangeText={(t: string) => set("workDone", t)}
            placeholder="تغيير زيت المحرك + فلتر زيت..."
            multiline
            testID="re-work-done"
          />
          <Field
            label="ملاحظات الورشة"
            icon={<FileText size={18} color={colors.textLight} />}
            value={form.workshopNotes}
            onChangeText={(t: string) => set("workshopNotes", t)}
            placeholder="أي ملاحظات داخلية للورشة..."
            multiline
            testID="re-notes"
          />

          <SectionLabel text="التواريخ والمتابعة" />
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Field
                label="تاريخ الخدمة"
                icon={<Calendar size={18} color={colors.textLight} />}
                value={form.serviceDate}
                onChangeText={(t: string) => set("serviceDate", t)}
                placeholder="2026-02-15"
                testID="re-service-date"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="مدة العودة"
                icon={<Clock size={18} color={colors.textLight} />}
                value={form.returnDuration}
                onChangeText={(t: string) => set("returnDuration", t)}
                placeholder="3 أشهر"
                testID="re-return-duration"
              />
            </View>
          </View>

          <Field
            label="تاريخ التذكير القادم"
            icon={<AlertCircle size={18} color={colors.accent} />}
            value={form.nextReminderDate}
            onChangeText={(t: string) => set("nextReminderDate", t)}
            placeholder="2026-05-15"
            testID="re-next-reminder-date"
          />

          <Text style={styles.hint}>
            ملاحظة: الصيغة المقترحة للتاريخ: YYYY-MM-DD. سيتم تخزين التذكير محلياً على الجهاز حالياً.
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity testID="re-save-btn" style={[styles.saveBtn, missing && { opacity: 0.6 }]} onPress={save}>
            <Save size={18} color="#fff" />
            <Text style={styles.saveTxt}>حفظ التذكير</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
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
          style={[styles.input, multiline && { minHeight: 72, paddingVertical: spacing.sm }]}
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
  sectionLabel: { fontSize: 12, color: colors.textMuted, fontWeight: "800", textAlign: "right", marginBottom: spacing.sm, marginTop: spacing.sm, textTransform: "uppercase", letterSpacing: 0.3 },
  label: { fontSize: 13, fontWeight: "600", color: colors.textMain, marginBottom: 6, textAlign: "right" },

  inputWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 52, borderWidth: 1, borderColor: colors.border },
  inputWrapMulti: { height: "auto", alignItems: "flex-start", paddingVertical: spacing.sm },
  input: { flex: 1, fontSize: 14, color: colors.textMain, textAlign: "right", paddingVertical: 0 },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { fontSize: 12, color: colors.textMuted, fontWeight: "700" },
  chipTxtActive: { color: "#fff" },

  hint: { fontSize: 11, color: colors.textLight, textAlign: "right", marginTop: spacing.sm, lineHeight: 18 },

  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primary, height: 52, borderRadius: radius.md },
  saveTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
