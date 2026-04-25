import React from "react";
import { Tabs } from "expo-router";
import { Home, Wrench, ShoppingCart, Bell, User } from "lucide-react-native";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../src/theme/theme";
import { useCart } from "../../src/context/CartContext";

function CartIcon({ color, size }: { color: string; size: number }) {
  const { count } = useCart();
  return (
    <View>
      <ShoppingCart size={size} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{count}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "الرئيسية", tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="services"
        options={{ title: "الخدمات", tabBarIcon: ({ color, size }) => <Wrench size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="cart"
        options={{ title: "السلة", tabBarIcon: ({ color, size }) => <CartIcon color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ title: "الإشعارات", tabBarIcon: ({ color, size }) => <Bell size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "حسابي", tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -6,
    insetInlineEnd: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
});
