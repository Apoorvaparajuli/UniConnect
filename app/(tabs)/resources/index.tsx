import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const resources = [
  {
    title: "Parachute Forces",
    subtitle: "Gravity pulls down, drag pushes up.",
    icon: "parachute",
    color: "#5B2EEA",
    formula: "Weight = mass × gravity",
  },
  {
    title: "Final Velocity",
    subtitle: "Used to estimate how fast the toy falls.",
    icon: "speedometer",
    color: "#FF9F1C",
    formula: "velocity = distance ÷ time",
  },
  {
    title: "Acceleration",
    subtitle: "Measures how quickly speed changes.",
    icon: "trending-up",
    color: "#25B46B",
    formula: "acceleration = velocity ÷ time",
  },
  {
    title: "Net Force",
    subtitle: "Total force acting on the object.",
    icon: "vector-combine",
    color: "#3B82F6",
    formula: "net force = mass × acceleration",
  },
  {
    title: "Sound Pollution",
    subtitle: "Compare quiet and noisy environments.",
    icon: "volume-high",
    color: "#EF4444",
    formula: "record sound level observations",
  },
  {
    title: "Reaction Time",
    subtitle: "Measures how quickly a person responds.",
    icon: "gesture-tap",
    color: "#7C3AED",
    formula: "average = total time ÷ attempts",
  },
];

export default function ResourcesScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Resources</Text>
        <Text style={styles.subtitle}>
          STEMM formulas and notes to help complete your activities.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="school-outline" size={28} color="#5B2EEA" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Learning Support</Text>
            <Text style={styles.infoText}>
              Use these quick notes while completing challenges, recording
              results and writing reflections.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          {resources.map((item) => (
            <View key={item.title} style={styles.resourceCard}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: `${item.color}18` },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={28}
                  color={item.color}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

                <View style={styles.formulaBox}>
                  <Text style={styles.formulaText}>{item.formula}</Text>
                </View>
              </View>
            </View>
          ))}
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
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 0,
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
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1D1828",
  },
  infoText: {
    fontSize: 13,
    color: "#7A7288",
    lineHeight: 19,
    marginTop: 4,
  },
  list: {
    gap: 14,
  },
  resourceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    gap: 14,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1D1828",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#7A7288",
    lineHeight: 19,
    marginTop: 3,
  },
  formulaBox: {
    backgroundColor: "#F7F4FF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 10,
  },
  formulaText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#5B2EEA",
  },
});
