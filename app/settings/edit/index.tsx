import { Ionicons } from "@expo/vector-icons";
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

export default function EditProfileScreen() {
  const navigation = useNavigation();

  const [teamName, setTeamName] = useState("Team Newton");
  const [teamCode, setTeamCode] = useState("STEMM-204");
  const [yearLevel, setYearLevel] = useState("Lower High School");
  const [members, setMembers] = useState(["Yacqub Ali", "Apoorva Parajuli"]);

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

  const updateMember = (index: number, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    setMembers([...members, ""]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, memberIndex) => memberIndex !== index));
  };

  const handleSave = () => {
    Alert.alert("Saved", "Profile changes saved locally.");
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-outline" size={34} color="#5B2EEA" />
          </View>

          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.text}>
            Update your team name, members and year level here.
          </Text>
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
            onChangeText={setTeamCode}
            placeholder="Enter team code"
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

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A39BAD"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4FF",
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
