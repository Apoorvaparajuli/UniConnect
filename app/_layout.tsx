import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

import { auth } from "../lib/firebase";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!ready) return;

    const isSignedIn = !!user;

    const isPublicRoute =
      pathname === "/welcome" ||
      pathname === "/login" ||
      pathname === "/register";

    if (!isSignedIn && !isPublicRoute && pathname !== "/welcome") {
      router.replace("/welcome");
      return;
    }

    if (isSignedIn && isPublicRoute) {
      router.replace("/home");
    }
  }, [ready, user, pathname, router]);

  if (!ready) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
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
