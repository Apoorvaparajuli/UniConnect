import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const challenges = [
  {
    id: "1",
    title: "Parachute Drop Challenge",
    description: "Design and test a parachute to slow a toy's fall.",
    due: "Due 20 May 2024",
    priority: "High",
    color: "#FF4D4F",
    icon: "parachute",
  },
  {
    id: "2",
    title: "Sound Pollution Hunter",
    description: "Measure and record noisy areas using phone sensors.",
    due: "Due 22 May 2024",
    priority: "Medium",
    color: "#FF9F1C",
    icon: "volume-high",
  },
  {
    id: "3",
    title: "Reaction Board Challenge",
    description: "Test reaction speed and compare team results.",
    due: "Due 25 May 2024",
    priority: "Low",
    color: "#25B46B",
    icon: "gesture-tap",
  },
  {
    id: "4",
    title: "Earthquake-Resistant Structure",
    description: "Build and improve a structure that survives shaking.",
    due: "Due 28 May 2024",
    priority: "Medium",
    color: "#3B82F6",
    icon: "office-building",
  },
];

export default function ChallengesScreen() {
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
            />
          </View>

          <Pressable style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#5B2EEA" />
          </Pressable>
        </View>

        <View style={styles.tabs}>
          <Pressable style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>All</Text>
          </Pressable>
          <Pressable style={styles.tab}>
            <Text style={styles.tabText}>Ongoing</Text>
          </Pressable>
          <Pressable style={styles.tab}>
            <Text style={styles.tabText}>Completed</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {challenges.map((challenge) => (
            <Link key={challenge.id} href={`/tasks/${challenge.id}`} asChild>
              <Pressable style={styles.card}>
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
                        { backgroundColor: `${challenge.color}18` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: challenge.color },
                        ]}
                      >
                        {challenge.priority}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.description}>
                    {challenge.description}
                  </Text>

                  <View style={styles.dueRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#7A7288"
                    />
                    <Text style={styles.dueText}>{challenge.due}</Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9A94A6" />
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>

      <Link href="/tasks/add" asChild>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Challenge Result</Text>
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
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
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
