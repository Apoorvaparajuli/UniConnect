import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F4FF" />

      <View style={styles.container}>
        <View style={styles.logo}>
          <MaterialCommunityIcons name="flask" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Real-world{"\n"}STEMM games</Text>

        <Text style={styles.subtitle}>
          Learn through hands-on challenges, sensors, GPS, teamwork and
          real-world experiments.
        </Text>

        <View style={styles.featureCard}>
          <Feature icon="map-outline" text="GPS-based challenge locations" />
          <Feature icon="camera-outline" text="Upload activity evidence" />
          <Feature icon="flash-outline" text="Use phone tools and sensors" />
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          activeOpacity={0.88}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Feature({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={20} color="#5B2EEA" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4FF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 30,
    backgroundColor: "#5B2EEA",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1D1828",
    textAlign: "center",
    lineHeight: 46,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7A7288",
    textAlign: "center",
    lineHeight: 23,
    marginTop: 14,
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    gap: 12,
    marginBottom: 26,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#1D1828",
  },
  getStartedButton: {
    width: "100%",
    paddingVertical: Platform.OS === "ios" ? 17 : 15,
    borderRadius: 18,
    backgroundColor: "#5B2EEA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signInText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7A7288",
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "900",
    color: "#5B2EEA",
  },
});
