import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Settings",
      headerBackTitle: "Back",
      headerStyle: { backgroundColor: "#F7F4FF" },
      headerShadowVisible: false,
      headerTintColor: "#1D1828",
      headerTitleStyle: { fontWeight: "800" },
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <SettingToggle
            icon="notifications-outline"
            title="Notifications"
            subtitle="Challenge reminders and team updates"
            value={notifications}
            onValueChange={setNotifications}
          />

          <SettingToggle
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Use dark appearance"
            value={darkMode}
            onValueChange={setDarkMode}
          />

          <SettingToggle
            icon="location-outline"
            title="Location Access"
            subtitle="Used for GPS-based STEMM challenges"
            value={locationAccess}
            onValueChange={setLocationAccess}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Link href="/settings/edit" asChild>
            <SettingButton
              icon="person-outline"
              title="Edit Profile"
              subtitle="Update team name, members and year level"
            />
          </Link>

          <Link href="/settings/stemm-lab" asChild>
            <SettingButton
              icon="information-circle-outline"
              title="About STEMM Lab"
              subtitle="Real-world STEMM learning activities"
            />
          </Link>

          <SettingButton
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={() =>
              Alert.alert("Logout", "Firebase logout will be connected later.")
            }
          />

          <SettingButton
            icon="trash-outline"
            title="Delete Account"
            subtitle="Remove account and team data"
            danger
            onPress={() =>
              Alert.alert(
                "Delete Account",
                "Account deletion will be connected to Firebase later.",
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SettingToggle({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: any;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={22} color="#5B2EEA" />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#DDD3FF", true: "#B8A8FF" }}
        thumbColor={value ? "#5B2EEA" : "#FFFFFF"}
      />
    </View>
  );
}

function SettingButton({
  icon,
  title,
  subtitle,
  onPress,
  danger,
}: {
  icon: any;
  title: string;
  subtitle: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.rowIcon, danger && styles.dangerIcon]}>
        <Ionicons
          name={icon}
          size={22}
          color={danger ? "#FF4D4F" : "#5B2EEA"}
        />
      </View>

      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#8C8796" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4FF",
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1D1828",
    marginBottom: 10,
  },
  row: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1EEFA",
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerIcon: {
    backgroundColor: "#FFEAEA",
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1D1828",
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#7A7288",
    marginTop: 3,
  },
  dangerText: {
    color: "#FF4D4F",
  },
});
