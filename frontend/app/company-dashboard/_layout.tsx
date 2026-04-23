import React from "react";
import { Tabs } from "expo-router";
import { User, Package, Plus } from "lucide-react-native";
import { colors } from "../../src/theme/theme";

export default function CompanyDashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { borderTopColor: colors.border, backgroundColor: colors.surface, height: 64, paddingTop: 8, paddingBottom: 10 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "الملف", tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
      <Tabs.Screen name="products" options={{ title: "المنتجات", tabBarIcon: ({ color, size }) => <Package size={size} color={color} /> }} />
      <Tabs.Screen name="product-edit" options={{ title: "إضافة", tabBarIcon: ({ color, size }) => <Plus size={size} color={color} /> }} />
    </Tabs>
  );
}
