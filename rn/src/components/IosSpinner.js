import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const TICKS = Array.from({ length: 12 }, (_, i) => i);

export default function IosSpinner({ size = 38, color = '#0F208F' }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const tickWidth = Math.max(2.8, size * 0.085);
  const tickHeight = size * 0.27;
  const radius = (size - tickHeight) / 2.2;

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size, transform: [{ rotate: spin }] },
      ]}
    >
      {TICKS.map((i) => {
        const angle = i * 30;
        const opacity = 0.15 + (0.85 * i) / 11;
        return (
          <View
            key={i}
            style={[
              styles.tick,
              {
                width: tickWidth,
                height: tickHeight,
                backgroundColor: color,
                opacity: opacity,
                borderRadius: tickWidth / 2,
                transform: [
                  { rotate: `${angle}deg` },
                  { translateY: -radius },
                ],
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    position: 'absolute',
  },
});
