import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');
const SIDE = 20;
const CONTENT_WIDTH = width - SIDE * 2;

function SkeletonBlock({ style, baseColor, highlightColor, shimmerTranslate }) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.block, { backgroundColor: baseColor }, style]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: highlightColor,
            transform: [{ translateX: shimmerTranslate }, { skewX: '-18deg' }],
          },
        ]}
      />
    </View>
  );
}

export default function HomeScreenSkeleton() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const shimmerProgress = useRef(new Animated.Value(0)).current;
  const shimmerAnimation = useRef(null);

  useEffect(() => {
    let mounted = true;

    const startAnimation = async () => {
      const reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      if (!mounted || reduceMotion) return;

      shimmerAnimation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerProgress, {
            toValue: 1,
            duration: 1150,
            useNativeDriver: true,
          }),
          Animated.delay(180),
        ])
      );
      shimmerAnimation.current.start();
    };

    startAnimation();

    return () => {
      mounted = false;
      shimmerAnimation.current?.stop();
    };
  }, [shimmerProgress]);

  const baseColor = isDark ? '#242832' : '#E9ECF2';
  const highlightColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.72)';
  const cardColor = isDark ? '#181B22' : '#FFFFFF';
  const shimmerTranslate = shimmerProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-110, CONTENT_WIDTH + 110],
  });
  const blockProps = { baseColor, highlightColor, shimmerTranslate };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 10),
            paddingBottom: Math.max(insets.bottom, 100),
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerIdentity}>
            <SkeletonBlock {...blockProps} style={styles.avatar} />
            <View>
              <SkeletonBlock {...blockProps} style={styles.greetingLine} />
              <SkeletonBlock {...blockProps} style={styles.nameLine} />
            </View>
          </View>
          <SkeletonBlock {...blockProps} style={styles.notification} />
        </View>

        <View style={[styles.walletCard, { backgroundColor: cardColor }]}>
          <View style={styles.walletTop}>
            <SkeletonBlock {...blockProps} style={styles.walletSelector} />
            <SkeletonBlock {...blockProps} style={styles.walletSwitch} />
          </View>
          <SkeletonBlock {...blockProps} style={styles.balanceLabel} />
          <SkeletonBlock {...blockProps} style={styles.balanceAmount} />
          <View style={styles.walletActions}>
            <SkeletonBlock {...blockProps} style={styles.walletPill} />
            <SkeletonBlock {...blockProps} style={styles.walletPillWide} />
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <SkeletonBlock {...blockProps} style={styles.headingLine} />
          <SkeletonBlock {...blockProps} style={styles.headingAction} />
        </View>
        <View style={[styles.quickActionsCard, { backgroundColor: cardColor }]}>
          {[0, 1, 2, 3].map((item) => (
            <View key={item} style={styles.quickAction}>
              <SkeletonBlock {...blockProps} style={styles.quickActionIcon} />
              <SkeletonBlock {...blockProps} style={styles.quickActionLabel} />
            </View>
          ))}
        </View>

        <View style={styles.sectionHeading}>
          <SkeletonBlock {...blockProps} style={styles.headingLineShort} />
          <SkeletonBlock {...blockProps} style={styles.headingAction} />
        </View>
        <View style={styles.servicesGrid}>
          {[0, 1, 2, 3].map((item) => (
            <View key={item} style={[styles.serviceCard, { backgroundColor: cardColor }]}>
              <SkeletonBlock {...blockProps} style={styles.serviceIcon} />
              <SkeletonBlock {...blockProps} style={styles.serviceLabel} />
            </View>
          ))}
        </View>

        <View style={styles.sectionHeading}>
          <SkeletonBlock {...blockProps} style={styles.headingLineLong} />
          <SkeletonBlock {...blockProps} style={styles.headingAction} />
        </View>
        <View style={styles.transactionList}>
          {[0, 1, 2].map((item) => (
            <View key={item} style={styles.transaction}>
              <SkeletonBlock {...blockProps} style={styles.transactionIcon} />
              <View style={styles.transactionDetails}>
                <SkeletonBlock {...blockProps} style={styles.transactionTitle} />
                <SkeletonBlock {...blockProps} style={styles.transactionMeta} />
              </View>
              <View style={styles.transactionValue}>
                <SkeletonBlock {...blockProps} style={styles.transactionAmount} />
                <SkeletonBlock {...blockProps} style={styles.transactionStatus} />
              </View>
            </View>
          ))}
        </View>

        <SkeletonBlock {...blockProps} style={styles.rewardBanner} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SIDE,
  },
  block: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 76,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greetingLine: {
    width: 76,
    height: 9,
    borderRadius: 5,
    marginBottom: 6,
  },
  nameLine: {
    width: 112,
    height: 14,
    borderRadius: 7,
  },
  notification: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  walletCard: {
    height: 174,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  walletTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletSelector: {
    width: 118,
    height: 26,
    borderRadius: 8,
  },
  walletSwitch: {
    width: 72,
    height: 26,
    borderRadius: 13,
  },
  balanceLabel: {
    width: 104,
    height: 10,
    borderRadius: 5,
    marginBottom: 7,
  },
  balanceAmount: {
    width: 180,
    height: 27,
    borderRadius: 8,
    marginBottom: 18,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  walletPill: {
    width: 102,
    height: 31,
    borderRadius: 10,
  },
  walletPillWide: {
    width: 126,
    height: 31,
    borderRadius: 10,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headingLine: {
    width: 104,
    height: 16,
    borderRadius: 8,
  },
  headingLineShort: {
    width: 92,
    height: 14,
    borderRadius: 7,
  },
  headingLineLong: {
    width: 142,
    height: 14,
    borderRadius: 7,
  },
  headingAction: {
    width: 48,
    height: 12,
    borderRadius: 6,
  },
  quickActionsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 28,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    marginBottom: 10,
  },
  quickActionLabel: {
    width: 42,
    height: 10,
    borderRadius: 5,
  },
  servicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceCard: {
    width: '23.5%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
  },
  serviceIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    marginBottom: 6,
  },
  serviceLabel: {
    width: '62%',
    height: 8,
    borderRadius: 4,
  },
  transactionList: {
    marginBottom: 8,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    width: '76%',
    height: 12,
    borderRadius: 6,
    marginBottom: 7,
  },
  transactionMeta: {
    width: '48%',
    height: 9,
    borderRadius: 5,
  },
  transactionValue: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    width: 82,
    height: 12,
    borderRadius: 6,
    marginBottom: 7,
  },
  transactionStatus: {
    width: 62,
    height: 18,
    borderRadius: 8,
  },
  rewardBanner: {
    width: '100%',
    height: 110,
    borderRadius: 14,
    marginBottom: 14,
  },
});
