import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const members = ["Yacqub Ali", "Apoorva Parajuli"];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            View your team details, members and recent STEMM activity.
          </Text>
        </View>

        <Link href="/settings" asChild>
          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#5B2EEA" />
          </Pressable>
        </Link>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SL</Text>
          </View>

          <Text style={styles.teamName}>Team Newton</Text>
          <Text style={styles.teamCode}>Team Code: STEMM-204</Text>
          <Text style={styles.grade}>Year Level: Lower High School</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Team Members</Text>

        <View style={styles.card}>
          {members.map((member, index) => (
            <View key={member} style={styles.memberRow}>
              <View style={styles.memberIcon}>
                <Ionicons name="person" size={22} color="#5B2EEA" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{member}</Text>
                <Text style={styles.memberRole}>
                  {index === 0 ? "Team Lead" : "Team Member"}
                </Text>
              </View>

              <Ionicons name="checkmark-circle" size={22} color="#25B46B" />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>

        <View style={styles.card}>
          <View style={styles.activityRow}>
            <MaterialCommunityIcons
              name="parachute"
              size={24}
              color="#FF4D4F"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>
                Parachute result submitted
              </Text>
              <Text style={styles.activityText}>
                Prototype 2 improved fall time.
              </Text>
            </View>
          </View>

          <View style={styles.activityRow}>
            <MaterialCommunityIcons
              name="volume-high"
              size={24}
              color="#25B46B"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Sound activity started</Text>
              <Text style={styles.activityText}>
                Team is collecting observations.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4FF",
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#F7F4FF",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1D1828",
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
    color: "#7A7288",
    lineHeight: 21,
    maxWidth: 280,
  },
  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 0,
  },
  headerCard: {
    backgroundColor: "#5B2EEA",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#5B2EEA",
  },
  teamName: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  teamCode: {
    fontSize: 14,
    color: "#EEE8FF",
    fontWeight: "700",
    marginTop: 6,
  },
  grade: {
    fontSize: 13,
    color: "#EEE8FF",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1D1828",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7A7288",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#1D1828",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 22,
    gap: 14,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  memberIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  memberName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1D1828",
  },
  memberRole: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7A7288",
    marginTop: 3,
  },
  activityRow: {
    flexDirection: "row",
    gap: 12,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1D1828",
  },
  activityText: {
    fontSize: 13,
    color: "#7A7288",
    marginTop: 3,
  },
});
