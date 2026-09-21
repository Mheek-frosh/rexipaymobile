import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';

const ACCENT = '#172FC7';

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
      <ScrollView contentContainerStyle={styles.content} style={styles.slideScroll} contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <MaterialIcons name={item.icon} size={36} color={ACCENT} />
        </View>
        <Text style={styles.header}>
          <Text style={[styles.headerHighlight, styles.headerShadow]}>{item.headerHighlight}</Text>
          <Text style={[styles.headerRest, styles.headerShadow]}> {item.headerRest}</Text>
        </Text>
        <Text style={[styles.subHeader, styles.textShadow]}>{item.subHeader}</Text>
        <Text style={[styles.description, styles.textShadow]}>{item.description}</Text>
      </ScrollView>
    </View>
  );
}

const AUTO_LOOP_MS = 4200;

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (pageWidth) scrollRef.current?.scrollTo({ x: activeIndexRef.current * pageWidth, animated: false });
  }, [pageWidth]);

  // Pause while off-screen or dragging so timed scrolling never fights a swipe.
  useEffect(() => {
    if (!isFocused || dragging || !pageWidth) return;
    const id = setTimeout(() => {
      const next = (activeIndexRef.current + 1) % carouselItems.length;
      scrollRef.current?.scrollTo({ x: next * pageWidth, animated: next !== 0 });
      activeIndexRef.current = next;
      setActiveIndex(next);
    }, AUTO_LOOP_MS);
    return () => clearTimeout(id);
  }, [activeIndex, dragging, isFocused, pageWidth]);

  const handleScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    if (!pageWidth) return;
    const page = Math.max(0, Math.min(carouselItems.length - 1, Math.round(x / pageWidth)));
    activeIndexRef.current = page;
    setActiveIndex(page);
  };

  const handleGetStarted = () => navigation.replace('Signup');
  const handleSkip = () => navigation.replace('Signup');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafe} edges={['top', 'left', 'right']}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.8}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.carouselWrap} onLayout={event => setPageWidth(event.nativeEvent.layout.width)}>
      {pageWidth > 0 && (
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={() => setDragging(true)}
        onScrollEndDrag={() => setDragging(false)}
        onMomentumScrollEnd={handleScroll}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.carousel}
        bounces={false}
        decelerationRate="fast"
        style={styles.slideScroll}
      >
        {carouselItems.map(item => (
          <View key={item.id} style={[styles.slideContainer, { width: pageWidth }]}>
            <CarouselSlide item={item} />
          </View>
        ))}
      </ScrollView>
      )}
      </View>
        <SafeAreaView style={styles.footer} edges={['bottom', 'left', 'right']}>
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
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  carouselWrap: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  carousel: {
    alignItems: 'stretch',
  },
  slideContainer: {
    height: '100%',
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
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  slideScroll: {
    flex: 1,
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
  topSafe: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    flexShrink: 0,
    paddingBottom: 12,
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
    paddingTop: 20,
    paddingBottom: 16,
    flexShrink: 0,
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
