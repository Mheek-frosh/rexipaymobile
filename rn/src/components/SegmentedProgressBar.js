import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const SEGMENT_DURATION = 280;
const STAGGER = 80;

export default function SegmentedProgressBar({ totalSteps = 4, currentStep = 1 }) {
  const { colors } = useTheme();
  const animValues = useRef(
    Array.from({ length: totalSteps }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = [];
    for (let i = 0; i < totalSteps; i++) {
      const isFilled = i < currentStep;
      animValues[i].setValue(0);
      if (isFilled) {
        animations.push(
          Animated.timing(animValues[i], {
            toValue: 1,
            duration: SEGMENT_DURATION,
            delay: i * STAGGER,
            useNativeDriver: true,
          })
        );
      }
    }
    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  }, [currentStep, totalSteps]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isFilled = i < currentStep;
        const opacity = animValues[i].interpolate({
          inputRange: [0, 1],
          outputRange: [0.2, 1],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: isFilled ? colors.primary : colors.border,
                opacity: isFilled ? opacity : 1,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 6, borderRadius: 3 },
});
