import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
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
    <View style={styles.container}>
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
          source={require('../../../assets/images/rx.png')}
          style={[
            styles.logoImage,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />
        <Text style={styles.appName}>RexiPay</Text>
        <Text style={styles.tagline}>Your money, simplified</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoImage: {
    width: width * 0.34,
    height: width * 0.34,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1B1B1F',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
});
