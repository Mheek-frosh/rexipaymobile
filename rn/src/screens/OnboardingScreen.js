import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../theme/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LOTTIE_SIZE = Math.min(SCREEN_WIDTH * 0.75, 320);

const SLIDES = [
  {
    id: '1',
    title: 'Send money in seconds',
    subtitle: 'Transfer to any bank or RexiPay user instantly. No hidden fees, no waiting.',
    lottie: require('../../assets/lottie/onboarding-send.json'),
  },
  {
    id: '2',
    title: 'Bank securely',
    subtitle: 'Your money is protected with bank-level security and biometric verification.',
    lottie: require('../../assets/lottie/onboarding-secure.json'),
  },
  {
    id: '3',
    title: 'Track every transaction',
    subtitle: 'See your spending at a glance. Stay in control with real-time updates.',
    lottie: require('../../assets/lottie/onboarding-track.json'),
  },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const lottieRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    const ref = lottieRefs.current[activeIndex];
    if (ref) {
      ref.play?.();
    }
  }, [activeIndex]);

  const onScroll = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < SLIDES.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleGetStarted = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.replace('Signup'));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity
          style={styles.skipWrap}
          onPress={() => navigation.replace('Signup')}
          activeOpacity={0.7}
        >
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          onScroll={onScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          bounces={false}
        >
          {SLIDES.map((slide, index) => (
            <View key={slide.id} style={[styles.slide, { width: SCREEN_WIDTH }]}>
              <View style={[styles.lottieGlow, { backgroundColor: colors.primaryLight }]}>
                <View
                  style={[
                    styles.lottieCard,
                    {
                      backgroundColor: colors.cardBackground,
                      shadowColor: colors.textPrimary,
                    },
                  ]}
                >
                <LottieView
                  ref={(el) => (lottieRefs.current[index] = el)}
                  source={slide.lottie}
                  style={styles.lottie}
                  loop
                  autoPlay
                />
                </View>
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  {slide.title}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  {slide.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === activeIndex ? colors.primary : colors.border,
                    width: i === activeIndex ? 28 : 10,
                    opacity: i === activeIndex ? 1 : 0.5,
                  },
                ]}
              />
            ))}
          </View>
          <PrimaryButton
            text="Get started"
            onPress={handleGetStarted}
            style={styles.getStartedBtn}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  skipWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 44,
    right: 28,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  carousel: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 16 : 28,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  lottieGlow: {
    width: LOTTIE_SIZE + 24,
    height: LOTTIE_SIZE + 24,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  lottieCard: {
    width: LOTTIE_SIZE,
    height: LOTTIE_SIZE,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  lottie: {
    width: LOTTIE_SIZE * 1.1,
    height: LOTTIE_SIZE * 1.1,
  },
  textWrap: {
    paddingTop: 32,
    paddingHorizontal: 8,
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
    opacity: 0.9,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: 20,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  getStartedBtn: {
    borderRadius: 16,
    paddingVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#2E63F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
