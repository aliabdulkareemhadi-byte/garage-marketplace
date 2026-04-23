import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, Droplet, Search, Disc, Wind, Zap, Settings, Target, Sparkles } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../theme/theme";
import type { Service } from "../data/mockData";

const iconMap: Record<string, any> = { Droplet, Search, Disc, Wind, Zap, Settings, Target, Sparkles };

export default function ServiceCard({ service, onPress }: { service: Service; onPress?: () => void }) {
  const Icon = iconMap[service.icon] || Settings;
  return (
    <TouchableOpacity
      testID={`service-card-${service.id}`}
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.iconWrap}>
        <Icon size={22} color={colors.accent} />
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.meta}>تبدأ من {service.priceFrom} ر.س · {service.duration}</Text>
      </View>
      <ChevronLeft size={18} color={colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  iconWrap: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 2 },
  name: { ...typography.h3 },
  meta: { fontSize: 12, color: colors.textMuted },
});
