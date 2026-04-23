import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors, spacing, radius } from "../theme/theme";

export type FilterTab<T extends string> = {
  value: T;
  count?: number;
};

type Props<T extends string> = {
  tabs: readonly T[] | FilterTab<T>[];
  active: T;
  onChange: (value: T) => void;
  /** When true, tabs are expected to be provided as FilterTab<T> with counts. */
  showCounts?: boolean;
  testIDPrefix?: string;
  containerStyle?: ViewStyle;
};

/**
 * Shared horizontal pill-style filter tabs used across dashboard screens.
 * Supports both the plain variant (e.g. company/workshop offers) and the
 * variant with numeric count badges (e.g. orders, bookings).
 */
export default function FilterTabs<T extends string>({
  tabs,
  active,
  onChange,
  showCounts = false,
  testIDPrefix = "filter",
  containerStyle,
}: Props<T>) {
  const normalized: FilterTab<T>[] = (tabs as unknown[]).map((t) =>
    typeof t === "string" ? ({ value: t as T } as FilterTab<T>) : (t as FilterTab<T>)
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.chips, containerStyle]}
    >
      {normalized.map(({ value, count }) => {
        const isActive = value === active;
        const showBadge = showCounts && typeof count === "number" && count > 0;
        return (
          <TouchableOpacity
            key={value}
            testID={`${testIDPrefix}-${value}`}
            onPress={() => onChange(value)}
            style={[
              showCounts ? styles.chipRow : styles.chip,
              isActive && styles.chipActive,
            ]}
          >
            <Text style={[styles.chipTxt, isActive && styles.chipTxtActive]}>
              {value}
            </Text>
            {showBadge && (
              <View
                style={[
                  styles.chipBadge,
                  isActive && { backgroundColor: "rgba(255,255,255,0.25)" },
                ]}
              >
                <Text
                  style={[styles.chipBadgeTxt, isActive && { color: "#fff" }]}
                >
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chips: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: "row",
    paddingBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginEnd: spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginEnd: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { fontSize: 12, color: colors.textMuted, fontWeight: "700" },
  chipTxtActive: { color: "#fff" },
  chipBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  chipBadgeTxt: { fontSize: 10, fontWeight: "800", color: colors.accent },
});
