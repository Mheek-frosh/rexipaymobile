import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

function Block({ style, baseColor, highlightColor, translateX }) {
  return (
    <View style={[styles.block, { backgroundColor: baseColor }, style]}>
      <Animated.View
        style={[
          styles.highlight,
          {
            backgroundColor: highlightColor,
            transform: [{ translateX }, { skewX: '-18deg' }],
          },
        ]}
      />
    </View>
  );
}

export default function ScreenTransitionSkeleton() {
  const { colors, isDark } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const animation = useRef(null);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (!mounted || reduceMotion) return;
      animation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(progress, {
            toValue: 1,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.delay(150),
        ])
      );
      animation.current.start();
    });

    return () => {
      mounted = false;
      animation.current?.stop();
    };
  }, [progress]);

  const baseColor = isDark ? '#242832' : '#E9ECF2';
  const highlightColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.72)';
  const cardColor = isDark ? '#181B22' : '#FFFFFF';
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100],
  });
  const blockProps = { baseColor, highlightColor, translateX };

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: colors.background,
          paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 54,
        },
      ]}
      accessibilityViewIsModal
      accessibilityRole="progressbar"
      accessibilityLabel="Loading screen"
    >
      <View style={styles.header}>
        <Block {...blockProps} style={styles.backButton} />
        <Block {...blockProps} style={styles.headerTitle} />
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.heroCard, { backgroundColor: cardColor }]}>
        <Block {...blockProps} style={styles.heroEyebrow} />
        <Block {...blockProps} style={styles.heroTitle} />
        <Block {...blockProps} style={styles.heroSubtitle} />
      </View>

      <View style={styles.sectionHeading}>
        <Block {...blockProps} style={styles.sectionTitle} />
        <Block {...blockProps} style={styles.sectionAction} />
      </View>

      {[0, 1, 2].map((item) => (
        <View key={item} style={[styles.rowCard, { backgroundColor: cardColor }]}>
          <Block {...blockProps} style={styles.rowIcon} />
          <View style={styles.rowCopy}>
            <Block {...blockProps} style={styles.rowTitle} />
            <Block {...blockProps} style={styles.rowSubtitle} />
          </View>
          <Block {...blockProps} style={styles.rowValue} />
        </View>
      ))}

      <View style={styles.sectionHeadingSecondary}>
        <Block {...blockProps} style={styles.sectionTitleShort} />
      </View>
      <View style={[styles.detailCard, { backgroundColor: cardColor }]}>
        <Block {...blockProps} style={styles.detailLineLong} />
        <Block {...blockProps} style={styles.detailLine} />
        <Block {...blockProps} style={styles.detailButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10000,
    elevation: 10000,
    paddingHorizontal: 20,
  },
  block: {
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 72,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  headerTitle: {
    width: 126,
    height: 18,
    borderRadius: 9,
  },
  headerSpacer: {
    width: 38,
  },
  heroCard: {
    height: 156,
    borderRadius: 22,
    padding: 20,
    marginBottom: 26,
  },
  heroEyebrow: {
    width: 88,
    height: 10,
    borderRadius: 5,
    marginBottom: 14,
  },
  heroTitle: {
    width: '72%',
    height: 25,
    borderRadius: 8,
    marginBottom: 12,
  },
  heroSubtitle: {
    width: '48%',
    height: 12,
    borderRadius: 6,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeadingSecondary: {
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    width: 124,
    height: 16,
    borderRadius: 8,
  },
  sectionTitleShort: {
    width: 96,
    height: 16,
    borderRadius: 8,
  },
  sectionAction: {
    width: 52,
    height: 12,
    borderRadius: 6,
  },
  rowCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    marginRight: 12,
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    width: '68%',
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  rowSubtitle: {
    width: '45%',
    height: 9,
    borderRadius: 5,
  },
  rowValue: {
    width: 54,
    height: 12,
    borderRadius: 6,
  },
  detailCard: {
    borderRadius: 20,
    padding: 18,
  },
  detailLineLong: {
    width: '84%',
    height: 13,
    borderRadius: 7,
    marginBottom: 12,
  },
  detailLine: {
    width: '58%',
    height: 11,
    borderRadius: 6,
    marginBottom: 24,
  },
  detailButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
  },
});
