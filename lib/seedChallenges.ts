import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const defaultChallenges = [
  {
    id: "1",
    title: "Parachute Drop Challenge",
    description:
      "Design, build and test a parachute for a small toy. Teams compare baseline and prototype drops to reduce landing speed and impact force.",
    due: "Due 20 May 2024",
    priority: "High",
    category: "Engineering + Physics",
    difficulty: "Intermediate",
    color: "#FF4D4F",
    icon: "parachute",
    status: "Ongoing",
    tasks: [
      "Drop the toy without a parachute as the baseline test",
      "Build a parachute using paper/plastic, string and tape",
      "Record the drop using the phone camera",
      "Measure time taken to hit the ground",
      "Redesign and test up to three prototypes",
      "Submit video, results and team reflection",
    ],
  },
  {
    id: "2",
    title: "Sound Pollution Hunter",
    description:
      "Use the phone to investigate noisy areas, record observations and compare sound levels across different locations.",
    due: "Due 22 May 2024",
    priority: "Medium",
    category: "Science + Sensors",
    difficulty: "Beginner",
    color: "#FF9F1C",
    icon: "volume-high",
    status: "To Do",
    tasks: [
      "Choose a safe outdoor area",
      "Record sound observations",
      "Compare quiet and noisy locations",
      "Identify possible causes of sound pollution",
      "Submit results and reflection",
    ],
  },
  {
    id: "3",
    title: "Reaction Board Challenge",
    description:
      "Test reaction speed using a timed physical activity. Teams compare reaction times and discuss human performance factors.",
    due: "Due 25 May 2024",
    priority: "Low",
    category: "Health + Medicine",
    difficulty: "Beginner",
    color: "#25B46B",
    icon: "gesture-tap",
    status: "To Do",
    tasks: [
      "Prepare the reaction board activity",
      "Complete multiple reaction tests",
      "Record each team member's result",
      "Calculate average reaction time",
      "Submit observations and team reflection",
    ],
  },
  {
    id: "4",
    title: "Earthquake-Resistant Structure",
    description:
      "Build and improve a structure that can survive shaking. Teams test stability, redesign weak points and explain their engineering decisions.",
    due: "Due 28 May 2024",
    priority: "Medium",
    category: "Engineering Design",
    difficulty: "Advanced",
    color: "#3B82F6",
    icon: "office-building",
    status: "To Do",
    tasks: [
      "Design a small structure using available materials",
      "Test the structure using shaking motion",
      "Record the test using video",
      "Identify weak points in the design",
      "Improve the structure and test again",
      "Submit final results and reflection",
    ],
  },
];

export async function seedChallenges() {
  for (const challenge of defaultChallenges) {
    const ref = doc(collection(db, "challenges"), challenge.id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const { status, ...safeChallengeData } = challenge;

      await setDoc(
        ref,
        {
          ...safeChallengeData,
          updatedAt: new Date().toISOString(),
          createdAt: snap.data().createdAt ?? new Date().toISOString(),
        },
        { merge: true },
      );
    } else {
      await setDoc(ref, {
        ...challenge,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
}
