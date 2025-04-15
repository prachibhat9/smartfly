// app/_layout.tsx
import 'react-native-get-random-values'; // MUST be at the very top
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { BookingProvider } from '../context/BookingContext';

export default function Layout() {
  return (
    <BookingProvider>
      <SafeAreaView style={styles.container}>
        <Slot />
      </SafeAreaView>
    </BookingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
