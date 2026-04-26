import React from "react";
import { View, TextInput, StyleSheet, ViewStyle } from "react-native";
import { Search } from "lucide-react-native";
import { colors, spacing, radius } from "../theme/theme";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  testID?: string;
  containerStyle?: ViewStyle;
};

/**
 * Shared search input used across dashboard screens.
 * Styles match the previously inlined `searchWrap` / `searchInput`
 * definitions in company-dashboard/products.tsx and
 * workshop-dashboard/services.tsx.
 */
export default function SearchBar({
  value,
  onChangeText,
  placeholder,
  testID,
  containerStyle,
}: Props) {
  return (
    <View style={[styles.wrap, containerStyle]}>
      <Search size={16} color={colors.textLight} />
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.textMain,
    textAlign: "right",
    paddingVertical: 0,
  },
});
