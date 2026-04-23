import React from "react";
import { Tabs } from "expo-router";
import { User, Wrench, Plus, Calendar, Tag } from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import { colors } from "../../src/theme/theme";
import { RemindersProvider } from "../../src/context/RemindersContext";
import { WalletProvider } from "../../src/context/WalletContext";

function AddTabIcon() {
  return (
    <View style={styles.addWrap}>
      <Plus size={22} color="#fff" />
    </View>
  );
}

export default function WorkshopDashboardLayout() {
  return (
    <WalletProvider>
      <RemindersProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textLight,
            tabBarStyle: { borderTopColor: colors.border, backgroundColor: colors.surface, height: 66, paddingTop: 8, paddingBottom: 10 },
            tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
          }}
        >
          <Tabs.Screen name="index" options={{ title: "الملف", tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
          <Tabs.Screen name="services" options={{ title: "الخدمات", tabBarIcon: ({ color, size }) => <Wrench size={size} color={color} /> }} />
          <Tabs.Screen name="service-edit" options={{ title: "إضافة", tabBarIcon: () => <AddTabIcon /> }} />
          <Tabs.Screen name="bookings" options={{ title: "الحجوزات", tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} /> }} />
          <Tabs.Screen name="offers" options={{ title: "العروض", tabBarIcon: ({ color, size }) => <Tag size={size} color={color} /> }} />
          {/* Customer Maintenance Reminders feature — hidden from tab bar, reachable via profile entry point */}
          <Tabs.Screen name="reminders" options={{ href: null }} />
          <Tabs.Screen name="reminder-edit" options={{ href: null }} />
          {/* Wallet feature — hidden from tab bar, reachable via profile entry point */}
          <Tabs.Screen name="wallet" options={{ href: null }} />
        </Tabs>
      </RemindersProvider>
    </WalletProvider>
  );
}

const styles = StyleSheet.create({
  addWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginTop: -14, borderWidth: 3, borderColor: colors.surface },
});
