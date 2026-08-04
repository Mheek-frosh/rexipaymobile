import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');
const logoWidth = Math.min(width * 0.6, 260);

export default function SplashScreen({ onFinish }) {
  const { isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 55,
        friction: 9,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(300),
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
    ]).start();

    const t = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0D0D0D' : '#FFFFFF' },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.Image
          source={
            isDark
              ? require('../../../assets/images/dark-logo-splash.png')
              : require('../../../assets/images/light-logo-splash.png')
          }
          style={[
            styles.logoImage,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  content: {
    alignItems: 'center',
  },
  logoImage: {
    width: logoWidth,
    height: logoWidth * (922 / 2048),
  },
});
