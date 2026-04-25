import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronRight, Car, Calendar, Clock, CheckCircle2, MapPin } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { services, workshops } from "../../src/data/mockData";

const dates = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  return { label: days[d.getDay()], day: d.getDate(), key: d.toISOString().slice(0, 10) };
});

const times = ["09:00 ص", "10:30 ص", "12:00 م", "01:30 م", "03:00 م", "04:30 م", "06:00 م"];

export default function Booking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const service = services.find((s) => s.id === id);
  const workshop = workshops.find((w) => w.id === id) || workshops[0];

  const [vehicle, setVehicle] = useState("car1");
  const [date, setDate] = useState(dates[0].key);
  const [time, setTime] = useState("10:30 ص");
  const [step] = useState(1);

  const vehicles = [
    { id: "car1", name: "تويوتا كامري 2022", plate: "أ ب ج - 1234" },
    { id: "car2", name: "هيونداي سوناتا 2020", plate: "د هـ و - 5678" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity testID="bk-back" onPress={() => router.back()} style={styles.backBtn}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.title}>حجز موعد</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}>
        <View style={styles.progress}>
          {[1, 2, 3].map((n) => (
            <React.Fragment key={n}>
              <View style={[styles.dot, step >= n && styles.dotActive]}>
                <Text style={[styles.dotTxt, step >= n && { color: "#fff" }]}>{n}</Text>
              </View>
              {n < 3 && <View style={[styles.line, step > n && styles.lineActive]} />}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.stepsLabels}>
          <Text style={styles.stepLabel}>المركبة</Text>
          <Text style={styles.stepLabel}>الموعد</Text>
          <Text style={styles.stepLabel}>التأكيد</Text>
        </View>

        {/* Service summary */}
        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <CheckCircle2 size={22} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>{service?.name || "خدمة مختارة"}</Text>
            <Text style={styles.summarySub}>{workshop.name} · من {service?.priceFrom || 180} ر.س</Text>
          </View>
        </View>

        <SectionTitle icon={<Car size={18} color={colors.textMain} />} label="اختر المركبة" />
        <View style={{ gap: spacing.md }}>
          {vehicles.map((v) => (
            <TouchableOpacity
              key={v.id}
              testID={`vehicle-${v.id}`}
              onPress={() => setVehicle(v.id)}
              style={[styles.vBox, vehicle === v.id && styles.vBoxActive]}
            >
              <View style={[styles.vIcon, vehicle === v.id && { backgroundColor: colors.accent }]}>
                <Car size={18} color={vehicle === v.id ? "#fff" : colors.textMain} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vName}>{v.name}</Text>
                <Text style={styles.vPlate}>{v.plate}</Text>
              </View>
              <View style={[styles.radio, vehicle === v.id && styles.radioOn]}>
                {vehicle === v.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addVehicle}>
            <Text style={styles.addVehicleTxt}>+ إضافة مركبة جديدة</Text>
          </TouchableOpacity>
        </View>

        <SectionTitle icon={<Calendar size={18} color={colors.textMain} />} label="اختر التاريخ" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: 4 }}>
          {dates.map((d) => (
            <TouchableOpacity
              key={d.key}
              testID={`date-${d.key}`}
              onPress={() => setDate(d.key)}
              style={[styles.dateBox, date === d.key && styles.dateBoxActive]}
            >
              <Text style={[styles.dayName, date === d.key && { color: "#fff" }]}>{d.label}</Text>
              <Text style={[styles.dayNum, date === d.key && { color: "#fff" }]}>{d.day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionTitle icon={<Clock size={18} color={colors.textMain} />} label="اختر الوقت" />
        <View style={styles.timeGrid}>
          {times.map((t) => (
            <TouchableOpacity
              key={t}
              testID={`time-${t}`}
              onPress={() => setTime(t)}
              style={[styles.timeBox, time === t && styles.timeBoxActive]}
            >
              <Text style={[styles.timeTxt, time === t && { color: "#fff" }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionTitle icon={<MapPin size={18} color={colors.textMain} />} label="الموقع" />
        <View style={styles.locBox}>
          <MapPin size={20} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.locName}>{workshop.name}</Text>
            <Text style={styles.locAddr}>{workshop.area} · {workshop.city}</Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.footerLabel}>السعر التقديري</Text>
          <Text style={styles.footerPrice}>{service?.priceFrom || 180} ر.س</Text>
        </View>
        <TouchableOpacity
          testID="confirm-booking-btn"
          style={styles.primaryBtn}
          onPress={() => {
            alert(`تم تأكيد الحجز\n${date} - ${time}`);
            router.replace("/(tabs)/home");
          }}
        >
          <Text style={styles.primaryTxt}>تأكيد الحجز</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function SectionTitle({ icon, label }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md }}>
      {icon}
      <Text style={styles.stTitle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h2 },
  progress: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceAlt, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  dotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotTxt: { fontSize: 13, fontWeight: "800", color: colors.textMuted },
  line: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: 4 },
  lineActive: { backgroundColor: colors.primary },
  stepsLabels: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.xs, marginBottom: spacing.lg },
  stepLabel: { fontSize: 12, color: colors.textMuted, fontWeight: "600", flex: 1, textAlign: "center" },
  summary: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.accentSoft, padding: spacing.md, borderRadius: radius.lg },
  summaryIcon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  summaryTitle: { fontSize: 15, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  summarySub: { fontSize: 12, color: colors.textMuted, marginTop: 2, textAlign: "right" },
  stTitle: { ...typography.h3 },
  vBox: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  vBoxActive: { borderColor: colors.primary, backgroundColor: "#F9FBFF" },
  vIcon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  vName: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  vPlate: { fontSize: 12, color: colors.textMuted, marginTop: 2, textAlign: "right" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  radioOn: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  addVehicle: { borderWidth: 1.5, borderColor: colors.border, borderStyle: "dashed", borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: "center" },
  addVehicleTxt: { color: colors.accent, fontSize: 13, fontWeight: "700" },
  dateBox: { width: 64, paddingVertical: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: "center", backgroundColor: colors.surface, marginEnd: spacing.sm },
  dateBoxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayName: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  dayNum: { fontSize: 18, fontWeight: "800", color: colors.textMain, marginTop: 4 },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  timeBox: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  timeBoxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeTxt: { fontSize: 13, color: colors.textMain, fontWeight: "600" },
  locBox: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  locName: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  locAddr: { fontSize: 12, color: colors.textMuted, marginTop: 2, textAlign: "right" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg },
  footerLabel: { fontSize: 11, color: colors.textMuted, textAlign: "right" },
  footerPrice: { fontSize: 18, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  primaryBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center", minWidth: 150 },
  primaryTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
