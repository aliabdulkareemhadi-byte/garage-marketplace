import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, radius } from "../theme/theme";

type Props = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
};

export default function EmptyState({ icon, title, description, actionLabel, onAction, testID }: Props) {
  return (
    <View style={styles.wrap} testID={testID}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.btn} onPress={onAction} testID={`${testID}-action`}>
          <Text style={styles.btnTxt}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingVertical: spacing.xxl * 2, paddingHorizontal: spacing.xl, gap: spacing.sm },
  iconWrap: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  title: { fontSize: 17, fontWeight: "800", color: colors.textMain, textAlign: "center" },
  desc: { fontSize: 13, color: colors.textMuted, textAlign: "center", lineHeight: 20, maxWidth: 280, marginTop: 2 },
  btn: { marginTop: spacing.lg, backgroundColor: colors.primary, paddingHorizontal: spacing.xl, height: 44, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  btnTxt: { color: "#fff", fontSize: 13, fontWeight: "700" },
});
