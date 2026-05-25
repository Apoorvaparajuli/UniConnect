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

import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

// Safe AdMob import — won't crash Expo Go
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;
try {
  const admob = require("react-native-google-mobile-ads");
  BannerAd = admob.BannerAd;
  BannerAdSize = admob.BannerAdSize;
  TestIds = admob.TestIds;
} catch (e) {
  console.log("AdMob not available in Expo Go");
}

type Challenge = {
  id: string;
  title: string;
  due: string;
  priority: string;
  color: string;
  icon?: string;
  status?: "To Do" | "Ongoing" | "Completed";
};

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
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;
      if (currentUser?.displayName) {
        setUserName(currentUser.displayName);
      }

      const q = query(
        collection(db, "challenges"),
        orderBy("id", "asc"),
        limit(20),
      );

      const snapshot = await getDocs(q);
      const loadedChallenges = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Challenge, "id">),
      }));

      setChallenges(loadedChallenges);
    } catch (error) {
      console.log("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const visibleChallenges = useMemo(
    () => challenges.filter((c) => c.status !== "Completed"),
    [challenges],
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.smallText}>Welcome back,</Text>
          <Text style={styles.name}>{userName} 👋</Text>
          <Text style={styles.caption}>
            Complete STEMM challenges, explore resources, and track your team
            progress.
          </Text>
        </View>
      </View>

      {/* AdMob Banner - requires native build, safely skipped in Expo Go */}
      {BannerAd && BannerAdSize && TestIds && (
        <View style={styles.adContainer}>
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdLoaded={() => console.log("AdMob banner loaded")}
            onAdFailedToLoad={(error: any) =>
              console.log("AdMob banner failed:", error)
            }
          />
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
          <Link href="/tasks" style={styles.viewAll}>
            View All
          </Link>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#5B2EEA" />
            <Text style={styles.loadingText}>Loading challenges...</Text>
          </View>
        ) : visibleChallenges.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="document-text-outline" size={28} color="#9A94A6" />
            <Text style={styles.emptyTitle}>No challenges yet</Text>
            <Text style={styles.emptyText}>
              Challenges from Firebase will appear here.
            </Text>
          </View>
        ) : (
          visibleChallenges.map((item) => (
            <Link key={item.id} href={`/tasks/${item.id}`} asChild>
              <Pressable style={styles.challengeRow}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: item.color || "#5B2EEA" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={(item.icon as any) || "flask-outline"}
                    size={22}
                    color="#FFFFFF"
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
                  <Text
                    style={[
                      styles.priorityText,
                      { color: item.color || "#5B2EEA" },
                    ]}
                  >
                    {item.priority}
                  </Text>
                </View>
              </Pressable>
            </Link>
          ))
        )}
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
  screen: { flex: 1, backgroundColor: "#F7F4FF" },
  content: { paddingBottom: 110 },
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
  smallText: { color: "#EEE8FF", fontSize: 15, marginBottom: 6 },
  name: { color: "#FFFFFF", fontSize: 31, fontWeight: "800" },
  caption: { color: "#EEE8FF", fontSize: 15, marginTop: 8, lineHeight: 22 },
  adContainer: {
    alignItems: "center",
    marginTop: -20,
    marginBottom: 6,
    zIndex: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 10,
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
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#181024" },
  viewAll: { fontSize: 14, fontWeight: "700", color: "#5B2EEA" },
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
  challengeTitle: { fontSize: 16, fontWeight: "800", color: "#1D1828" },
  challengeDue: { fontSize: 13, color: "#7A7288", marginTop: 4 },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  priorityText: { fontSize: 11, fontWeight: "800" },
  loadingBox: { paddingVertical: 26, alignItems: "center", gap: 10 },
  loadingText: { fontSize: 13, fontWeight: "700", color: "#7A7288" },
  emptyBox: { paddingVertical: 26, alignItems: "center" },
  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "800",
    color: "#1D1828",
  },
  emptyText: {
    marginTop: 4,
    fontSize: 13,
    color: "#7A7288",
    textAlign: "center",
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
