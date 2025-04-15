// app/booking.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import GoBackButton from "../components/GoBackButton";
import { colors } from "../constants/colors";
import { useBooking, BoardingPass } from "../context/BookingContext";
import { v4 as uuidv4 } from "uuid";

/** Airports list (10 airports) */
const airports = [
  { code: "JFK", name: "John F. Kennedy Intl (JFK)" },
  { code: "LAX", name: "Los Angeles Intl (LAX)" },
  { code: "ORD", name: "Chicago O'Hare (ORD)" },
  { code: "DFW", name: "Dallas/Fort Worth (DFW)" },
  { code: "DEN", name: "Denver Intl (DEN)" },
  { code: "SFO", name: "San Francisco Intl (SFO)" },
  { code: "SEA", name: "Seattle-Tacoma (SEA)" },
  { code: "MIA", name: "Miami Intl (MIA)" },
  { code: "ATL", name: "Atlanta Intl (ATL)" },
  { code: "BOS", name: "Boston Logan (BOS)" }
];

/**
 * Returns 3 mock flights for a given route.
 */
function getMockFlights(fromCode: string, toCode: string) {
  return [
    {
      flightNumber: `${fromCode}-${toCode}-01`,
      departureTime: "08:00 AM",
      arrivalTime: "10:00 AM",
      gate: "A1",
      seat: "5A"
    },
    {
      flightNumber: `${fromCode}-${toCode}-02`,
      departureTime: "12:00 PM",
      arrivalTime: "02:00 PM",
      gate: "B2",
      seat: "6B"
    },
    {
      flightNumber: `${fromCode}-${toCode}-03`,
      departureTime: "06:00 PM",
      arrivalTime: "08:00 PM",
      gate: "C3",
      seat: "7C"
    }
  ];
}

export default function BookingScreen() {
  const router = useRouter();
  const { addBoardingPass, user } = useBooking();

  // Step 1 – Airport selection using styled Pickers
  const [fromAirport, setFromAirport] = useState("JFK");
  const [toAirport, setToAirport] = useState("LAX");

  // Step 2 – Date selection using modal date pickers
  const [departureDate, setDepartureDate] = useState("2025-05-15");
  const [returnDate, setReturnDate] = useState("2025-05-22");
  const [isDeparturePickerVisible, setDeparturePickerVisible] = useState(false);
  const [isReturnPickerVisible, setReturnPickerVisible] = useState(false);

  const showDeparturePicker = () => setDeparturePickerVisible(true);
  const hideDeparturePicker = () => setDeparturePickerVisible(false);
  const handleConfirmDeparture = (date: Date) => {
    setDepartureDate(date.toISOString().split("T")[0]);
    hideDeparturePicker();
  };

  const showReturnPicker = () => setReturnPickerVisible(true);
  const hideReturnPicker = () => setReturnPickerVisible(false);
  const handleConfirmReturn = (date: Date) => {
    setReturnDate(date.toISOString().split("T")[0]);
    hideReturnPicker();
  };

  // Step 3 – Flight Results (mocked)
  const [flightResults, setFlightResults] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any | null>(null);
  const [showFlightList, setShowFlightList] = useState(false);

  const handleCheckFlights = () => {
    if (fromAirport === toAirport) {
      alert("Departure and arrival airports must differ.");
      return;
    }
    const results = getMockFlights(fromAirport, toAirport);
    setFlightResults(results);
    setShowFlightList(true);
  };

  const selectFlight = (flight: any) => {
    setSelectedFlight(flight);
  };

  const confirmBooking = () => {
    if (!selectedFlight) {
      alert("Please select a flight first.");
      return;
    }
    const newPass: BoardingPass = {
      id: uuidv4(),
      flightNumber: selectedFlight.flightNumber,
      name: user?.name || "John Doe",
      seat: selectedFlight.seat,
      departure: fromAirport,
      arrival: toAirport,
      departureDate,
      returnDate,
      departureTime: selectedFlight.departureTime,
      arrivalTime: selectedFlight.arrivalTime,
      gate: selectedFlight.gate
    };
    addBoardingPass(newPass);
    alert("Flight booking confirmed! Boarding pass generated.");
    router.push("/boardingpass");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GoBackButton />
      <Text style={styles.title}>Book Your Flight</Text>
      {!showFlightList ? (
        <>
          <Text style={styles.label}>Select Departure Airport</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fromAirport}
              onValueChange={(value) => setFromAirport(value)}
              style={{ height: 50, width: "100%", color: colors.eerieBlack }}
            >
              {airports.map((airport) => (
                <Picker.Item
                  key={airport.code}
                  label={airport.name}
                  value={airport.code}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Select Arrival Airport</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={toAirport}
              onValueChange={(value) => setToAirport(value)}
              style={{ height: 50, width: "100%", color: colors.eerieBlack }}
            >
              {airports.map((airport) => (
                <Picker.Item
                  key={airport.code}
                  label={airport.name}
                  value={airport.code}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Departure Date</Text>
            <TouchableOpacity onPress={showDeparturePicker} style={styles.dateInput}>
              <Text style={styles.dateText}>{departureDate}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Return Date</Text>
            <TouchableOpacity onPress={showReturnPicker} style={styles.dateInput}>
              <Text style={styles.dateText}>{returnDate}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleCheckFlights}>
            <Text style={styles.buttonText}>Check Flights</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDeparturePickerVisible}
            mode="date"
            onConfirm={handleConfirmDeparture}
            onCancel={hideDeparturePicker}
          />
          <DateTimePickerModal
            isVisible={isReturnPickerVisible}
            mode="date"
            onConfirm={handleConfirmReturn}
            onCancel={hideReturnPicker}
          />
        </>
      ) : (
        <>
          <Text style={[styles.label, { fontSize: 18, marginVertical: 10 }]}>
            Available Flights from {fromAirport} to {toAirport}
          </Text>
          {flightResults.length === 0 ? (
            <Text style={styles.flightText}>No flights available.</Text>
          ) : (
            flightResults.map((flight) => (
              <TouchableOpacity
                key={flight.flightNumber}
                style={[
                  styles.flightOption,
                  selectedFlight?.flightNumber === flight.flightNumber && styles.selectedFlight
                ]}
                onPress={() => selectFlight(flight)}
              >
                <Text style={styles.flightText}>Flight: {flight.flightNumber}</Text>
                <Text style={styles.flightText}>
                  {flight.departureTime} → {flight.arrivalTime}
                </Text>
                <Text style={styles.flightText}>
                  Gate: {flight.gate}, Seat: {flight.seat}
                </Text>
              </TouchableOpacity>
            ))
          )}
          <TouchableOpacity style={styles.button} onPress={confirmBooking}>
            <Text style={styles.buttonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </>
      )}
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
    color: colors.eerieBlack,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start"
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden"
  },
  dateContainer: {
    width: "100%",
    marginBottom: 15
  },
  dateInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    elevation: 1
  },
  dateText: {
    fontSize: 16,
    color: colors.slateGray
  },
  button: {
    backgroundColor: colors.imperialRed,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 20,
    alignSelf: "stretch"
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center"
  },
  flightOption: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    elevation: 1
  },
  flightText: {
    fontSize: 16,
    color: colors.eerieBlack
  },
  selectedFlight: {
    borderWidth: 2,
    borderColor: colors.imperialRed
  }
});
