import React from "react";
import { Stack } from "expo-router";
import { WalletProvider } from "../../src/context/WalletContext";
import { colors } from "../../src/theme/theme";

export default function AdminLayout() {
  return (
    <WalletProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </WalletProvider>
  );
}
