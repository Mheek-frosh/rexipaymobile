import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ACCENT = '#007AFF';

export const carouselItems = [
  {
    id: '1',
    imageUri:
      'https://plus.unsplash.com/premium_photo-1663088910348-ec43f3e595e2?q=80&w=2409&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    icon: 'security',
    headerHighlight: 'Your security',
    headerRest: 'comes first',
    subHeader: 'Bank-grade protection',
    description:
      'We use strong encryption to keep your money and personal information safe. Your trust is our top priority.',
  },
  {
    id: '2',
    imageUri:
      'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    icon: 'phone-iphone',
    headerHighlight: 'Financial control',
    headerRest: 'in your hands',
    subHeader: 'Your money, your pace',
    description:
      'Send money, pay bills, and stay on top of spending from one place—online or offline when it matters most.',
  },
  {
    id: '3',
    imageUri:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    icon: 'people',
    headerHighlight: "We're here",
    headerRest: 'for you',
    subHeader: 'Real support, anytime',
    description:
      'Questions about your account or transactions? Our team is a tap away whenever you need help.',
  },
];

function CarouselSlide({ item }) {
  return (
    <View style={styles.slide}>
      <Image source={{ uri: item.imageUri }} style={styles.slideImage} resizeMode="cover" />
      <View style={styles.imageOverlay} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <MaterialIcons name={item.icon} size={36} color={ACCENT} />
        </View>
        <Text style={styles.header}>
          <Text style={[styles.headerHighlight, styles.headerShadow]}>{item.headerHighlight}</Text>
          <Text style={[styles.headerRest, styles.headerShadow]}> {item.headerRest}</Text>
        </Text>
        <Text style={[styles.subHeader, styles.textShadow]}>{item.subHeader}</Text>
        <Text style={[styles.description, styles.textShadow]}>{item.description}</Text>
      </View>
    </View>
  );
}

const AUTO_LOOP_MS = 4200;

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const loopData = [carouselItems[2], carouselItems[0], carouselItems[1], carouselItems[2], carouselItems[0]];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
    }, 50);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance through the three slides on a repeating loop (synced with infinite scroll clones)
  useEffect(() => {
    const id = setInterval(() => {
      const i = activeIndexRef.current;
      if (i < 2) {
        scrollRef.current?.scrollTo({ x: (i + 2) * SCREEN_WIDTH, animated: true });
      } else {
        scrollRef.current?.scrollTo({ x: 4 * SCREEN_WIDTH, animated: true });
      }
    }, AUTO_LOOP_MS);
    return () => clearInterval(id);
  }, []);

  const handleScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const page = Math.round(x / SCREEN_WIDTH);
    const realIndex = page === 0 ? 2 : page === 4 ? 0 : page - 1;
    setActiveIndex(realIndex);
  };

  const handleMomentumScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const page = Math.round(x / SCREEN_WIDTH);
    if (page === 0) {
      scrollRef.current?.scrollTo({ x: SCREEN_WIDTH * 3, animated: false });
      setActiveIndex(2);
    } else if (page === 4) {
      scrollRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
      setActiveIndex(0);
    }
  };

  const handleGetStarted = () => navigation.replace('Signup');
  const handleSkip = () => navigation.replace('Signup');

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.carousel}
        bounces={false}
        decelerationRate="fast"
        style={styles.carouselWrap}
      >
        {loopData.map((item, index) => (
          <View key={`${item.id}-${index}`} style={[styles.slideContainer, { width: SCREEN_WIDTH }]}>
            <CarouselSlide item={item} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.overlay} pointerEvents="box-none">
        <SafeAreaView style={styles.topSafe} edges={['top']}>
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.8}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {carouselItems.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === activeIndex ? '#FFF' : 'rgba(255,255,255,0.4)',
                    width: i === activeIndex ? 24 : 8,
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  carouselWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    height: SCREEN_HEIGHT,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  slide: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  slideImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 180,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,122,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
  },
  headerHighlight: {
    color: ACCENT,
  },
  headerRest: {
    color: '#FFF',
  },
  headerShadow: {
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.85)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topSafe: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
  },
  skipBtn: {
    marginRight: 24,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  skipText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
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
    marginHorizontal: 4,
  },
  getStartedBtn: {
    borderRadius: 16,
    paddingVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
