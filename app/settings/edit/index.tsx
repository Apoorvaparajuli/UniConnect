import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../../../lib/firebase";

export default function EditProfileScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [members, setMembers] = useState<string[]>([""]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Edit Profile",
      headerStyle: { backgroundColor: "#F7F4FF" },
      headerShadowVisible: false,
      headerTintColor: "#1D1828",
      headerTitleStyle: { fontWeight: "800" },
    });
  }, [navigation]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      setEmail(currentUser.email || "");
      setFirstName(currentUser.displayName || "");

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setLoading(false);
        return;
      }

      const data = userSnap.data();

      const savedTeamCode = data.teamCode || "";
      let savedTeamName = data.teamName || "";

      if (!savedTeamName && savedTeamCode) {
        const teamSnap = await getDoc(doc(db, "teams", savedTeamCode));

        if (teamSnap.exists()) {
          const teamData = teamSnap.data();
          savedTeamName = teamData.teamName || teamData.name || "";
        }
      }

      setFirstName(data.firstName || currentUser.displayName || "");
      setEmail(data.email || currentUser.email || "");
      setTeamName(savedTeamName);
      setTeamCode(savedTeamCode);
      setYearLevel(data.yearLevel || "");
      setMembers(data.members?.length ? data.members : [""]);
    } catch (error) {
      console.log("Load profile error:", error);
      Alert.alert("Error", "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const updateMember = (index: number, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    setMembers([...members, ""]);
  };

  const removeMember = (index: number) => {
    const updatedMembers = members.filter(
      (_, memberIndex) => memberIndex !== index,
    );

    setMembers(updatedMembers.length ? updatedMembers : [""]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("Error", "You are not logged in.");
        return;
      }

      const cleanMembers = members
        .map((member) => member.trim())
        .filter(Boolean);

      await updateDoc(doc(db, "users", currentUser.uid), {
        firstName: firstName.trim(),
        teamName: teamName.trim(),
        yearLevel: yearLevel.trim(),
        members: cleanMembers,
        updatedAt: serverTimestamp(),
      });

      await updateProfile(currentUser, {
        displayName: firstName.trim(),
      });

      Alert.alert("Saved", "Profile updated successfully.");
    } catch (error) {
      console.log("Save profile error:", error);
      Alert.alert("Error", "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-outline" size={34} color="#5B2EEA" />
          </View>

          <Text style={styles.title}>Edit Profile</Text>

          <Text style={styles.text}>
            Update your account details, team members and year level.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Account Details</Text>

          <InputField
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />

          <InputField
            label="Email"
            value={email}
            onChangeText={() => {}}
            placeholder="Enter email"
            editable={false}
          />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Team Details</Text>

          <InputField
            label="Team Name"
            value={teamName}
            onChangeText={setTeamName}
            placeholder="Enter team name"
          />

          <InputField
            label="Team Code"
            value={teamCode}
            onChangeText={() => {}}
            placeholder="Team code"
            editable={false}
          />

          <InputField
            label="Year Level"
            value={yearLevel}
            onChangeText={setYearLevel}
            placeholder="Enter year level"
          />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Team Members</Text>

          {members.map((member, index) => (
            <View key={index} style={styles.memberInputRow}>
              <View style={{ flex: 1 }}>
                <InputField
                  label={`Member ${index + 1}`}
                  value={member}
                  onChangeText={(value) => updateMember(index, value)}
                  placeholder="Enter member name"
                />
              </View>

              {members.length > 1 && (
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeMember(index)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF4D4F" />
                </Pressable>
              )}
            </View>
          ))}

          <Pressable style={styles.addMemberButton} onPress={addMember}>
            <Ionicons name="add-circle-outline" size={22} color="#5B2EEA" />
            <Text style={styles.addMemberText}>Add Team Member</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />

          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  editable?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A39BAD"
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4FF",
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F4FF",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D1828",
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1D1828",
    marginTop: 14,
  },
  text: {
    fontSize: 14,
    color: "#7A7288",
    lineHeight: 21,
    marginTop: 8,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1D1828",
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1D1828",
    marginBottom: 7,
  },
  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F7F4FF",
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1828",
    borderWidth: 1,
    borderColor: "#E5DDF7",
  },
  disabledInput: {
    backgroundColor: "#ECE8F8",
    color: "#7A7288",
  },
  memberInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  removeButton: {
    width: 44,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFEAEA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  addMemberButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  addMemberText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#5B2EEA",
  },
  saveButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#5B2EEA",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
