// app/boardingpass.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import GoBackButton from "../components/GoBackButton";
import { colors } from "../constants/colors";
import { useBooking } from "../context/BookingContext";

export default function BoardingPassScreen() {
  const { boardingPasses } = useBooking();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GoBackButton />
      <Text style={styles.title}>My Boarding Passes</Text>
      {boardingPasses.length === 0 ? (
        <Text style={styles.noPassText}>No boarding passes. Please book a flight.</Text>
      ) : (
        boardingPasses.map((pass) => {
          const qrData = JSON.stringify(pass);
          return (
            <View key={pass.id} style={styles.passCard}>
              <View style={styles.passDetails}>
                <Text style={styles.passText}>Flight: {pass.flightNumber}</Text>
                <Text style={styles.passText}>Name: {pass.name}</Text>
                <Text style={styles.passText}>Seat: {pass.seat}</Text>
                <Text style={styles.passText}>From: {pass.departure}</Text>
                <Text style={styles.passText}>To: {pass.arrival}</Text>
                <Text style={styles.passText}>
                  Date: {pass.departureDate} - {pass.returnDate}
                </Text>
                <Text style={styles.passText}>
                  Time: {pass.departureTime} - {pass.arrivalTime}
                </Text>
                <Text style={styles.passText}>Gate: {pass.gate}</Text>
                {pass.photo && <Text style={styles.passText}>[User Photo Included]</Text>}
              </View>
              <View style={styles.qrContainer}>
                <QRCode value={qrData} size={120} />
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: colors.antiflashWhite,
    alignItems: "center"
  },
  title: {
    fontSize: 22,
    color: colors.eerieBlack,
    marginBottom: 20
  },
  noPassText: {
    fontSize: 18,
    color: colors.slateGray,
    textAlign: "center"
  },
  passCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2
  },
  passDetails: {
    flex: 1,
    marginRight: 10
  },
  passText: {
    fontSize: 16,
    color: colors.eerieBlack,
    marginBottom: 4
  },
  qrContainer: {
    width: 130,
    alignItems: "center"
  }
});
