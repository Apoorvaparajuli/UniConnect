// File: app/(tabs)/home/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

export default function HomeStackLayout() {
  const isDark = useColorScheme() === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? "#000" : "#FFF" },
        headerTintColor: isDark ? "#FFF" : "#000",
        headerTitleAlign: "center",
      }}
    >
      {/* Home feed */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
