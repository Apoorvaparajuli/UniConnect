import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { seedChallenges } from "../../../lib/seedChallenges";

type Challenge = {
  id: string;
  title: string;
  description: string;
  due: string;
  priority: string;
  color: string;
  icon: string;
  status?: "To Do" | "Ongoing" | "Completed";
  category?: string;
  difficulty?: string;
  tasks?: string[];
};

type ActiveTab = "All" | "Ongoing" | "Completed";

export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("All");
  const [searchText, setSearchText] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadChallenges();
    }, []),
  );
  const loadChallenges = async () => {
    try {
      setLoading(true);

      await seedChallenges();

      const q = query(collection(db, "challenges"), orderBy("id", "asc"));
      const snapshot = await getDocs(q);

      const loadedChallenges = snapshot.docs.map((document) => ({
        ...(document.data() as Challenge),
        id: document.id,
      }));

      setChallenges(loadedChallenges);
    } catch (error) {
      console.log("Error loading challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const matchesSearch =
        challenge.title.toLowerCase().includes(searchText.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchText.toLowerCase());

      const isCompleted = challenge.status === "Completed";

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Completed" && isCompleted) ||
        (activeTab === "Ongoing" && !isCompleted);

      return matchesSearch && matchesTab;
    });
  }, [challenges, activeTab, searchText]);

  const ongoingCount = challenges.filter(
    (challenge) => challenge.status !== "Completed",
  ).length;

  const completedCount = challenges.filter(
    (challenge) => challenge.status === "Completed",
  ).length;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges</Text>
        <Text style={styles.headerSubtitle}>
          Track and complete your STEMM activities
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#8C8796" />
            <TextInput
              placeholder="Search challenges..."
              placeholderTextColor="#9A94A6"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === "All" && styles.activeTab]}
            onPress={() => setActiveTab("All")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "All" && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === "Ongoing" && styles.activeTab]}
            onPress={() => setActiveTab("Ongoing")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Ongoing" && styles.activeTabText,
              ]}
            >
              Ongoing {ongoingCount}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === "Completed" && styles.activeTab]}
            onPress={() => setActiveTab("Completed")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Completed" && styles.activeTabText,
              ]}
            >
              Completed {completedCount}
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#5B2EEA" />
            <Text style={styles.loadingText}>Loading challenges...</Text>
          </View>
        ) : filteredChallenges.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="search-outline" size={26} color="#9A94A6" />
            <Text style={styles.emptyTitle}>No challenges found</Text>
            <Text style={styles.emptyText}>
              Try another tab or search term.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredChallenges.map((challenge) => {
              const isCompleted = challenge.status === "Completed";

              return (
                <Pressable
                  key={challenge.id}
                  style={styles.card}
                  onPress={() => router.push(`/tasks/${challenge.id}`)}
                >
                  <View style={styles.iconWrap}>
                    <MaterialCommunityIcons
                      name={challenge.icon as any}
                      size={34}
                      color={challenge.color}
                    />
                  </View>

                  <View style={styles.cardMiddle}>
                    <View style={styles.titleRow}>
                      <Text style={styles.cardTitle}>{challenge.title}</Text>

                      <View
                        style={[
                          styles.priorityBadge,
                          {
                            backgroundColor: isCompleted
                              ? "#E9F8EF"
                              : `${challenge.color}18`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityText,
                            {
                              color: isCompleted ? "#1F8F4D" : challenge.color,
                            },
                          ]}
                        >
                          {isCompleted ? "Completed" : challenge.priority}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.description}>
                      {challenge.description}
                    </Text>

                    <View style={styles.dueRow}>
                      <Ionicons
                        name={
                          isCompleted
                            ? "checkmark-circle-outline"
                            : "calendar-outline"
                        }
                        size={14}
                        color={isCompleted ? "#1F8F4D" : "#7A7288"}
                      />
                      <Text
                        style={[
                          styles.dueText,
                          isCompleted && styles.completedDueText,
                        ]}
                      >
                        {isCompleted ? "Completed" : challenge.due}
                      </Text>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#9A94A6" />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Link href="/tasks/add" asChild>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Submit Result</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4FF",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 120,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  searchBox: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEEAFD",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1D1828",
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEEAFD",
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 5,
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEAFD",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#5B2EEA",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6F687D",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  loadingBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7A7288",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "900",
    color: "#1D1828",
  },
  emptyText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#7A7288",
  },
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: "#F4F1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardMiddle: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#1D1828",
  },
  description: {
    fontSize: 13,
    color: "#7A7288",
    lineHeight: 18,
    marginTop: 5,
  },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 9,
  },
  dueText: {
    fontSize: 12,
    color: "#7A7288",
    fontWeight: "600",
  },
  completedDueText: {
    color: "#1F8F4D",
    fontWeight: "800",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "800",
  },
  addButton: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 20,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#5B2EEA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1D1828",
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#7A7288",
  },
});
