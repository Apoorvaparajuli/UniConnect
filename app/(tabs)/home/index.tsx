import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Screen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="flask-outline" size={42} color="#5B35D5" />
      </View>

      <Text style={styles.title}>STEMM Lab</Text>

      <Text style={styles.subtitle}>
        Complete STEMM challenges, track progress, use device tools, and submit
        activity results with your team.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today’s Challenge</Text>
        <Text style={styles.cardText}>
          Measure motion, record observations, and upload your team result.
        </Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Start Challenge</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F7FF",
  },
  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#171321",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B6575",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#171321",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#6B6575",
    lineHeight: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#5B35D5",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
