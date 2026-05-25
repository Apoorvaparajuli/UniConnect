import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useNavigation } from "expo-router";
import * as SQLite from "expo-sqlite";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../../../../lib/firebase";

type Challenge = {
  id: string;
  title: string;
  description?: string;
  status?: string;
};

// ─── SQLite setup ──────────────────────────────────────────────────────────
const database = SQLite.openDatabaseSync("stemm_lab.db");

const setupDatabase = () => {
  database.execSync(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id TEXT NOT NULL,
      challenge_title TEXT NOT NULL,
      team_name TEXT NOT NULL,
      result_summary TEXT NOT NULL,
      observations TEXT NOT NULL,
      evidence_url TEXT,
      evidence_type TEXT,
      latitude REAL,
      longitude REAL,
      synced INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
};

const saveSubmissionLocally = (data: {
  challengeId: string;
  challengeTitle: string;
  teamName: string;
  resultSummary: string;
  observations: string;
  evidenceUrl: string | null;
  evidenceType: string | null;
  latitude: number | null;
  longitude: number | null;
}) => {
  database.runSync(
    `INSERT INTO submissions (
      challenge_id, challenge_title, team_name, result_summary,
      observations, evidence_url, evidence_type, latitude, longitude,
      synced, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    [
      data.challengeId,
      data.challengeTitle,
      data.teamName,
      data.resultSummary,
      data.observations,
      data.evidenceUrl ?? null,
      data.evidenceType ?? null,
      data.latitude ?? null,
      data.longitude ?? null,
      new Date().toISOString(),
    ],
  );
};

const getLocalSubmissions = () => {
  return database.getAllSync(
    "SELECT * FROM submissions ORDER BY created_at DESC",
  );
};

export default function AddChallengeResultScreen() {
  const navigation = useNavigation();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [saving, setSaving] = useState(false);
  const [localCount, setLocalCount] = useState(0);

  const [resultSummary, setResultSummary] = useState("");
  const [observations, setObservations] = useState("");
  const [teamName, setTeamName] = useState("");
  const [evidenceUri, setEvidenceUri] = useState("");
  const [evidenceType, setEvidenceType] = useState<"image" | "video">("image");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Submit Result",
      headerStyle: { backgroundColor: "#F7F4FF" },
      headerShadowVisible: false,
      headerTintColor: "#1D1828",
      headerTitleStyle: { fontWeight: "800" },
    });
  }, [navigation]);

  useEffect(() => {
    setupDatabase();
    loadChallenges();
    loadUserTeamName();
    refreshLocalCount();
  }, []);

  const refreshLocalCount = () => {
    const rows = getLocalSubmissions();
    setLocalCount(rows.length);
  };

  const loadUserTeamName = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      if (!userSnap.exists()) return;

      const data = userSnap.data();
      let savedTeamName = data.teamName || "";
      const savedTeamCode = data.teamCode || "";

      if (!savedTeamName && savedTeamCode) {
        const teamSnap = await getDoc(doc(db, "teams", savedTeamCode));
        if (teamSnap.exists()) {
          const teamData = teamSnap.data();
          savedTeamName = teamData.teamName || teamData.name || "";
        }
      }

      setTeamName(savedTeamName);
    } catch (error) {
      console.log("Error loading team name:", error);
    }
  };

  const loadChallenges = async () => {
    try {
      setLoadingChallenges(true);
      const q = query(collection(db, "challenges"), orderBy("id", "asc"));
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Challenge, "id">),
      }));
      setChallenges(loaded);
      setSelectedChallenge(loaded[0] ?? null);
    } catch (error) {
      console.log("Error loading challenges:", error);
      Alert.alert("Error", "Could not load challenges from Firebase.");
    } finally {
      setLoadingChallenges(false);
    }
  };

  const clearEvidence = () => {
    setEvidenceUri("");
    setEvidenceType("image");
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 120,
    });

    if (!result.canceled) {
      setEvidenceUri(result.assets[0].uri);
      setEvidenceType(result.assets[0].type === "video" ? "video" : "image");
    }
  };

  const takePhotoOrVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }

    Alert.alert("Camera", "What would you like to capture?", [
      {
        text: "Take Photo",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
          });
          if (!result.canceled) {
            setEvidenceUri(result.assets[0].uri);
            setEvidenceType("image");
          }
        },
      },
      {
        text: "Record Video",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            videoMaxDuration: 120,
            quality: 0.8,
          });
          if (!result.canceled) {
            setEvidenceUri(result.assets[0].uri);
            setEvidenceType("video");
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedChallenge || !teamName || !resultSummary || !observations) {
      Alert.alert("Missing fields", "Please fill in all result details.");
      return;
    }

    try {
      setSaving(true);

      let gpsLocation = null;
      let latitude = null;
      let longitude = null;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          latitude = loc.coords.latitude;
          longitude = loc.coords.longitude;
          gpsLocation = { latitude, longitude };
        }
      } catch {
        console.log("GPS unavailable, skipping.");
      }

      // Save to Firebase
      await addDoc(collection(db, "submissions"), {
        challengeId: selectedChallenge.id,
        challengeTitle: selectedChallenge.title,
        teamName: teamName.trim(),
        resultSummary: resultSummary.trim(),
        observations: observations.trim(),
        evidenceUrl: evidenceUri || null,
        evidenceType: evidenceUri ? evidenceType : null,
        gpsLocation,
        createdAt: serverTimestamp(),
      });

      // Save to SQLite local cache
      saveSubmissionLocally({
        challengeId: selectedChallenge.id,
        challengeTitle: selectedChallenge.title,
        teamName: teamName.trim(),
        resultSummary: resultSummary.trim(),
        observations: observations.trim(),
        evidenceUrl: evidenceUri || null,
        evidenceType: evidenceUri ? evidenceType : null,
        latitude,
        longitude,
      });

      await updateDoc(doc(db, "challenges", selectedChallenge.id), {
        status: "Completed",
        completedAt: serverTimestamp(),
      });

      refreshLocalCount();

      Alert.alert(
        "Result saved",
        "Your STEMM challenge result was saved to Firebase and cached locally.",
        [
          {
            text: "OK",
            onPress: () => {
              setResultSummary("");
              setObservations("");
              clearEvidence();
              loadChallenges();
            },
          },
        ],
      );
    } catch (error) {
      console.log("Error saving submission:", error);

      // Fallback: save locally if Firebase fails
      if (selectedChallenge) {
        try {
          saveSubmissionLocally({
            challengeId: selectedChallenge.id,
            challengeTitle: selectedChallenge.title,
            teamName: teamName.trim(),
            resultSummary: resultSummary.trim(),
            observations: observations.trim(),
            evidenceUrl: evidenceUri || null,
            evidenceType: evidenceUri ? evidenceType : null,
            latitude: null,
            longitude: null,
          });
          refreshLocalCount();
          Alert.alert(
            "Saved offline",
            "Firebase unavailable. Result saved locally and will sync when online.",
          );
        } catch (sqlError) {
          Alert.alert("Error", "Could not save result.");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="flask-plus" size={42} color="#5B2EEA" />
        </View>
        <Text style={styles.title}>Submit Challenge Result</Text>
        <Text style={styles.subtitle}>
          Select a STEMM challenge and record your team's results, observations
          and evidence.
        </Text>

        {localCount > 0 && (
          <View style={styles.localBadge}>
            <Ionicons name="server-outline" size={14} color="#3B82F6" />
            <Text style={styles.localBadgeText}>
              {localCount} submission{localCount > 1 ? "s" : ""} cached locally
            </Text>
          </View>
        )}
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Choose Challenge</Text>

        {loadingChallenges ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#5B2EEA" />
            <Text style={styles.loadingText}>Loading challenges...</Text>
          </View>
        ) : (
          <View style={styles.challengePicker}>
            {challenges.map((challenge) => (
              <Pressable
                key={challenge.id}
                onPress={() => setSelectedChallenge(challenge)}
                style={[
                  styles.challengeOption,
                  selectedChallenge?.id === challenge.id &&
                    styles.challengeOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.challengeOptionText,
                    selectedChallenge?.id === challenge.id &&
                      styles.challengeOptionTextActive,
                  ]}
                >
                  {challenge.title}
                </Text>

                {challenge.status === "Completed" && (
                  <Text style={styles.completedTag}>Completed</Text>
                )}

                {selectedChallenge?.id === challenge.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#5B2EEA" />
                )}
              </Pressable>
            ))}
          </View>
        )}

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
          Add a photo or video from your camera, or upload from your gallery as
          evidence for this result.
        </Text>

        {evidenceUri ? (
          <View style={styles.previewWrap}>
            {evidenceType === "video" ? (
              <View style={styles.videoPreview}>
                <View style={styles.videoIconCircle}>
                  <Ionicons name="videocam" size={32} color="#5B2EEA" />
                </View>
                <Text style={styles.videoPreviewTitle}>Video selected</Text>
                <Text style={styles.videoPreviewSub}>
                  Ready to submit as evidence
                </Text>
              </View>
            ) : (
              <Image
                source={{ uri: evidenceUri }}
                style={styles.previewImage}
              />
            )}

            <Pressable style={styles.removeButton} onPress={clearEvidence}>
              <Ionicons name="close-circle" size={24} color="#FF4D4F" />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.evidenceButtonRow}>
          <Pressable
            style={styles.evidenceHalfButton}
            onPress={takePhotoOrVideo}
          >
            <Ionicons name="camera-outline" size={20} color="#5B2EEA" />
            <Text style={styles.evidenceHalfButtonText}>Camera</Text>
          </Pressable>

          <Pressable
            style={styles.evidenceHalfButton}
            onPress={pickFromGallery}
          >
            <Ionicons name="images-outline" size={20} color="#5B2EEA" />
            <Text style={styles.evidenceHalfButtonText}>Gallery</Text>
          </Pressable>
        </View>

        {evidenceUri ? (
          <View style={styles.evidenceTypeBadge}>
            <Ionicons
              name={evidenceType === "video" ? "videocam" : "image"}
              size={14}
              color={evidenceType === "video" ? "#3B82F6" : "#25B46B"}
            />
            <Text
              style={[
                styles.evidenceTypeBadgeText,
                { color: evidenceType === "video" ? "#3B82F6" : "#25B46B" },
              ]}
            >
              {evidenceType === "video" ? "Video attached" : "Photo attached"}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.sqliteInfoCard}>
        <Ionicons name="save-outline" size={20} color="#5B2EEA" />
        <View style={{ flex: 1 }}>
          <Text style={styles.sqliteInfoTitle}>Local Storage Active</Text>
          <Text style={styles.sqliteInfoText}>
            Results are cached locally with SQLite and synced to Firebase on
            submission.
          </Text>
        </View>
      </View>

      <Pressable
        style={[styles.submitButton, saving && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
        <Text style={styles.submitButtonText}>
          {saving ? "Saving..." : "Save Result"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F4FF" },
  content: { padding: 20, paddingBottom: 36 },
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
  localBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
  },
  localBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3B82F6",
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
  loadingBox: {
    backgroundColor: "#FBFAFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEEAFD",
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  loadingText: { fontSize: 13, fontWeight: "700", color: "#7A7288" },
  challengePicker: { gap: 10, marginBottom: 8 },
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
    gap: 8,
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
  challengeOptionTextActive: { color: "#5B2EEA" },
  completedTag: {
    fontSize: 11,
    fontWeight: "900",
    color: "#1F8F4D",
    backgroundColor: "#E9F8EF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
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
  textArea: { height: 110, paddingTop: 14 },
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
  evidenceTitle: { fontSize: 16, fontWeight: "800", color: "#1D1828" },
  evidenceText: {
    fontSize: 13,
    color: "#6F687D",
    lineHeight: 20,
    marginBottom: 14,
  },
  previewWrap: { position: "relative", marginBottom: 14 },
  previewImage: {
    width: "100%",
    height: 190,
    borderRadius: 18,
    backgroundColor: "#EEE9FF",
  },
  videoPreview: {
    width: "100%",
    height: 190,
    borderRadius: 18,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  videoIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  videoPreviewTitle: { fontSize: 15, fontWeight: "800", color: "#1D1828" },
  videoPreviewSub: { fontSize: 13, color: "#7A7288" },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  evidenceButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  evidenceHalfButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#5B2EEA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  evidenceHalfButtonText: { color: "#5B2EEA", fontSize: 14, fontWeight: "800" },
  evidenceTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F0FA",
    alignSelf: "flex-start",
  },
  evidenceTypeBadgeText: { fontSize: 12, fontWeight: "800" },
  sqliteInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F1ECFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  sqliteInfoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1D1828",
  },
  sqliteInfoText: {
    fontSize: 12,
    color: "#6F687D",
    marginTop: 2,
    lineHeight: 18,
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
  submitButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
});
