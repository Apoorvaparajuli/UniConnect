// app/(tabs)/index.tsx
import { Redirect } from "expo-router";
import React from "react";

export default function RootRedirect() {
  // Immediately redirect from "/" to "/home"
  return <Redirect href="/home" />;
}
