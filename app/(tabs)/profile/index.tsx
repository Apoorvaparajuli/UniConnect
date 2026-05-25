import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../../../lib/firebase";

type Challenge = {
  id: string;
  status?: string;
};

type Submission = {
  id: string;
  challengeTitle?: string;
  observations?: string;
};

type UserData = {
  firstName?: string;
  teamName?: string;
  teamCode?: string;
  yearLevel?: string;
  members?: string[];
};

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState<UserData | null>(null);

  const [challengeCount, setChallengeCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) return;

      // USER
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data() as UserData);
      }

      // CHALLENGES
      const challengeSnapshot = await getDocs(
        query(collection(db, "challenges"), orderBy("id", "asc")),
      );

      const challenges = challengeSnapshot.docs.map(
        (docSnap) =>
          ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Challenge, "id">),
          }) as Challenge,
      );

      const completed = challenges.filter(
        (challenge) => challenge.status === "Completed",
      ).length;

      setChallengeCount(challenges.length);
      setCompletedCount(completed);

      // SUBMISSIONS
      const submissionsSnapshot = await getDocs(
        query(
          collection(db, "submissions"),
          where("teamName", "==", userSnap.data()?.teamName || ""),
          orderBy("createdAt", "desc"),
          limit(3),
        ),
      );

      const submissions = submissionsSnapshot.docs.map(
        (docSnap) =>
          ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Submission, "id">),
          }) as Submission,
      );

      setRecentSubmissions(submissions);
    } catch (error) {
      console.log("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const progress = useMemo(() => {
    if (challengeCount === 0) return 0;

    return Math.round((completedCount / challengeCount) * 100);
  }, [challengeCount, completedCount]);

  const initials = useMemo(() => {
    if (!userData?.teamName) return "ST";

    return userData.teamName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [userData]);

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
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#5B2EEA" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            <View style={styles.headerCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>

              <Text style={styles.teamName}>
                {userData?.teamName || "No Team"}
              </Text>

              <Text style={styles.teamCode}>
                Team Code: {userData?.teamCode || "N/A"}
              </Text>

              <Text style={styles.grade}>
                {userData?.yearLevel || "No year level"}
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{challengeCount}</Text>
                <Text style={styles.statLabel}>Challenges</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>{completedCount}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>{progress}%</Text>
                <Text style={styles.statLabel}>Progress</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Team Members</Text>

            <View style={styles.card}>
              {(userData?.members || []).length === 0 ? (
                <Text style={styles.emptyText}>No team members found.</Text>
              ) : (
                userData?.members?.map((member, index) => (
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

                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#25B46B"
                    />
                  </View>
                ))
              )}
            </View>

            <Text style={styles.sectionTitle}>Recent Activity</Text>

            <View style={styles.card}>
              {recentSubmissions.length === 0 ? (
                <Text style={styles.emptyText}>No recent activity yet.</Text>
              ) : (
                recentSubmissions.map((submission) => (
                  <View key={submission.id} style={styles.activityRow}>
                    <MaterialCommunityIcons
                      name="flask-outline"
                      size={24}
                      color="#5B2EEA"
                    />

                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityTitle}>
                        {submission.challengeTitle || "Challenge submitted"}
                      </Text>

                      <Text style={styles.activityText}>
                        {submission.observations ||
                          "Submission completed successfully."}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
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
    paddingBottom: 30,
  },

  loadingBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },

  loadingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7A7288",
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

  emptyText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7A7288",
  },
});
