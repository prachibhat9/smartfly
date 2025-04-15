// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../constants/colors";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartFly App</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.buttonText}>End User Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/booking")}
      >
        <Text style={styles.buttonText}>Book Flight</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/boardingpass")}
      >
        <Text style={styles.buttonText}>My Boarding Passes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/admin")}
      >
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.antiflashWhite,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 28,
    color: colors.eerieBlack,
    marginBottom: 20
  },
  button: {
    backgroundColor: colors.imperialRed,
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center"
  },
  buttonText: {
    color: colors.white,
    fontSize: 18
  }
});
