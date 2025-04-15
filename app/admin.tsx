// app/admin.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import GoBackButton from "../components/GoBackButton";
import { colors } from "../constants/colors";

export default function AdminScreen() {
  const [qrData, setQrData] = useState<string>("");
  const [boardingPass, setBoardingPass] = useState<any>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera permissions are required.");
      }
    })();
  }, []);

  // Handler to "scan" QR code data pasted manually.
  const handleScan = () => {
    try {
      const data = JSON.parse(qrData);
      setBoardingPass(data);
    } catch (error) {
      Alert.alert("Invalid QR Data", "Please enter valid QR code JSON data.");
    }
  };

  // Check if current time is within 12 hours of departure.
  const isWithin12Hours = (departureDate: string, departureTime: string) => {
    // Construct a Date from departureDate and departureTime.
    const departureDateTime = new Date(`${departureDate} ${departureTime}`);
    const currentTime = new Date();
    const diff = departureDateTime.getTime() - currentTime.getTime();
    return diff <= 12 * 60 * 60 * 1000 && diff > 0;
  };

  // Launch Image Picker to capture an image for admin verification.
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCapturedPhoto(result.assets[0].uri);
    }
  };

  // Simulate a face authentication check (naively comparing URIs)
  const handleFaceAuth = () => {
    if (!boardingPass) {
      Alert.alert("No Boarding Pass", "Scan a QR code first.");
      return;
    }
    if (!isWithin12Hours(boardingPass.departureDate, boardingPass.departureTime)) {
      Alert.alert("Entry Denied", "Departure time is more than 12 hours away or already passed.");
      return;
    }
    if (!capturedPhoto) {
      Alert.alert("No Photo Captured", "Please capture a photo for verification.");
      return;
    }
    // Naively compare the captured photo with the photo in the boarding pass.
    if (capturedPhoto === boardingPass.photo) {
      Alert.alert("Success", "Face Authentication Successful!");
    } else {
      Alert.alert("Failure", "Face Authentication Failed.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GoBackButton />
      <Text style={styles.title}>Admin: Verify Boarding Pass</Text>
      <Text style={styles.label}>Paste QR Code Data:</Text>
      <TextInput
        style={styles.qrInput}
        value={qrData}
        onChangeText={setQrData}
        placeholder="QR code JSON data"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleScan}>
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>
      {boardingPass && (
        <View style={styles.passContainer}>
          <Text style={styles.passText}>Flight: {boardingPass.flightNumber}</Text>
          <Text style={styles.passText}>Name: {boardingPass.name}</Text>
          <Text style={styles.passText}>Seat: {boardingPass.seat}</Text>
          <Text style={styles.passText}>From: {boardingPass.departure}</Text>
          <Text style={styles.passText}>To: {boardingPass.arrival}</Text>
          <Text style={styles.passText}>
            Date: {boardingPass.departureDate} - {boardingPass.returnDate}
          </Text>
          <Text style={styles.passText}>
            Time: {boardingPass.departureTime} - {boardingPass.arrivalTime}
          </Text>
          <Text style={styles.passText}>Gate: {boardingPass.gate}</Text>
          {boardingPass.photo && (
            <Text style={styles.passText}>[User Photo Included]</Text>
          )}
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{capturedPhoto ? "Retake Photo" : "Capture Photo"}</Text>
      </TouchableOpacity>
      {capturedPhoto && (
        <Image source={{ uri: capturedPhoto }} style={styles.image} />
      )}
      <TouchableOpacity style={styles.button} onPress={handleFaceAuth}>
        <Text style={styles.buttonText}>Authenticate Face</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.antiflashWhite,
    alignItems: "center",
    padding: 20,
    paddingBottom: 40
  },
  title: {
    fontSize: 22,
    color: colors.eerieBlack,
    marginBottom: 20
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.eerieBlack
  },
  qrInput: {
    width: "100%",
    minHeight: 100,
    borderColor: colors.slateGray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top"
  },
  button: {
    backgroundColor: colors.imperialRed,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
    alignItems: "center"
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center"
  },
  passContainer: {
    width: "100%",
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    alignItems: "center",
    marginBottom: 20
  },
  passText: {
    fontSize: 16,
    color: colors.eerieBlack,
    marginVertical: 2
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 20
  }
});
