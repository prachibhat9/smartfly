// app/+not-found.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoBackButton from '../components/GoBackButton';
import { colors } from '../constants/colors';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <GoBackButton />
      <Text style={styles.text}>404: Screen Not Found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.eerieBlack,
  },
});
