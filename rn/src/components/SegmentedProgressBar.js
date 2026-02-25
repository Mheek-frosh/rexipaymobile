import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function SegmentedProgressBar({ totalSteps = 4, currentStep = 1 }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { backgroundColor: i < currentStep ? colors.primary : colors.border },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 6, borderRadius: 3 },
});
