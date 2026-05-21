import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const challengeOptions = [
  "Parachute Drop Challenge",
  "Sound Pollution Hunter",
  "Hand Fan Challenge",
  "Earthquake-Resistant Structure",
  "Human Performance Lab",
  "Reaction Board Challenge",
  "Breathing Pace Trainer",
];

export default function AddChallengeResultScreen() {
  const navigation = useNavigation();

  const [selectedChallenge, setSelectedChallenge] = useState(
    "Parachute Drop Challenge",
  );
  const [resultSummary, setResultSummary] = useState("");
  const [observations, setObservations] = useState("");
  const [teamName, setTeamName] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Submit Result",
      headerStyle: {
        backgroundColor: "#F7F4FF",
      },
      headerShadowVisible: false,
      headerTintColor: "#1D1828",
      headerTitleStyle: {
        fontWeight: "800",
      },
    });
  }, [navigation]);

  const handleSubmit = () => {
    if (!selectedChallenge || !resultSummary || !observations) {
      Alert.alert("Missing fields", "Please fill in the main result details.");
      return;
    }

    Alert.alert("Result saved", "Your STEMM challenge result was saved.");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="flask-plus" size={42} color="#5B2EEA" />
        </View>

        <Text style={styles.title}>Submit Challenge Result</Text>
        <Text style={styles.subtitle}>
          Select a STEMM challenge and record your team&apos;s results,
          observations and evidence.
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Choose Challenge</Text>

        <View style={styles.challengePicker}>
          {challengeOptions.map((challenge) => (
            <Pressable
              key={challenge}
              onPress={() => setSelectedChallenge(challenge)}
              style={[
                styles.challengeOption,
                selectedChallenge === challenge && styles.challengeOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.challengeOptionText,
                  selectedChallenge === challenge &&
                    styles.challengeOptionTextActive,
                ]}
              >
                {challenge}
              </Text>

              {selectedChallenge === challenge && (
                <Ionicons name="checkmark-circle" size={20} color="#5B2EEA" />
              )}
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Team Name</Text>
        <TextInput
          value={teamName}
          onChangeText={setTeamName}
          placeholder="e.g. Team Newton"
          placeholderTextColor="#9A94A6"
          style={styles.input}
        />

        <Text style={styles.label}>Result Summary</Text>
        <TextInput
          value={resultSummary}
          onChangeText={setResultSummary}
          placeholder="Briefly explain the result..."
          placeholderTextColor="#9A94A6"
          style={styles.input}
        />

        <Text style={styles.label}>Observations</Text>
        <TextInput
          value={observations}
          onChangeText={setObservations}
          placeholder="Write observations, measurements or findings..."
          placeholderTextColor="#9A94A6"
          style={[styles.input, styles.textArea]}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.evidenceCard}>
        <View style={styles.evidenceHeader}>
          <Ionicons name="camera-outline" size={22} color="#5B2EEA" />
          <Text style={styles.evidenceTitle}>Evidence Upload</Text>
        </View>

        <Text style={styles.evidenceText}>
          Add photo/video evidence later using camera or gallery integration.
        </Text>

        <Pressable style={styles.outlineButton}>
          <Ionicons name="image-outline" size={20} color="#5B2EEA" />
          <Text style={styles.outlineButtonText}>Add Evidence</Text>
        </Pressable>
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
        <Text style={styles.submitButtonText}>Save Result</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4FF",
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1D1828",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6F687D",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1D1828",
    marginBottom: 8,
    marginTop: 12,
  },
  challengePicker: {
    gap: 10,
    marginBottom: 8,
  },
  challengeOption: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEEAFD",
    backgroundColor: "#FBFAFF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  challengeOptionActive: {
    borderColor: "#5B2EEA",
    backgroundColor: "#F1ECFF",
  },
  challengeOptionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6F687D",
    flex: 1,
  },
  challengeOptionTextActive: {
    color: "#5B2EEA",
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEEAFD",
    backgroundColor: "#FBFAFF",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#1D1828",
  },
  textArea: {
    height: 110,
    paddingTop: 14,
  },
  evidenceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  evidenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  evidenceTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1D1828",
  },
  evidenceText: {
    fontSize: 13,
    color: "#6F687D",
    lineHeight: 20,
    marginBottom: 14,
  },
  outlineButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#5B2EEA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  outlineButtonText: {
    color: "#5B2EEA",
    fontSize: 14,
    fontWeight: "800",
  },
  submitButton: {
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
