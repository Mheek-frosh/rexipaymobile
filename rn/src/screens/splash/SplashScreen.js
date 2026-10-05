import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const iconSize = Math.min(width * 0.42, 180);
const wordmarkWidth = Math.min(width * 0.72, 320);

export default function SplashScreen({ onFinish }) {
  const [showWordmark, setShowWordmark] = useState(false);
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.86)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkX = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 70,
        friction: 8,
      }),
    ]).start();

    const revealWordmark = setTimeout(() => {
      setShowWordmark(true);
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(wordmarkOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(wordmarkX, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1100);

    const finish = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2600);

    return () => {
      clearTimeout(revealWordmark);
      clearTimeout(finish);
    };
  }, [iconOpacity, iconScale, onFinish, wordmarkOpacity, wordmarkX]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.layer,
          { opacity: iconOpacity, transform: [{ scale: iconScale }] },
        ]}
      >
        <Image
          source={require('../../../assets/images/new.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </Animated.View>
      {showWordmark ? (
        <Animated.View
          style={[
            styles.layer,
            { opacity: wordmarkOpacity, transform: [{ translateX: wordmarkX }] },
          ]}
        >
          <Image
            source={require('../../../assets/images/newb.png')}
            style={styles.wordmark}
            resizeMode="contain"
          />
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: iconSize,
    height: iconSize,
  },
  wordmark: {
    width: wordmarkWidth,
    height: wordmarkWidth * 0.42,
  },
});
