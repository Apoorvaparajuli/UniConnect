import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const challenges = [
  {
    title: "Bridge Design Challenge",
    due: "Due 20 May 2024, 11:59 PM",
    priority: "High",
    color: "#FF4D4F",
  },
  {
    title: "Plant Growth Investigation",
    due: "Due 22 May 2024, 9:00 AM",
    priority: "Medium",
    color: "#FF9F1C",
  },
  {
    title: "Water Quality Test",
    due: "Due 25 May 2024, 5:00 PM",
    priority: "Low",
    color: "#25B46B",
  },
];

function GridButton({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.gridCard}>
        {icon}
        <Text style={styles.gridText}>{title}</Text>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.smallText}>Welcome back,</Text>
          <Text style={styles.name}>Yacqub Ali 👋</Text>
          <Text style={styles.caption}>
            Complete STEMM challenges, explore resources, and track your team
            progress.
          </Text>
        </View>

        <View style={styles.notificationCircle}>
          <Ionicons name="notifications-outline" size={23} color="#fff" />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
          <Link href="/tasks" style={styles.viewAll}>
            View All
          </Link>
        </View>

        {challenges.map((item) => (
          <View key={item.title} style={styles.challengeRow}>
            <View style={[styles.iconBox, { backgroundColor: item.color }]}>
              <MaterialCommunityIcons
                name="flask-outline"
                size={22}
                color="#fff"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.challengeTitle}>{item.title}</Text>
              <Text style={styles.challengeDue}>{item.due}</Text>
            </View>

            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: `${item.color}18` },
              ]}
            >
              <Text style={[styles.priorityText, { color: item.color }]}>
                {item.priority}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        <GridButton
          href="/tasks"
          title="Challenges"
          icon={
            <MaterialCommunityIcons name="flask" size={38} color="#6C3DEB" />
          }
        />

        <GridButton
          href="/map"
          title="Challenge Map"
          icon={<Ionicons name="location" size={38} color="#35B86B" />}
        />

        <GridButton
          href="/safety"
          title="Activity Tools"
          icon={<Ionicons name="shield-checkmark" size={38} color="#FF9F1C" />}
        />

        <GridButton
          href="/resources"
          title="Resources"
          icon={<Ionicons name="book" size={38} color="#3B82F6" />}
        />

        <GridButton
          href="/profile"
          title="Team"
          icon={<Ionicons name="people" size={38} color="#7C3AED" />}
        />

        <GridButton
          href="/settings"
          title="Settings"
          icon={<Ionicons name="settings" size={38} color="#6B7280" />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4FF",
  },
  content: {
    paddingBottom: 110,
  },
  header: {
    minHeight: 215,
    backgroundColor: "#5B2EEA",
    paddingTop: 68,
    paddingHorizontal: 26,
    paddingBottom: 44,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  smallText: {
    color: "#EEE8FF",
    fontSize: 15,
    marginBottom: 6,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "800",
  },
  caption: {
    color: "#EEE8FF",
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
  },
  notificationCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 26,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#181024",
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5B2EEA",
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDF8",
    gap: 14,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1D1828",
  },
  challengeDue: {
    fontSize: 13,
    color: "#7A7288",
    marginTop: 4,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 22,
    gap: 14,
  },
  gridCard: {
    width: "47.5%",
    minHeight: 118,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  gridText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#211A30",
    textAlign: "center",
  },
});
