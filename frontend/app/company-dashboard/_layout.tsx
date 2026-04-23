import React from "react";
import { Tabs } from "expo-router";
import { User, Package, ShoppingBag, Tag, Plus } from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import { colors } from "../../src/theme/theme";

function AddTabIcon() {
  return (
    <View style={styles.addWrap}>
      <Plus size={22} color="#fff" />
    </View>
  );
}

export default function CompanyDashboardLayout() {
  return (
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
      <Tabs.Screen name="products" options={{ title: "المنتجات", tabBarIcon: ({ color, size }) => <Package size={size} color={color} /> }} />
      <Tabs.Screen name="product-edit" options={{ title: "إضافة", tabBarIcon: () => <AddTabIcon /> }} />
      <Tabs.Screen name="orders" options={{ title: "الطلبات", tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} /> }} />
      <Tabs.Screen name="offers" options={{ title: "العروض", tabBarIcon: ({ color, size }) => <Tag size={size} color={color} /> }} />
      <Tabs.Screen name="offer-edit" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginTop: -14, borderWidth: 3, borderColor: colors.surface },
});
