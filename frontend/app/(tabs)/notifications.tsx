import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Package, Calendar, Tag, Settings as SettingsIcon } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { notifications as seed, type NotificationItem } from "../../src/data/mockData";

const typeIcon = {
  booking: Calendar,
  order: Package,
  promo: Tag,
  system: SettingsIcon,
};

const typeColor = {
  booking: { bg: "#E6F0FF", fg: "#0066FF" },
  order: { bg: "#D1FAE5", fg: "#10B981" },
  promo: { bg: "#FEF3C7", fg: "#F59E0B" },
  system: { bg: "#F3F4F6", fg: "#4B5563" },
};

export default function Notifications() {
  const [list, setList] = useState<NotificationItem[]>(seed);
  const unread = list.filter((n) => !n.read).length;

  const markAll = () => setList((l) => l.map((n) => ({ ...n, read: true })));
  const toggle = (id: string) => setList((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>الإشعارات</Text>
          <Text style={styles.sub}>{unread > 0 ? `لديك ${unread} إشعارات جديدة` : "لا يوجد جديد"}</Text>
        </View>
        {unread > 0 && (
          <TouchableOpacity testID="mark-all-read" onPress={markAll}>
            <Text style={styles.markAll}>تحديد الكل كمقروء</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {list.length === 0 ? (
          <View style={styles.empty}>
            <Bell size={40} color={colors.textLight} />
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textMain, marginTop: spacing.md }}>لا توجد إشعارات</Text>
          </View>
        ) : (
          list.map((n) => {
            const Icon = typeIcon[n.type];
            const c = typeColor[n.type];
            return (
              <TouchableOpacity
                key={n.id}
                testID={`notif-${n.id}`}
                activeOpacity={0.7}
                onPress={() => toggle(n.id)}
                style={[styles.item, !n.read && styles.itemUnread]}
              >
                <View style={[styles.iconWrap, { backgroundColor: c.bg }]}>
                  <Icon size={20} color={c.fg} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={styles.rowHead}>
                    <Text style={styles.itemTitle}>{n.title}</Text>
                    {!n.read && <View style={styles.dot} />}
                  </View>
                  <Text style={styles.itemBody} numberOfLines={2}>{n.body}</Text>
                  <Text style={styles.time}>{n.time}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", padding: spacing.lg, gap: spacing.md },
  title: { ...typography.h1, textAlign: "right" },
  sub: { fontSize: 13, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  markAll: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  item: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  itemUnread: { backgroundColor: "#F9FBFF", borderColor: "#BFDBFE" },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  rowHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  itemTitle: { fontSize: 14, fontWeight: "700", color: colors.textMain, flex: 1, textAlign: "right" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginStart: spacing.sm },
  itemBody: { fontSize: 12, color: colors.textMuted, lineHeight: 18, textAlign: "right" },
  time: { fontSize: 11, color: colors.textLight, textAlign: "right" },
  empty: { alignItems: "center", paddingVertical: spacing.xxl * 2 },
});
