import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const challengeData: any = {
  "1": {
    title: "Parachute Drop Challenge",
    description:
      "Design, build and test a parachute for a small toy. Teams compare baseline and prototype drops to reduce landing speed and impact force.",
    priority: "High",
    due: "20 May 2024",
    category: "Engineering + Physics",
    difficulty: "Intermediate",
    color: "#FF4D4F",
    icon: "parachute",
    tasks: [
      "Drop the toy without a parachute as the baseline test",
      "Build a parachute using paper/plastic, string and tape",
      "Record the drop using the phone camera",
      "Measure time taken to hit the ground",
      "Redesign and test up to three prototypes",
      "Submit video, results and team reflection",
    ],
  },
  "2": {
    title: "Sound Pollution Hunter",
    description:
      "Use the phone to investigate noisy areas, record observations and compare sound levels across different locations.",
    priority: "Medium",
    due: "22 May 2024",
    category: "Science + Sensors",
    difficulty: "Beginner",
    color: "#FF9F1C",
    icon: "volume-high",
    tasks: [
      "Choose a safe outdoor area",
      "Record sound observations",
      "Compare quiet and noisy locations",
      "Identify possible causes of sound pollution",
      "Submit results and reflection",
    ],
  },
  "3": {
    title: "Reaction Board Challenge",
    description:
      "Test reaction speed using a timed physical activity. Teams compare reaction times and discuss human performance factors.",
    priority: "Low",
    due: "25 May 2024",
    category: "Health + Medicine",
    difficulty: "Beginner",
    color: "#25B46B",
    icon: "gesture-tap",
    tasks: [
      "Prepare the reaction board activity",
      "Complete multiple reaction tests",
      "Record each team member's result",
      "Calculate average reaction time",
      "Submit observations and team reflection",
    ],
  },
  "4": {
    title: "Earthquake-Resistant Structure",
    description:
      "Build and improve a structure that can survive shaking. Teams test stability, redesign weak points and explain their engineering decisions.",
    priority: "Medium",
    due: "28 May 2024",
    category: "Engineering Design",
    difficulty: "Advanced",
    color: "#3B82F6",
    icon: "office-building",
    tasks: [
      "Design a small structure using available materials",
      "Test the structure using shaking motion",
      "Record the test using video",
      "Identify weak points in the design",
      "Improve the structure and test again",
      "Submit final results and reflection",
    ],
  },
};

export default function ChallengeDetailsScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const challenge = challengeData[id as string] || challengeData["1"];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Challenge Details",
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: "#F7F4FF",
      },
      headerShadowVisible: false,
      headerTintColor: "#1D1828",
      headerTitleStyle: {
        fontWeight: "800",
      },
      headerRight: () => (
        <Pressable style={styles.headerIcon}>
          <Ionicons name="share-social-outline" size={20} color="#1D1828" />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View
            style={[
              styles.heroIcon,
              { backgroundColor: `${challenge.color}18` },
            ]}
          >
            <MaterialCommunityIcons
              name={challenge.icon}
              size={48}
              color={challenge.color}
            />
          </View>

          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.description}>{challenge.description}</Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: `${challenge.color}18` },
              ]}
            >
              <Text style={[styles.badgeText, { color: challenge.color }]}>
                {challenge.priority} Priority
              </Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.secondaryBadgeText}>
                {challenge.difficulty}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Challenge Details</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#5B2EEA" />
              <View>
                <Text style={styles.infoLabel}>Due Date</Text>
                <Text style={styles.infoValue}>{challenge.due}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="layers-outline" size={20} color="#5B2EEA" />
              <View>
                <Text style={styles.infoLabel}>Category</Text>
                <Text style={styles.infoValue}>{challenge.category}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="school-outline" size={20} color="#5B2EEA" />
              <View>
                <Text style={styles.infoLabel}>Difficulty</Text>
                <Text style={styles.infoValue}>{challenge.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks</Text>

          <View style={styles.tasksCard}>
            {challenge.tasks.map((task: string, index: number) => (
              <View key={index} style={styles.taskRow}>
                <View style={styles.taskCircle}>
                  <Text style={styles.taskNumber}>{index + 1}</Text>
                </View>

                <Text style={styles.taskText}>{task}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Link href="/tasks/add" asChild>
        <Pressable style={styles.submitButton}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Submit Challenge Result</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4FF",
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  heroIcon: {
    width: 90,
    height: 90,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1D1828",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#6F687D",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 12,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F0FA",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  secondaryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5F596B",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1D1828",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    gap: 18,
  },
  infoRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#7A7288",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1D1828",
    marginTop: 2,
  },
  tasksCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    gap: 16,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  taskCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#5B2EEA",
    alignItems: "center",
    justifyContent: "center",
  },
  taskNumber: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: "#1D1828",
    fontWeight: "600",
  },
  submitButton: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 20,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#5B2EEA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
