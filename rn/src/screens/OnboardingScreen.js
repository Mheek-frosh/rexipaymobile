import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Send money in seconds',
    subtitle: 'Transfer to any bank or RexiPay user instantly. No hidden fees, no waiting.',
    imageUri: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  },
  {
    id: '2',
    title: 'Bank securely',
    subtitle: 'Your money is protected with bank-level security and biometric verification.',
    imageUri: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80',
  },
  {
    id: '3',
    title: 'Track every transaction',
    subtitle: 'See your spending at a glance. Stay in control with real-time updates.',
    imageUri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const onScroll = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < SLIDES.length) setActiveIndex(index);
  };

  const handleGetStarted = () => {
    navigation.replace('Signup');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View style={[styles.imageWrap, { backgroundColor: colors.cardBackground }]}>
              <Image
                source={{ uri: slide.imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
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

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? colors.primary : colors.border,
                  width: i === activeIndex ? 24 : 8,
                  marginHorizontal: 4,
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carousel: {
    flexGrow: 1,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 32,
    paddingBottom: 16,
    justifyContent: 'flex-start',
  },
  imageWrap: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.38,
    maxHeight: 320,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textWrap: {
    paddingTop: 28,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: 8,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  getStartedBtn: {
    borderRadius: 14,
    paddingVertical: 18,
  },
});
