// app/signup.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import GoBackButton from "../components/GoBackButton";
import { useBooking } from "../context/BookingContext";
import { colors } from "../constants/colors";

export default function SignupScreen() {
  const { setUser } = useBooking();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera permissions are required.");
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (name.trim() === "") {
      Alert.alert("Missing Name", "Please enter your full name.");
      return;
    }
    if (!image) {
      Alert.alert("No Image", "Please capture a photo.");
      return;
    }
    setUser({ name, photo: image });
    Alert.alert("Success", "User signed up successfully!");
  };

  return (
    <View style={styles.container}>
      <GoBackButton />
      <Text style={styles.title}>Sign Up with Facial Biometrics</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.instruction}>No image captured yet.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{image ? "Retake Photo" : "Capture Photo"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.antiflashWhite,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 22,
    color: colors.eerieBlack,
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: colors.slateGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    color: colors.eerieBlack
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 20
  },
  instruction: {
    fontSize: 16,
    color: colors.slateGray,
    marginBottom: 20
  },
  button: {
    backgroundColor: colors.imperialRed,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center"
  },
  buttonText: {
    color: colors.white,
    fontSize: 16
  }
});
