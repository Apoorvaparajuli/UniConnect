import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="tasks" />
        <Stack.Screen name="map" />
        <Stack.Screen name="safety" />
        <Stack.Screen name="resources" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
