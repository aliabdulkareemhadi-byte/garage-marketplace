import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TrendingUp, TrendingDown } from "lucide-react-native";
import { colors, spacing, radius } from "../theme/theme";

type Props = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: { value: string; up?: boolean };
  tint?: string; // background tint for icon
  fg?: string;   // foreground (icon color already applied by caller)
  testID?: string;
};

export default function StatCard({ icon, value, label, trend, tint = colors.accentSoft, testID }: Props) {
  return (
    <View style={styles.card} testID={testID}>
      <View style={[styles.iconWrap, { backgroundColor: tint }]}>{icon}</View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {trend ? (
        <View style={styles.trendRow}>
          {trend.up ? (
            <TrendingUp size={11} color={colors.success} />
          ) : (
            <TrendingDown size={11} color={colors.error} />
          )}
          <Text style={[styles.trendTxt, { color: trend.up ? colors.success : colors.error }]}>{trend.value}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
    minHeight: 110,
  },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginBottom: spacing.xs },
  value: { fontSize: 20, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  label: { fontSize: 11, color: colors.textMuted, textAlign: "right" },
  trendRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  trendTxt: { fontSize: 10, fontWeight: "700" },
});
